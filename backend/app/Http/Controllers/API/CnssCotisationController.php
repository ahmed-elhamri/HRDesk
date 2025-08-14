<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CnssCotisation;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Validation\Rule;

class CnssCotisationController extends Controller implements HasMiddleware
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
        return response()->json(CnssCotisation::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'cotisation'     => ['required', 'string', 'max:255', 'unique:cnss_cotisations,cotisation'],
            'part_salariale' => ['nullable', 'numeric', 'between:0,100'],
            'part_patronale' => ['nullable', 'numeric', 'between:0,100'],
            'plafond'        => ['nullable', 'string', 'max:255'],
        ]);

        $row = CnssCotisation::create($data);

        return response()->json($row, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $cnssCotisation = CnssCotisation::findOrFail($id);
        return response()->json($cnssCotisation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->validate([
            'cotisation'     => [
                'sometimes', 'required', 'string', 'max:255',
                Rule::unique('cnss_cotisations', 'cotisation')->ignore($id),
            ],
            'part_salariale' => ['nullable', 'numeric', 'between:0,100'],
            'part_patronale' => ['nullable', 'numeric', 'between:0,100'],
            'plafond'        => ['nullable', 'string', 'max:255'],
        ]);
        $cnssCotisation = CnssCotisation::findOrFail($id);

        $cnssCotisation->update($data);

        return response()->json($cnssCotisation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $cnssCotisation = CnssCotisation::findOrFail($id);
        $cnssCotisation->delete();
        return response()->json(null, 204);
    }
}
