<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bulletin;
use App\Models\BulletinDetails;
use App\Models\CaisseSociale;
use App\Models\Contrat;
use App\Models\Document;
use App\Models\Employe;
use App\Models\EmployePrime;
use App\Models\Paiement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MergeEmployesController extends Controller
{
    public function run(Request $request){
        $employesDe = Employe::where('periode', $request->periodeDe.'-01')->get();
        $employesVers = Employe::where('periode', $request->periodeVers.'-01')->get();
        if ($employesDe->isEmpty()){
            return response()->json([
                'message' => 'Les employés de la période ' . $request->periodeDe .  ' n\'existent pas',
            ], 422);
        }
        if ($employesVers->isNotEmpty()){
            return response()->json([
                'message' => 'Les employés de la période ' . $request->periodeVers .  ' existent déjà',
            ], 422);
        }

        foreach ($employesDe as $employe) {
//            $newUser = $employe->replicate();
//            $newUser->periode = $request->periodeVers.'-01';
//            $newUser->save();

            $newEmploye = $employe->replicate();
            $newEmploye->periode = $request->periodeVers.'-01';
            $newEmploye->save();

            $newContrat = Contrat::where('employe_id', $employe->id)->first()->replicate();
            $newContrat->employe_id = $newEmploye->id;
            $newContrat->save();

            $newCaisse = CaisseSociale::where('employe_id', $employe->id)->first()->replicate();
            $newCaisse->employe_id = $newEmploye->id;
            $newCaisse->save();

            $newPaiment = Paiement::where('employe_id', $employe->id)->first()->replicate();
            $newPaiment->employe_id = $newEmploye->id;
            $newPaiment->save();

            $newDocument = Document::where('employe_id', $employe->id)->first()->replicate();
            $newDocument->employe_id = $newEmploye->id;
            $newDocument->save();

            $employe_primes = EmployePrime::where('employe_id', $employe->id)->get();
            foreach ($employe_primes as $employe_prime) {
                $newEmployePrime = $employe_prime->replicate();
                $newEmployePrime->employe_id = $newEmploye->id;
                $newEmployePrime->save();
            }

            $Bulletins = Bulletin::where('employe_id', $employe->id)->where('periode', $request->periodeDe.'-01')->get();
            foreach ($Bulletins as $bulletin) {
                $newBulletin = $bulletin->replicate();
                $newBulletin->employe_id = $newEmploye->id;
                $newBulletin->periode = $request->periodeVers.'-01';
                $newBulletin->save();

                $bulletins_details = BulletinDetails::where('bulletin_id', $bulletin->id)->get();
                foreach ($bulletins_details as $bulletin_detail) {
                    $newBulletin_detail = $bulletin_detail->replicate();
                    $newBulletin_detail->save();
                }
            }
        }
        return response()->json([
            'message' => 'Les employés ont été transférés avec succès.',
        ], 201);
    }
}
