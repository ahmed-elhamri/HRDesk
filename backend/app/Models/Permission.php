<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'entity',
        'can_create',
        'can_read',
        'can_update',
        'can_delete',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
