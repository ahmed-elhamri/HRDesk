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
        Contrat::create([
            'employe_id' => 1,
            'type_contrat' => 'CDI',
            'type_remuneration' => 'MENSUEL',
            'statut' => 'PERMANENT',
            'salaire_base' => 4288.26,
            'taux_horaire' => 7.33,
            'classification' => 'NR',
            'est_avocat' => 0,
            'est_domestique' => 0,
            'est_saisonnier' => 0,
            'nb_jours_saisonnier' => 0,
            'nouveau_declarant' => 0,
        ]);

        $employeIds = Employe::pluck('id')->shuffle();
        for($i = 2; $i <= count($employeIds); $i++) {
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
                'est_saisonnier' => false,
                'nb_jours_saisonnier' => 0,
                'nouveau_declarant' => fake()->boolean(),
            ]);
        }
    }
}
