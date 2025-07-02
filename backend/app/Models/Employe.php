<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employe extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'poste',
        'departement',
        'date_embauche',
        'salaire_base',
    ];

    public function primes() {
        return $this->hasMany(Prime::class);
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
