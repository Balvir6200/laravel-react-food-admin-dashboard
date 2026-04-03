import React from "react";
import AdminLayout from "../Components/AdminLayout";

const formatDate = () => {
    return new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getStatusClasses = (status) => {
    const value = String(status || "").toLowerCase();

    if (value.includes("delivered") || value.includes("completed") || value.includes("done")) {
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    }

    if (value.includes("pending")) {
        return "bg-amber-100 text-amber-700 border border-amber-200";
    }

    if (value.includes("cancel") || value.includes("failed")) {
        return "bg-rose-100 text-rose-700 border border-rose-200";
    }

    if (value.includes("progress")) {
        return "bg-sky-100 text-sky-700 border border-sky-200";
    }

    return "bg-slate-100 text-slate-700 border border-slate-200";
};

const StatCard = ({ title, value, subtitle, icon, iconBg, accent }) => {
    return (
        <div
            className={`group relative overflow-hidden rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)] ${accent}`}
        >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-white to-slate-100 opacity-70" />
            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />

            <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-slate-400">
                        {title}
                    </p>

                    <h3 className="mt-4 text-4xl font-black leading-none text-slate-900 sm:text-[2.7rem]">
                        {value}
                    </h3>

                    <p className="mt-3 text-sm font-medium text-slate-500">
                        {subtitle}
                    </p>
                </div>

                <div
                    className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-[0_12px_25px_rgba(15,23,42,0.14)] transition-transform duration-300 group-hover:scale-110 ${iconBg}`}
                >
                    <span className="relative z-10">{icon}</span>
                    <div className="absolute inset-0 rounded-2xl bg-white/10" />
                </div>
            </div>
        </div>
    );
};

export default function Dashboard({
    totalOrders = 0,
    totalRestaurants = 0,
    totalCustomers = 0,
    recentOrders = [],
}) {
    return (
        <AdminLayout title="Dashboard">
            <div className="relative space-y-8 overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-orange-200/25 blur-3xl" />
                    <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-violet-200/20 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-100/30 blur-3xl" />
                </div>

                <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-gradient-to-br from-[#fffaf3] via-[#fffdf8] to-[#f8f4ec] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/80 sm:p-8">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-200/30 blur-2xl" />
                    <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-amber-100/50 blur-2xl" />
                    <div className="absolute right-20 top-1/2 h-20 w-20 rounded-full bg-rose-100/30 blur-xl" />

                    <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                                <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.65)]" />
                                <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-orange-600">
                                    Food Management
                                </p>
                            </div>

                            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl xl:text-5xl">
                                Dashboard
                            </h1>

                            <h2 className="mt-3 text-xl font-bold text-slate-800 sm:text-2xl">
                                Food Ordering Overview
                            </h2>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-[15px]">
                                Monitor orders, restaurants, and customers in one place.
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                                        Total Orders
                                    </p>
                                    <p className="mt-1 text-lg font-black text-slate-900">
                                        {totalOrders}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                                        Restaurants
                                    </p>
                                    <p className="mt-1 text-lg font-black text-slate-900">
                                        {totalRestaurants}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                                        Customers
                                    </p>
                                    <p className="mt-1 text-lg font-black text-slate-900">
                                        {totalCustomers}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:w-[380px] xl:grid-cols-1">
                            <div className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_16px_35px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-slate-400">
                                            Today
                                        </p>
                                        <p className="mt-3 text-2xl font-black text-slate-900">
                                            {formatDate()}
                                        </p>
                                    </div>
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-2xl text-white shadow-[0_14px_30px_rgba(249,115,22,0.35)]">
                                        📅
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_16px_35px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-pink-500 to-violet-500 text-2xl font-black text-white shadow-[0_16px_35px_rgba(236,72,153,0.28)]">
                                        A
                                    </div>

                                    <div>
                                        <p className="text-xl font-black text-slate-900">
                                            Welcome, Admin
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Control your food system
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <StatCard
                        title="Total Orders"
                        value={totalOrders}
                        subtitle="All food orders"
                        icon="🛒"
                        iconBg="bg-gradient-to-br from-orange-500 to-amber-500 text-white"
                        accent="before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 before:bg-gradient-to-b before:from-orange-400 before:to-amber-400"
                    />

                    <StatCard
                        title="Restaurants"
                        value={totalRestaurants}
                        subtitle="Registered restaurants"
                        icon="🍽"
                        iconBg="bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                        accent="before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 before:bg-gradient-to-b before:from-emerald-400 before:to-teal-400"
                    />

                    <StatCard
                        title="Customers"
                        value={totalCustomers}
                        subtitle="Active customers"
                        icon="👥"
                        iconBg="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"
                        accent="before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 before:bg-gradient-to-b before:from-violet-400 before:to-fuchsia-400"
                    />
                </div>

                <div className="overflow-hidden rounded-[34px] border border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/80 backdrop-blur-sm">
                    <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-orange-50/40 px-6 py-6 sm:px-7">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-500">
                                        Live Summary
                                    </span>
                                </div>

                                <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
                                    Recent Orders
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Latest food orders placed in your system
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
                                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                                    Total Listed
                                </p>
                                <p className="mt-1 text-2xl font-black text-slate-900">
                                    {recentOrders.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {recentOrders.length > 0 ? (
                        <>
                            <div className="block lg:hidden space-y-4 p-4 sm:p-6">
                                {recentOrders.map((order, index) => (
                                    <div
                                        key={index}
                                        className="group rounded-[24px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
                                                    Order No.
                                                </p>
                                                <h4 className="mt-2 text-lg font-black text-slate-900">
                                                    {order.order_number || order.id}
                                                </h4>
                                            </div>

                                            <span
                                                className={`inline-flex rounded-full px-3.5 py-1.5 text-xs font-extrabold tracking-wide shadow-sm ${getStatusClasses(order.status)}`}
                                            >
                                                {order.status || "Pending"}
                                            </span>
                                        </div>

                                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                    Customer
                                                </p>
                                                <p className="mt-2 text-sm font-semibold text-slate-800">
                                                    {order.customer_name || "-"}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                    Restaurant
                                                </p>
                                                <p className="mt-2 text-sm font-semibold text-slate-800">
                                                    {order.restaurant_name || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="hidden lg:block overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50/90">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                                                Order No.
                                            </th>
                                            <th className="px-6 py-4 text-left text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                                                Customer
                                            </th>
                                            <th className="px-6 py-4 text-left text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                                                Restaurant
                                            </th>
                                            <th className="px-6 py-4 text-left text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {recentOrders.map((order, index) => (
                                            <tr
                                                key={index}
                                                className="group transition duration-200 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-transparent"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="inline-flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-700 transition group-hover:bg-orange-100 group-hover:text-orange-700">
                                                            #
                                                        </div>
                                                        <span className="font-black text-slate-900">
                                                            {order.order_number || order.id}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-slate-800">
                                                            {order.customer_name || "-"}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Customer Name
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-slate-800">
                                                            {order.restaurant_name || "-"}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Restaurant Name
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-3.5 py-1.5 text-xs font-extrabold tracking-wide shadow-sm ${getStatusClasses(order.status)}`}
                                                    >
                                                        {order.status || "Pending"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="py-20 text-center">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl">
                                🍽
                            </div>
                            <h4 className="mt-5 text-xl font-black text-slate-900">
                                No recent orders found
                            </h4>
                            <p className="mt-2 text-sm text-slate-500">
                                Orders will appear here once they are added to your system.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}