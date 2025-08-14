<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\IrTranche;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Validation\Rule;

class IrTrancheController extends Controller implements HasMiddleware
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
        return response()->json(IrTranche::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'period'    => ['required', Rule::in(['MENSUEL', 'ANNUEL'])],
            'rni_min'   => ['required', 'numeric', 'min:0'],
            'rni_max'   => ['nullable', 'numeric', 'gte:rni_min'],
            'taux'      => ['required', 'numeric', 'between:0,100'],
            'deduction' => ['required', 'numeric', 'min:0'],
        ]);

        $bracket = IrTranche::create($data);

        return response()->json($bracket, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $irTranche = IrTranche::findOrFail($id);
        return response()->json($irTranche);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->validate([
            'period'    => ['sometimes', Rule::in(['MENSUEL', 'ANNUEL'])],
            'rni_min'   => ['sometimes', 'numeric', 'min:0'],
            'rni_max'   => ['nullable', 'numeric', 'gte:rni_min'],
            'taux'      => ['sometimes', 'numeric', 'between:0,100'],
            'deduction' => ['sometimes', 'numeric', 'min:0'],
        ]);
        $irTranche = IrTranche::findOrFail($id);

        $irTranche->update($data);

        return response()->json($irTranche);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $irTranche = IrTranche::findOrFail($id);

        $irTranche->delete();

        return response()->json(null, 204);
    }
}
