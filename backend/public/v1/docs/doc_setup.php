<?php
/**
 * @OA\OpenApi(
 *   @OA\Info(
 *       title="Clubs Management API",
 *       description="Web Programming Project",
 *       version="1.0.0",
 *       @OA\Contact(
 *           email="dariopecelj@stu.ibu.edu.ba",
 *           name="Web Programming"
 *       )
 *   ),
 *   @OA\Server(
 *       url="http://localhost/clubs-management-app/backend",
 *       description="Local API server"
 *   ),
 *   @OA\Server(
 *       url="https://starfish-app-btyuy.ondigitalocean.app/backend",
 *       description="Production API server"
 *   ),
 *   @OA\Components(
 *       @OA\SecurityScheme(
 *           securityScheme="BearerAuth",
 *           type="http",
 *           scheme="bearer",
 *           bearerFormat="JWT",
 *           description="Enter JWT token in format: Bearer {your-token}"
 *       )
 *   ),
 *   security={{"BearerAuth": {}}}
 * )
 */