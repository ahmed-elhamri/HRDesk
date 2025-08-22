<?php

namespace Database\Seeders;

use App\Models\Employe;
use App\Models\Prime;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PrimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Prime::insert([
            [
                'motif' => "Achat de jouets de la fête de l'Achoura",
            ],[
                'motif' => "Allocation d'assistance à la famille",
            ],[
                'motif' => "Allocation de recherche",
            ],[
                'motif' => "Allocation hierarchique",
            ],[
                'motif' => "Bourse d'études",
            ],[
                'motif' => "Commissions proport sur chiffre d'affaires",
            ],[
                'motif' => "Commissions sur les ventes",
            ],[
                'motif' => "Dépenses d'eau, d'électricité et de chauffage",
            ],[
                'motif' => "Etrennes",
            ],[
                'motif' => "Frais d'entretien, de rép. vign. de voiture personnelle",
            ],[
                'motif' => "Frais de voyage et de séjours particullers",
            ],[
                'motif' => "Frais deTéléphone",
            ],[
                'motif' => "Gratification de fin d'année",
            ],[
                'motif' => "Gratification a caractere discretion",
            ],[
                'motif' => "Indemnite de lait",
            ],[
                'motif' => "Indemnité compensatrice de logement",
            ],[
                'motif' => "Indemnité compensatrice de rémunération",
            ],[
                'motif' => "Indemnité d'encadrement",
            ],[
                'motif' => "Indemnité d'habillement pr travaux salissants",
            ],[
                'motif' => "Indemnité d'intempéries pr travaux dangereux",
            ],[
                'motif' => "Indemnité d'utilisation de volture personnelle",
            ],[
                'motif' => "Indemnité de calsse",
            ],[
                'motif' => "Indemnité de cherté de vie",
            ],[
                'motif' => "Indemnité de direction",
            ],[
                'motif' => "Indemnite de demenagement ou de mutation Imp.",
            ],[
                'motif' => "Indemnité de déménagement ou de mutation N.Imp.",
            ],[
                'motif' => "Indemnité de déplacements",
            ],[
                'motif' => "Indemnité de fonction",
            ],[
                'motif' => "Indemnité de frais de bureau",
            ],[
                'motif' => "Indemnité de licenciment partie fixée",
            ],[
                'motif' => "Indemnité de licenciment partie légale",
            ],[
                'motif' => "Indemnité de logement",
            ]
        ]);
    }
}
