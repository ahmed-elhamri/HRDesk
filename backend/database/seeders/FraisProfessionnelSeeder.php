<?php

namespace Database\Seeders;

use App\Models\FraisProfessionnel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FraisProfessionnelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            // Annuel
            ['type' => 'annuel', 'min_sbi' => 0,        'max_sbi' => 78000,    'taux' => 35.00, 'plafond' => null],
            ['type' => 'annuel', 'min_sbi' => 78000.01, 'max_sbi' => null,     'taux' => 25.00, 'plafond' => 35000.00],

            // Mensuel
            ['type' => 'mensuel', 'min_sbi' => 0,       'max_sbi' => 6500,     'taux' => 35.00, 'plafond' => null],
            ['type' => 'mensuel', 'min_sbi' => 6500.01, 'max_sbi' => null,     'taux' => 25.00, 'plafond' => 2916.67],
        ];

        foreach ($data as $row) {
            FraisProfessionnel::create($row);
        }
    }
}
