<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\WeeklyPlan;
use Illuminate\Support\Facades\Auth;

class WeeklyPlanController extends Controller
{
    public function index(Request $request)
    {
        return WeeklyPlan::where('user_id', $request->user()->id)
            ->with('menu')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'day' => 'required|string',
            'menu_id' => 'nullable|exists:menus,id',
        ]);

        $plan = WeeklyPlan::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'day' => $request->day,
            ],
            [
                'menu_id' => $request->menu_id,
            ]
        );

        return response($plan->load('menu'), 200);
    }
}
