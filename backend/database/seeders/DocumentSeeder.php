<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\Employe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employeIds = Employe::pluck('id')->shuffle();
        for($i = 1; $i <= count($employeIds); $i++) {
            Document::create([
                'employe_id' => $i,
                'chemin_cin' => 'cin1.pdf',
                'chemin_cnss' => 'cnss1.pdf',
                'chemin_contrat_travail' => 'contrat1.pdf',
                'chemin_tableau_amortissement' => 'amortissement1.pdf',
                'lettre_demission' => 'demission1.pdf',
                'diplome_un' => 'diplome1.pdf',
                'diplome_deux' => 'diplome2.pdf',
                'diplome_trois' => 'diplome3.pdf',
                'diplome_quatre' => 'diplome4.pdf',
                'diplome_cinq' => 'diplome5.pdf',
            ]);
        }
    }
}
