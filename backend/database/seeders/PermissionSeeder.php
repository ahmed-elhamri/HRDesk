<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::insert([
            [
                'user_id' => 1,
                'entity' => 'departement',
                'can_create' => true,
                'can_read' => true,
                'can_update' => true,
                'can_delete' => true,
            ],
            [
                'user_id' => 1,
                'entity' => 'service',
                'can_create' => true,
                'can_read' => true,
                'can_update' => true,
                'can_delete' => true,
            ],
            [
                'user_id' => 1,
                'entity' => 'fonction',
                'can_create' => true,
                'can_read' => true,
                'can_update' => true,
                'can_delete' => true,
            ],
            [
                'user_id' => 1,
                'entity' => 'employe',
                'can_create' => true,
                'can_read' => true,
                'can_update' => true,
                'can_delete' => true,
            ],
            [
                'user_id' => 1,
                'entity' => 'prime',
                'can_create' => true,
                'can_read' => true,
                'can_update' => true,
                'can_delete' => true,
            ],
            [
                'user_id' => 1,
                'entity' => 'parametre',
                'can_create' => true,
                'can_read' => true,
                'can_update' => true,
                'can_delete' => true,
            ],
        ]);
        $employeIds = User::pluck('id')->shuffle();
        for($i = 2; $i <= count($employeIds); $i++) {
            Permission::insert([
                [
                    'user_id' => $i,
                    'entity' => 'departement',
                ],
                [
                    'user_id' => $i,
                    'entity' => 'service',
                ],
                [
                    'user_id' => $i,
                    'entity' => 'fonction',
                ],
                [
                    'user_id' => $i,
                    'entity' => 'employe',
                ],
                [
                    'user_id' => $i,
                    'entity' => 'prime',
                ],
                [
                    'user_id' => $i,
                    'entity' => 'parametre',
                ],
            ]);
        }
    }
}
