<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EmployeController;
use App\Http\Controllers\API\PrimeController;

Route::middleware('api')->group(function () {
    Route::apiResource('employes', EmployeController::class);
    Route::apiResource('primes', PrimeController::class);
});
