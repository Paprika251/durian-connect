import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BackButton from '../components/BackButton.jsx';
import { createFruitRecord, fetchHarvestSummary } from '../services/api.js';

const RecordFruitPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    grade: 'A',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const loadHistory = async () => {
    if (!user?.id) {
      setHistory([]);
      return;
    }
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const response = await fetchHarvestSummary();
      const records = Array.isArray(response?.records) ? response.records : [];
      const ownRecords = records.filter((item) => item.brokerId === user.id);
      setHistory(ownRecords);
    } catch (err) {
      setHistoryError(err.message || 'ไม่สามารถโหลดประวัติผลผลิตได้');
    } finally {
      setHistoryLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (user.status !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
        <div className="max-w-xl text-center bg-white border border-emerald-100 rounded-3xl shadow p-8 space-y-3">
          <h2 className="text-2xl font-semibold text-emerald-900">บัญชีของคุณยังรอการอนุมัติ</h2>
          <p className="text-emerald-700">
            กรุณารอให้เจ้าของสวนอนุมัติข้อเสนอ ก่อนที่จะสามารถบันทึกผลผลิตได้
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
      const response = await createFruitRecord({
        brokerId: user.id,
        amount: Number(formData.amount),
        grade: formData.grade,
      });
      setStatus('บันทึกจำนวนผลผลิตเรียบร้อย');
      setFormData({ amount: '', grade: 'A' });
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

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [history]);

  const formatDateTime = (value) => {
    if (!value) return '-';
    try {
      return new Date(value).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' });
    } catch (err) {
      return value;
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks-exhaustive-deps
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white border border-emerald-100 rounded-3xl shadow-lg p-8 space-y-6">
          <BackButton fallback="/broker/dashboard" />
          <header className="space-y-2">
            <h1 className="text-2xl font-bold text-emerald-900">บันทึกจำนวนผลทุเรียนที่เก็บเกี่ยวได้</h1>
            <p className="text-emerald-700">ระบุจำนวนผลผลิตแยกตามเกรดเพื่อให้เจ้าของสวนวางแผนการขาย</p>
          </header>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="amount" className="font-semibold text-emerald-900">
                  จำนวนผลผลิต (ลูก)
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-emerald-900">คุณภาพทุเรียน</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="A">เกรด A</option>
                  <option value="B">เกรด B</option>
                  <option value="C">เกรด C</option>
                  <option value="reject">ตกเกรด</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="h-11 px-6 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition-colors disabled:opacity-70"
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึกผลผลิต'}
              </button>
            </div>
          </form>

          {status && (
            <div className="text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
              {status}
            </div>
          )}

          <section className="space-y-4">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h2 className="text-xl font-semibold text-emerald-900">ประวัติการบันทึกผลผลิตของคุณ</h2>
              <span className="text-sm text-emerald-700">
                {historyLoading ? 'กำลังโหลดประวัติ...' : `ทั้งหมด ${sortedHistory.length} รายการ`}
              </span>
            </header>

            {historyError && <p className="text-red-600 text-sm">{historyError}</p>}

            {historyLoading ? (
              <p className="text-emerald-700">กำลังโหลดข้อมูล...</p>
            ) : sortedHistory.length === 0 ? (
              <p className="text-emerald-700">ยังไม่มีการบันทึกผลผลิต</p>
            ) : (
              <div className="space-y-3">
                {sortedHistory.map((item) => (
                  <article
                    key={item.id}
                    className="border border-emerald-100 rounded-2xl px-5 py-4 bg-emerald-50/60"
                  >
                    <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-800">
                      <span className="font-semibold">{formatDateTime(item.createdAt)}</span>
                      <span className="rounded-full bg-white border border-emerald-200 px-3 py-1">
                        เกรด {item.grade?.toUpperCase?.() || item.grade || '-'}
                      </span>
                    </div>
                    <p className="mt-3 text-emerald-900 font-semibold text-lg">
                      {Number(item.amount || 0).toLocaleString('th-TH')} ลูก
                    </p>
                    {item.note && <p className="mt-1 text-sm text-emerald-700">{item.note}</p>}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default RecordFruitPage;
