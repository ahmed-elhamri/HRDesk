<?php

namespace Database\Seeders;

use App\Models\AmoCotisation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AmoCotisationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AmoCotisation::insert([
            [
                'cotisation' => 'AMO',
                'part_salariale' => 4.0,
                'part_patronale' => 6.0,
                'plafond' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cotisation' => 'Participation AMO',
                'part_salariale' => 2.0,
                'part_patronale' => 3.0,
                'plafond' => 5000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
