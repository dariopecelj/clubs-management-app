<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

require __DIR__ . '/../../../vendor/autoload.php';

define('LOCALSERVER', 'http://localhost/clubs-management-app/backend/');
define('PRODSERVER', 'https://starfish-app-btyuy.ondigitalocean.app/backend/');

if($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == '127.0.0.1'){
    define('BASE_URL', 'http://localhost/clubs-management-app/backend/');
} else {
    define('BASE_URL', 'https://starfish-app-btyuy.ondigitalocean.app/backend/');
}

$openapi = \OpenApi\Generator::scan([
    __DIR__ . '/doc_setup.php',
    __DIR__ . '/../../../rest/routes'
]);

header('Content-Type: application/json');
echo $openapi->toJson();
?>