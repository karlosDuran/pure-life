<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Seed 10 example menus
        $menus = [
            ['name' => 'Menú Balanceado', 'breakfast' => 'Avena con frutas', 'lunch' => 'Pollo a la plancha con ensalada', 'dinner' => 'Yogurt con nueces', 'snack' => 'Manzana', 'calories' => 1800, 'type' => 'omnivora'],
            ['name' => 'Menú Vegetariano Ligero', 'breakfast' => 'Tostadas de aguacate', 'lunch' => 'Lentejas con arroz', 'dinner' => 'Sopa de verduras', 'snack' => 'Almendras', 'calories' => 1500, 'type' => 'vegetariana'],
            ['name' => 'Menú Alto en Proteína', 'breakfast' => 'Huevos revueltos', 'lunch' => 'Carne asada con papas', 'dinner' => 'Atún con galletas', 'snack' => 'Batido de proteína', 'calories' => 2200, 'type' => 'omnivora'],
            ['name' => 'Menú Keto', 'breakfast' => 'Tocino y huevos', 'lunch' => 'Salmón con espárragos', 'dinner' => 'Ensalada César con pollo', 'snack' => 'Queso', 'calories' => 2000, 'type' => 'omnivora'],
            ['name' => 'Menú Vegano', 'breakfast' => 'Smoothie verde', 'lunch' => 'Tacos de garbanzo', 'dinner' => 'Ensalada de quinoa', 'snack' => 'Zanahorias con hummus', 'calories' => 1600, 'type' => 'vegetariana'],
            ['name' => 'Menú Mediterráneo', 'breakfast' => 'Pan integral con tomate', 'lunch' => 'Pescado al horno', 'dinner' => 'Ensalada griega', 'snack' => 'Aceitunas', 'calories' => 1900, 'type' => 'omnivora'],
            ['name' => 'Menú Sin Gluten', 'breakfast' => 'Arepas de maíz', 'lunch' => 'Pollo al curry con arroz', 'dinner' => 'Tortilla de patatas', 'snack' => 'Frutos secos', 'calories' => 1700, 'type' => 'omnivora'],
            ['name' => 'Menú Detox', 'breakfast' => 'Jugo verde', 'lunch' => 'Sopa de calabaza', 'dinner' => 'Verduras al vapor', 'snack' => 'Piña', 'calories' => 1200, 'type' => 'vegetariana'],
            ['name' => 'Menú Energético', 'breakfast' => 'Hot cakes de avena', 'lunch' => 'Pasta con albóndigas', 'dinner' => 'Sándwich de pavo', 'snack' => 'Barra de granola', 'calories' => 2500, 'type' => 'omnivora'],
            ['name' => 'Menú Low Carb', 'breakfast' => 'Omelette de espinacas', 'lunch' => 'Pechuga rellena de queso', 'dinner' => 'Calabacitas rellenas', 'snack' => 'Gelatina sin azúcar', 'calories' => 1400, 'type' => 'omnivora'],
        ];

        foreach ($menus as $menu) {
            \App\Models\Menu::create($menu);
        }

        $this->call([
            AdminSeeder::class,
            UserSeeder::class,
        ]);
    }
}
