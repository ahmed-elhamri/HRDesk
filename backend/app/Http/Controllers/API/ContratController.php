<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contrat;
use App\Models\Departement;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Validator;

class ContratController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth:sanctum',
//            new Middleware('role:SUPERVISOR,ADMIN'),
        ];
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employe_id' => 'required|exists:employes,id|unique:contrats,employe_id',
            'type_contrat' => 'required|in:CDI,CDD',
            'type_remuneration' => 'required|in:MENSUEL,HORAIRE,QUINZAINE',
            'statut' => 'required|in:PERMANENT,VACATAIRE,OCCASIONNEL,STAGAIRE,TAHFIZ,PCS',
            'date_fin' => 'nullable|date',
            'salaire_base' => 'required|numeric',
            'taux_horaire' => 'required|integer',
            'classification' => 'required|in:NR,SO,DE,IT,IL,AT,CS,MS,MP',
            'est_avocat' => 'boolean',
            'est_domestique' => 'boolean',
            'est_saisonnier' => 'boolean',
            'nb_jours_saisonnier' => 'nullable|integer',
            'nouveau_declarant' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        Contrat::create($validator->validated());

        return response()->json("Contrat added successfully", 201);
    }

    public function show(Request $request)
    {
        $contrat = Contrat::where("employe_id", $request->employe_id)->firstOrFail();
        return response()->json($contrat);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $contrat = Contrat::where('employe_id',$request->employe_id)->first();
        $validator = Validator::make($request->all(), [
            'type_contrat' => 'sometimes|in:CDI,CDD',
            'type_remuneration' => 'sometimes|in:MENSUEL,HORAIRE,QUINZAINE',
            'statut' => 'sometimes|in:PERMANENT,VACATAIRE,OCCASIONNEL,STAGAIRE,TAHFIZ,PCS',
            'date_fin' => 'nullable|date',
            'salaire_base' => 'sometimes|numeric',
            'taux_horaire' => 'sometimes|integer',
            'classification' => 'sometimes|in:NR,SO,DE,IT,IL,AT,CS,MS,MP',
            'est_avocat' => 'boolean',
            'est_domestique' => 'boolean',
            'est_saisonnier' => 'boolean',
            'nb_jours_saisonnier' => 'nullable|integer',
            'nouveau_declarant' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $contrat->update($validator->validated());

        return response()->json($contrat);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $contrat = Contrat::where('employe_id', $request->employe_id);
        $contrat->delete();
        return response()->json("Contrat deleted successfully", 201);
    }
}
