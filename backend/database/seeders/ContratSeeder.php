<?php

namespace Database\Seeders;

use App\Models\Contrat;
use App\Models\Employe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContratSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employeIds = Employe::pluck('id')->shuffle();
        for($i = 1; $i <= count($employeIds); $i++) {
            Contrat::create([
                'employe_id' => $i,
                'type_contrat' => fake()->randomElement(['CDI', 'CDD']),
                'type_remuneration' => fake()->randomElement(['MENSUEL', 'HORAIRE', 'QUINZAINE']),
                'statut' => fake()->randomElement(['PERMANENT', 'VACATAIRE', 'OCCASIONNEL', 'STAGAIRE', 'TAHFIZ', 'PCS']),
                'date_fin' => fake()->optional()->dateTimeBetween('now', '+1 year'),
                'salaire_base' => fake()->randomFloat(2, 2000, 10000),
                'taux_horaire' => fake()->numberBetween(10, 100),
                'classification' => fake()->randomElement(['NR', 'SO', 'DE', 'IT', 'IL', 'AT', 'CS', 'MS', 'MP']),
                'est_avocat' => fake()->boolean(),
                'est_domestique' => fake()->boolean(),
                'est_saisonnier' => fake()->boolean(),
                'nb_jours_saisonnier' => fake()->numberBetween(0, 90),
                'nouveau_declarant' => fake()->boolean(),
            ]);
        }
    }
}
