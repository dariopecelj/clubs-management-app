<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require './vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$allowedOrigins = [
    'http://localhost:3000',
    'https://starfish-app-btyuy.ondigitalocean.app'
];

Flight::before('start', function () use ($allowedOrigins) {
    if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
        header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Allow-Credentials: true");
    }
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit();
    }
});

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

// Use Flight::before('start') instead of Flight::route('/*')
Flight::before('start', function() {
    $url = Flight::request()->url;
    
    // Skip auth for login/register
    if (
        strpos($url, '/auth/login') === 0 ||
        strpos($url, '/auth/register') === 0
    ) {
        return;
    }
    
    // Verify token for all other routes
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