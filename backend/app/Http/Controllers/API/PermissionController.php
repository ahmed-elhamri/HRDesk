<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employe;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PermissionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth:sanctum',
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $employe = Employe::where('id', $request->employe_id)->firstOrFail();
        $permissions = Permission::where('user_id', $employe->user->id)->get();
        return response()->json($permissions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $permission)
    {
        $employe = Employe::where('id', $permission)->firstOrFail();
        $permission = Permission::where('user_id', $employe->user->id)->where('entity', $request->entity)->get();
        return response()->json($permission);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $permission)
    {
        $permission = Permission::where('user_id', $permission)->where('entity', $request->entity)->firstOrFail();
        $permission->update($request->all());
        return response()->json($permission);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        //
    }
}
