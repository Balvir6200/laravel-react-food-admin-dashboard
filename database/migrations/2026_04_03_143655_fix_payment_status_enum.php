<?php
public function up(): void
{
    \DB::statement("DROP TABLE IF EXISTS orders_temp");

    \DB::statement("
        CREATE TABLE orders_temp AS SELECT * FROM orders
    ");

    \Schema::drop('orders');

    \Schema::create('orders', function ($table) {
        $table->id();
        $table->foreignId('customer_id')->constrained()->onDelete('cascade');
        $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
        $table->string('order_number')->unique();
        $table->date('order_date')->nullable();
        $table->decimal('total_amount', 10, 2);
        $table->string('payment_method');
        $table->string('payment_status'); // 🔥 no restriction now
        $table->string('order_status');
        $table->string('vehicle_number')->nullable();
        $table->string('delivery_address')->nullable();
        $table->text('notes')->nullable();
        $table->timestamps();
    });

    \DB::statement("
        INSERT INTO orders SELECT * FROM orders_temp
    ");

    \Schema::dropIfExists('orders_temp');
}