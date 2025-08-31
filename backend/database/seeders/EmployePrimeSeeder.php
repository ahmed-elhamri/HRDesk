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
                'employe_id' => 1,
                'prime_id' => 1,
                'montant' => 1000,
            ],
            [
                'employe_id' => 1,
                'prime_id' => 2,
                'montant' => 1600,
            ],
        ]);
    }
}
