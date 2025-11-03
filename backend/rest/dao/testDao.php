<?php
require_once __DIR__ . "/usersDao.php";
require_once __DIR__ . "/clubsDao.php";
require_once __DIR__ . "/eventsDao.php";
require_once __DIR__ . "/commentsDao.php";
require_once __DIR__ . "/registrationsDao.php";

echo "<h1>DAO Testing</h1>";
echo "<hr>";

try {
    // ============ USERS DAO ============
    echo "<h2>Users DAO</h2>";
    $userDao = new User();

    // Add user
    echo "<h3>1. Add User</h3>";
    $newUser = [
        'full_name' => 'Test User',
        'email' => 'test' . time() . '@example.com',
        'password' => password_hash('password123', PASSWORD_DEFAULT),
        'role' => 'student'
    ];
    $addedUser = $userDao->add($newUser);
    $userId = $addedUser['id'];
    echo "User added (ID: $userId)<br>";

    // Get all users
    echo "<h3>2. All Users</h3>";
    $allUsers = $userDao->getAllUsers();
    print_r($allUsers);

    // Get user by ID
    echo "<h3>3. Get User by ID</h3>";
    $user = $userDao->getUserById($userId);
    print_r($user);

    // Get user by email
    echo "<h3>4. Get User by Email</h3>";
    $userByEmail = $userDao->getUserByEmail($addedUser['email']);
    print_r($userByEmail);

    // Update user
    echo "<h3>5. Update User</h3>";
    $updateData = ['full_name' => 'Updated Test User'];
    $updatedUser = $userDao->updateUser($updateData, $userId);
    print_r($updatedUser);

    echo "<hr>";

    // ============ CLUBS DAO ============
    echo "<h2>Clubs DAO</h2>";
    $clubDao = new Club();

    // Add club
    echo "<h3>1. Add Club</h3>";
    $newClub = [
        'club_name' => 'Test Club ' . time(),
        'description' => 'This is a test club',
        'logo' => 'test_logo.png',
        'creator_user_id' => $userId
    ];
    $addedClub = $clubDao->add($newClub);
    $clubId = $addedClub['id'];
    echo "Club added (ID: $clubId)<br>";

    // Get all clubs
    echo "<h3>2. All Clubs</h3>";
    $allClubs = $clubDao->getAllClubs();
    print_r($allClubs);

    // Get club by ID
    echo "<h3>3. Get Club by ID</h3>";
    $club = $clubDao->getClubById($clubId);
    print_r($club);

    // Get clubs by creator
    echo "<h3>4. Clubs by Creator</h3>";
    $userClubs = $clubDao->getClubsByCreator($userId);
    print_r($userClubs);

    // Search clubs
    echo "<h3>5. Search Clubs</h3>";
    $searchResults = $clubDao->searchClubs('Test');
    print_r($searchResults);

    // Update club
    echo "<h3>6. Update Club</h3>";
    $updateClubData = ['description' => 'Updated description'];
    $updatedClub = $clubDao->updateClub($updateClubData, $clubId);
    print_r($updatedClub);

    echo "<hr>";

    // ============ EVENTS DAO ============
    echo "<h2>Events DAO</h2>";
    $eventDao = new Event();

    // Add event
    echo "<h3>1. Add Event</h3>";
    $newEvent = [
        'club_id' => $clubId,
        'title' => 'Test Event ' . time(),
        'description' => 'This is a test event',
        'event_date' => date('Y-m-d', strtotime('+7 days')),
        'location' => 'Test Location',
        'image' => 'test_event.png'
    ];
    $addedEvent = $eventDao->add($newEvent);
    $eventId = $addedEvent['id'];
    echo "Event added (ID: $eventId)<br>";

    // Get all events
    echo "<h3>2. All Events</h3>";
    $allEvents = $eventDao->getAllEvents();
    print_r($allEvents);

    // Get event by ID
    echo "<h3>3. Get Event by ID</h3>";
    $event = $eventDao->getEventById($eventId);
    print_r($event);

    // Get events by club
    echo "<h3>4. Events by Club</h3>";
    $clubEvents = $eventDao->getEventsByClub($clubId);
    print_r($clubEvents);

    // Get upcoming events
    echo "<h3>5. Upcoming Events</h3>";
    $upcomingEvents = $eventDao->getUpcomingEvents();
    print_r($upcomingEvents);

    // Get event with club info
    echo "<h3>6. Event with Club Info</h3>";
    $eventWithClub = $eventDao->getEventWithClubInfo($eventId);
    print_r($eventWithClub);

    // Update event
    echo "<h3>7. Update Event</h3>";
    $updateEventData = ['location' => 'Updated Location'];
    $updatedEvent = $eventDao->updateEvent($updateEventData, $eventId);
    print_r($updatedEvent);

    echo "<hr>";

    // ============ REGISTRATIONS DAO ============
    echo "<h2>Registrations DAO</h2>";
    $registrationDao = new Registration();

    // Register user
    echo "<h3>1. Register User</h3>";
    $registration = $registrationDao->registerUser($userId, $eventId);
    $registrationId = $registration['id'];
    echo "User registered (ID: $registrationId)<br>";

    // Check registration
    echo "<h3>2. Is User Registered</h3>";
    $isRegistered = $registrationDao->isUserRegistered($userId, $eventId);
    echo $isRegistered ? "User is registered<br>" : "User is not registered<br>";

    // Registrations by event
    echo "<h3>3. Registrations by Event</h3>";
    $eventRegistrations = $registrationDao->getRegistrationsByEvent($eventId);
    print_r($eventRegistrations);

    // Registrations by user
    echo "<h3>4. Registrations by User</h3>";
    $userRegistrations = $registrationDao->getRegistrationsByUser($userId);
    print_r($userRegistrations);

    // Registration count
    echo "<h3>5. Registration Count</h3>";
    $regCount = $registrationDao->getRegistrationCount($eventId);
    echo "Event has $regCount registrations<br>";

    echo "<hr>";

    // ============ COMMENTS DAO ============
    echo "<h2>Comments DAO</h2>";
    $commentDao = new Comment();

    // Add comment
    echo "<h3>1. Add Comment</h3>";
    $newComment = [
        'user_id' => $userId,
        'event_id' => $eventId,
        'comment_text' => 'This is a test comment'
    ];
    $addedComment = $commentDao->add($newComment);
    $commentId = $addedComment['id'];
    echo "Comment added (ID: $commentId)<br>";

    // Get comments by event
    echo "<h3>2. Comments by Event</h3>";
    $eventComments = $commentDao->getCommentsByEvent($eventId);
    print_r($eventComments);

    // Get comments by user
    echo "<h3>3. Comments by User</h3>";
    $userComments = $commentDao->getCommentsByUser($userId);
    print_r($userComments);

    // Comment count
    echo "<h3>4. Comment Count</h3>";
    $commentCount = $commentDao->getCommentCount($eventId);
    echo "Event has $commentCount comments<br>";

    // Update comment
    echo "<h3>5. Update Comment</h3>";
    $updateCommentData = ['comment_text' => 'Updated comment text'];
    $updatedComment = $commentDao->updateComment($updateCommentData, $commentId);
    print_r($updatedComment);

    echo "<hr>";

    // ============ CLEANUP ============
    echo "<h2>Cleanup</h2>";

    echo "Deleting comment...<br>";
    $commentDao->deleteComment($commentId);

    echo "Unregistering user...<br>";
    $registrationDao->unregisterUser($userId, $eventId);

    echo "Deleting event...<br>";
    $eventDao->deleteEvent($eventId);

    echo "Deleting club...<br>";
    $clubDao->deleteClub($clubId);

    echo "Deleting user...<br>";
    $userDao->deleteUser($userId);

    echo "<hr>";
    echo "<h2>All tests completed successfully.</h2>";

} catch (Exception $e) {
    echo "<h2>Test failed</h2>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
?>
