<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\HeureSupplementaire;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Validation\Rule;

class HeureSupplementaireController extends Controller implements HasMiddleware
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
        return response()->json(
            HeureSupplementaire::with('employe')->orderByDesc('id')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'employe_id'  => ['required', 'exists:employes,id'],
            'date'       =>  ['required', 'date'],
            'jour'        => ['required', Rule::in(['OUVRABLE','FERIES'])],
            'heure_debut' => ['required', 'date_format:H:i'],
            'heure_fin'   => ['required', 'date_format:H:i'],
        ]);

        $row = HeureSupplementaire::create($data);
        return response()->json($row->load('employe'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $heureSupplementaire = HeureSupplementaire::with('employe')->findOrFail($id);
        return response()->json($heureSupplementaire);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->validate([
            'employe_id'  => ['sometimes', 'exists:employes,id'],
            'date'       => ['sometimes', 'date'],
            'jour'        => ['sometimes', Rule::in(['OUVRABLE','FERIES'])],
            'heure_debut' => ['sometimes', 'date_format:H:i'],
            'heure_fin'   => ['sometimes', 'date_format:H:i'],
        ]);
        $heureSupplementaire = HeureSupplementaire::findOrFail($id);

        $heureSupplementaire->update($data);
        return response()->json($heureSupplementaire->load('employe'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $heureSupplementaire = HeureSupplementaire::findOrFail($id);
        $heureSupplementaire->delete();
        return response()->json(null, 204);
    }
}
