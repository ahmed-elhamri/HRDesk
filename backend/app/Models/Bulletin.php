<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bulletin extends Model
{
    use HasFactory;
    protected $table = 'bulletins';

    protected $fillable = [
        'employe_id',
        'jrs_trav',
        'hrs_trav',
        'hrs_sup',
        'brut',
        'cnss',
        'amo',
        'igr',
        'net_a_payer',
        'periode',
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }

    public function bulletins_details(){
        return $this->hasMany(BulletinDetails::class);
    }
}
