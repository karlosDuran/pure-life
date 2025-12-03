<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
    /**
     * REGISTRO DE NUEVOS USUARIOS
     * Recibe los datos del formulario de registro, valida y crea el usuario en la BD.
     */
    public function register(Request $request)
    {
        // 1. Validar los datos entrantes
        $request->validate([
            'name' => ['required', 'string', 'max:255'], // Nombre obligatorio
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class], // Email único en la tabla users
            'password' => ['required', 'confirmed', Rules\Password::defaults()], // Password confirmado (password_confirmation)
            'role' => ['required', 'string', 'in:nutriologo,usuario'], // Solo permite roles específicos
        ]);

        // 2. Crear el usuario en la base de datos
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')), // IMPORTANTE: Siempre encriptar la contraseña
            'role' => $request->role,
        ]);

        // 3. Generar un token de acceso inmediato para que el usuario quede logueado
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Devolver respuesta JSON con el token y datos del usuario
        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * INICIO DE SESIÓN (LOGIN)
     * Verifica credenciales y emite un token de acceso si son correctas.
     */
    public function login(Request $request)
    {
        // 1. Validar que se enviaron email y password
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 2. Intentar autenticar con las credenciales
        // Auth::attempt verifica si el email existe y si la contraseña coincide (desencriptando automáticamente)
        if (Auth::attempt($credentials)) {
            $user = Auth::user(); // Obtener el usuario autenticado

            // 3. Crear un nuevo token de acceso (Sanctum)
            // Este token es el que el Frontend guardará y enviará en cada petición futura
            $token = $user->createToken('auth_token')->plainTextToken;

            // 4. Determinar a dónde redirigir según el rol
            // Esto ayuda al Frontend a saber a qué pantalla enviar al usuario
            $redirectUrl = match ($user->role) {
                'admin' => '/admin/dashboard',
                'nutriologo' => '/nutritionist/menus',
                default => '/user/calculation',
            };

            // 5. Devolver respuesta exitosa
            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
                'redirect_url' => $redirectUrl,
            ]);
        }

        // 6. Si la autenticación falla, devolver error 422 (Unprocessable Entity)
        return response()->json([
            'email' => 'The provided credentials do not match our records.',
        ], 422);
    }

    /**
     * CIERRE DE SESIÓN (LOGOUT)
     * Invalida el token actual para que ya no pueda ser usado.
     */
    public function logout(Request $request)
    {
        // 1. Obtener el usuario actual y borrar SOLO el token que usó para esta petición.
        // Esto permite que si está logueado en otro dispositivo, no se le cierre la sesión allá.
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
