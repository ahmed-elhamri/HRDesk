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
            ['2025-08-01', 'OUVRABLE', 'JOUR', 4],  // 2h HS jour ouvrable
            ['2025-08-02', 'OUVRABLE', 'JOUR', 4],  // 1h30
        ];

        foreach ($samples as [$date, $jour, $periode, $nombre]) {
            HeureSupplementaire::create([
                'employe_id'  => 2,
                'date' => $date,
                'jour'        => $jour,
                'periode' => $periode,
                'nombre'   => $nombre,
            ]);
        }
    }
}
