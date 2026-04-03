import React from "react";

export default function StatCard({
    title,
    value,
    icon = "📈",
    subtitle = "Updated today",
}) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-500">
                        {title}
                    </p>

                    <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                        {value}
                    </h3>

                    <p className="mt-2 text-xs font-medium text-slate-400 sm:text-sm">
                        {subtitle}
                    </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl shadow-inner">
                    {icon}
                </div>
            </div>
        </div>
    );
}