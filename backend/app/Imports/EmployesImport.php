<?php

namespace App\Imports;

use App\Models\CaisseSociale;
use App\Models\Contrat;
use App\Models\Document;
use App\Models\Employe;
use App\Models\Paiement;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Row;

class EmployesImport implements OnEachRow, WithHeadingRow
{
    public function onRow(Row $row)
    {
        $user = User::create([
            'email' => $row['email'],
            'password' => Hash::make('123456'),
            'role' => 'EMPLOYE'
        ]);
        $employe = Employe::create([
            'user_id' => $user->id,
            'fonction_id' => (int) trim($row['fonction_id']),
            'matricule' => trim($row['matricule']),
            'civilite' => trim($row['civilite']),
            'nom' => trim($row['nom']),
            'prenom' => trim($row['prenom']),
            'adresse' => trim($row['adresse']),
            'ville' => trim($row['ville']),
            'nationalite' => trim($row['nationalite']),
            'cin' => trim($row['cin']),
            'telephone_mobile' => trim($row['telephone_mobile']),
            'email' => trim($row['email']),
            'date_de_naissance' => trim($row['date_de_naissance']),
            'lieu_de_naissance' => trim($row['lieu_de_naissance']),
            'situation_familiale' => trim($row['situation_familiale']),
            'date_embauche' => trim($row['date_embauche']),
            'date_entree' => trim($row['date_entree']),
        ]);
        $contrat = Contrat::create([
            'employe_id' => $employe->id,
            'type_contrat' => trim($row['type_contrat']),
            'type_remuneration' => trim($row['type_remuneration']),
            'statut' => trim($row['statut']),
            'date_fin' => trim($row['date_fin']),
            'salaire_base' => (float) trim($row['salaire_base']),
            'taux_horaire' => (int) trim($row['taux_horaire']),
            'classification' => trim($row['classification']),
            'est_avocat' => (int) trim($row['est_avocat']),
            'est_domestique' => (int) trim($row['est_domestique']),
            'est_saisonnier' => (int) trim($row['est_saisonnier']),
            'nb_jours_saisonnier' => (int) trim($row['nb_jours_saisonnier']),
            'nouveau_declarant' => (int) trim($row['nouveau_declarant']),
        ]);
        $caisse = CaisseSociale::create([
            'employe_id' => $employe->id,
            'numero_cnss' => trim($row['numero_cnss']),
            'numero_mutuelle' => trim($row['numero_mutuelle']),
            'numero_adherent_cimr' => trim($row['numero_adherent_cimr']),
            'numero_categorie_cimr' => trim($row['numero_categorie_cimr']),
            'matricule_cimr' => trim($row['matricule_cimr']),
            'taux_cotisation_cimr' => trim($row['taux_cotisation_cimr']),
            'date_affiliation_cimr' => trim($row['date_affiliation_cimr']),
        ]);
        $paiement = Paiement::create([
            'employe_id' => $employe->id,
            'mode_paiement' => trim($row['mode_paiement']),
            'banque' => trim($row['banque']),
            'numero_compte' => trim($row['numero_compte']),
            'adresse_banque' => trim($row['adresse_banque']),
        ]);

        $document = Document::create([
            'employe_id' => $employe->id,
        ]);
    }
}
