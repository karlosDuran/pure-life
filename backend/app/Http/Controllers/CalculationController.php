<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CalculationController extends Controller
{
    /**
     * CALCULAR NECESIDADES NUTRICIONALES
     * Este método realiza dos cálculos fundamentales:
     * 1. IMC (Índice de Masa Corporal)
     * 2. TMB (Tasa Metabólica Basal) usando la ecuación de Harris-Benedict
     * 3. TDEE (Gasto Energético Total Diario) basado en el nivel de actividad
     */
    public function calculate(Request $request)
    {
        // 1. Validar los datos físicos del usuario
        $request->validate([
            'weight' => 'required|numeric', // Peso en kg
            'height' => 'required|numeric', // Altura en cm
            'age' => 'required|numeric',    // Edad en años
            'gender' => 'required|in:male,female', // Género biológico (necesario para la fórmula)
            'activity_level' => 'required|numeric', // Factor de actividad (1.2 a 1.9)
        ]);

        $user = Auth::user();
        $weight = $request->weight;
        $height = $request->height;
        $age = $request->age;
        $gender = $request->gender;
        $activityLevel = $request->activity_level;

        // 2. Calcular IMC (Índice de Masa Corporal)
        // Fórmula: Peso (kg) / [Estatura (m)]^2
        $heightInMeters = $height / 100; // Convertir cm a metros
        $imc = $weight / ($heightInMeters * $heightInMeters);

        // 3. Calcular TMB (Tasa Metabólica Basal) - Ecuación Harris-Benedict
        // Esto estima cuántas calorías quema el cuerpo en reposo absoluto
        if ($gender === 'male') {
            // Fórmula para Hombres
            $bmr = 88.362 + (13.397 * $weight) + (4.799 * $height) - (5.677 * $age);
        } else {
            // Fórmula para Mujeres
            $bmr = 447.593 + (9.247 * $weight) + (3.098 * $height) - (4.330 * $age);
        }

        // 4. Calcular Calorías Totales (TDEE)
        // Se multiplica la TMB por el factor de actividad física seleccionado
        $targetCalories = round($bmr * floatval($activityLevel));

        // 5. Guardar los nuevos datos en el perfil del usuario
        // Así no tiene que volver a introducirlos la próxima vez
        $user->update([
            'weight' => $weight,
            'height' => $height,
            'age' => $age,
            'gender' => $gender,
            'activity_level' => $activityLevel,
            'target_calories' => $targetCalories,
        ]);

        // 6. Devolver los resultados al Frontend
        return response()->json([
            'imc' => $imc,
            'target_calories' => $targetCalories,
            'user' => $user
        ]);
    }
}
