<?php

namespace Database\Seeders;

use App\Models\IrTranche;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IrTrancheSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            // period, rni_min, rni_max, taux, deduction
            ['MENSUEL', 0.00, 3333.00, 0, 0.00],
            ['MENSUEL', 3333.01, 5000.00, 10, 333.33],
            ['MENSUEL', 5000.01, 6667.00, 20, 833.33],
            ['MENSUEL', 6667.01, 8333.00, 30, 1500.00],
            ['MENSUEL', 8333.01, 15000.00, 34, 1833.33],
            ['MENSUEL', 15000.01, null, 37, 2283.33],

            ['ANNUEL', 0.00, 40000.00, 0, 0.00],
            ['ANNUEL', 40000.01, 60000.00, 10, 4000.00],
            ['ANNUEL', 60000.01, 80000.00, 20, 10000.00],
            ['ANNUEL', 80000.01, 100000.00, 30, 18000.00],
            ['ANNUEL', 100000.01, 180000.00, 34, 22000.00],
            ['ANNUEL', 180000.01, null, 37, 27000.00],
        ];

        foreach ($data as $row) {
            IrTranche::create([
                'period'    => $row[0],
                'rni_min'   => $row[1],
                'rni_max'   => $row[2],
                'taux'      => $row[3],
                'deduction' => $row[4],
            ]);
        }
    }
}
