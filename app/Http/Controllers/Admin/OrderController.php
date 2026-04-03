<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        return view('admin.orders.index');
    }

    public function list()
    {
        $orders = Order::with(['customer', 'restaurant'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_id' => $order->customer_id,
                    'restaurant_id' => $order->restaurant_id,
                    'order_number' => $order->order_number ?? '',
                    'order_date' => $order->order_date ?? '',
                    'total_amount' => $order->total_amount ?? 0,
                    'payment_method' => $order->payment_method ?? '',
                    'payment_status' => $order->payment_status ?? '',
                    'order_status' => $order->order_status ?? '',
                    'vehicle_number' => $order->vehicle_number ?? '',
                    'delivery_address' => $order->delivery_address ?? '',
                    'notes' => $order->notes ?? '',
                    'customer_name' => optional($order->customer)->name ?? '',
                    'restaurant_name' => optional($order->restaurant)->name ?? '',
                    'created_at' => $order->created_at
                        ? $order->created_at->format('d M Y, h:i A')
                        : '',
                ];
            });

        return response()->json($orders);
    }

    public function formData()
    {
        return response()->json([
            'customers' => Customer::select('id', 'name')->orderBy('name')->get(),
            'restaurants' => Restaurant::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'customer_id' => 'required|exists:customers,id',
                'restaurant_id' => 'required|exists:restaurants,id',
                'order_number' => 'required|string|max:255|unique:orders,order_number',
                'order_date' => 'nullable|date',
                'total_amount' => 'required|numeric|min:0',
                'payment_method' => 'required|string|max:255',
                'payment_status' => 'required|string|max:255',
                'order_status' => 'required|string|max:255',
                'vehicle_number' => 'nullable|string|max:50',
                'delivery_address' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
            ]);

            $payload = $this->filterOrderPayloadByExistingColumns($validated);

            DB::beginTransaction();

            $order = Order::create($payload);

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully.',
                'order' => $order,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            DB::rollBack();

            $schemaRow = DB::select("SELECT sql FROM sqlite_master WHERE type='table' AND name='orders'");

            return response()->json([
                'message' => 'Failed to create order.',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'payload' => isset($payload) ? $payload : null,
                'columns' => Schema::getColumnListing('orders'),
                'orders_table_sql' => $schemaRow[0]->sql ?? null,
            ], 500);
        }
    }

    public function update(Request $request, Order $order)
    {
        try {
            $validated = $request->validate([
                'customer_id' => 'required|exists:customers,id',
                'restaurant_id' => 'required|exists:restaurants,id',
                'order_number' => 'required|string|max:255|unique:orders,order_number,' . $order->id,
                'order_date' => 'nullable|date',
                'total_amount' => 'required|numeric|min:0',
                'payment_method' => 'required|string|max:255',
                'payment_status' => 'required|string|max:255',
                'order_status' => 'required|string|max:255',
                'vehicle_number' => 'nullable|string|max:50',
                'delivery_address' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
            ]);

            $payload = $this->filterOrderPayloadByExistingColumns($validated);

            $order->update($payload);

            return response()->json([
                'message' => 'Order updated successfully.',
                'order' => $order,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to update order.',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
            ], 500);
        }
    }

    public function markDelivered(Order $order)
    {
        $order->update([
            'order_status' => 'Completed',
        ]);

        return response()->json([
            'message' => 'Order marked as delivered successfully.',
        ]);
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully.',
        ]);
    }

    private function filterOrderPayloadByExistingColumns(array $validated): array
    {
        $columns = Schema::getColumnListing('orders');

        return collect($validated)->only($columns)->toArray();
    }
}