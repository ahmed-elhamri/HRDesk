<?php

namespace Database\Seeders;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            DepartementSeeder::class,
            ServiceSeeder::class,
            FonctionSeeder::class,
            UserSeeder::class,
            EmployeSeeder::class,
            AbsenceSeeder::class,
            HeureSupplementaireSeeder::class,
            ContratSeeder::class,
            CaisseSocialeSeeder::class,
            PaiementSeeder::class,
            DocumentSeeder::class,
            PrimeSeeder::class,
            EmployePrimeSeeder::class,
            PermissionSeeder::class,
            AmoCotisationSeeder::class,
            CnssCotisationSeeder::class,
            FamilyChargeSeeder::class,
            FraisProfessionnelSeeder::class,
            IrTrancheSeeder::class,
            TauxHeuresSupplementairesSeeder::class,
        ]);
    }
}
