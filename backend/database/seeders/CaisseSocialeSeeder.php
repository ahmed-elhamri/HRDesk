<?php

namespace Database\Seeders;

use App\Models\CaisseSociale;
use App\Models\Employe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CaisseSocialeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employeIds = Employe::pluck('id')->shuffle();
        for($i = 1; $i <= count($employeIds); $i++) {
            CaisseSociale::create([
                'employe_id' => $i,
                'numero_cnss' => fake()->numerify('CnssCotisations#######'),
                'numero_mutuelle' => fake()->numerify('MUT#######'),
                'numero_adherent_cimr' => fake()->numerify('CIMR#######'),
                'numero_categorie_cimr' => fake()->randomElement(['A1', 'B2', 'C3', 'D4']),
                'matricule_cimr' => fake()->bothify('CIMR-##??'),
                'taux_cotisation_cimr' => fake()->randomFloat(2, 0, 10),
                'date_affiliation_cimr' => fake()->date(),
            ]);
        }
    }
}
