<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\NavigationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MenuController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Ruta de prueba para conectar con Angular
Route::get('/prueba', function () {
    return response()->json([
        'mensaje' => '¡Conexión Exitosa!',
        'servidor' => 'Laravel funcionando correctamente'
    ]);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth Routes
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('logout');

// Navigation Route
Route::get('/navigation', [NavigationController::class, 'getRoutes'])->middleware('auth:sanctum');

// Protected Routes with Role Middleware
Route::middleware(['auth:sanctum', RoleMiddleware::class . ':admin,nutriologo'])->group(function () {
    Route::apiResource('users', UserController::class);
    // Menus: Create, Update, Delete restricted to Admin/Nutriologo
    Route::post('/menus', [MenuController::class, 'store']);
    Route::put('/menus/{menu}', [MenuController::class, 'update']);
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    // Menus: Read access for all authenticated users
    Route::get('/menus', [MenuController::class, 'index']);
    Route::get('/menus/{menu}', [MenuController::class, 'show']);
});

Route::middleware(['auth:sanctum', RoleMiddleware::class . ':usuario'])->group(function () {
    Route::get('/weekly-plans', [App\Http\Controllers\WeeklyPlanController::class, 'index']);
    Route::post('/weekly-plans', [App\Http\Controllers\WeeklyPlanController::class, 'store']);
    Route::post('/calculate', [App\Http\Controllers\CalculationController::class, 'calculate']);
});