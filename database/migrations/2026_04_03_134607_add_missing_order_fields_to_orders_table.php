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

            if (!Schema::hasColumn('orders', 'delivery_address')) {
                $table->string('delivery_address')->nullable()->after('vehicle_number');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $columns = [];

            if (Schema::hasColumn('orders', 'order_date')) {
                $columns[] = 'order_date';
            }

            if (Schema::hasColumn('orders', 'delivery_address')) {
                $columns[] = 'delivery_address';
            }

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};