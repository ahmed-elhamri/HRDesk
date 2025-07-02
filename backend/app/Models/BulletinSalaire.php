<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BulletinSalaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'employe_id',
        'mois',
        'salaire_base',
        'total_primes',
        'total_prets',
        'total_absences',
        'salaire_net',
    ];

    public function employe() {
        return $this->belongsTo(Employe::class);
    }
}
