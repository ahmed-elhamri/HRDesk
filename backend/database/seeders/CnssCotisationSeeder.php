<?php

namespace Database\Seeders;

use App\Models\CnssCotisation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CnssCotisationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CnssCotisation::insert([
            [
                'cotisation'      => 'Prestation Sociale',
                'part_salariale'  => 4.48,
                'part_patronale'  => 8.98,
                'plafond'         => '6000',
            ],
            [
                'cotisation'      => 'Allocations familiales',
                'part_salariale'  => null,
                'part_patronale'  => 6.40,
                'plafond'         => null,
            ],
            [
                'cotisation'      => 'Taxe formation Pro',
                'part_salariale'  => null,
                'part_patronale'  => 1.60,
                'plafond'         => null,
            ],
        ]);
    }
}
