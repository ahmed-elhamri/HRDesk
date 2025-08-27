<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employe>
 */
class EmployeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'fonction_id' => fake()->unique()->numberBetween(1, 27),
            'matricule' => 'MAT'.fake()->numerify('#####'),
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
            'periode' => now()->format('Y-m').'-01',
            'jours_travailles' => 26
        ];
    }
}
