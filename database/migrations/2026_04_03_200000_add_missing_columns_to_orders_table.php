<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'order_date')) {
                $table->date('order_date')->nullable()->after('order_number');
            }

            if (!Schema::hasColumn('orders', 'vehicle_number')) {
                $table->string('vehicle_number')->nullable()->after('order_status');
            }

            if (!Schema::hasColumn('orders', 'delivery_address')) {
                $table->string('delivery_address')->nullable()->after('vehicle_number');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $columnsToDrop = [];

            if (Schema::hasColumn('orders', 'delivery_address')) {
                $columnsToDrop[] = 'delivery_address';
            }

            if (Schema::hasColumn('orders', 'vehicle_number')) {
                $columnsToDrop[] = 'vehicle_number';
            }

            if (Schema::hasColumn('orders', 'order_date')) {
                $columnsToDrop[] = 'order_date';
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};