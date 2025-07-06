<?php

namespace Database\Seeders;

use App\Models\Fonction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FonctionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Fonction::insert([
            [
                "service_id" => "1",
                "reference" => "FUNC-001",
                "designation" => "Développeur Laravel"
            ],[
                "service_id" => "1",
                "reference" => "FUNC-002",
                "designation" => "Développeur Node.js"
            ],[
                "service_id" => "1",
                "reference" => "FUNC-003",
                "designation" => "Développeur SpringBoot"
            ]
        ]);
        Fonction::insert([
            [
                "service_id" => "2",
                "reference" => "FUNC-004",
                "designation" => "Développeur React.js"
            ],[
                "service_id" => "2",
                "reference" => "FUNC-005",
                "designation" => "Développeur Vue.js"
            ],[
                "service_id" => "2",
                "reference" => "FUNC-006",
                "designation" => "Développeur Next.js"
            ]
        ]);
        Fonction::insert([
            [
                "service_id" => "3",
                "reference" => "FUNC-007",
                "designation" => "Testeur manuel"
            ],[
                "service_id" => "3",
                "reference" => "FUNC-008",
                "designation" => "Testeur automatisé"
            ],[
                "service_id" => "3",
                "reference" => "FUNC-009",
                "designation" => "Responsable QA"
            ]
        ]);
        Fonction::insert([
            [
                "service_id" => "4",
                "reference" => "FUNC-010",
                "designation" => "Product Owner"
            ],[
                "service_id" => "4",
                "reference" => "FUNC-011",
                "designation" => "Chef de produit technique"
            ],[
                "service_id" => "4",
                "reference" => "FUNC-012",
                "designation" => "Responsable roadmap"
            ]
        ]);
        Fonction::insert([
            [
                "service_id" => "5",
                "reference" => "FUNC-013",
                "designation" => "Chercheur UX"
            ],[
                "service_id" => "5",
                "reference" => "FUNC-014",
                "designation" => "Designer UI"
            ],[
                "service_id" => "5",
                "reference" => "FUNC-015",
                "designation" => "Designer d’interaction"
            ]
        ]);
        Fonction::insert([
            [
                "service_id" => "6",
                "reference" => "FUNC-016",
                "designation" => "Analyste métier"
            ],[
                "service_id" => "6",
                "reference" => "FUNC-017",
                "designation" => "Ingénieur des exigences"
            ],[
                "service_id" => "6",
                "reference" => "FUNC-018",
                "designation" => "Analyste fonctionnel"
            ]
        ]);
        Fonction::insert([
            [
                "service_id" => "7",
                "reference" => "FUNC-019",
                "designation" => "Recruteur"
            ],[
                "service_id" => "7",
                "reference" => "FUNC-020",
                "designation" => "Responsable RH"
            ],[
                "service_id" => "7",
                "reference" => "FUNC-021",
                "designation" => "Coordinateur de formation"
            ]
        ]);
        Fonction::insert([
            [
                "service_id" => "8",
                "reference" => "FUNC-022",
                "designation" => "Technicien Helpdesk"
            ],[
                "service_id" => "8",
                "reference" => "FUNC-023",
                "designation" => "Administrateur systèmes"
            ],[
                "service_id" => "8",
                "reference" => "FUNC-024",
                "designation" => "Ingénieur réseau"
            ]
        ]);
        Fonction::insert([
            [
                "service_id" => "9",
                "reference" => "FUNC-025",
                "designation" => "Comptable"
            ],[
                "service_id" => "9",
                "reference" => "FUNC-026",
                "designation" => "Responsable paie"
            ],[
                "service_id" => "9",
                "reference" => "FUNC-027",
                "designation" => "Analyste financier"
            ]
        ]);

    }
}
