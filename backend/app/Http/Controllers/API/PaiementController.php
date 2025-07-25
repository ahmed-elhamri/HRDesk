<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Validator;

class PaiementController extends Controller implements HasMiddleware
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
            'employe_id' => 'required|exists:employes,id|unique:paiements,employe_id',
            'mode_paiement' => 'nullable|string',
            'banque' => 'nullable|string',
            'numero_compte' => 'nullable|string',
            'adresse_banque' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $paiement = Paiement::create($validator->validated());

        return response()->json($paiement, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $paiement = Paiement::where('employe_id', $request->employe_id)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'mode_paiement' => 'sometimes|string|nullable',
            'banque' => 'sometimes|string|nullable',
            'numero_compte' => 'sometimes|string|nullable',
            'adresse_banque' => 'sometimes|string|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $paiement->update($validator->validated());

        return response()->json($paiement);
    }

}
