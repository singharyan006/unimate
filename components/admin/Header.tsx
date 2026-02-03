"use client";

export function AdminHeader({ title = "Overview" }: { title?: string }) {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-teal-50 dark:border-slate-800 bg-white/90 dark:bg-background-dark/80 backdrop-blur-md px-8 py-5">
            <div className="flex items-center gap-8">
                <h2 className="text-slate-800 dark:text-slate-50 text-xl font-bold tracking-tight">
                    {title}
                </h2>
                <div className="relative w-72">
                    <span className="material-icons-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                        search
                    </span>
                    <input
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-50 placeholder:text-slate-400 outline-none"
                        placeholder="Search..."
                        type="text"
                    />
                </div>
            </div>
            <div className="flex items-center gap-5">
                <div className="flex gap-2">
                    <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all relative">
                        <span className="material-icons-outlined text-xl">
                            notifications
                        </span>
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-slate-800"></span>
                    </button>
                    <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
                        <span className="material-icons-outlined text-xl">settings</span>
                    </button>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-50">
                            Alex Rivera
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                            Head Admin
                        </span>
                    </div>
                    <div
                        className="h-10 w-10 rounded-xl bg-cover bg-center border-2 border-primary/20 shadow-sm"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCY3NM4z2qqXmJbCKGR1FQkuw59wqRMkSth9k0fVbPcHAse9b8jJ6sxK6LzBATA27tmHDh9DS6SmviIlrC8pl-VZ7_X4VBaid0Fld6OE_NyxvuY76LKA2App42S0mF9OD2vFRxDpf26ixyVTKRXk1lRg6iRskGRa23dxASbOz_PHgYTFw-K-6hmGPga3iDtxr88hMdve3vXwoNtUaI1i_DuwJ0OlQ07BlmdQ_X9ss-PhAeBBH3D9Tu-B_RNAPqdB7_CZetRdafLivQ")',
                        }}
                    ></div>
                </div>
            </div>
        </header>
    );
}
