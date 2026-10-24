import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function Home() {
  const transactions = await prisma.transaction.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  
  const totalUsers = await prisma.user.count();
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const avgAmount = transactions.length > 0 ? totalAmount / transactions.length : 0;

  return (
    // ปรับให้เป็น flex-col บนมือถือ และ flex-row บนจอใหญ่
    <div className="flex flex-col md:flex-row h-screen bg-[#0B1120] text-white font-sans overflow-hidden">
      
      {/* --- Mobile Top Navigation (แสดงเฉพาะบนมือถือ) --- */}
      <div className="md:hidden bg-[#080D17] border-b border-slate-800/60 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg">
            PB
          </div>
          <p className="text-sm font-semibold text-slate-200">Pocket Admin</p>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="text-blue-400 font-medium text-sm">Dashboard</Link>
          <Link href="/users" className="text-slate-400 font-medium text-sm">Users</Link>
        </div>
      </div>

      {/* --- Desktop Sidebar (ซ่อนบนมือถือ, แสดงเฉพาะบนจอใหญ่) --- */}
      <aside className="hidden md:flex w-64 bg-[#080D17] border-r border-slate-800/60 flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg">
            PB
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">Pocket Admin</p>
            <p className="text-xs text-slate-500">Workspace</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-600 mb-4 px-2 tracking-wider">MAIN MENU</p>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 bg-blue-600 text-white rounded-lg shadow-md shadow-blue-900/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link href="/users" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <span className="font-medium text-sm">Users</span>
          </Link>
        </nav>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* ปรับ Padding p-4 สำหรับมือถือ และ p-8 สำหรับจอใหญ่ */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-100">Dashboard Overview</h1>
                <p className="text-xs md:text-sm text-slate-400 mt-1">สรุปข้อมูลการใช้จ่ายและสลิปล่าสุด</p>
              </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="p-5 md:p-6 bg-[#131B2C] rounded-xl border border-slate-800/80 shadow-lg">
                <h2 className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">ยอดใช้จ่ายรวมทั้งหมด</h2>
                <p className="text-xl md:text-2xl font-bold text-white">฿{totalAmount.toLocaleString()}</p>
              </div>
              <div className="p-5 md:p-6 bg-[#131B2C] rounded-xl border border-slate-800/80 shadow-lg">
                <h2 className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">จำนวนสลิปทั้งหมด</h2>
                <p className="text-xl md:text-2xl font-bold text-white">{transactions.length} <span className="text-sm font-normal text-slate-500">รายการ</span></p>
              </div>
              <div className="p-5 md:p-6 bg-[#131B2C] rounded-xl border border-slate-800/80 shadow-lg">
                <h2 className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">ผู้ใช้งานทั้งหมด</h2>
                <p className="text-xl md:text-2xl font-bold text-white">{totalUsers} <span className="text-sm font-normal text-slate-500">คน</span></p>
              </div>
              <div className="p-5 md:p-6 bg-[#131B2C] rounded-xl border border-slate-800/80 shadow-lg">
                <h2 className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">ยอดเฉลี่ยต่อรายการ</h2>
                <p className="text-xl md:text-2xl font-bold text-white">฿{avgAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#131B2C] rounded-xl shadow-lg border border-slate-800/80 overflow-hidden">
              <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-800/80 flex justify-between items-center">
                <h3 className="font-semibold text-slate-200">Recent Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[600px]">
                  <thead>
                    <tr className="bg-[#0B1120]/50 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-4 md:px-6 py-4 font-medium">ผู้ใช้งาน</th>
                      <th className="px-4 md:px-6 py-4 font-medium">ชื่อรายการ</th>
                      <th className="px-4 md:px-6 py-4 font-medium">ยอดเงิน</th>
                      <th className="px-4 md:px-6 py-4 font-medium">วันที่ส่ง</th>
                      <th className="px-4 md:px-6 py-4 font-medium text-right">หลักฐาน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#1A2438] transition-colors group">
                        <td className="px-4 md:px-6 py-4 flex items-center gap-3">
                          {tx.user?.pictureUrl ? (
                            <img src={tx.user.pictureUrl} alt="profile" className="w-8 h-8 rounded-full ring-2 ring-slate-800 object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-700 ring-2 ring-slate-800 flex items-center justify-center text-xs text-slate-300">
                              {tx.user?.displayName?.charAt(0) || '?'}
                            </div>
                          )}
                          <span className="font-medium text-slate-200">{tx.user?.displayName || 'ไม่ทราบชื่อ'}</span>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-slate-400">{tx.note || '-'}</td>
                        <td className="px-4 md:px-6 py-4 font-medium text-slate-200">฿{tx.amount.toLocaleString()}</td>
                        <td className="px-4 md:px-6 py-4 text-slate-400">
                          {new Date(tx.createdAt).toLocaleDateString('th-TH', { 
                            year: '2-digit', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-right">
                          <a href={tx.slipUrl} target="_blank" rel="noreferrer" className="inline-flex px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-md transition-colors text-xs font-medium">
                            ดูสลิป
                          </a>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          ยังไม่มีข้อมูลสลิปในระบบ
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        </div>
      </main>

    </div>
  );
}