<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CaisseSociale;
use App\Models\Contrat;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Validator;

class CaisseSocialeController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            'auth:sanctum',
            new Middleware('role:SUPERVISOR,ADMIN'),
        ];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employe_id' => 'required|exists:employes,id|unique:caisses_sociales,employe_id',
            'numero_cnss' => 'required|string',
            'numero_mutuelle' => 'required|string',
            'numero_adherent_cimr' => 'required|string',
            'numero_categorie_cimr' => 'required|string',
            'matricule_cimr' => 'required|string',
            'taux_cotisation_cimr' => 'required|numeric',
            'date_affiliation_cimr' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $caisse = CaisseSociale::create($validator->validated());

        return response()->json($caisse, 201);
    }

    public function show(Request $request)
    {
        $caisse_sociale = CaisseSociale::where("employe_id", $request->employe_id)->firstOrFail();
        return response()->json($caisse_sociale);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $caisse = CaisseSociale::where('employe_id', $request->employe_id)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'numero_cnss' => 'required|string',
            'numero_mutuelle' => 'required|string',
            'numero_adherent_cimr' => 'required|string',
            'numero_categorie_cimr' => 'required|string',
            'matricule_cimr' => 'required|string',
            'taux_cotisation_cimr' => 'required|numeric',
            'date_affiliation_cimr' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $caisse->update($validator->validated());

        return response()->json($caisse);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $caisse = CaisseSociale::where('employe_id', $request->employe_id)->firstOrFail();
        $caisse->delete();

        return response()->json(['message' => 'Caisse Sociale deleted successfully'], 200);
    }
}
