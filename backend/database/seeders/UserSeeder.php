<?php

namespace Database\Seeders;

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
        User::insert([
            [
                'email' => 'supervisor@gmail.com',
                'password' => Hash::make('123456'),
                'role' => 'SUPERVISOR',
            ],
            [
                'email' => 'admin@gmail.com',
                'password' => Hash::make('123456'),
                'role' => 'ADMIN',
            ],
            [
                'email' => 'elhamri949@gmail.com',
                'password' => Hash::make('123456'),
                'role' => 'EMPLOYE',
            ],
        ]);
        User::factory()->count(200)->create();
    }
}
