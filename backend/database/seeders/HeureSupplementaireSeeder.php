<?php

namespace Database\Seeders;

use App\Models\HeureSupplementaire;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HeureSupplementaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $samples = [
            // employe_id sera choisi aléatoirement
            ['2025-08-01', 'OUVRABLE', '08:00', '10:00'],  // 2h HS jour ouvrable
            ['2025-08-02', 'OUVRABLE', '18:30', '20:00'],  // 1h30
            ['2025-08-04', 'FERIES',   '21:00', '23:00'],  // 2h férié soir
            ['2025-08-09', 'FERIES',   '09:00', '12:00'],  // 3h jour férié
        ];

        foreach ($samples as [$date, $jour, $debut, $fin]) {
            HeureSupplementaire::create([
                'employe_id'  => 2,
                'date' => $date,
                'jour'        => $jour,
                'heure_debut' => $debut,
                'heure_fin'   => $fin,
            ]);
        }
    }
}
