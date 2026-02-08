import { AdminHeader } from "@/components/admin/Header";

export default function AdminDashboard() {
    return (
        <>
            <AdminHeader title="Overview" />
            <div className="p-8 flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm">
                    <a
                        className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
                        href="#"
                    >
                        <span className="material-icons-outlined text-sm">home</span>
                        Home
                    </a>
                    <span className="text-slate-300">/</span>
                    <span className="text-primary font-semibold">Dashboard</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-background-dark p-6 rounded-2xl border border-teal-50 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                <span className="material-icons-outlined">assignment_ind</span>
                            </div>
                            <span className="text-primary bg-primary/5 px-2.5 py-1 rounded-lg text-xs font-bold">
                                +12%
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                            Total Consultants
                        </p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-50 tracking-tight">
                            1,240
                        </p>
                    </div>
                    <div className="bg-white dark:bg-background-dark p-6 rounded-2xl border border-teal-50 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                <span className="material-icons-outlined">school</span>
                            </div>
                            <span className="text-primary bg-primary/5 px-2.5 py-1 rounded-lg text-xs font-bold">
                                +18%
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                            Total Students
                        </p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-50 tracking-tight">
                            8,520
                        </p>
                    </div>
                    <div className="bg-white dark:bg-background-dark p-6 rounded-2xl border border-teal-50 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600">
                                <span className="material-icons-outlined">video_chat</span>
                            </div>
                            <span className="text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-lg text-xs font-bold">
                                -5%
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                            Active Sessions
                        </p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-50 tracking-tight">
                            342
                        </p>
                    </div>
                    <div className="bg-white dark:bg-background-dark p-6 rounded-2xl border border-teal-50 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                <span className="material-icons-outlined">payments</span>
                            </div>
                            <span className="text-primary bg-primary/5 px-2.5 py-1 rounded-lg text-xs font-bold">
                                +10%
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                            Total Revenue
                        </p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-50 tracking-tight">
                            ₹42,800
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Section */}
                    <div className="lg:col-span-2 bg-white dark:bg-background-dark rounded-2xl border border-teal-50 dark:border-slate-800 p-8 flex flex-col shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50 tracking-tight">
                                    Platform Activity
                                </h3>
                                <p className="text-xs text-slate-400 mt-1 font-medium">
                                    Session distribution across recent weeks
                                </p>
                            </div>
                            <select className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-primary/20 outline-none">
                                <option>Last 30 Days</option>
                                <option>Last 6 Months</option>
                                <option>Year to Date</option>
                            </select>
                        </div>
                        <div className="h-64 w-full flex flex-col justify-end gap-2 px-2 relative">
                            <div className="absolute inset-0 flex items-end justify-between px-10 pb-2">
                                <div className="w-10 bg-primary/10 rounded-t-lg h-[30%] hover:bg-primary/20 transition-all cursor-pointer"></div>
                                <div className="w-10 bg-primary/15 rounded-t-lg h-[45%] hover:bg-primary/25 transition-all cursor-pointer"></div>
                                <div className="w-10 bg-primary/20 rounded-t-lg h-[60%] hover:bg-primary/30 transition-all cursor-pointer"></div>
                                <div className="w-10 bg-primary/25 rounded-t-lg h-[55%] hover:bg-primary/35 transition-all cursor-pointer"></div>
                                <div className="w-10 bg-primary/30 rounded-t-lg h-[75%] hover:bg-primary/40 transition-all cursor-pointer"></div>
                                <div className="w-10 bg-primary/40 rounded-t-lg h-[90%] hover:bg-primary/50 transition-all cursor-pointer"></div>
                                <div className="w-10 bg-primary/50 rounded-t-lg h-[85%] hover:bg-primary/60 transition-all cursor-pointer"></div>
                                <div className="w-10 bg-primary rounded-t-lg h-[100%] hover:bg-primary-dark transition-all cursor-pointer"></div>
                            </div>
                            <div className="border-t border-teal-50 dark:border-slate-800 pt-6 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
                                <span>Week 1</span>
                                <span>Week 2</span>
                                <span>Week 3</span>
                                <span>Week 4</span>
                            </div>
                        </div>
                    </div>

                    {/* Verification Queue */}
                    <div className="bg-white dark:bg-background-dark rounded-2xl border border-teal-50 dark:border-slate-800 flex flex-col shadow-sm">
                        <div className="p-6 border-b border-teal-50 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50 tracking-tight">
                                Verification Queue
                            </h3>
                            <span className="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-1 rounded-full">
                                4 NEW
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex flex-col">
                                {/* Item 1 */}
                                <div className="p-4 border-b border-teal-50 dark:border-slate-800/50 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group">
                                    <div
                                        className="h-11 w-11 rounded-xl bg-cover bg-center shrink-0 shadow-sm border border-primary/10"
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDltvs-6ul6T-4twNhaEBUEIsGZpvuZ80_6wFczvQb9sRkVQiaFz0quyd2h_jg8JzeAJnDP5YNYb4uzpYB8kwVnezctyGBnJx5ukx23B9_ALtox91839kaJaBkS1EUliMcUAFobqM9HPJXLCAqsmNBa5oBKttWOd_SRloqXW5HCYXkcvtfsiFejyU6fom9-GwiA2NMsXE2y_2o4wBpTHGYIAS-CWTk9HC5o2KfRcUj2YkgE4_LQYIPDdnV_JBBwIrulsIG-yp4B43A")',
                                        }}
                                    ></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-50 truncate">
                                            Dr. Sarah Chen
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            Stanford • Bio-Tech
                                        </p>
                                    </div>
                                    <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <span className="material-icons-outlined text-sm">
                                            visibility
                                        </span>
                                    </button>
                                </div>
                                {/* Item 2 */}
                                <div className="p-4 border-b border-teal-50 dark:border-slate-800/50 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group">
                                    <div
                                        className="h-11 w-11 rounded-xl bg-cover bg-center shrink-0 shadow-sm border border-primary/10"
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnPSL8jeSfXnMRMTyJbgP93wZlEfs4lcUqJy6USgR7kRytnJTpttB-b0e9b0tS94SkIVpbJFqYsI_F4El-AcfIoqyVJPnSK1eDIpmyiRupqXKs6yzelj0DZVuokCdXKtU4aVfEO8UaI8yLKXl2kKcaZ_vcFW2LfB37ChLS-VYNTJT4Mrn3NdBFp7-sEdHpdPRVsuXz7eQsmh3P5EnwjOqNW5T8uOYYq2bnRZxcpgdu8vMUFtLwcovFS9TgRC7rdNFxUrqMTTg3MKg")',
                                        }}
                                    ></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-50 truncate">
                                            Marcus Johnson
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            MIT • AI Ethics
                                        </p>
                                    </div>
                                    <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <span className="material-icons-outlined text-sm">
                                            visibility
                                        </span>
                                    </button>
                                </div>
                                {/* Item 3 */}
                                <div className="p-4 border-b border-teal-50 dark:border-slate-800/50 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group">
                                    <div
                                        className="h-11 w-11 rounded-xl bg-cover bg-center shrink-0 shadow-sm border border-primary/10"
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCKgcm2qzISD-Czu_ItlonERnP0Bys687luDN3W4UjuvNXeaqbpmxNMGKFwu_kBbgfnKWkGZlRauTZRmArJPctmma9rK-9eZ6XsQRcuSf4LmH2mHq0LXHLluIBI0b5Cjjt_kgR-9I_STT9NE-lTxnwSYGNeL7xkpXDNgFJZcbxbbTqJiMrGt2F-VbufUmvYeMOZ5_XT32WBbmYVF1KolGSujMDF64vLCcU5Rk5tgMWCru5noffEIEFIQXnNPdzTvWmuNaK4AFKTG1k")',
                                        }}
                                    ></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-50 truncate">
                                            Elena Rodriguez
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            Yale • Pol-Science
                                        </p>
                                    </div>
                                    <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <span className="material-icons-outlined text-sm">
                                            visibility
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <button className="w-full text-center text-[10px] font-black text-slate-400 hover:text-primary transition-all py-3 uppercase tracking-[0.2em] bg-slate-50 dark:bg-slate-800 rounded-xl">
                                View Full Queue
                            </button>
                        </div>
                    </div>
                </div>

                {/* Top Performing Table */}
                <div className="bg-white dark:bg-background-dark rounded-2xl border border-teal-50 dark:border-slate-800 shadow-sm overflow-hidden mb-12">
                    <div className="px-8 py-6 border-b border-teal-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50 tracking-tight">
                            Top Performing Consultants
                        </h3>
                        <button className="text-sm font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-2">
                            <span className="material-icons-outlined text-sm">download</span>
                            Export List
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-100/50 dark:bg-slate-800/40 text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">
                                <tr>
                                    <th className="px-8 py-5">Consultant</th>
                                    <th className="px-8 py-5">Total Sessions</th>
                                    <th className="px-8 py-5">Rating</th>
                                    <th className="px-8 py-5">Earnings</th>
                                    <th className="px-8 py-5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-teal-50 dark:divide-slate-800/50">
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="h-9 w-9 rounded-full bg-cover bg-center ring-2 ring-primary/10"
                                                style={{
                                                    backgroundImage:
                                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAvxOqg9S70wwsw7etm_tZSw7l5dV1_eLhurVOU--tNA8xOec_Q4tk_edx5-9YllkcS7Sll9AJZjgkw9pShka5fCQXyAaJew5Fut3xVV-pbqb6wrDvwCobVg69t10PiSIFqRQgrBwYiqXnXJyBltTH0A4h_CB5Q1cuXH-Tq5dv79a1Ju0M1CQz4YFGmbvLbcrIckJ8YdNDku-Kf1AuWCFgmIlhL8GVhO3-wbY3rBt0_3gIYSCAPbq_BjgZklXJUprkVn_4nIra7_4c")',
                                                }}
                                            ></div>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-50">
                                                Dr. James Wilson
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-slate-600 dark:text-slate-400">
                                        142 sessions
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5 text-yellow-500">
                                            <span className="material-icons-outlined text-base">
                                                star
                                            </span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                4.9
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-primary">
                                        ₹3,450.00
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className="px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="h-9 w-9 rounded-full bg-cover bg-center ring-2 ring-primary/10"
                                                style={{
                                                    backgroundImage:
                                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAP3AB0Ab7tAGfjBD-orDpFT5Cu45isi3I50tC_Dcm-uu-5uQPgmF0YYlcXeZJWL-PnFVEQPu1gidzqa9RQVjNCxq1KIZmvl2_zHp8r9CtDDykjq5vRAzunWiKNT0zrKTSHVSZZMjokJ4sMRhH2HESNDRZ5qARU2G9FWoA_qu6oCt_oXmCZsRYW2oPErepFxksm2CFz8yGKkFG5dm0UV1AFqYnAtZqnMLlF376fQ9S2AAw3sdi_GNgwn8XT_pd4Jvxf2B2z3AdGbe0")',
                                                }}
                                            ></div>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-50">
                                                Amara Okafor
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-slate-600 dark:text-slate-400">
                                        98 sessions
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5 text-yellow-500">
                                            <span className="material-icons-outlined text-base">
                                                star
                                            </span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                5.0
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-primary">
                                        ₹2,140.00
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className="px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="h-9 w-9 rounded-full bg-cover bg-center ring-2 ring-primary/10"
                                                style={{
                                                    backgroundImage:
                                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuClJobJDtfBpHGzylsRWWtAg5B1T5k2cKJyqFlWvwSmmlromMHFs-PJ3DGO7UKMOyhTDF9kZt8zx8BXhGXmTozB_WoBVeQDWQO1ioCDT4fk2eVSxSdBVMhIWwW1aMW0tEFxHOQ20izU8kO3tQz9GSrnc-0eY4GsBebGt18_tRfuS7GHlQlsD_NjJ71dg22fE9UBGVHVsrqGrZG81PZDAIHz3ZvqhZr5YNiopW58z6DLHx4AvRyppQ_B-Od4uRf1EaP0YGRyWwTzrUk")',
                                                }}
                                            ></div>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-50">
                                                Tom Bradley
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-slate-600 dark:text-slate-400">
                                        85 sessions
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5 text-yellow-500">
                                            <span className="material-icons-outlined text-base">
                                                star
                                            </span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                4.7
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-primary">
                                        ₹1,890.00
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
                                            Away
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
