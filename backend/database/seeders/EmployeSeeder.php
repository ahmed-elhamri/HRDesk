<?php

namespace Database\Seeders;

use App\Models\Employe;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
//        Employe::create([
//            'user_id' => 3,
//            'fonction_id' => 1,
//            'nom' => "ELHAMRI",
//            'prenom' => "Ahmed",
//            'date_embauche' => "2025-01-01",
//            'salaire_base' => 8000,
//        ]);

        $userIds = User::pluck('id')->shuffle();

        for($i = 4; $i <= count($userIds); $i++) {
            Employe::create([
                'user_id' => $i,
                'fonction_id' => fake()->numberBetween(1, 27),
                'nom' => fake()->lastName(),
                'prenom' => fake()->firstName(),
                'date_embauche' => fake()->dateTime(),
                'salaire_base' => fake()->numberBetween(5000, 12000),
            ]);
        }

    }
}
