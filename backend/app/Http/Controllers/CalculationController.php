<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CalculationController extends Controller
{
    public function calculate(Request $request)
    {
        $request->validate([
            'weight' => 'required|numeric',
            'height' => 'required|numeric',
            'age' => 'required|numeric',
            'gender' => 'required|in:male,female',
            'activity_level' => 'required|numeric',
        ]);

        $user = Auth::user();
        $weight = $request->weight;
        $height = $request->height;
        $age = $request->age;
        $gender = $request->gender;
        $activityLevel = $request->activity_level;

        // IMC Calculation
        $heightInMeters = $height / 100;
        $imc = $weight / ($heightInMeters * $heightInMeters);

        // Harris-Benedict Equation
        if ($gender === 'male') {
            $bmr = 88.362 + (13.397 * $weight) + (4.799 * $height) - (5.677 * $age);
        } else {
            $bmr = 447.593 + (9.247 * $weight) + (3.098 * $height) - (4.330 * $age);
        }

        $targetCalories = round($bmr * floatval($activityLevel));

        // Update User Profile
        $user->update([
            'weight' => $weight,
            'height' => $height,
            'age' => $age,
            'gender' => $gender,
            'activity_level' => $activityLevel,
            'target_calories' => $targetCalories,
            // We don't save IMC usually as it's a derived value, but we return it
        ]);

        return response()->json([
            'imc' => $imc,
            'target_calories' => $targetCalories,
            'user' => $user
        ]);
    }
}
