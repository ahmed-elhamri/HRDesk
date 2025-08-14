<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmoCotisation extends Model
{
    use HasFactory;

    protected $table = 'amo_cotisations';

    // The fields that are mass assignable
    protected $fillable = [
        'cotisation',
        'part_salariale',
        'part_patronale',
        'plafond',
    ];
}
