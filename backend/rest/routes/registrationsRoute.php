<?php

/**
 * @OA\Schema(
 *   schema="Registration",
 *   required={"user_id", "event_id"},
 *   @OA\Property(property="user_id", type="integer", example=1),
 *   @OA\Property(property="event_id", type="integer", example=1)
 * )
 */

/**
 * @OA\Get(
 *   path="/registrations",
 *   summary="Get all registrations or filter by event/user",
 *   tags={"Registrations"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="event_id",
 *     in="query",
 *     description="Filter registrations by event",
 *     required=false,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Parameter(
 *     name="user_id",
 *     in="query",
 *     description="Filter registrations by user",
 *     required=false,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="List of registrations")
 * )
 */
Flight::route('GET /registrations', function(){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER]);
    $event_id = Flight::request()->query['event_id'] ?? null;
    $user_id = Flight::request()->query['user_id'] ?? null;
    
    if($event_id){
        Flight::json(Flight::registrationsService()->getRegistrationsByEvent($event_id));
    } else if($user_id){
        Flight::json(Flight::registrationsService()->getRegistrationsByUser($user_id));
    } else {
        Flight::json(Flight::registrationsService()->getAllRegistrations());
    }
});

/**
 * @OA\Get(
 *   path="/registrations/{id}",
 *   summary="Get registration by ID",
 *   tags={"Registrations"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="Registration found"),
 *   @OA\Response(response=404, description="Registration not found")
 * )
 */
Flight::route('GET /registrations/@id', function($id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    Flight::json(Flight::registrationsService()->getById($id));
});

/**
 * @OA\Get(
 *   path="/registrations/check/{user_id}/{event_id}",
 *   summary="Check if user is registered for event",
 *   tags={"Registrations"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="user_id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Parameter(
 *     name="event_id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="Registration status")
 * )
 */
Flight::route('GET /registrations/check/@user_id/@event_id', function($user_id, $event_id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    Flight::json(Flight::registrationsService()->isUserRegistered($user_id, $event_id));
});

/**
 * @OA\Get(
 *   path="/registrations/count/{event_id}",
 *   summary="Get registration count for event",
 *   tags={"Registrations"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="event_id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="Registration count")
 * )
 */
Flight::route('GET /registrations/count/@event_id', function($event_id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    Flight::json(Flight::registrationsService()->getRegistrationCount($event_id));
});

/**
 * @OA\Get(
 *   path="/registrations/user/{user_id}/upcoming",
 *   summary="Get upcoming events for user",
 *   tags={"Registrations"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="user_id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="List of upcoming events user is registered for")
 * )
 */
Flight::route('GET /registrations/user/@user_id/upcoming', function($user_id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    Flight::json(Flight::registrationsService()->getUpcomingEventsByUser($user_id));
});

/**
 * @OA\Post(
 *   path="/registrations",
 *   summary="Create a new registration",
 *   tags={"Registrations"},
 *   security={{"BearerAuth": {}}},
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(ref="#/components/schemas/Registration")
 *   ),
 *   @OA\Response(response=200, description="Registration created successfully")
 * )
 */
Flight::route('POST /registrations', function(){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    $data = Flight::request()->data->getData();
    Flight::json(Flight::registrationsService()->create($data));
});

/**
 * @OA\Post(
 *   path="/registrations/register",
 *   summary="Register user for event",
 *   tags={"Registrations"},
 *   security={{"BearerAuth": {}}},
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(
 *       @OA\Property(property="user_id", type="integer", example=1),
 *       @OA\Property(property="event_id", type="integer", example=1)
 *     )
 *   ),
 *   @OA\Response(response=200, description="User registered successfully")
 * )
 */
Flight::route('POST /registrations/register', function(){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    $data = Flight::request()->data->getData();
    Flight::json(Flight::registrationsService()->registerUser($data['user_id'], $data['event_id']));
});

/**
 * @OA\Delete(
 *   path="/registrations/{id}",
 *   summary="Delete a registration by ID",
 *   tags={"Registrations"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="Registration deleted successfully")
 * )
 */
Flight::route('DELETE /registrations/@id', function($id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER]);
    Flight::json(Flight::registrationsService()->delete($id));
});

/**
 * @OA\Delete(
 *   path="/registrations/unregister/{user_id}/{event_id}",
 *   summary="Unregister user from event",
 *   tags={"Registrations"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="user_id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Parameter(
 *     name="event_id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="User unregistered successfully")
 * )
 */
Flight::route('DELETE /registrations/unregister/@user_id/@event_id', function($user_id, $event_id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    Flight::json(Flight::registrationsService()->unregisterUser($user_id, $event_id));
});