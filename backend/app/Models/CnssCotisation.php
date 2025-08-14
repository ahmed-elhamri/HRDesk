<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CnssCotisation extends Model
{
    use HasFactory;
    protected $table = 'cnss_cotisations';

    protected $fillable = [
        'cotisation',
        'part_salariale',
        'part_patronale',
        'plafond',
    ];

}
