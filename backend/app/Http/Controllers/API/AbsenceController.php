<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class AbsenceController extends Controller implements HasMiddleware
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
        return response()->json(Absence::whereBetween('date', [$start, $end])->with('employe')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'employe_id' => 'required|exists:employes,id',
            'date'       => 'required|date',
        ]);

        $absence = Absence::create($data);
        return response()->json($absence, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        [$year, $month] = explode('-', $request->mois);
        $start = Carbon::create((int)$year, (int)$month, 1)->startOfMonth()->toDateString(); // 2025-08-01
        $end   = Carbon::create((int)$year, (int)$month, 1)->endOfMonth()->toDateString();   // 2025-08-31
        $absence = Absence::with('employe')->whereBetween('date', [$start, $end])->where('employe_id', $id)->get();
        return response()->json($absence);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->validate([
            'employe_id' => 'sometimes|exists:employes,id',
            'date'       => 'sometimes|date',
        ]);
        $absence = Absence::findOrFail($id);
        $absence->update($data);
        return response()->json($absence);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $absence = Absence::findOrFail($id);
        $absence->delete();
        return response()->json(null, 204);
    }
}
