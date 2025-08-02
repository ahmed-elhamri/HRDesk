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
            'user_id' => 1,
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
        ]);

        $userIds = User::pluck('id')->shuffle();

        for($i = 2; $i <= count($userIds); $i++) {
            Employe::create([
                'user_id' => $i,
                'fonction_id' => fake()->numberBetween(1, 27),
                'matricule' => str_pad($i, 3, '0', STR_PAD_LEFT),
                'civilite' => fake()->randomElement(['M', 'MME', 'MLLE']),
                'nom' => fake()->lastName(),
                'prenom' => fake()->firstName(),
                'adresse' => fake()->address(),
                'ville' => fake()->firstName(),
                'nationalite' => "Marocain",
                'cin' => strtoupper(fake()->lexify('??') . fake()->numerify('#####')),
                'telephone_mobile' => fake()->phoneNumber(),
                'email' => fake()->safeEmail(),
                'date_de_naissance' => fake()->date(),
                'lieu_de_naissance' => fake()->city(),
                'situation_familiale' => fake()->randomElement(['MARIE', 'CELIBATAIRE']),
                'date_embauche' => fake()->date(),
                'date_entree' => fake()->date(),
            ]);
        }

    }
}
