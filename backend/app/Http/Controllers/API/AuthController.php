<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|string|email|max:255|unique:users',
            'role'     => 'required|in:EMPLOYE,ADMIN',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        User::create([
            'email'    => $request->email,
            'password' => Hash::make("123456"),
            'role'     => $request->role,
        ]);

        return response()->json(['success' => "User registered succefully"], 201);
    }

    public function resetPassword($id){
        $user = User::findOrFail($id);
        $user->password = Hash::make('123456');
        $user->password_changed = false;
        $user->save();
        return response()->json(['message' => 'Password reset']);
    }

    public function changePassword(Request $request, $id)
    {
        $request->validate([
            'new_password' => 'required|min:6|confirmed', // expects new_password + new_password_confirmation
        ]);

        $user = User::findOrFail($id);

        $user->password = Hash::make($request->new_password);
        $user->password_changed = true;
        $user->save();

        return response()->json(['message' => 'Mot de passe modifié avec succès']);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }


        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
