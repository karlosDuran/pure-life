<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Menu::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'breakfast' => 'required|string|max:255',
            'lunch' => 'required|string|max:255',
            'dinner' => 'required|string|max:255',
            'snack' => 'required|string|max:255',
            'calories' => 'required|integer',
            'type' => 'required|in:vegetariana,omnivora',
        ]);

        $menu = Menu::create($request->all());

        return response($menu, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Menu::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $menu = Menu::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'breakfast' => 'required|string|max:255',
            'lunch' => 'required|string|max:255',
            'dinner' => 'required|string|max:255',
            'snack' => 'required|string|max:255',
            'calories' => 'required|integer',
            'type' => 'required|in:vegetariana,omnivora',
        ]);

        $menu->update($request->all());

        return response($menu);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $menu = Menu::findOrFail($id);
        $menu->delete();

        return response(null, 204);
    }
}
