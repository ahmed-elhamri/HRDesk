<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'fonction_id',
        'matricule',
        'civilite',
        'nom',
        'prenom',
        'adresse',
        'ville',
        'nationalite',
        'cin',
        'sejour',
        'telephone_mobile',
        'telephone_fixe',
        'email',
        'date_de_naissance',
        'lieu_de_naissance',
        'situation_familiale',
        'nb_enfants',
        'nb_enfants',
        'date_embauche',
        'date_entree',
        'taux_anciennete',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function primes()
    {
        return $this->belongsToMany(Prime::class, "employe_prime")
            ->withPivot('montant', 'date_attribution')
            ->withTimestamps();
    }

    public function fonction()
    {
        return $this->belongsTo(Fonction::class);
    }

    public function conges() {
        return $this->hasMany(Conge::class);
    }

    public function contrat() {
        return $this->hasOne(Contrat::class);
    }

    public function paiment() {
        return $this->hasOne(Paiement::class);
    }

    public function caisse() {
        return $this->hasOne(CaisseSociale::class);
    }

    public function document() {
        return $this->hasOne(Document::class);
    }

    public function absences() {
        return $this->hasMany(Absence::class);
    }

    public function prets() {
        return $this->hasMany(Pret::class);
    }

    public function bulletins() {
        return $this->hasMany(Bulletin::class);
    }
}
