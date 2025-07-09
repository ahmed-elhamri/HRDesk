<?php

namespace Database\Seeders;

use App\Models\Employe;
use App\Models\Prime;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PrimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = Employe::pluck('id')->shuffle();

        for($i = 4; $i <= count($userIds); $i++) {
            Prime::create([
                'employe_id' => $i,
                'montant' => fake()->numberBetween(500, 4000),
                'motif' => fake()->text(),
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'date_attribution' => fake()->date(),
            ]);
        }
    }
}
