<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../services/usersService.php';
require_once __DIR__ . '/../services/eventsService.php';
require_once __DIR__ . '/../services/clubsService.php';
require_once __DIR__ . '/../services/registrationsService.php';
require_once __DIR__ . '/../services/commentsService.php';

$usersService = new UsersService();
$eventsService = new EventsService();
$clubsService = new ClubsService();
$registrationsService = new RegistrationsService();
$commentsService = new CommentsService();

echo "<h2>Testing Users Service</h2>";
$allUsers = $usersService->getAllUsers();
$userById = $usersService->getById(1);
$userByEmail = $usersService->getUserByEmail("alice@example.com");
echo "<pre>";
print_r($allUsers);
print_r($userById);
print_r($userByEmail);
echo "</pre>";

echo "<h2>Testing Events Service</h2>";
$allEvents = $eventsService->getAllEvents();
$upcomingEvents = $eventsService->getUpcomingEvents();
$eventsByClub = $eventsService->getEventsByClub(1);
$eventWithClub = $eventsService->getEventWithClubInfo(1);
echo "<pre>";
print_r($allEvents);
print_r($upcomingEvents);
print_r($eventsByClub);
print_r($eventWithClub);
echo "</pre>";

echo "<h2>Testing Clubs Service</h2>";
$allClubs = $clubsService->getAllClubs();
$clubById = $clubsService->getById(2);
$clubsByCreator = $clubsService->getClubsByCreator(2);
$searchClubs = $clubsService->searchClubs("tech");
echo "<pre>";
print_r($allClubs);
print_r($clubById);
print_r($clubsByCreator);
print_r($searchClubs);
echo "</pre>";

echo "<h2>Testing Registrations Service</h2>";
$allRegistrations = $registrationsService->getAllRegistrations();
$registrationsByEvent = $registrationsService->getRegistrationsByEvent(1);
$registrationsByUser = $registrationsService->getRegistrationsByUser(1);
$isRegistered = $registrationsService->isUserRegistered(1, 1);
$registrationCount = $registrationsService->getRegistrationCount(1);
$upcomingUserEvents = $registrationsService->getUpcomingEventsByUser(1);
echo "<pre>";
print_r($allRegistrations);
print_r($registrationsByEvent);
print_r($registrationsByUser);
print_r($isRegistered);
print_r($registrationCount);
print_r($upcomingUserEvents);
echo "</pre>";

echo "<h2>Testing Comments Service</h2>";
$allComments = $commentsService->getAllComments();
$commentsByEvent = $commentsService->getCommentsByEvent(1);
$commentsByUser = $commentsService->getCommentsByUser(1);
$commentCount = $commentsService->getCommentCount(1);
echo "<pre>";
print_r($allComments);
print_r($commentsByEvent);
print_r($commentsByUser);
print_r($commentCount);
echo "</pre>";

?>