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
//        Employe::create([
//            'user_id' => 3,
//            'fonction_id' => 1,
//            'matricule' => "003",
//            'nom' => "ELHAMRI",
//            'prenom' => "Ahmed",
//            'cin' => "EA243377",
//            'sexe' => "HOMME",
//            'nationalite' => "Marocain",
//            'date_de_naissance' => "2003-01-07",
//            'pays' => "Maroc",
//            'ville' => "Ben Guerir",
//            'adresse_actuelle' => fake()->address(),
//            'telephone_mobile' => "0641866092",
//            'telephone_fixe' => fake()->phoneNumber(),
//            'email_personnel' => "elhamri949@gmail.com",
//            'situation_familiale' => "CELIBATAIRE",
//            'date_embauche' => fake()->date(),
//            'salaire_base' => "10000",
//        ]);

        $userIds = User::pluck('id')->shuffle();

        for($i = 4; $i <= count($userIds); $i++) {
            Employe::create([
                'user_id' => $i,
                'fonction_id' => fake()->numberBetween(1, 27),
                'matricule' => str_pad($i, 3, '0', STR_PAD_LEFT),
                'nom' => fake()->lastName(),
                'prenom' => fake()->firstName(),
                'cin' => strtoupper(fake()->lexify('??') . fake()->numerify('#####')),
                'sexe' => fake()->randomElement(['HOMME', 'FEMME']),
                'nationalite' => "Marocain",
                'date_de_naissance' => fake()->date(),
                'pays' => fake()->firstName(),
                'ville' => fake()->firstName(),
                'adresse_actuelle' => fake()->address(),
                'telephone_mobile' => fake()->phoneNumber(),
                'telephone_fixe' => fake()->phoneNumber(),
                'email_personnel' => fake()->email(),
                'situation_familiale' => fake()->randomElement(['MARIE', 'CELIBATAIRE']),
                'date_embauche' => fake()->date(),
                'salaire_base' => fake()->numberBetween(5000, 12000),
            ]);
        }

    }
}
