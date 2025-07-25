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
                'chemin_cin' => 'documents/fake/cin1.pdf',
                'chemin_cnss' => 'documents/fake/cnss1.pdf',
                'chemin_contrat_travail' => 'documents/fake/contrat1.pdf',
                'chemin_tableau_amortissement' => 'documents/fake/amortissement1.pdf',
                'lettre_demission' => 'documents/fake/demission1.pdf',
                'diplome_un' => 'documents/fake/diplome1.pdf',
                'diplome_deux' => 'documents/fake/diplome2.pdf',
                'diplome_trois' => 'documents/fake/diplome3.pdf',
                'diplome_quatre' => 'documents/fake/diplome4.pdf',
                'diplome_cinq' => 'documents/fake/diplome5.pdf',
            ]);
        }
    }
}
