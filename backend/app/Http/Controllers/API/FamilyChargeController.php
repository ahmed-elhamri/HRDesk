<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FamilyCharge;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class FamilyChargeController extends Controller implements HasMiddleware
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
        return response()->json(FamilyCharge::all());

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nbr_enfants' => 'required|integer|min:0',
            'mensuel'     => 'required|numeric|min:0',
            'annuel'      => 'required|numeric|min:0',
        ]);

        $charge = FamilyCharge::create($data);
        return response()->json($charge, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $familyCharge = FamilyCharge::findOrFail($id);
        return response()->json($familyCharge);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->validate([
            'nbr_enfants' => 'sometimes|integer|min:0',
            'mensuel'     => 'sometimes|numeric|min:0',
            'annuel'      => 'sometimes|numeric|min:0',
        ]);
        $familyCharge = FamilyCharge::findOrFail($id);
        $familyCharge->update($data);
        return response()->json($familyCharge);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $familyCharge = FamilyCharge::findOrFail($id);
        $familyCharge->delete();
        return response()->json(null, 204);
    }
}
