<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EmployeController;
use App\Http\Controllers\API\PrimeController;
use App\Http\Controllers\API\DepartementController;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\FonctionController;
use \App\Http\Controllers\API\AuthController;
use \App\Http\Controllers\API\PermissionController;
use \App\Http\Controllers\API\EmployePrimeController;
use \App\Http\Controllers\API\ContratController;
use \App\Http\Controllers\API\DocumentController;
use \App\Http\Controllers\API\CaisseSocialeController;
use \App\Http\Controllers\API\PaiementController;


//Route::middleware('api')->group(function () {
//});
//Route::apiResource('admins', AdminController::class);

Route::apiResource('permissions', PermissionController::class);
Route::apiResource('departements', DepartementController::class);
Route::get('/departements/reference/{reference}', [DepartementController::class, 'getByReference']);

Route::apiResource('services', ServiceController::class);
Route::get('/services/reference/{reference}', [ServiceController::class, 'getByReference']);

Route::apiResource('fonctions', FonctionController::class);
Route::get('/fonctions/reference/{reference}', [FonctionController::class, 'getByReference']);

Route::apiResource('employes', EmployeController::class);
Route::get('/employes/matricule/{matricule}', [EmployeController::class, 'getByMatricule']);
Route::post('/import-employes', [EmployeController::class, 'import']);

Route::get('/contrats', [ContratController::class, 'show']);
Route::post('/contrats', [ContratController::class, 'store']);
Route::put('/contrats', [ContratController::class, 'update']);

Route::get('/caisses-sociales', [CaisseSocialeController::class, 'show']);
Route::post('/caisses-sociales', [CaisseSocialeController::class, 'store']);
Route::put('/caisses-sociales', [CaisseSocialeController::class, 'update']);

Route::get('/paiements', [PaiementController::class, 'show']);
Route::post('/paiements', [PaiementController::class, 'store']);
Route::put('/paiements', [PaiementController::class, 'update']);

Route::get('/documents', [DocumentController::class, 'show']);
Route::post('/documents', [DocumentController::class, 'store']);
Route::post('/documents/{id}', [DocumentController::class, 'update']);


Route::apiResource('primes', PrimeController::class);

Route::apiResource('employe-primes', EmployePrimeController::class);

Route::post('/login', [AuthController::class, 'login']);
Route::get('/user', [AuthController::class, 'user']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/reset-password/{id}', [AuthController::class, 'resetPassword']);
    Route::put('/change-default-password', [AuthController::class, 'changeDefaultPassword']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);
    Route::get('/user', [AuthController::class, 'user']);
});

Route::apiResource('frais-professionnels', \App\Http\Controllers\API\FraisProfessionnelController::class);
Route::apiResource('amo-cotisations', \App\Http\Controllers\API\AmoCotisationController::class);
Route::apiResource('cnss-cotisations', \App\Http\Controllers\API\CnssCotisationController::class);
Route::apiResource('ir-tranches', \App\Http\Controllers\API\IrTrancheController::class);
Route::apiResource('family-charges', \App\Http\Controllers\API\FamilyChargeController::class);
Route::apiResource('taux-heures-supplementaires', \App\Http\Controllers\API\TauxHeuresSupplementairesController::class);
Route::apiResource('heures-supplementaires', \App\Http\Controllers\API\HeureSupplementaireController::class);
Route::apiResource('absences', \App\Http\Controllers\API\AbsenceController::class);






// Example protected route
//Route::middleware('auth:sanctum')->get('/dashboard', function (Request $request) {
//    return response()->json([
//        'message' => 'Welcome to dashboard',
//    ]);
//});
//
//Route::get('/check-auth', function (Request $request) {
//    return $request->user() ? 'Authenticated' : 'Not Authenticated';
//})->middleware('auth:sanctum');
//
////Route::get('/dashboard', function () {
////    return response()->json(['message' => 'Hello']);
////});
//
//Route::middleware(['role:SUPERVISOR'])->get('/admin-dashboard', function () {
//    return 'Admin dashboard';
//});
//
//Route::middleware(['auth:sanctum'])->group(function () {
//    Route::get('/test', function (Request $request) {
//        return response()->json(['user' => "hello"]);
//    });
//});


