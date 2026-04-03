import React from "react";

export default function Topbar({ title = "Dashboard", onMenuClick }) {
    const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 lg:hidden"
                    >
                        ☰
                    </button>

                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-600">
                            <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                            Food Management
                        </div>

                        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                            {title}
                        </h1>

                        <p className="mt-2 text-sm font-medium text-slate-500">
                            {getGreeting()}, welcome back to your premium admin panel.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-orange-200 hover:shadow-md">
                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                            Today
                        </p>
                        <p className="mt-2 text-lg font-bold text-slate-900">
                            {today}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-orange-200 hover:shadow-md">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-fuchsia-500 text-lg font-bold text-white shadow-lg shadow-orange-200">
                            A
                        </div>

                        <div>
                            <p className="text-lg font-bold text-slate-900">
                                Welcome, Admin
                            </p>
                            <p className="text-sm text-slate-500">
                                Control your food system
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}