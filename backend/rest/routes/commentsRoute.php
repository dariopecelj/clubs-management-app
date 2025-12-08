<?php

/**
 * @OA\Schema(
 *   schema="Comment",
 *   required={"user_id", "event_id", "comment_text"},
 *   @OA\Property(property="user_id", type="integer", example=1),
 *   @OA\Property(property="event_id", type="integer", example=1),
 *   @OA\Property(property="comment_text", type="string", example="Really excited about this workshop!")
 * )
 */

/**
 * @OA\Get(
 *   path="/comments",
 *   summary="Get all comments or filter by event/user",
 *   tags={"Comments"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="event_id",
 *     in="query",
 *     description="Filter comments by event",
 *     required=false,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Parameter(
 *     name="user_id",
 *     in="query",
 *     description="Filter comments by user",
 *     required=false,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="List of comments")
 * )
 */
Flight::route('GET /comments', function(){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    $event_id = Flight::request()->query['event_id'] ?? null;
    $user_id = Flight::request()->query['user_id'] ?? null;
    
    if($event_id){
        Flight::json(Flight::commentsService()->getCommentsByEvent($event_id));
    } else if($user_id){
        Flight::json(Flight::commentsService()->getCommentsByUser($user_id));
    } else {
        Flight::json(Flight::commentsService()->getAllComments());
    }
});

/**
 * @OA\Get(
 *   path="/comments/{id}",
 *   summary="Get comment by ID",
 *   tags={"Comments"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="Comment found"),
 *   @OA\Response(response=404, description="Comment not found")
 * )
 */
Flight::route('GET /comments/@id', function($id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    Flight::json(Flight::commentsService()->getById($id));
});

/**
 * @OA\Get(
 *   path="/comments/count/{event_id}",
 *   summary="Get comment count for event",
 *   tags={"Comments"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="event_id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="Comment count")
 * )
 */
Flight::route('GET /comments/count/@event_id', function($event_id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    Flight::json(Flight::commentsService()->getCommentCount($event_id));
});

/**
 * @OA\Post(
 *   path="/comments",
 *   summary="Create a new comment",
 *   tags={"Comments"},
 *   security={{"BearerAuth": {}}},
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(ref="#/components/schemas/Comment")
 *   ),
 *   @OA\Response(response=200, description="Comment created successfully")
 * )
 */
Flight::route('POST /comments', function(){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    $data = Flight::request()->data->getData();
    Flight::json(Flight::commentsService()->create($data));
});

/**
 * @OA\Put(
 *   path="/comments/{id}",
 *   summary="Update comment by ID",
 *   tags={"Comments"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(ref="#/components/schemas/Comment")
 *   ),
 *   @OA\Response(response=200, description="Comment updated successfully")
 * )
 */
Flight::route('PUT /comments/@id', function($id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER, Roles::USER]);
    $data = Flight::request()->data->getData();
    Flight::json(Flight::commentsService()->update($id, $data));
});

/**
 * @OA\Delete(
 *   path="/comments/{id}",
 *   summary="Delete a comment by ID",
 *   tags={"Comments"},
 *   security={{"BearerAuth": {}}},
 *   @OA\Parameter(
 *     name="id",
 *     in="path",
 *     required=true,
 *     @OA\Schema(type="integer")
 *   ),
 *   @OA\Response(response=200, description="Comment deleted successfully")
 * )
 */
Flight::route('DELETE /comments/@id', function($id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::CLUB_OWNER]);
    Flight::json(Flight::commentsService()->delete($id));
});