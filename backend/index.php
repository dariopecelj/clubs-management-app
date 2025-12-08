<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
require './vendor/autoload.php';

// CORS HEADERS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once 'data/roles.php';

require_once 'rest/services/usersService.php';
require_once 'rest/services/registrationsService.php';
require_once 'rest/services/eventsService.php';
require_once 'rest/services/commentsService.php';
require_once 'rest/services/clubsService.php';
require_once 'rest/services/authService.php';
require_once 'middleware/authMiddleware.php';

Flight::register('usersService', 'UsersService');
Flight::register('registrationsService', 'RegistrationsService');
Flight::register('eventsService', 'EventsService');
Flight::register('commentsService', 'CommentsService');
Flight::register('clubsService', 'ClubsService');
Flight::register('contactMessageService', 'ContactMessageService');
Flight::register('auth_service', 'AuthService');
Flight::register('auth_middleware', 'AuthMiddleware');

Flight::before('start', function() {
    $url = Flight::request()->url;

    if (
        str_starts_with($url, '/auth/login') ||
        str_starts_with($url, '/auth/register')
    ) {
        return;
    }

    try {
        $headers = getallheaders();
        $token = $headers['Authorization'] ?? $headers['authorization'] ?? null;

        if (!$token) {
            throw new Exception("Missing Authorization header");
        }

        Flight::auth_middleware()->verifyToken($token);
    } catch (Exception $e) {
        Flight::halt(401, "Unauthorized: " . $e->getMessage());
    }
});


require_once 'rest/routes/usersRoute.php';
require_once 'rest/routes/registrationsRoute.php';
require_once 'rest/routes/eventsRoute.php';
require_once 'rest/routes/commentsRoute.php';
require_once 'rest/routes/clubsRoute.php';
require_once 'rest/routes/authRoute.php';

Flight::start();
