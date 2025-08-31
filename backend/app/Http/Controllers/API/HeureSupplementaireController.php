<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\HeureSupplementaire;
use Carbon\Carbon;
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
    public function index(Request $request)
    {
        [$year, $month] = explode('-', $request->periode);
        $start = Carbon::create((int)$year, (int)$month, 1)->startOfMonth()->toDateString(); // 2025-08-01
        $end   = Carbon::create((int)$year, (int)$month, 1)->endOfMonth()->toDateString();   // 2025-08-31
        return response()->json(
            HeureSupplementaire::whereBetween('date', [$start, $end])->with('employe')->orderByDesc('id')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'employe_id' => ['required', 'exists:employes,id'],
            'date' => ['required', 'date'],
            'jour' => ['required', Rule::in(['OUVRABLE','FERIES'])],
            'periode' => ['required', Rule::in(['JOUR','NUIT'])],
            'nombre' => ['required', 'numeric'],
        ]);

        $row = HeureSupplementaire::create($data);
        return response()->json($row->load('employe'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        [$year, $month] = explode('-', $request->mois);
        $start = Carbon::create((int)$year, (int)$month, 1)->startOfMonth()->toDateString(); // 2025-08-01
        $end   = Carbon::create((int)$year, (int)$month, 1)->endOfMonth()->toDateString();   // 2025-08-31
        $heureSupplementaire = HeureSupplementaire::with('employe')->whereBetween('date', [$start, $end])->where('employe_id', $id)->get();
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
            'periode' => ['sometimes', Rule::in(['JOUR','NUIT'])],
            'nombre'   => ['sometimes', 'numeric'],
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
