<?php

namespace Database\Seeders;

use App\Models\Employe;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Employe::create([
            'fonction_id' => 1,
            'matricule' => "001",
            'civilite' => "M",
            'nom' => "ELHAMRI",
            'prenom' => "Ahmed",
            'adresse' => fake()->address(),
            'ville' => "Ben Guerir",
            'nationalite' => "Marocain",
            'cin' => "EA243377",
            'telephone_mobile' => "0641866092",
            'email' => "elhamri949@gmail.com",
            'date_de_naissance' => "2003-01-07",
            'lieu_de_naissance' => "Ben Guerir",
            'situation_familiale' => "CELIBATAIRE",
            'date_embauche' => fake()->date(),
            'date_entree' => fake()->date(),
            'periode' => now()->format('Y-m').'-01',
            'jours_travailles' => '26',
        ]);

        Employe::factory()->count(24)->create();

    }
}
