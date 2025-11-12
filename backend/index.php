<?php
require './vendor/autoload.php';

require_once 'rest/services/usersService.php';
require_once 'rest/services/clubsService.php';
require_once 'rest/services/eventsService.php';
require_once 'rest/services/registrationsService.php';
require_once 'rest/services/commentsService.php';

Flight::register('usersService', 'UsersService');
Flight::register('clubsService', 'ClubsService');
Flight::register('eventsService', 'EventsService');
Flight::register('registrationsService', 'RegistrationsService');
Flight::register('commentsService', 'CommentsService');

require_once 'rest/routes/usersRoute.php';
require_once 'rest/routes/clubsRoute.php';
require_once 'rest/routes/eventsRoute.php';
require_once 'rest/routes/registrationsRoute.php';
require_once 'rest/routes/commentsRoute.php';

Flight::route('GET /test', function() {
    echo 'Web Programming API is running!';
});

Flight::start();