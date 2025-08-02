<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'email' => 'elhamri949@gmail.com',
            'password' => Hash::make('123456'),
            'password_changed' => true,
            'role' => 'SUPERVISOR',
        ]);
        Permission::insert([
            [
                'user_id' => $user->id,
                'entity' => 'departement',
            ],
            [
                'user_id' => $user->id,
                'entity' => 'service',
            ],
            [
                'user_id' => $user->id,
                'entity' => 'fonction',
            ],
            [
                'user_id' => $user->id,
                'entity' => 'employe',
            ],
            [
                'user_id' => $user->id,
                'entity' => 'prime',
            ],
        ]);
        User::factory()->count(200)->create();
    }
}
