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
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Allocation d'assistance à la famille",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Allocation de recherche",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Allocation hierarchique",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Bourse d'études",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Commissions proport sur chiffre d'affaires",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Commissions sur les ventes",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Dépenses d'eau, d'électricité et de chauffage",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Etrennes",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Frais d'entretien, de rép. vign. de voiture personnelle",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Frais de voyage et de séjours particullers",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Frais deTéléphone",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Gratification de fin d'année",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Gratification a caractere discretion",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnite de lait",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité compensatrice de logement",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité compensatrice de rémunération",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité d'encadrement",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité d'habillement pr travaux salissants",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité d'intempéries pr travaux dangereux",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité d'utilisation de volture personnelle",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité de calsse",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité de cherté de vie",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité de direction",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnite de demenagement ou de mutation Imp.",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité de déménagement ou de mutation N.Imp.",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité de déplacements",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité de fonction",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité de frais de bureau",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité de licenciment partie fixée",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité de licenciment partie légale",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ],[
                'motif' => "Indemnité de logement",
                'impot' => fake()->randomElement(['IMPOSABLE', 'NON IMPOSABLE']),
                'plafond' => 1000,
            ]
        ]);
    }
}
