<?php

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

Route::post('/register', [App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);
Route::post('/login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');
