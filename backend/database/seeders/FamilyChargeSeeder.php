<?php

namespace Database\Seeders;

use App\Models\FamilyCharge;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FamilyChargeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [0, 41.67, 500],
            [1, 83.33, 1000],
            [2, 125.00, 1500],
            [3, 166.67, 2000],
            [4, 208.33, 2500],
            [5, 250.00, 3000],
            [6, 250.00, 3000],
        ];

        foreach ($data as [$nbr, $mensuel, $annuel]) {
            FamilyCharge::create([
                'nbr_enfants' => $nbr,
                'mensuel'     => $mensuel,
                'annuel'      => $annuel,
            ]);
        }
    }
}
