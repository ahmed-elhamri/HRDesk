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
            'periode' => now()->format('Y-m').'-01',
        ]);
        User::factory()->count(3)->create();
    }
}
