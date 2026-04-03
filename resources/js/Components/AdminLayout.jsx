import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({ children, title = "Dashboard" }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="flex min-h-screen">
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <div className="flex min-h-screen flex-1 flex-col lg:ml-72">
                    <Topbar
                        title={title}
                        onMenuClick={() => setSidebarOpen(true)}
                    />

                    <main className="flex-1 px-5 py-6 sm:px-7 lg:px-10 xl:px-12 2xl:px-14">
                        <div className="mx-auto w-full max-w-[1600px]">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}