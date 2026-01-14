<?php

namespace App\Http\Controllers\Api;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class TransactionController extends Controller
{
    /**
     * Get all transactions with filters
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 10);
            $status = $request->input('status', 'all');
            $search = $request->input('search', '');

            $transactions = Transaction::query()
                ->status($status)
                ->search($search)
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            // Calculate statistics
            $stats = [
                'total_revenue' => Transaction::where('status', 'paid')->sum('amount'),
                'pending_amount' => Transaction::where('status', 'pending')->sum('amount'),
                'pending_count' => Transaction::where('status', 'pending')->count(),
                'paid_this_month' => Transaction::where('status', 'paid')
                    ->whereMonth('paid_at', now()->month)
                    ->whereYear('paid_at', now()->year)
                    ->sum('amount'),
                'overdue_amount' => Transaction::where('status', 'overdue')->sum('amount'),
                'overdue_count' => Transaction::where('status', 'overdue')->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $transactions,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching transactions: ' . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch transactions',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Get statistics only
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = [
                'total_revenue' => Transaction::where('status', 'paid')->sum('amount'),
                'pending_amount' => Transaction::where('status', 'pending')->sum('amount'),
                'pending_count' => Transaction::where('status', 'pending')->count(),
                'paid_this_month' => Transaction::where('status', 'paid')
                    ->whereMonth('paid_at', now()->month)
                    ->whereYear('paid_at', now()->year)
                    ->sum('amount'),
                'overdue_amount' => Transaction::where('status', 'overdue')->sum('amount'),
                'overdue_count' => Transaction::where('status', 'overdue')->count(),
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching transaction stats: ' . $e->getMessage(), [
                'exception' => $e
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Create new transaction (for main website purchases)
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'client_name' => 'required|string|max:255',
                'client_email' => 'required|email|max:255',
                'client_phone' => 'nullable|string|max:20',
                'product_name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'amount' => 'required|numeric|min:0',
                'payment_method' => 'nullable|in:bank_transfer,credit_card,e_wallet,cash',
                'due_date' => 'nullable|date',
                'metadata' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                \Log::warning('Transaction validation failed', [
                    'errors' => $validator->errors(),
                    'request' => $request->all()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = $validator->validated();
            $data['invoice_number'] = Transaction::generateInvoiceNumber();
            $data['status'] = 'pending';

            $transaction = Transaction::create($data);

            \Log::info('Transaction created successfully', [
                'transaction_id' => $transaction->id,
                'invoice_number' => $transaction->invoice_number
            ]);

            // Broadcast realtime event
            try {
                broadcast(new \App\Events\TransactionCreated($transaction))->toOthers();
            } catch (\Exception $e) {
                \Log::warning('Failed to broadcast transaction created event', [
                    'transaction_id' => $transaction->id,
                    'error' => $e->getMessage()
                ]);
                // Don't fail the whole request if broadcasting fails
            }

            return response()->json([
                'success' => true,
                'message' => 'Transaction created successfully',
                'data' => $transaction,
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating transaction: ' . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create transaction',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Get single transaction
     */
    public function show($id): JsonResponse
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $transaction,
        ]);
    }

    /**
     * Update transaction
     */
    public function update(Request $request, $id): JsonResponse
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'client_name' => 'sometimes|string|max:255',
            'client_email' => 'sometimes|email|max:255',
            'client_phone' => 'nullable|string|max:20',
            'product_name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:pending,paid,overdue,cancelled',
            'payment_method' => 'nullable|in:bank_transfer,credit_card,e_wallet,cash',
            'payment_reference' => 'nullable|string|max:255',
            'due_date' => 'nullable|date',
            'metadata' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $transaction->update($validator->validated());

        // Broadcast realtime event
        broadcast(new \App\Events\TransactionUpdated($transaction))->toOthers();

        return response()->json([
            'success' => true,
            'message' => 'Transaction updated successfully',
            'data' => $transaction,
        ]);
    }

    /**
     * Mark transaction as paid
     */
    public function markAsPaid(Request $request, $id): JsonResponse
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|in:bank_transfer,credit_card,e_wallet,cash',
            'payment_reference' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $transaction->markAsPaid(
            $request->input('payment_method'),
            $request->input('payment_reference')
        );

        // Broadcast realtime event
        broadcast(new \App\Events\TransactionUpdated($transaction))->toOthers();

        return response()->json([
            'success' => true,
            'message' => 'Transaction marked as paid',
            'data' => $transaction,
        ]);
    }

    /**
     * Delete transaction
     */
    public function destroy($id): JsonResponse
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
            ], 404);
        }

        $transaction->delete();

        // Broadcast realtime event
        broadcast(new \App\Events\TransactionDeleted($id))->toOthers();

        return response()->json([
            'success' => true,
            'message' => 'Transaction deleted successfully',
        ]);
    }

    /**
     * Check for overdue transactions and update status
     */
    public function checkOverdue(): JsonResponse
    {
        $updated = Transaction::where('status', 'pending')
            ->where('due_date', '<', now())
            ->update(['status' => 'overdue']);

        return response()->json([
            'success' => true,
            'message' => "Updated {$updated} overdue transactions",
            'updated_count' => $updated,
        ]);
    }
}
