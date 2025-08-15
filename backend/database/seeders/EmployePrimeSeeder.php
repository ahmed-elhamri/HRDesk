<?php

namespace Database\Seeders;

use App\Models\EmployePrime;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployePrimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EmployePrime::insert([
            [
                'employe_id' => 2,
                'prime_id' => 1,
                'montant' => 2000,
                'date_attribution' => '2025-08-05',
            ],
            [
                'employe_id' => 2,
                'prime_id' => 2,
                'montant' => 500,
                'date_attribution' => '2025-08-09',
            ],
        ]);
    }
}
