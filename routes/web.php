<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LetterGeneratorController;
use App\Http\Controllers\LetterTemplateController;
use Illuminate\Support\Facades\Route;

// Dashboard & Home
Route::get('/', [LetterTemplateController::class, 'index'])->name('dashboard');
Route::get('/home', fn () => redirect()->route('dashboard'))->name('home');

// Letter Templates CRUD
Route::resource('templates', LetterTemplateController::class);

// Employees Sync & Selection API
Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
Route::post('/employees/sync', [EmployeeController::class, 'sync'])->name('employees.sync');

// Letter Generator Studio & PDF Export
Route::get('/generate', [LetterGeneratorController::class, 'index'])->name('letters.generate');
Route::post('/letters/preview', [LetterGeneratorController::class, 'preview'])->name('letters.preview');
Route::post('/letters/store', [LetterGeneratorController::class, 'store'])->name('letters.store');
Route::post('/letters/export-direct', [LetterGeneratorController::class, 'exportDirect'])->name('letters.export_direct');
Route::get('/letters/history', [LetterGeneratorController::class, 'history'])->name('letters.history');
Route::get('/letters/{letter}/download', [LetterGeneratorController::class, 'download'])->name('letters.download');
