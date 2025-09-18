import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { createFinanceRecord } from '../services/api.js';

const RecordFinancePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    paymentMethod: 'cash',
    type: 'income',
    invoiceRef: '',
    amount: '',
    notes: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  if (user.status !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
        <div className="max-w-xl text-center bg-white border border-emerald-100 rounded-3xl shadow p-8 space-y-3">
          <h2 className="text-2xl font-semibold text-emerald-900">บัญชีของคุณยังรอการอนุมัติ</h2>
          <p className="text-emerald-700">
            กรุณารอให้เจ้าของสวนอนุมัติข้อเสนอ ก่อนที่จะสามารถบันทึกรายรับรายจ่ายได้
          </p>
          <button
            type="button"
            onClick={() => navigate('/broker/dashboard')}
            className="mt-4 h-11 px-6 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            กลับไปหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setLoading(true);

    try {
      await createFinanceRecord({
        brokerId: user.id,
        paymentMethod: formData.paymentMethod,
        type: formData.type,
        invoiceRef: formData.invoiceRef,
        amount: Number(formData.amount),
        notes: formData.notes,
      });
      setStatus('ส่งรายการให้เจ้าของสวนตรวจสอบแล้ว');
      setFormData({ paymentMethod: 'cash', type: 'income', invoiceRef: '', amount: '', notes: '' });
    } catch (err) {
      setStatus(err.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white border border-emerald-100 rounded-3xl shadow-lg p-8 space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl font-bold text-emerald-900">บันทึกรายรับ / รายจ่าย</h1>
            <p className="text-emerald-700">กรอกข้อมูลให้ครบถ้วนเพื่อให้เจ้าของสวนอนุมัติรายการเข้าระบบ</p>
          </header>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="font-semibold text-emerald-900">ประเภทรายการ</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="income">รายรับ</option>
                  <option value="expense">รายจ่าย</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-emerald-900">วิธีการจ่าย / รับเงิน</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="cash">เงินสด</option>
                  <option value="transfer">โอนเงิน</option>
                  <option value="credit">บัตรเครดิต</option>
                  <option value="other">อื่น ๆ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="invoiceRef" className="font-semibold text-emerald-900">
                  เลขอ้างอิงใบเสร็จ
                </label>
                <input
                  id="invoiceRef"
                  name="invoiceRef"
                  value={formData.invoiceRef}
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="เช่น INV-2025-001"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="font-semibold text-emerald-900">
                  จำนวนเงิน (บาท)
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="font-semibold text-emerald-900">
                หมายเหตุ
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="รายละเอียด เช่น ซื้อปุ๋ย, ค่าแรง, ขายผลผลิต"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/broker/dashboard')}
                className="h-11 px-5 rounded-xl border border-emerald-200 text-emerald-700 hover:border-emerald-400"
              >
                ย้อนกลับ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="h-11 px-6 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition-colors disabled:opacity-70"
              >
                {loading ? 'กำลังส่ง...' : 'ส่งรายการให้เจ้าของสวน'}
              </button>
            </div>
          </form>

          {status && (
            <div className="text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordFinancePage;
