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
//        Permission::insert([
//            [
//                'user_id' => $user->id,
//                'entity' => 'departement',
//                'can_create' => true,
//                'can_read' => true,
//                'can_update' => true,
//                'can_delete' => true,
//            ],
//            [
//                'user_id' => $user->id,
//                'entity' => 'service',
//                'can_create' => true,
//                'can_read' => true,
//                'can_update' => true,
//                'can_delete' => true,
//            ],
//            [
//                'user_id' => $user->id,
//                'entity' => 'fonction',
//                'can_create' => true,
//                'can_read' => true,
//                'can_update' => true,
//                'can_delete' => true,
//            ],
//            [
//                'user_id' => $user->id,
//                'entity' => 'employe',
//                'can_create' => true,
//                'can_read' => true,
//                'can_update' => true,
//                'can_delete' => true,
//            ],
//            [
//                'user_id' => $user->id,
//                'entity' => 'prime',
//                'can_create' => true,
//                'can_read' => true,
//                'can_update' => true,
//                'can_delete' => true,
//            ],
//        ]);
        User::factory()->count(20)->create();
    }
}
