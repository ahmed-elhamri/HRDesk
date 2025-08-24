<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployePrime extends Model
{
    protected $table = 'employe_prime';

    protected $fillable = [
        'employe_id',
        'prime_id',
        'montant',
        'periode',
    ];

    public function employe() {
        return $this->belongsTo(Employe::class);
    }

    public function prime() {
        return $this->belongsTo(Prime::class);
    }
}
