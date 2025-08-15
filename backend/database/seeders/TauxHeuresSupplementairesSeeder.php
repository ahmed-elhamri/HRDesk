<?php

namespace Database\Seeders;

use App\Models\TauxHeuresSupplementaires;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TauxHeuresSupplementairesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $donnees = [
            // periode, heure_debut, heure_fin, taux jours ouvrés, taux jours fériés
            ['JOUR', '06:00', '21:00', 25, 50],
            ['NUIT', '21:00', '06:00', 50, 100], // chevauche minuit
        ];

        foreach ($donnees as [$periode, $debut, $fin, $ouvres, $feries]) {
            TauxHeuresSupplementaires::create([
                'periode'           => $periode,
                'heure_debut'       => $debut,
                'heure_fin'         => $fin,
                'taux_jours_ouvres' => $ouvres,
                'taux_jours_feries' => $feries,
            ]);
        }
    }
}
