<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            "user_id" => 2,
            "nom" => "admin1",
            "prenom" => "admin1",
            "date_embauche" => "2025-07-06",
            "salaire_base" => 20000,
        ]);
    }
}
