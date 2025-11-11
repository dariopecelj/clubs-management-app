<?php
/**
 * @OA\Info(
 *     title="Clubs Management API",
 *     description="Web Programming Project",
 *     version="1.0",
 *     @OA\Contact(
 *         email="dariopecelj@stu.ibu.edu.ba",
 *         name="Web Programming"
 *     )
 * )
 *
 * @OA\Server(
 *     url=LOCALSERVER,
 *     description="Local API server"
 * )
 *
 * @OA\Server(
 *     url=PRODSERVER,
 *     description="Production API server"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="ApiKey",
 *     type="apiKey",
 *     in="header",
 *     name="Authentication"
 * )
 */