<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Models\Customer;
use App\Models\Order;

class DashboardController extends Controller
{
    public function index()
    {
        $totalOrders = Order::count();
        $totalRestaurants = Restaurant::count();
        $totalCustomers = Customer::count();

        $recentOrders = Order::with(['customer', 'restaurant'])
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer?->name,
                    'restaurant_name' => $order->restaurant?->name,
                    'status' => $order->order_status,
                ];
            });

        return view('admin.dashboard', compact(
            'totalOrders',
            'totalRestaurants',
            'totalCustomers',
            'recentOrders'
        ));
    }
}