<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prime extends Model
{
    use HasFactory;

    protected $fillable = [
        'motif',
        'impot',
        'plafond',
    ];

    public function employes()
    {
        return $this->belongsToMany(Employe::class, "employe_prime")
            ->withPivot('montant', 'date_attribution')
            ->withTimestamps();
    }
}
