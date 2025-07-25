<?php

namespace Database\Seeders;

use App\Models\Employe;
use App\Models\Paiement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaiementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employeIds = Employe::pluck('id')->shuffle();
        for($i = 1; $i <= count($employeIds); $i++) {
            Paiement::create([
                'employe_id' => $i,
                'mode_paiement' => fake()->randomElement(['Virement', 'Chèque', 'Espèces']),
                'banque' => fake()->company(),
                'numero_compte' => fake()->bankAccountNumber(),
                'adresse_banque' => fake()->address(),
            ]);
        }
    }
}
