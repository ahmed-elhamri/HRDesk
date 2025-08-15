<?php

namespace Database\Seeders;

use App\Models\Absence;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AbsenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Absence::insert([
            [
                'employe_id' => 2,
                'date' => '2025-08-2'
            ],
            [
                'employe_id' => 2,
                'date' => '2025-08-10'
            ]
        ]);
    }
}
