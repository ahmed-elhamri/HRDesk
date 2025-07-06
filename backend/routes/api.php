<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EmployeController;
use App\Http\Controllers\API\PrimeController;
use App\Http\Controllers\API\DepartementController;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\FonctionController;
use \App\Http\Controllers\API\AuthController;

Route::middleware('api')->group(function () {
    Route::apiResource('employes', EmployeController::class);
    Route::apiResource('primes', PrimeController::class);
    Route::apiResource('departements', DepartementController::class);
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('fonctions', FonctionController::class);
});

Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    Route::get('/user', [AuthController::class, 'user']);
});

// Example protected route
Route::middleware('auth:sanctum')->get('/dashboard', function (Request $request) {
    return response()->json([
        'message' => 'Welcome to dashboard',
        'user' => $request->user()
    ]);
});
