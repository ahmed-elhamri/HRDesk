<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FraisProfessionnel extends Model
{
    use HasFactory;

    protected $table = 'frais_professionnels';

    protected $fillable = [
        'type',
        'min_sbi',
        'max_sbi',
        'taux',
        'plafond',
    ];

}
