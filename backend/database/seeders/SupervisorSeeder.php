<?php

namespace Database\Seeders;

use App\Models\Supervisor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupervisorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Supervisor::create([
            "user_id" => 1,
            "nom" => "supervisor1",
            "prenom" => "supervisor1",
            "date_embauche" => "2025-07-06",
        ]);

    }
}
