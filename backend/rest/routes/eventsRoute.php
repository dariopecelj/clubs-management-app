<?php

/**
 * @OA\Schema(
 *   schema="Event",
 *   required={"club_id", "title", "event_date"},
 *   @OA\Property(property="club_id", type="integer", example=1),
 *   @OA\Property(property="title", type="string", example="AI Workshop"),
 *   @OA\Property(property="description", type="string", example="Learn the basics of Artificial Intelligence"),
 *   @OA\Property(property="event_date", type="string", format="date", example="2025-11-15"),
 *   @OA\Property(property="location", type="string", example="Auditorium A"),
 *   @OA\Property(property="image", type="string", example="ai_event.jpg")
 * )
 */

/**
 * @OA\Get(
 *   path="/events",
 *   summary="Get all events or filter by club/search",
 *   tags={"Events"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="club_id",
 *     in="query",
 *     description="Filter events by club",
 *     required=false,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Parameter(
 *     name="search",
 *     in="query",
 *     description="Search events by title or description",
 *     required=false,
 *     @OA\Schema(type="string")
 *   ),
 *   @OA\Response(response=200, description="List of events")
 * )
 */
Flight::route('GET /events', function(){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    $club_id = Flight::request()->query['club_id'] ?? null;
    $search = Flight::request()->query['search'] ?? null;
    
    if($club_id){
        Flight::json(Flight::eventsService()->getEventsByClub($club_id));
    } else if($search){
        Flight::json(Flight::eventsService()->searchEvents($search));
    } else {
        Flight::json(Flight::eventsService()->getAllEvents());
    }
});

/**
 * @OA\Get(
 *   path="/events/{id}",
 *   summary="Get event by ID",
 *   tags={"Events"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="Event found"),
 *   @OA\Response(response=404, description="Event not found")
 * )
 */
Flight::route('GET /events/@id', function($id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    Flight::json(Flight::eventsService()->getById($id));
});

/**
 * @OA\Get(
 *   path="/events/{id}/with-club",
 *   summary="Get event by ID with club information",
 *   tags={"Events"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="Event with club info found"),
 *   @OA\Response(response=404, description="Event not found")
 * )
 */
Flight::route('GET /events/@id/with-club', function($id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    Flight::json(Flight::eventsService()->getEventWithClubInfo($id));
});

/**
 * @OA\Get(
 *   path="/events/upcoming",
 *   summary="Get upcoming events",
 *   tags={"Events"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Response(response=200, description="List of upcoming events")
 * )
 */
Flight::route('GET /events/upcoming', function(){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    Flight::json(Flight::eventsService()->getUpcomingEvents());
});

/**
 * @OA\Get(
 *   path="/events/past",
 *   summary="Get past events",
 *   tags={"Events"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Response(response=200, description="List of past events")
 * )
 */
Flight::route('GET /events/past', function(){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    Flight::json(Flight::eventsService()->getPastEvents());
});

/**
 * @OA\Post(
 *   path="/events",
 *   summary="Create a new event",
 *   tags={"Events"},
 *   security={{"BearerAuth": {}}},
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(ref="#/components/schemas/Event")
 *   ),
 *   @OA\Response(response=200, description="Event created successfully")
 * )
 */
Flight::route('POST /events', function(){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER]);
    $data = Flight::request()->data->getData();
    Flight::json(Flight::eventsService()->add($data));
});

/**
 * @OA\Put(
 *   path="/events/{id}",
 *   summary="Update event by ID",
 *   tags={"Events"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(ref="#/components/schemas/Event")
 *   ),
 *   @OA\Response(response=200, description="Event updated successfully")
 * )
 */
Flight::route('PUT /events/@id', function($id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER]);
    $data = Flight::request()->data->getData();
    Flight::json(Flight::eventsService()->update($id, $data));
});

/**
 * @OA\Delete(
 *   path="/events/{id}",
 *   summary="Delete an event by ID",
 *   tags={"Events"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="Event deleted successfully")
 * )
 */
Flight::route('DELETE /events/@id', function($id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER]);
    Flight::json(Flight::eventsService()->delete($id));
});