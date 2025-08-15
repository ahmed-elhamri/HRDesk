<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TauxHeuresSupplementaires;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Validation\Rule;

class TauxHeuresSupplementairesController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            'auth:sanctum',
//            new Middleware('role:SUPERVISOR,ADMIN'),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(TauxHeuresSupplementaires::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'periode'           => ['required', Rule::in(['JOUR','NUIT'])],
            'heure_debut'       => ['required', 'date_format:H:i'],
            'heure_fin'         => ['required', 'date_format:H:i'],
            'taux_jours_ouvres' => ['required', 'numeric', 'between:0,100'],
            'taux_jours_feries' => ['required', 'numeric', 'between:0,100'],
        ]);

        $taux = TauxHeuresSupplementaires::create($data);
        return response()->json($taux, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $taux = TauxHeuresSupplementaires::findOrFail($id);
        return response()->json($taux);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->validate([
            'periode'           => ['sometimes', Rule::in(['JOUR','NUIT'])],
            'heure_debut'       => ['sometimes', 'date_format:H:i:s'],
            'heure_fin'         => ['sometimes', 'date_format:H:i:s'],
            'taux_jours_ouvres' => ['sometimes', 'numeric', 'between:0,100'],
            'taux_jours_feries' => ['sometimes', 'numeric', 'between:0,100'],
        ]);
        $taux = TauxHeuresSupplementaires::findOrFail($id);

        $taux->update($data);
        return response()->json($taux);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $taux = TauxHeuresSupplementaires::findOrFail($id);
        $taux->delete();
        return response()->json(null, 204);
    }
}
