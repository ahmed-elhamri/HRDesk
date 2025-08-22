<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BulletinDetails extends Model
{
    use HasFactory;
    protected $table = 'bulletin_details';

    protected $fillable = [
        'bulletin_id',
        'libele',
        'base',
        'taux',
        'gain',
        'retenue',
    ];

    public function bulletin()
    {
        return $this->belongsTo(Bulletin::class);
    }
}
