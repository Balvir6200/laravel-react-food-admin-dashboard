import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Components/AdminLayout";

const emptyForm = {
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
};

export default function CustomersIndex() {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await fetch("/admin/customers/list");
            const data = await response.json();
            setCustomers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const url = editingId
                ? `/admin/customers/${editingId}`
                : "/admin/customers";

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                resetForm();
                fetchCustomers();
            } else {
                alert("Something went wrong. Please check form fields.");
            }
        } catch (error) {
            console.error("Submit failed:", error);
            alert("Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (customer) => {
        setForm({
            name: customer.name || "",
            email: customer.email || "",
            phone: customer.phone || "",
            address: customer.address || "",
            status: customer.status || "active",
        });

        setEditingId(customer.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        const confirmed = confirm("Are you sure you want to delete this customer?");
        if (!confirmed) return;

        try {
            const response = await fetch(`/admin/customers/${id}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                fetchCustomers();
            } else {
                alert("Delete failed.");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Delete failed.");
        }
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
            const keyword = search.toLowerCase();

            return (
                (customer.name || "").toLowerCase().includes(keyword) ||
                (customer.email || "").toLowerCase().includes(keyword) ||
                (customer.phone || "").toLowerCase().includes(keyword) ||
                (customer.address || "").toLowerCase().includes(keyword)
            );
        });
    }, [customers, search]);

    const activeCount = customers.filter(
        (customer) => customer.status === "active"
    ).length;

    const inactiveCount = customers.filter(
        (customer) => customer.status === "inactive"
    ).length;

    return (
        <AdminLayout title="Customers">
            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-[30px] border border-orange-100 bg-gradient-to-br from-white via-orange-50/80 to-amber-50/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl"></div>
                    <div className="absolute -bottom-10 left-0 h-32 w-32 rounded-full bg-amber-200/40 blur-3xl"></div>

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-600 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                                Customer Management
                            </div>

                            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                Premium Customer Control Panel
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                                Manage customer records, contact details, and account
                                status with a cleaner, warmer, and more attractive
                                premium admin experience.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={resetForm}
                                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                            >
                                {editingId ? "Create New Entry" : "+ Add New Customer"}
                            </button>
                        </div>
                    </div>

                    <div className="relative mt-8 grid gap-4 md:grid-cols-3">
                        <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
                            <p className="text-sm font-medium text-slate-500">
                                Total Customers
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-slate-900">
                                {customers.length}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                All registered customer profiles
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
                            <p className="text-sm font-medium text-slate-500">
                                Active Customers
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                                {activeCount}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Currently active accounts
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
                            <p className="text-sm font-medium text-slate-500">
                                Inactive Customers
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-rose-600">
                                {inactiveCount}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Currently inactive accounts
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-orange-500/80">
                                {editingId ? "Update details" : "Create a new customer"}
                            </p>
                            <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                {editingId ? "Edit Customer" : "Add Customer"}
                            </h2>
                        </div>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter customer name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Address
                            </label>
                            <textarea
                                name="address"
                                placeholder="Enter full address"
                                value={form.address}
                                onChange={handleChange}
                                rows="4"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            ></textarea>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {submitting
                                    ? editingId
                                        ? "Updating..."
                                        : "Saving..."
                                    : editingId
                                    ? "Update Customer"
                                    : "Save Customer"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Reset Form
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-[30px] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                    <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-orange-500/80">
                                    Manage records
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                    Customer List
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Search, manage, update, and remove customer records.
                                </p>
                            </div>

                            <div className="flex w-full max-w-md items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus-within:border-orange-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
                                <input
                                    type="text"
                                    placeholder="Search by name, email, phone or address..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-5 sm:px-8">
                        <div className="mb-5 flex flex-wrap gap-3">
                            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                                Total: {customers.length}
                            </div>
                            <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                                Active: {activeCount}
                            </div>
                            <div className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
                                Inactive: {inactiveCount}
                            </div>
                        </div>

                        {loading ? (
                            <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50/50 px-6 py-14 text-center">
                                <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-orange-100"></div>
                                <p className="text-sm font-medium text-slate-500">
                                    Loading customers...
                                </p>
                            </div>
                        ) : filteredCustomers.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50/50 px-6 py-14 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl">
                                    👤
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    No customers found
                                </h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Try adding a new customer or changing your search.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-3xl border border-slate-100">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-gradient-to-r from-orange-50 to-amber-50">
                                            <tr className="text-left">
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Customer
                                                </th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Contact
                                                </th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Address
                                                </th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {filteredCustomers.map((customer) => (
                                                <tr
                                                    key={customer.id}
                                                    className="transition hover:bg-orange-50/40"
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-sm font-bold text-orange-700 shadow-sm">
                                                                {(customer.name || "C")
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>

                                                            <div>
                                                                <p className="font-bold text-slate-900">
                                                                    {customer.name}
                                                                </p>
                                                                <p className="mt-1 text-sm text-slate-500">
                                                                    Customer record
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium text-slate-700">
                                                                {customer.phone || "-"}
                                                            </p>
                                                            <p className="text-sm text-slate-500">
                                                                {customer.email || "-"}
                                                            </p>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <p className="max-w-xs text-sm leading-6 text-slate-600">
                                                            {customer.address || "-"}
                                                        </p>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <span
                                                            className={`inline-flex rounded-full px-3.5 py-1.5 text-xs font-bold capitalize ${
                                                                customer.status === "active"
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : "bg-rose-100 text-rose-700"
                                                            }`}
                                                        >
                                                            {customer.status}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(customer)
                                                                }
                                                                className="rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(customer.id)
                                                                }
                                                                className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}