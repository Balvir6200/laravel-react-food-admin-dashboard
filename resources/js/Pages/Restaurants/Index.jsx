import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../Components/AdminLayout";

const emptyForm = {
    name: "",
    owner_name: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
    rating: "0",
};

export default function RestaurantsIndex() {
    const [restaurants, setRestaurants] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await fetch("/admin/restaurants/list");
            const data = await response.json();
            setRestaurants(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch restaurants:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
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
                ? `/admin/restaurants/${editingId}`
                : "/admin/restaurants";

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
                fetchRestaurants();
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

    const handleEdit = (restaurant) => {
        setForm({
            name: restaurant.name || "",
            owner_name: restaurant.owner_name || "",
            email: restaurant.email || "",
            phone: restaurant.phone || "",
            address: restaurant.address || "",
            status: restaurant.status || "active",
            rating: restaurant.rating || "0",
        });

        setEditingId(restaurant.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        const confirmed = confirm("Are you sure you want to delete this restaurant?");
        if (!confirmed) return;

        try {
            const response = await fetch(`/admin/restaurants/${id}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                fetchRestaurants();
            } else {
                alert("Delete failed.");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Delete failed.");
        }
    };

    const filteredRestaurants = useMemo(() => {
        return restaurants.filter((restaurant) => {
            const keyword = search.toLowerCase();

            return (
                (restaurant.name || "").toLowerCase().includes(keyword) ||
                (restaurant.owner_name || "").toLowerCase().includes(keyword) ||
                (restaurant.phone || "").toLowerCase().includes(keyword) ||
                (restaurant.email || "").toLowerCase().includes(keyword)
            );
        });
    }, [restaurants, search]);

    const activeCount = restaurants.filter(
        (restaurant) => restaurant.status === "active"
    ).length;

    const inactiveCount = restaurants.filter(
        (restaurant) => restaurant.status === "inactive"
    ).length;

    const avgRating =
        restaurants.length > 0
            ? (
                  restaurants.reduce(
                      (sum, item) => sum + parseFloat(item.rating || 0),
                      0
                  ) / restaurants.length
              ).toFixed(1)
            : "0.0";

    return (
        <AdminLayout title="Restaurants">
            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-[28px] border border-orange-100 bg-gradient-to-br from-white via-orange-50/70 to-amber-50 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-200/30 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-amber-200/30 blur-3xl"></div>

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                                Restaurant Management
                            </div>

                            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                Premium Restaurant Control Panel
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                                Manage restaurant profiles, owners, status, ratings,
                                and contact details with a cleaner, smarter, and more
                                beautiful admin experience.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={resetForm}
                                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                            >
                                {editingId ? "Create New Entry" : "+ Add New Restaurant"}
                            </button>
                        </div>
                    </div>

                    <div className="relative mt-8 grid gap-4 md:grid-cols-3">
                        <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
                            <p className="text-sm font-medium text-slate-500">
                                Total Restaurants
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-slate-900">
                                {restaurants.length}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                All registered restaurants
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
                            <p className="text-sm font-medium text-slate-500">
                                Active Restaurants
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                                {activeCount}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Currently active and operational
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
                            <p className="text-sm font-medium text-slate-500">
                                Average Rating
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-amber-500">
                                {avgRating}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Based on all restaurant ratings
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                                {editingId ? "Update details" : "Create a new restaurant"}
                            </p>
                            <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                {editingId ? "Edit Restaurant" : "Add Restaurant"}
                            </h2>
                        </div>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Restaurant Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter restaurant name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Owner Name
                                </label>
                                <input
                                    type="text"
                                    name="owner_name"
                                    placeholder="Enter owner name"
                                    value={form.owner_name}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
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
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
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
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
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
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Rating
                                </label>
                                <input
                                    type="number"
                                    name="rating"
                                    placeholder="0.0 to 5.0"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={form.rating}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Address
                            </label>
                            <textarea
                                name="address"
                                placeholder="Enter full restaurant address"
                                value={form.address}
                                onChange={handleChange}
                                rows="4"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
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
                                    ? "Update Restaurant"
                                    : "Save Restaurant"}
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

                <div className="rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                    <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                                    Manage records
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                    Restaurant List
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    View, search, edit and delete restaurant entries.
                                </p>
                            </div>

                            <div className="flex w-full max-w-md items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                                <input
                                    type="text"
                                    placeholder="Search by name, owner, phone or email..."
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
                                Total: {restaurants.length}
                            </div>
                            <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                                Active: {activeCount}
                            </div>
                            <div className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
                                Inactive: {inactiveCount}
                            </div>
                        </div>

                        {loading ? (
                            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
                                <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-orange-100"></div>
                                <p className="text-sm font-medium text-slate-500">
                                    Loading restaurants...
                                </p>
                            </div>
                        ) : filteredRestaurants.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl">
                                    🍽️
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    No restaurants found
                                </h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Try adding a new restaurant or changing your search.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-3xl border border-slate-100">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-slate-50">
                                            <tr className="text-left">
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Restaurant
                                                </th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Contact
                                                </th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Rating
                                                </th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {filteredRestaurants.map((restaurant) => (
                                                <tr
                                                    key={restaurant.id}
                                                    className="transition hover:bg-orange-50/40"
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-sm font-bold text-orange-700 shadow-sm">
                                                                {(restaurant.name || "R")
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>

                                                            <div>
                                                                <p className="font-bold text-slate-900">
                                                                    {restaurant.name}
                                                                </p>
                                                                <p className="mt-1 text-sm text-slate-500">
                                                                    Owner:{" "}
                                                                    {restaurant.owner_name || "-"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium text-slate-700">
                                                                {restaurant.phone || "-"}
                                                            </p>
                                                            <p className="text-sm text-slate-500">
                                                                {restaurant.email || "-"}
                                                            </p>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <span
                                                            className={`inline-flex rounded-full px-3.5 py-1.5 text-xs font-bold capitalize ${
                                                                restaurant.status === "active"
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : "bg-rose-100 text-rose-700"
                                                            }`}
                                                        >
                                                            {restaurant.status}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
                                                            <span>⭐</span>
                                                            <span>{restaurant.rating || "0"}</span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(restaurant)
                                                                }
                                                                className="rounded-xl bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(restaurant.id)
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