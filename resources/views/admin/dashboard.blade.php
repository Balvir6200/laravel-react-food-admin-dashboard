@extends('layouts.admin')

@section('content')
<div
    id="dashboard-root"
    data-props="{{ json_encode([
        'totalOrders' => $totalOrders ?? 0,
        'totalRestaurants' => $totalRestaurants ?? 0,
        'totalCustomers' => $totalCustomers ?? 0,
        'recentOrders' => $recentOrders ?? [],
    ]) }}"
></div>
@endsection

