<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'customer_id',
        'restaurant_id',
        'order_number',
        'order_date',
        'total_amount',
        'payment_method',
        'payment_status',
        'order_status',
        'vehicle_number',
        'delivery_address',
        'notes',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}