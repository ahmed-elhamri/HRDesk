<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Service::insert([
            [
                "departement_id" => "1",
                "reference" => "SERV-001",
                "designation" => "Développement Backend"
            ],[
                "departement_id" => "1",
                "reference" => "SERV-002",
                "designation" => "Développement Frontend"
            ],[
                "departement_id" => "1",
                "reference" => "SERV-003",
                "designation" => "Qualité & Tests"
            ]
        ]);
        Service::insert([
            [
                "departement_id" => "2",
                "reference" => "SERV-004",
                "designation" => "Gestion de produit"
            ],[
                "departement_id" => "2",
                "reference" => "SERV-005",
                "designation" => "Conception UI/UX"
            ],[
                "departement_id" => "2",
                "reference" => "SERV-006",
                "designation" => "Analyse métier"
            ]
        ]);
        Service::insert([
            [
                "departement_id" => "3",
                "reference" => "SERV-007",
                "designation" => "Ressources humaines"
            ],[
                "departement_id" => "3",
                "reference" => "SERV-008",
                "designation" => "Support informatique"
            ],[
                "departement_id" => "3",
                "reference" => "SERV-009",
                "designation" => "Comptabilité & Finance"
            ]
        ]);
    }
}
