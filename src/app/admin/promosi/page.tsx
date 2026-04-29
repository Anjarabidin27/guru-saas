'use client'

import { 
  Gift, 
  Plus, 
  Search, 
  Tag, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  Timer,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminPromosiPage() {
  const promos = [
    { code: 'WIYATA_MERDEKA', type: 'PERCENT', discount: '20%', usage: '45/100', status: 'ACTIVE', school: 'GLOBAL' },
    { code: 'B2B_JAKARTA_NEW', type: 'FLAT', discount: 'Rp 2.5jt', usage: '12/50', status: 'ACTIVE', school: 'DKI JAKARTA' },
    { code: 'TRIAL_PRO_60', type: 'FREE_DAYS', discount: '60 Days', usage: '210/Unlimited', status: 'ACTIVE', school: 'GLOBAL' },
    { code: 'KAMPUS_MENGAJAR', type: 'PERCENT', discount: '50%', usage: '89/300', status: 'EXPIRED', school: 'SPECIFIC' },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto animate-fade-up">
      {/* Header - Campaign Protocol */}
      <div className="flex justify-between items-end pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-none uppercase">Marketing_Promo_Campaign</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
            <Gift className="w-3.5 h-3.5" /> Voucher_Distribution_System
          </p>
        </div>
        <button className="bg-slate-900 text-white text-[10px] font-black uppercase px-6 py-3 rounded hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-slate-900/20">
          <Plus className="w-3.5 h-3.5" /> Deploy_New_Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white border border-slate-200 p-5 rounded-lg">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Coupons</p>
            <p className="text-2xl font-black text-slate-900">12</p>
         </div>
         <div className="bg-white border border-slate-200 p-5 rounded-lg">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Reach</p>
            <p className="text-2xl font-black text-slate-900">85%</p>
         </div>
         <div className="bg-blue-600 p-5 rounded-lg text-white">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Redeemed Today</p>
            <p className="text-2xl font-black">42</p>
         </div>
         <div className="bg-white border border-slate-200 p-5 rounded-lg">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Savings</p>
            <p className="text-2xl font-black text-slate-900">Rp 122M</p>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/10">
           <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-blue-600" />
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Coupons_Registry_Table</h2>
           </div>
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                placeholder="FIND_CAMPAIGN_CODE..."
                className="bg-white border border-slate-200 rounded px-10 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-slate-900 transition-all w-[250px]"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                  <th className="px-6 py-4">Promo_Code</th>
                  <th className="px-6 py-4">Benefit_Type</th>
                  <th className="px-6 py-4">Scope</th>
                  <th className="px-6 py-4">Usage_Load</th>
                  <th className="px-6 py-4 text-right">Administrative</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 italic font-mono text-xs">
               {promos.map((p, idx) => (
                  <tr key={idx} className={cn("hover:bg-slate-50 transition-colors group", p.status === 'EXPIRED' && 'opacity-50 grayscale')}>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 group/code">
                          <span className="bg-slate-900 text-white px-3 py-1 rounded font-black tracking-widest text-[11px] shadow-sm">{p.code}</span>
                          <button className="p-1 opacity-0 group-hover/code:opacity-100 transition-opacity text-slate-400 hover:text-slate-900">
                             <Copy className="w-3 h-3" />
                          </button>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{p.discount}</span>
                       <span className="ml-2 text-[10px] font-black text-slate-400 uppercase">{p.type}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-1.5">
                       <Users className="w-3.5 h-3.5 text-slate-400" />
                       {p.school}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                                className={cn("h-full", p.status === 'ACTIVE' ? "bg-amber-400" : "bg-slate-400")} 
                                style={{ width: p.usage.includes('Unlimited') ? '100%' : `${(parseInt(p.usage.split('/')[0])/parseInt(p.usage.split('/')[1]))*100}%` }} 
                             />
                          </div>
                          <span className="text-[10px] font-black text-slate-900 uppercase">{p.usage}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          {p.status === 'ACTIVE' ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                               <CheckCircle2 className="w-3.5 h-3.5" />
                               <span className="text-[10px] font-black uppercase">Live</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2 py-1 rounded">
                               <Timer className="w-3.5 h-3.5" />
                               <span className="text-[10px] font-black uppercase">Expired</span>
                            </div>
                          )}
                          <button className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all">
                             <Trash2 className="w-3.5 h-3.5" />
                          </button>
                       </div>
                    </td>
                  </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center gap-5">
         <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-700">
            <Users className="w-6 h-6" />
         </div>
         <div className="flex-1">
            <h4 className="text-sm font-black text-amber-900 uppercase">Growth_Tip_System</h4>
            <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase opacity-70">
               Coupons dengan diskon PERCENT (20-30%) memiliki tingkat konversi 3x lebih tinggi daripada FLat discount untuk sekolah menengah di wilayah Indonesia bagian Timur.
            </p>
         </div>
         <button className="text-[10px] font-black text-amber-900 border border-amber-900 px-4 py-2 rounded hover:bg-amber-900 hover:text-white transition-all uppercase">
            Start Campaign
         </button>
      </div>
    </div>
  )
}
