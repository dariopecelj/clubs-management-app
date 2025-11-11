<?php

/**
 * @OA\Schema(
 *   schema="Club",
 *   required={"club_name", "creator_user_id"},
 *   @OA\Property(property="club_name", type="string", example="Tech Innovators"),
 *   @OA\Property(property="description", type="string", example="A club for tech enthusiasts"),
 *   @OA\Property(property="logo", type="string", example="tech_logo.png"),
 *   @OA\Property(property="creator_user_id", type="integer", example=2)
 * )
 */

/**
 * @OA\Get(
 *   path="/clubs",
 *   summary="Get all clubs or search by term",
 *   tags={"Clubs"},
 *   @OA\Parameter(
 *     name="search",
 *     in="query",
 *     description="Search clubs by name or description",
 *     required=false,
 *     @OA\Schema(type="string")
 *   ),
 *   @OA\Response(response=200, description="List of clubs")
 * )
 */
Flight::route('GET /clubs', function(){
    $search = Flight::request()->query['search'] ?? null;
    
    if($search){
        Flight::json(Flight::clubsService()->searchClubs($search));
    } else {
        Flight::json(Flight::clubsService()->getAllClubs());
    }
});

/**
 * @OA\Get(
 *   path="/clubs/{id}",
 *   summary="Get club by ID",
 *   tags={"Clubs"},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="Club found"),
 *   @OA\Response(response=404, description="Club not found")
 * )
 */
Flight::route('GET /clubs/@id', function($id){
    Flight::json(Flight::clubsService()->getById($id));
});

/**
 * @OA\Get(
 *   path="/clubs/creator/{creator_user_id}",
 *   summary="Get clubs by creator",
 *   tags={"Clubs"},
 *   @OA\Parameter(
 *     name="creator_user_id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="List of clubs created by user")
 * )
 */
Flight::route('GET /clubs/creator/@creator_user_id', function($creator_user_id){
    Flight::json(Flight::clubsService()->getClubsByCreator($creator_user_id));
});

/**
 * @OA\Post(
 *   path="/clubs",
 *   summary="Create a new club",
 *   tags={"Clubs"},
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(ref="#/components/schemas/Club")
 *   ),
 *   @OA\Response(response=200, description="Club created successfully")
 * )
 */
Flight::route('POST /clubs', function(){
    $data = Flight::request()->data->getData();
    Flight::json(Flight::clubsService()->create($data));
});

/**
 * @OA\Put(
 *   path="/clubs/{id}",
 *   summary="Update club by ID",
 *   tags={"Clubs"},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(ref="#/components/schemas/Club")
 *   ),
 *   @OA\Response(response=200, description="Club updated successfully")
 * )
 */
Flight::route('PUT /clubs/@id', function($id){
    $data = Flight::request()->data->getData();
    Flight::json(Flight::clubsService()->update($id, $data));
});

/**
 * @OA\Delete(
 *   path="/clubs/{id}",
 *   summary="Delete a club by ID",
 *   tags={"Clubs"},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="Club deleted successfully")
 * )
 */
Flight::route('DELETE /clubs/@id', function($id){
    Flight::json(Flight::clubsService()->delete($id));
});