import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Components/AdminLayout";

export default function Orders() {
    const generateOrderNumber = () => {
        return `ORD-${Date.now()}`;
    };

    const getTodayDate = () => {
        return new Date().toISOString().slice(0, 10);
    };

    const emptyForm = {
        customer_id: "",
        restaurant_id: "",
        order_number: generateOrderNumber(),
        order_date: getTodayDate(),
        total_amount: "",
        payment_method: "cash",
        payment_status: "unpaid",
        order_status: "pending",
        vehicle_number: "",
        delivery_address: "",
        notes: "",
    };

    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingOrder, setEditingOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [toast, setToast] = useState(null);

    const [expandedCardId, setExpandedCardId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [openSections, setOpenSections] = useState({
        orderInfo: true,
        paymentStatus: true,
        deliveryDetails: true,
    });

    const pageSize = 9;

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await fetch("/admin/orders/list", {
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Orders fetch error:", error);
            showToast("Failed to load orders.", "error");
            setOrders([]);
        } finally {
            setLoading(false);
            setPageLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch("/admin/customers/list", {
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch customers");
            }

            const data = await response.json();
            setCustomers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Customers fetch error:", error);
            setCustomers([]);
        }
    };

    const fetchRestaurants = async () => {
        try {
            const response = await fetch("/admin/restaurants/list", {
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch restaurants");
            }

            const data = await response.json();
            setRestaurants(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Restaurants fetch error:", error);
            setRestaurants([]);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchCustomers();
        fetchRestaurants();

        setForm((prev) => ({
            ...prev,
            order_number: generateOrderNumber(),
            order_date: getTodayDate(),
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm({
            ...emptyForm,
            order_number: generateOrderNumber(),
            order_date: getTodayDate(),
        });
        setEditingOrder(null);
        setExpandedCardId(null);
        setOpenSections({
            orderInfo: true,
            paymentStatus: true,
            deliveryDetails: true,
        });
    };

    const validateForm = () => {
        if (!form.customer_id) {
            showToast("Please select a customer.", "error");
            return false;
        }

        if (!form.restaurant_id) {
            showToast("Please select a restaurant.", "error");
            return false;
        }

        if (!form.order_number.trim()) {
            showToast("Please enter order number.", "error");
            return false;
        }

        if (!form.order_date) {
            showToast("Please select order date.", "error");
            return false;
        }

        if (!form.total_amount || Number(form.total_amount) < 0) {
            showToast("Please enter a valid total amount.", "error");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            const url = editingOrder
                ? `/admin/orders/${editingOrder.id}`
                : "/admin/orders";

            const method = editingOrder ? "PUT" : "POST";

            const payload = {
                customer_id: form.customer_id,
                restaurant_id: form.restaurant_id,
                order_number: form.order_number.trim(),
                order_date: form.order_date,
                total_amount: form.total_amount,
                payment_method: form.payment_method,
                payment_status: form.payment_status,
                order_status: form.order_status,
                vehicle_number: form.vehicle_number.trim(),
                delivery_address: form.delivery_address.trim(),
                notes: form.notes.trim(),
            };

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                if (data?.errors) {
                    const firstError = Object.values(data.errors)[0]?.[0];
                    throw new Error(firstError || "Validation failed");
                }

                throw new Error(data?.message || "Something went wrong");
            }

            showToast(
                editingOrder
                    ? "Order updated successfully."
                    : "Order created successfully."
            );

            resetForm();
            fetchOrders();
            setShowCreateForm(false);
        } catch (error) {
            console.error("Submit error:", error);
            showToast(error.message || "Failed to save order.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (order) => {
        setEditingOrder(order);
        setExpandedCardId(order.id);
        setShowCreateForm(true);

        setForm({
            customer_id: order.customer_id || "",
            restaurant_id: order.restaurant_id || "",
            order_number: order.order_number || generateOrderNumber(),
            order_date: order.order_date
                ? String(order.order_date).slice(0, 10)
                : getTodayDate(),
            total_amount: order.total_amount || "",
            payment_method: order.payment_method || "cash",
            payment_status: order.payment_status || "unpaid",
            order_status: order.order_status || "pending",
            vehicle_number: order.vehicle_number || "",
            delivery_address: order.delivery_address || "",
            notes: order.notes || "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this order?"
        );

        if (!confirmed) return;

        try {
            setLoading(true);

            const response = await fetch(`/admin/orders/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.message || "Failed to delete order");
            }

            showToast("Order deleted successfully.");
            fetchOrders();

            if (editingOrder?.id === id) {
                resetForm();
            }
        } catch (error) {
            console.error("Delete error:", error);
            showToast(error.message || "Delete failed.", "error");
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const keyword = search.toLowerCase();

            const matchesSearch =
                (order.order_number || "").toLowerCase().includes(keyword) ||
                (order.customer_name || "").toLowerCase().includes(keyword) ||
                (order.restaurant_name || "").toLowerCase().includes(keyword) ||
                (order.payment_status || "").toLowerCase().includes(keyword) ||
                (order.order_status || "").toLowerCase().includes(keyword) ||
                (order.vehicle_number || "").toLowerCase().includes(keyword);

            const matchesStatus =
                statusFilter === "all"
                    ? true
                    : (order.order_status || "").toLowerCase() ===
                      statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [orders, search, statusFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => (order.order_status || "").toLowerCase() === "pending"
    ).length;

    const completedOrders = orders.filter(
        (order) => (order.order_status || "").toLowerCase() === "delivered"
    ).length;

    const totalRevenue = orders.reduce(
        (sum, order) => sum + Number(order.total_amount || 0),
        0
    );

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const getStatusBadge = (status) => {
        const normalized = (status || "").toLowerCase();

        if (normalized === "delivered") {
            return "border border-emerald-200 bg-emerald-100 text-emerald-700";
        }

        if (
            normalized === "confirmed" ||
            normalized === "preparing" ||
            normalized === "out_for_delivery"
        ) {
            return "border border-blue-200 bg-blue-100 text-blue-700";
        }

        if (normalized === "cancelled") {
            return "border border-red-200 bg-red-100 text-red-700";
        }

        return "border border-amber-200 bg-amber-100 text-amber-700";
    };

    const getPaymentBadge = (status) => {
        const normalized = (status || "").toLowerCase();

        if (normalized === "paid") {
            return "border border-emerald-200 bg-emerald-100 text-emerald-700";
        }

        if (normalized === "partial") {
            return "border border-sky-200 bg-sky-100 text-sky-700";
        }

        return "border border-rose-200 bg-rose-100 text-rose-700";
    };

    const formatStatusLabel = (value) => {
        if (!value) return "-";
        return value.replaceAll("_", " ");
    };

    if (pageLoading) {
        return (
            <AdminLayout title="Orders">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-slate-600 shadow-sm">
                        Loading orders...
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Orders">
            <div className="space-y-6">
                {toast && (
                    <div
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm ${
                            toast.type === "error"
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                    >
                        {toast.message}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                        <div className="mb-3 h-1.5 w-16 rounded-full bg-emerald-500" />
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                            Total Orders
                        </p>
                        <h3 className="mt-2 text-3xl font-bold text-slate-900">
                            {totalOrders}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            All order records
                        </p>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                        <div className="mb-3 h-1.5 w-16 rounded-full bg-amber-500" />
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                            Pending Orders
                        </p>
                        <h3 className="mt-2 text-3xl font-bold text-amber-600">
                            {pendingOrders}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Waiting for completion
                        </p>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                        <div className="mb-3 h-1.5 w-16 rounded-full bg-blue-500" />
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                            Delivered Orders
                        </p>
                        <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                            {completedOrders}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Completed successfully
                        </p>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                        <div className="mb-3 h-1.5 w-16 rounded-full bg-orange-500" />
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                            Total Revenue
                        </p>
                        <h3 className="mt-2 text-3xl font-bold text-slate-900">
                            ₹{Number(totalRevenue).toLocaleString("en-IN")}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Based on all orders
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.06)]">
                    <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-r from-orange-50 via-rose-50 to-white p-6 lg:p-7">
                        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-orange-100/40 blur-3xl" />
                        <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-pink-100/40 blur-3xl" />

                        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <span className="inline-flex rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-600 shadow-sm">
                                    Food Management
                                </span>

                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                        {editingOrder ? "Edit Order" : "Create Order"}
                                    </h2>

                                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                                        {editingOrder ? "Editing Mode" : "New Order"}
                                    </span>
                                </div>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                    Create and manage delivery orders with a cleaner premium form layout.
                                    Keep the page focused and only open this form when needed.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm((prev) => !prev)}
                                    className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                                >
                                    {showCreateForm ? "Hide Form" : "Show Form"}
                                </button>

                                {editingOrder && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {showCreateForm && (
                        <div className="bg-gradient-to-b from-white to-slate-50/70 p-6 lg:p-7">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenSections((prev) => ({
                                                ...prev,
                                                orderInfo: !prev.orderInfo,
                                            }))
                                        }
                                        className="flex w-full items-center justify-between px-5 py-5 text-left transition hover:bg-slate-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-1.5 rounded-full bg-orange-500" />
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    Order Information
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    Basic order details and assignment data.
                                                </p>
                                            </div>
                                        </div>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                            {openSections.orderInfo ? "Hide" : "Show"}
                                        </span>
                                    </button>

                                    {openSections.orderInfo && (
                                        <div className="border-t border-slate-100 px-5 pb-5 pt-5">
                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                        Customer
                                                    </label>
                                                    <select
                                                        name="customer_id"
                                                        value={form.customer_id}
                                                        onChange={handleChange}
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                                    >
                                                        <option value="">Select customer</option>
                                                        {customers.map((customer) => (
                                                            <option key={customer.id} value={customer.id}>
                                                                {customer.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                        Restaurant
                                                    </label>
                                                    <select
                                                        name="restaurant_id"
                                                        value={form.restaurant_id}
                                                        onChange={handleChange}
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                                    >
                                                        <option value="">Select restaurant</option>
                                                        {restaurants.map((restaurant) => (
                                                            <option key={restaurant.id} value={restaurant.id}>
                                                                {restaurant.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                        Order Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="order_number"
                                                        value={form.order_number}
                                                        readOnly
                                                        className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none ring-4 ring-orange-100/60"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                        Order Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="order_date"
                                                        value={form.order_date}
                                                        onChange={handleChange}
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                        Total Amount
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="total_amount"
                                                        value={form.total_amount}
                                                        onChange={handleChange}
                                                        placeholder="Enter amount"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                        Vehicle Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="vehicle_number"
                                                        value={form.vehicle_number}
                                                        onChange={handleChange}
                                                        placeholder="Enter vehicle number"
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenSections((prev) => ({
                                                ...prev,
                                                paymentStatus: !prev.paymentStatus,
                                            }))
                                        }
                                        className="flex w-full items-center justify-between px-5 py-5 text-left transition hover:bg-slate-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-1.5 rounded-full bg-emerald-500" />
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    Payment & Status
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    Track payment mode and current order progress.
                                                </p>
                                            </div>
                                        </div>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                            {openSections.paymentStatus ? "Hide" : "Show"}
                                        </span>
                                    </button>

                                    {openSections.paymentStatus && (
                                        <div className="border-t border-slate-100 px-5 pb-5 pt-5">
                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                        Payment Method
                                                    </label>
                                                    <select
                                                        name="payment_method"
                                                        value={form.payment_method}
                                                        onChange={handleChange}
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                                    >
                                                        <option value="cash">Cash</option>
                                                        <option value="upi">UPI</option>
                                                        <option value="card">Card</option>
                                                        <option value="net_banking">Net Banking</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                        Payment Status
                                                    </label>
                                                    <select
                                                        name="payment_status"
                                                        value={form.payment_status}
                                                        onChange={handleChange}
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                                    >
                                                        <option value="unpaid">Unpaid</option>
                                                        <option value="paid">Paid</option>
                                                        <option value="partial">Partial</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                        Order Status
                                                    </label>
                                                    <select
                                                        name="order_status"
                                                        value={form.order_status}
                                                        onChange={handleChange}
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="preparing">Preparing</option>
                                                        <option value="out_for_delivery">Out for Delivery</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenSections((prev) => ({
                                                ...prev,
                                                deliveryDetails: !prev.deliveryDetails,
                                            }))
                                        }
                                        className="flex w-full items-center justify-between px-5 py-5 text-left transition hover:bg-slate-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-1.5 rounded-full bg-sky-500" />
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    Delivery Details
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    Add delivery location and extra notes.
                                                </p>
                                            </div>
                                        </div>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                            {openSections.deliveryDetails ? "Hide" : "Show"}
                                        </span>
                                    </button>

                                    {openSections.deliveryDetails && (
                                        <div className="border-t border-slate-100 px-5 pb-5 pt-5">
                                            <div className="grid grid-cols-1 gap-5">
                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                        Delivery Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="delivery_address"
                                                        value={form.delivery_address}
                                                        onChange={handleChange}
                                                        placeholder="Enter delivery address"
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                        Notes
                                                    </label>
                                                    <textarea
                                                        name="notes"
                                                        value={form.notes}
                                                        onChange={handleChange}
                                                        rows="4"
                                                        placeholder="Enter notes"
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:from-slate-800 hover:to-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading
                                            ? "Saving..."
                                            : editingOrder
                                            ? "Update Order"
                                            : "Create Order"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="rounded-2xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                                    >
                                        Reset
                                    </button>

                                    <div className="ml-auto hidden rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 lg:block">
                                        Auto date & order number enabled
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                                Orders Overview
                            </span>
                            <h2 className="mt-4 text-2xl font-bold text-slate-900">
                                Orders Cards
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Compact premium cards with pagination and quick updates.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 sm:w-80"
                            />

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="preparing">Preparing</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {paginatedOrders.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {paginatedOrders.map((order) => {
                                    const isExpanded =
                                        expandedCardId === order.id &&
                                        editingOrder?.id === order.id;

                                    return (
                                        <div
                                            key={order.id}
                                            className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
                                        >
                                            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-sky-500 to-orange-500" />

                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-sm font-bold text-white shadow-md">
                                                                #{String(order.order_number || "-").slice(-2)}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                                    Order Number
                                                                </p>
                                                                <h3 className="truncate text-[18px] font-bold leading-tight text-slate-900">
                                                                    {order.order_number || "-"}
                                                                </h3>
                                                            </div>
                                                        </div>

                                                        <p className="mt-2 text-xs text-slate-500">
                                                            {order.order_date
                                                                ? String(order.order_date).slice(0, 10)
                                                                : "-"}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-2">
                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getPaymentBadge(
                                                                order.payment_status
                                                            )}`}
                                                        >
                                                            {formatStatusLabel(order.payment_status)}
                                                        </span>

                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getStatusBadge(
                                                                order.order_status
                                                            )}`}
                                                        >
                                                            {formatStatusLabel(order.order_status)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 grid grid-cols-2 gap-2.5">
                                                    <div className="rounded-2xl bg-slate-50 p-3">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                                            Customer
                                                        </p>
                                                        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                                                            {order.customer_name || "-"}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-2xl bg-slate-50 p-3">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                                            Restaurant
                                                        </p>
                                                        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                                                            {order.restaurant_name || "-"}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-2xl bg-slate-50 p-3">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                                            Amount
                                                        </p>
                                                        <p className="mt-1 text-base font-bold text-slate-900">
                                                            ₹
                                                            {Number(order.total_amount || 0).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-2xl bg-slate-50 p-3">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                                            Payment
                                                        </p>
                                                        <p className="mt-1 truncate text-sm font-semibold capitalize text-slate-800">
                                                            {formatStatusLabel(order.payment_method)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-3 rounded-2xl bg-slate-50 p-3">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                                                Vehicle
                                                            </p>
                                                            <p className="mt-1 truncate text-sm font-medium text-slate-800">
                                                                {order.vehicle_number || "-"}
                                                            </p>
                                                        </div>

                                                        <div className="min-w-0 text-right">
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                                                Address
                                                            </p>
                                                            <p className="mt-1 truncate text-sm font-medium text-slate-800">
                                                                {order.delivery_address || "-"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(order)}
                                                        className="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setExpandedCardId((prev) =>
                                                                prev === order.id ? null : order.id
                                                            )
                                                        }
                                                        className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                                                    >
                                                        {isExpanded ? "Hide Update" : "Quick Update"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(order.id)}
                                                        className="rounded-2xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>

                                                {isExpanded && (
                                                    <div className="mt-4 rounded-[20px] border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-4 shadow-inner">
                                                        <div className="mb-3">
                                                            <h4 className="text-sm font-bold text-slate-900">
                                                                Quick Update
                                                            </h4>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                Update payment and order status directly here.
                                                            </p>
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-3">
                                                            <div>
                                                                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                                                    Payment Status
                                                                </label>
                                                                <select
                                                                    name="payment_status"
                                                                    value={form.payment_status}
                                                                    onChange={handleChange}
                                                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                                                                >
                                                                    <option value="unpaid">Unpaid</option>
                                                                    <option value="paid">Paid</option>
                                                                    <option value="partial">Partial</option>
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                                                    Order Status
                                                                </label>
                                                                <select
                                                                    name="order_status"
                                                                    value={form.order_status}
                                                                    onChange={handleChange}
                                                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                                                                >
                                                                    <option value="pending">Pending</option>
                                                                    <option value="confirmed">Confirmed</option>
                                                                    <option value="preparing">Preparing</option>
                                                                    <option value="out_for_delivery">
                                                                        Out for Delivery
                                                                    </option>
                                                                    <option value="delivered">Delivered</option>
                                                                    <option value="cancelled">Cancelled</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSubmit({
                                                                        preventDefault: () => {},
                                                                    })
                                                                }
                                                                disabled={loading}
                                                                className="rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {loading ? "Saving..." : "Save Changes"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleEdit(order)}
                                                                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                                                            >
                                                                Full Edit
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-500">
                                    Showing{" "}
                                    <span className="font-semibold text-slate-800">
                                        {(currentPage - 1) * pageSize + 1}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-semibold text-slate-800">
                                        {Math.min(currentPage * pageSize, filteredOrders.length)}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-slate-800">
                                        {filteredOrders.length}
                                    </span>{" "}
                                    orders
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                                        }
                                        className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                                        Page {currentPage} of {totalPages}
                                    </div>

                                    <button
                                        type="button"
                                        disabled={currentPage === totalPages}
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                        className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                                🍽️
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-slate-800">
                                No orders found
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Try changing search or filter to see matching orders.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}