<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'departement_id',
        'reference',
        'designation',
    ];

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function fonctions() {
        return $this->hasMany(Fonction::class);
    }
}
