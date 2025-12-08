<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware{

    public function verifyToken($token) {
        if (!$token) {
            Flight::halt(401, "Missing the authentication header!");
        }

        if (str_starts_with($token, "Bearer ")) {
            $token = substr($token, 7);
        }

        try {
            $decoded_token = JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));
            Flight::set('user', $decoded_token -> user);
            Flight::set('jwt_token', $token);
            return true;
        } catch (Exception $e) {
            Flight::halt(401, "Invalid token: " . $e -> getMessage());
        }
    }

    public function authorizeRole($requiredRole) {
        $user = Flight::get('user');
        if (!$user || !isset($user -> role)) {
            Flight::halt(403, 'Access denied: User not found or invalid token!');
        }
        if ($user -> role !== $requiredRole) {
            Flight::halt(403, 'Access denied. You do not have permission to access this resource!');
        }
    }

    public function authorizeRoles($roles) {
        $user = Flight::get('user');
        if (!$user || !isset($user -> role)) {
            Flight::halt(403, 'Forbidden: user not found or missing role!');
        }
        if (!in_array($user -> role, $roles)) {
            Flight::halt(403, 'Forbidden: role is not allowed!');
        }
    }
}