<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\EmployePrime;
use App\Models\Prime;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Validator;

class EmployePrimeController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth:sanctum',
        ];
    }

    public function index(Request $request)
    {
        return EmployePrime::where('employe_id', $request->employe_id)->with(['employe', 'prime'])->get();
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'employe_id' => 'required|exists:employes,id',
            'prime_id' => 'required|exists:primes,id',
            'montant' => 'required|numeric',
            'date_attribution' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $plafond = Prime::findOrFail($request->get('prime_id'))->plafond;

//        if ($request->montant > $plafond) {
//            return response()->json([
//                'message' => 'Montant dépasse le plafond autorisé pour ce prime.',
//                'plafond' => $plafond,
//            ], 422);
//        }

        $employePrime = EmployePrime::create($request->all());
        return response()->json($employePrime, 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'employe_id' => 'required|exists:employes,id',
            'prime_id' => 'required|exists:primes,id',
            'montant' => 'required|numeric',
            'date_attribution' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $plafond = Prime::findOrFail($request->get('prime_id'))->plafond;

//        if ($request->montant > $plafond) {
//            return response()->json([
//                'message' => 'Montant dépasse le plafond autorisé pour ce prime.',
//                'plafond' => $plafond,
//            ], 422);
//        }

        $employePrime = EmployePrime::findOrFail($id);
        $employePrime->update($request->all());
        return response()->json($employePrime, 201);
    }

    public function destroy($id)
    {
        EmployePrime::destroy($id);
        return response()->json(['message' => 'Prime deleted successfully']);
    }

}
