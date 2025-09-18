import { useEffect, useState } from 'react';
import { fetchFinanceRecords, updateFinanceStatus } from '../services/api.js';

const statusLabels = {
  pending: 'รออนุมัติ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ปฏิเสธ',
};

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-700',
};

const typeLabels = {
  income: 'รายรับ',
  expense: 'รายจ่าย',
};

const OwnerFinancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchFinanceRecords();
      setRecords(response.finances || []);
      setTotals(response.totals || { income: 0, expense: 0, balance: 0 });
    } catch (err) {
      setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setMessage('');
    try {
      await updateFinanceStatus(id, status);
      setMessage(status === 'approved' ? 'อนุมัติรายการเรียบร้อยแล้ว' : 'ปฏิเสธรายการเรียบร้อยแล้ว');
      await loadData();
    } catch (err) {
      setMessage(err.message || 'ไม่สามารถอัปเดตสถานะได้');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-emerald-900">รายรับ / รายจ่ายของสวน</h1>
          <p className="text-emerald-700">ตรวจสอบและยืนยันรายการจากผู้รับเหมา พร้อมดูสรุปภาพรวม</p>
        </header>

        {loading ? (
          <div className="bg-white border border-emerald-100 rounded-3xl shadow p-6 text-center text-emerald-700">กำลังโหลดข้อมูล...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl shadow p-6 text-center">{error}</div>
        ) : (
          <div className="space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard title="รายรับที่อนุมัติแล้ว" amount={totals.income} tone="income" />
              <SummaryCard title="รายจ่ายที่อนุมัติแล้ว" amount={totals.expense} tone="expense" />
              <SummaryCard title="คงเหลือสุทธิ" amount={totals.balance} tone="balance" />
            </section>

            {message && (
              <div className="bg-emerald-100/70 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-3 text-sm">
                {message}
              </div>
            )}

            <section className="bg-white border border-emerald-100 rounded-3xl shadow overflow-hidden">
              <table className="min-w-full divide-y divide-emerald-100">
                <thead className="bg-emerald-100/70">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">วันที่ส่ง</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">ผู้ส่ง</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">ประเภท</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">จำนวนเงิน</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">วิธีการชำระ</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">สถานะ</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-emerald-50/70 text-sm text-emerald-800">
                      <td className="px-4 py-3">{new Date(record.createdAt).toLocaleString('th-TH')}</td>
                      <td className="px-4 py-3">{record.broker?.name || '-'}</td>
                      <td className="px-4 py-3">{typeLabels[record.type] || record.type}</td>
                      <td className="px-4 py-3 font-semibold">{Number(record.amount).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</td>
                      <td className="px-4 py-3">{mapPaymentMethod(record.paymentMethod)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[record.status] || statusColors.pending}`}>
                          {statusLabels[record.status] || statusLabels.pending}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(record.id, 'approved')}
                            disabled={record.status === 'approved'}
                            className="h-9 px-4 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 disabled:opacity-60"
                          >
                            อนุมัติ
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(record.id, 'rejected')}
                            disabled={record.status === 'rejected'}
                            className="h-9 px-4 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 disabled:opacity-60"
                          >
                            ปฏิเสธ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, amount, tone }) => {
  const toneStyles = {
    income: 'bg-emerald-100 text-emerald-800',
    expense: 'bg-red-100 text-red-700',
    balance: 'bg-lime-100 text-lime-700',
  };

  return (
    <div className={`rounded-3xl border border-emerald-100 shadow p-5 space-y-2 ${toneStyles[tone]}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-2xl font-bold">
        {Number(amount).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
      </p>
    </div>
  );
};

const mapPaymentMethod = (value) => {
  switch (value) {
    case 'cash':
      return 'เงินสด';
    case 'transfer':
      return 'โอนเงิน';
    case 'credit':
      return 'บัตรเครดิต';
    case 'other':
    default:
      return 'อื่น ๆ';
  }
};

export default OwnerFinancePage;
