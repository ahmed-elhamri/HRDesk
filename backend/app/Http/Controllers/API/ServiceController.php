<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json($services = Service::with('departement')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'departement_id' => 'required|exists:departements,id',
            'reference' => 'required|string',
            'designation' => 'required|string',
        ]);

        $service = Service::create($request->all());

        return response()->json($service, 201);
    }

    public function show($id)
    {
        $service = Service::findOrFail($id);
        return response()->json($service);
    }

    public function getByReference($reference)
    {
        $service = Service::with('departement')
            ->where('reference', $reference)
            ->first();

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        return response()->json($service);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'departement_id' => 'required|exists:departements,id',
            'reference' => 'required|string|unique:services,reference,' . $id,
            'designation' => 'required|string|max:255',
        ]);
        $service = Service::findOrFail($id);
        $service->update($request->all());

        return response()->json($service);
    }

    public function destroy($id)
    {
        Service::destroy($id);
        return response()->json(['message' => 'Service deleted successfully']);
    }
}
