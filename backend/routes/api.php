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
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});

// Example protected route
Route::middleware('auth:sanctum')->get('/dashboard', function (Request $request) {
    return response()->json([
        'message' => 'Welcome to dashboard',
    ]);
});

Route::get('/check-auth', function (Request $request) {
    return $request->user() ? 'Authenticated' : 'Not Authenticated';
})->middleware('auth:sanctum');

//Route::get('/dashboard', function () {
//    return response()->json(['message' => 'Hello']);
//});

Route::middleware(['role:SUPERVISOR'])->get('/admin-dashboard', function () {
    return 'Admin dashboard';
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/test', function (Request $request) {
        return response()->json(['user' => "hello"]);
    });
});


