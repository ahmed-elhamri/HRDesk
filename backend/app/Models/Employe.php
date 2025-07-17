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
        'nom',
        'prenom',
        'cin',
        'sexe',
        'nationalite',
        'date_de_naissance',
        'pays',
        'ville',
        'adresse_actuelle',
        'telephone_mobile',
        'telephone_fixe',
        'email_personnel',
        'situation_familiale',
        'date_embauche',
        'salaire_base',
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

    public function absences() {
        return $this->hasMany(Absence::class);
    }

    public function prets() {
        return $this->hasMany(Pret::class);
    }

    public function bulletinsSalaire() {
        return $this->hasMany(BulletinSalaire::class);
    }
}
