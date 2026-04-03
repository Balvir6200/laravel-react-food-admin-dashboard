import React from "react";

const menuItems = [
    {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: "📊",
        description: "Manage dashboard",
    },
    {
        label: "Restaurants",
        href: "/admin/restaurants",
        icon: "🍽️",
        description: "Manage restaurants",
    },
    {
        label: "Orders",
        href: "/admin/orders",
        icon: "🧾",
        description: "Manage orders",
    },
    {
        label: "Customers",
        href: "/admin/customers",
        icon: "👥",
        description: "Manage customers",
    },
    {
        label: "Delivery Boys",
        href: "/admin/delivery-boys",
        icon: "🛵",
        description: "Manage delivery team",
    },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const currentPath = window.location.pathname;

    return (
        <>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-hidden border-r border-slate-800 bg-gradient-to-b from-[#020817] via-[#07112b] to-[#0f172a] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="border-b border-white/10 px-6 py-7">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-fuchsia-500 text-2xl shadow-lg shadow-orange-500/20">
                            🍔
                        </div>

                        <div>
                            <h1 className="text-2xl font-black leading-tight text-white">
                                Food
                                <br />
                                Admin
                            </h1>
                            <p className="mt-1 text-sm font-medium text-slate-300">
                                Premium Control Panel
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6">
                    <p className="mb-4 px-2 text-xs font-bold uppercase tracking-[0.28em] text-slate-400">
                        Main Navigation
                    </p>

                    <nav className="space-y-3">
                        {menuItems.map((item) => {
                            const isActive = currentPath === item.href;

                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className={`group relative flex items-center gap-4 rounded-[22px] px-4 py-4 transition-all duration-200 ${
                                        isActive
                                            ? "bg-white text-slate-900 shadow-[0_18px_40px_rgba(255,255,255,0.12)]"
                                            : "bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]"
                                    }`}
                                >
                                    {isActive && (
                                        <span className="absolute left-0 top-4 h-10 w-1 rounded-r-full bg-gradient-to-b from-orange-400 to-orange-600"></span>
                                    )}

                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg shadow-sm transition ${
                                            isActive
                                                ? "bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700"
                                                : "bg-white/10 text-white group-hover:bg-white/15"
                                        }`}
                                    >
                                        {item.icon}
                                    </div>

                                    <div className="min-w-0">
                                        <p
                                            className={`text-[15px] font-bold ${
                                                isActive
                                                    ? "text-slate-900"
                                                    : "text-white"
                                            }`}
                                        >
                                            {item.label}
                                        </p>
                                        <p
                                            className={`truncate text-sm ${
                                                isActive
                                                    ? "text-slate-500"
                                                    : "text-slate-400"
                                            }`}
                                        >
                                            {item.description}
                                        </p>
                                    </div>
                                </a>
                            );
                        })}
                    </nav>
                </div>

                <div className="border-t border-white/10 px-5 py-4">
                    <div className="rounded-3xl border border-orange-400/20 bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-4">
                        <p className="text-sm font-semibold text-orange-200">
                            Admin Panel
                        </p>
                        <p className="mt-1 text-xs leading-6 text-slate-300">
                            Unified orange premium theme applied across the full
                            dashboard.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}