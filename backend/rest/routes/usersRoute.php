<?php

/**
 * @OA\Schema(
 *   schema="User",
 *   required={"full_name", "email", "password", "role"},
 *   @OA\Property(property="full_name", type="string", example="John Doe"),
 *   @OA\Property(property="email", type="string", example="john@example.com"),
 *   @OA\Property(property="password", type="string", example="password123"),
 *   @OA\Property(property="role", type="string", enum={"student", "club_owner", "admin"}, example="student")
 * )
 */

/**
 * @OA\Get(
 *   path="/users",
 *   summary="Get all users",
 *   tags={"Users"},
 *   @OA\Response(response=200, description="List of users")
 * )
 */
Flight::route('GET /users', function(){
    Flight::json(Flight::usersService()->getAllUsers());
});

/**
 * @OA\Get(
 *   path="/users/{id}",
 *   summary="Get user by ID",
 *   tags={"Users"},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="User found"),
 *   @OA\Response(response=404, description="User not found")
 * )
 */
Flight::route('GET /users/@id', function($id){
    Flight::json(Flight::usersService()->getById($id));
});

/**
 * @OA\Get(
 *   path="/users/email/{email}",
 *   summary="Get user by email",
 *   tags={"Users"},
 *   @OA\Parameter(
 *     name="email",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="string")
 *   ),
 *   @OA\Response(response=200, description="User found"),
 *   @OA\Response(response=404, description="User not found")
 * )
 */
Flight::route('GET /users/email/@email', function($email){
    Flight::json(Flight::usersService()->getUserByEmail($email));
});

/**
 * @OA\Get(
 *   path="/users/role/{role}",
 *   summary="Get users by role",
 *   tags={"Users"},
 *   @OA\Parameter(
 *     name="role",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="string", enum={"student", "club_owner", "admin"})
 *   ),
 *   @OA\Response(response=200, description="List of users with specified role")
 * )
 */
Flight::route('GET /users/role/@role', function($role){
    Flight::json(Flight::usersService()->getUsersByRole($role));
});

/**
 * @OA\Post(
 *   path="/users",
 *   summary="Create a new user",
 *   tags={"Users"},
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(ref="#/components/schemas/User")
 *   ),
 *   @OA\Response(response=200, description="User created successfully")
 * )
 */
Flight::route('POST /users', function(){
    $data = Flight::request()->data->getData();
    Flight::json(Flight::usersService()->create($data));
});

/**
 * @OA\Put(
 *   path="/users/{id}",
 *   summary="Update user by ID",
 *   tags={"Users"},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(ref="#/components/schemas/User")
 *   ),
 *   @OA\Response(response=200, description="User updated successfully")
 * )
 */
Flight::route('PUT /users/@id', function($id){
    $data = Flight::request()->data->getData();
    Flight::json(Flight::usersService()->update($id, $data));
});

/**
 * @OA\Delete(
 *   path="/users/{id}",
 *   summary="Delete a user by ID",
 *   tags={"Users"},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="User deleted successfully")
 * )
 */
Flight::route('DELETE /users/@id', function($id){
    Flight::json(Flight::usersService()->delete($id));
});