<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', 'in:nutriologo,usuario'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')),
            'role' => $request->role,
        ]);

        return response($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return User::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,' . $user->id],
            // Role is optional for profile updates, but if present must be valid
            'role' => ['sometimes', 'string', 'in:admin,nutriologo,usuario'],
            'image' => ['nullable', 'image', 'max:5120'], // 5MB Max
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->has('role')) {
            $data['role'] = $request->role;
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('profile-photos', 'public');
            $data['profile_photo_path'] = $path;
        }

        // Add User Stats and Preferences
        $fields = ['weight', 'height', 'age', 'gender', 'activity_level', 'target_calories', 'excluded_foods'];
        foreach ($fields as $field) {
            if ($request->has($field)) {
                $data[$field] = $request->$field;
            }
        }

        $user->update($data);

        if ($request->filled('password')) {
            $request->validate([
                'password' => ['confirmed', Rules\Password::defaults()],
            ]);
            $user->update([
                'password' => Hash::make($request->string('password')),
            ]);
        }

        return response($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response(null, 204);
    }
}
