<?php

namespace Database\Seeders;

use App\Models\Departement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Departement::insert([
            [
                "reference" => "DEPT-001",
                "designation" => "Ingénierie"
            ],[
                "reference" => "DEPT-002",
                "designation" => "Produit"
            ],[
                "reference" => "DEPT-003",
                "designation" => "Opérations"
            ]
        ]);
    }
}
