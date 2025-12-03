<?php

// Importamos los controladores que contienen la lógica de negocio
use App\Http\Controllers\AuthController; // Para login, registro y logout
use App\Http\Controllers\NavigationController; // Para obtener las rutas del menú según el rol
use App\Http\Controllers\UserController; // Para gestionar usuarios (CRUD)
use App\Http\Controllers\MenuController; // Para gestionar menús de comida
use App\Http\Middleware\RoleMiddleware; // Middleware personalizado para verificar roles
use Illuminate\Http\Request; // Clase para manejar las peticiones HTTP
use Illuminate\Support\Facades\Route; // Facade para definir las rutas

// =================================================================================
// RUTAS PÚBLICAS (No requieren token de autenticación)
// =================================================================================

// Ruta de prueba para verificar que el backend responde correctamente
// Se accede vía GET a /api/prueba
Route::get('/prueba', function () {
    return response()->json([
        'mensaje' => '¡Conexión Exitosa!',
        'servidor' => 'Laravel funcionando correctamente'
    ]);
});

// Rutas de Autenticación
// POST /api/register -> Crea un nuevo usuario
Route::post('/register', [AuthController::class, 'register'])->name('register');
// POST /api/login -> Inicia sesión y devuelve un token
Route::post('/login', [AuthController::class, 'login'])->name('login');

// =================================================================================
// RUTAS PROTEGIDAS (Requieren estar logueado - Token Sanctum)
// =================================================================================

// Grupo de rutas que requieren autenticación (middleware 'auth:sanctum')
Route::middleware(['auth:sanctum'])->group(function () {

    // Obtener el usuario autenticado actual
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Cerrar sesión (invalida el token actual)
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Obtener las opciones de navegación (menú lateral) según el rol del usuario
    Route::get('/navigation', [NavigationController::class, 'getRoutes']);

    // Lectura de menús: Disponible para TODOS los usuarios logueados
    Route::get('/menus', [MenuController::class, 'index']); // Ver lista
    Route::get('/menus/{menu}', [MenuController::class, 'show']); // Ver detalle
});

// =================================================================================
// RUTAS DE ADMINISTRACIÓN Y NUTRICIÓN (Requieren rol 'admin' o 'nutriologo')
// =================================================================================

Route::middleware(['auth:sanctum', RoleMiddleware::class . ':admin,nutriologo'])->group(function () {
    // Gestión completa de usuarios (CRUD): Solo admins y nutriólogos pueden ver/editar usuarios
    Route::apiResource('users', UserController::class);

    // Gestión de Menús (Escritura): Solo admins y nutriólogos pueden crear/editar/borrar
    Route::post('/menus', [MenuController::class, 'store']); // Crear
    Route::put('/menus/{menu}', [MenuController::class, 'update']); // Actualizar
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy']); // Eliminar
});

// =================================================================================
// RUTAS DE USUARIO FINAL (Requieren rol 'usuario')
// =================================================================================

Route::middleware(['auth:sanctum', RoleMiddleware::class . ':usuario'])->group(function () {
    // Ver sus planes semanales asignados
    Route::get('/weekly-plans', [App\Http\Controllers\WeeklyPlanController::class, 'index']);
    // Guardar un nuevo plan semanal (si aplica)
    Route::post('/weekly-plans', [App\Http\Controllers\WeeklyPlanController::class, 'store']);
    // Calcular necesidades calóricas
    Route::post('/calculate', [App\Http\Controllers\CalculationController::class, 'calculate']);
});