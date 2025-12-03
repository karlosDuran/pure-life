<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Nutritionist
        User::updateOrCreate(
            ['email' => 'nutriologo@purelife.com'],
            [
                'name' => 'Nutriólogo Principal',
                'password' => Hash::make('password'),
                'role' => 'nutriologo',
            ]
        );

        // User 1
        User::updateOrCreate(
            ['email' => 'usuario1@purelife.com'],
            [
                'name' => 'Usuario Uno',
                'password' => Hash::make('password'),
                'role' => 'usuario',
            ]
        );

        // User 2
        User::updateOrCreate(
            ['email' => 'usuario2@purelife.com'],
            [
                'name' => 'Usuario Dos',
                'password' => Hash::make('password'),
                'role' => 'usuario',
            ]
        );
    }
}
