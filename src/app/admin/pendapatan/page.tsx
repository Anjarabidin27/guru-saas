'use client'

import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Filter,
  CreditCard,
  Building2,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminPendapatanPage() {
  const transactions = [
    { school: 'SMA Negeri 1 Jakarta', type: 'PRO_ANNUAL', amount: 15400000, date: '2024-03-15', status: 'PAID' },
    { school: 'SMP Al-Azhar Pusat', type: 'ENT_B2B', amount: 45000000, date: '2024-03-12', status: 'PAID' },
    { school: 'SMA Labschool Rawamangun', type: 'PRO_MONTHLY', amount: 1250000, date: '2024-03-10', status: 'PAID' },
    { school: 'SMK Telkom Malang', type: 'PRO_ANNUAL', amount: 15400000, date: '2024-03-08', status: 'PENDING' },
  ]

  const metrics = [
    { label: 'Revenue (MTD)', value: 'Rp 61.65M', grow: '+12.5%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Average Contract Value', value: 'Rp 15.4M', grow: '+4.2%', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Invoices', value: 'Rp 15.4M', grow: '-2.1%', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto animate-fade-up">
      {/* Header - Capital Management */}
      <div className="flex justify-between items-end pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-none uppercase">Capital_Revenue_Console</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
            <Wallet className="w-3.5 h-3.5" /> Financial_Growth_Monitoring
          </p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase px-4 py-2 rounded hover:bg-slate-50 transition-colors flex items-center gap-2">
             <Download className="w-3.5 h-3.5" /> Export_Fiscal_Report
           </button>
           <button className="bg-slate-900 text-white text-[10px] font-black uppercase px-4 py-2 rounded hover:bg-black transition-colors shadow-lg shadow-slate-900/20">Analyze ROI</button>
        </div>
      </div>

      {/* Revenue Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm hover:border-slate-400 transition-all group relative overflow-hidden">
               <div className="relative z-10">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 shadow-none">{m.label}</span>
                  <div className="flex items-end gap-2 mt-1">
                     <p className="text-2xl font-black text-slate-900 tracking-tighter">{m.value}</p>
                     <span className={cn(
                       "text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5",
                       m.grow.startsWith('+') ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                     )}>
                        {m.grow.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {m.grow}
                     </span>
                  </div>
               </div>
               <Icon className={cn("absolute -right-4 -bottom-4 w-20 h-20 opacity-[0.03] group-hover:opacity-10 transition-opacity", m.color)} />
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         {/* Ledger - Recent Transactions */}
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Fiscal_Registry_Log
               </h2>
               <div className="flex gap-2">
                  <button className="p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900">
                     <Filter className="w-3.5 h-3.5" />
                  </button>
               </div>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                        <th className="px-6 py-4">Institution_Payer</th>
                        <th className="px-6 py-4">Contract_Type</th>
                        <th className="px-6 py-4">Fiscal_Value</th>
                        <th className="px-6 py-4 text-right">Settlement</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[13px] font-semibold">
                     {transactions.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <Building2 className="w-4 h-4 text-slate-300" />
                                 <span className="font-bold text-slate-900 uppercase tracking-tight">{t.school}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-[10px] font-black text-slate-500 border border-slate-200 px-2 py-0.5 rounded tracking-widest">{t.type}</span>
                           </td>
                           <td className="px-6 py-4 font-black text-slate-900">
                              Rp {t.amount.toLocaleString()}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <span className={cn(
                                "text-[10px] font-black px-2 py-1 rounded tracking-widest uppercase",
                                t.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                              )}>
                                 {t.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Live_Sync_With_Bank_Gateway...</p>
            </div>
         </div>

         {/* Distribution Summary */}
         <div className="bg-slate-900 rounded-lg p-6 text-white flex flex-col gap-6 shadow-xl">
            <div className="flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-emerald-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Revenue_Distribution</span>
            </div>
            
            <div className="space-y-6">
               {[
                 { label: 'B2B Institutions (90%)', val: 90, color: 'bg-emerald-400' },
                 { label: 'Individual Pro (8%)', val: 8, color: 'bg-blue-400' },
                 { label: 'API Services (2%)', val: 2, color: 'bg-slate-600' }
               ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                     <div className="flex justify-between text-[11px] font-black uppercase">
                        <span>{item.label}</span>
                        <span className="text-white/50">{item.val}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className={cn("h-full", item.color)} style={{ width: `${item.val}%` }} />
                     </div>
                  </div>
               ))}
            </div>

            <div className="mt-4 p-4 bg-white/5 rounded border border-white/10">
               <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">
                  Kontrak B2B mendominasi pendapatan sebesar 90%. Strategi ekspansi ke sekolah menengah negeri harus dipertahankan.
               </p>
            </div>
            
            <button className="bg-white text-slate-900 font-black text-[10px] py-3 rounded hover:bg-slate-100 transition-all tracking-widest uppercase mt-auto shadow-lg shadow-black/20">
               Initiate Payout
            </button>
         </div>
      </div>
    </div>
  )
}
