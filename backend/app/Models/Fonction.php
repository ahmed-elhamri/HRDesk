<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fonction extends Model
{
    protected $fillable = [
        'service_id',
        'reference',
        'designation',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function employes() {
        return $this->hasMany(Employe::class);
    }
}
