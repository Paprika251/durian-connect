import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BackButton from '../components/BackButton.jsx';
import { createFinanceRecord, fetchFinanceRecords } from '../services/api.js';

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
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [search, setSearch] = useState('');

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

  const loadHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const response = await fetchFinanceRecords({ brokerId: user.id });
      setHistory(response.finances || []);
    } catch (err) {
      setStatus((prev) => prev || err.message || 'ไม่สามารถโหลดประวัติได้');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setLoading(true);

    try {
      const response = await createFinanceRecord({
        brokerId: user.id,
        paymentMethod: formData.paymentMethod,
        type: formData.type,
        invoiceRef: formData.invoiceRef,
        amount: Number(formData.amount),
        notes: formData.notes,
      });
      setStatus('ส่งรายการให้เจ้าของสวนตรวจสอบแล้ว');
      setFormData({ paymentMethod: 'cash', type: 'income', invoiceRef: '', amount: '', notes: '' });
      if (response?.record) {
        setHistory((prev) => [response.record, ...prev]);
      } else {
        loadHistory();
      }
    } catch (err) {
      setStatus(err.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredHistory = useMemo(() => {
    if (!normalizedSearch) return history;
    return history.filter((item) => {
      const haystack = [
        item.paymentMethod,
        item.type,
        item.invoiceRef,
        item.notes,
        item.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [history, normalizedSearch]);

  const formatDateTime = (value) => {
    if (!value) return '-';
    try {
      return new Date(value).toLocaleString('th-TH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch (err) {
      return value;
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white border border-emerald-100 rounded-3xl shadow-lg p-8 space-y-6">
          <BackButton fallback="/broker/dashboard" />
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

          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-semibold text-emerald-900">ประวัติรายการรายรับ/รายจ่าย</h2>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full md:w-64 h-11 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="ค้นหาจากหมายเหตุ ประเภท หรือเลขที่ใบเสร็จ"
              />
            </div>

            <div className="space-y-3">
              {historyLoading ? (
                <p className="text-emerald-700">กำลังโหลดประวัติ...</p>
              ) : filteredHistory.length === 0 ? (
                <p className="text-emerald-700">ยังไม่มีการส่งรายการรายรับ/รายจ่าย</p>
              ) : (
                filteredHistory.map((item) => (
                  <article
                    key={item.id}
                    className="border border-emerald-100 rounded-2xl px-5 py-4 bg-emerald-50/60 space-y-2"
                  >
                    <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-800">
                      <span className="font-semibold">
                        {item.type === 'income' ? 'รายรับ' : 'รายจ่าย'} • {item.paymentMethod === 'cash'
                          ? 'เงินสด'
                          : item.paymentMethod === 'transfer'
                          ? 'โอนเงิน'
                          : item.paymentMethod === 'credit'
                          ? 'บัตรเครดิต'
                          : 'อื่น ๆ'}
                      </span>
                      {item.invoiceRef && (
                        <span className="rounded-full bg-white border border-emerald-200 px-3 py-1">{item.invoiceRef}</span>
                      )}
                      <span
                        className={`rounded-full px-3 py-1 border ${
                          item.status === 'approved'
                            ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                            : item.status === 'rejected'
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        }`}
                      >
                        {item.status === 'approved'
                          ? 'เจ้าของสวนอนุมัติแล้ว'
                          : item.status === 'rejected'
                          ? 'รายการถูกปฏิเสธ'
                          : 'รอการตรวจสอบ'}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-emerald-900">
                      <p className="font-semibold">จำนวนเงิน {Number(item.amount || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</p>
                      <p className="text-sm text-emerald-700">บันทึกเมื่อ {formatDateTime(item.createdAt)}</p>
                    </div>
                    <p className="text-emerald-900">{item.notes}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RecordFinancePage;
