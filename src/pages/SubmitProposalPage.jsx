import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import BackButton from '../components/BackButton.jsx';
import { createProposal, fetchHarvestSummary, fetchProposals } from '../services/api.js';

const initialState = {
  contactDeadline: '',
  quantity: '',
  price: '',
  paymentMethod: 'cash',
  note: '',
};

const SubmitProposalPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const [harvestInfo, setHarvestInfo] = useState(null);
  const [harvestLoading, setHarvestLoading] = useState(false);
  const [harvestError, setHarvestError] = useState('');

  const loadHistory = useCallback(async () => {
    if (!user?.id) {
      setHistory([]);
      return;
    }
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const response = await fetchProposals({ brokerId: user.id });
      setHistory(Array.isArray(response?.proposals) ? response.proposals : []);
    } catch (err) {
      setHistoryError(err.message || 'ไม่สามารถโหลดประวัติข้อเสนอได้');
    } finally {
      setHistoryLoading(false);
    }
  }, [user?.id]);

  const loadHarvest = useCallback(async () => {
    setHarvestLoading(true);
    setHarvestError('');
    try {
      const response = await fetchHarvestSummary();
      setHarvestInfo(response || null);
    } catch (err) {
      setHarvestError(err.message || 'ไม่สามารถโหลดข้อมูลผลผลิตได้');
    } finally {
      setHarvestLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    loadHarvest();
  }, [loadHarvest]);

  if (!user) {
    return null;
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
      await createProposal({
        brokerId: user.id,
        contactDeadline: formData.contactDeadline,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        paymentMethod: formData.paymentMethod,
        note: formData.note,
      });
      setStatus('ส่งข้อเสนอเรียบร้อยแล้ว รอการพิจารณาจากเจ้าของสวน');
      setFormData(initialState);
      await loadHistory();
    } catch (err) {
      setStatus(err.message || 'ไม่สามารถส่งข้อเสนอได้');
    } finally {
      setLoading(false);
    }
  };

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => {
      const timeA = new Date(a?.createdAt || 0).getTime();
      const timeB = new Date(b?.createdAt || 0).getTime();
      return timeB - timeA;
    });
  }, [history]);

  const harvestSummary = harvestInfo?.summary || null;
  const totalHarvest = useMemo(() => {
    if (!harvestSummary) return 0;
    return Object.values(harvestSummary).reduce((acc, value) => acc + Number(value || 0), 0);
  }, [harvestSummary]);

  const formatDate = (value, options = { dateStyle: 'medium' }) => {
    if (!value) return '-';
    try {
      return new Date(value).toLocaleString('th-TH', options);
    } catch (err) {
      return value;
    }
  };

  const formatNumber = (value) => {
    const numeric = Number(value || 0);
    return Number.isFinite(numeric) ? numeric.toLocaleString('th-TH') : value;
  };

  const renderStatusLabel = (value) => {
    switch (value) {
      case 'accepted':
        return 'เจ้าของสวนอนุมัติ';
      case 'rejected':
        return 'ถูกปฏิเสธ';
      case 'pending':
      default:
        return 'รอการพิจารณา';
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white border border-emerald-100 rounded-3xl shadow-lg p-8 space-y-6">
          <BackButton fallback="/broker/dashboard" />
          <header className="space-y-2">
            <h1 className="text-2xl font-bold text-emerald-900">ยื่นข้อเสนอซื้อทุเรียนจากสวน</h1>
            <p className="text-emerald-700">
              โปรดระบุรายละเอียดที่ชัดเจนเพื่อให้เจ้าของสวนพิจารณาและตอบรับอย่างรวดเร็ว
            </p>
          </header>

          <section className="bg-emerald-50/60 border border-emerald-100 rounded-2xl px-5 py-4 space-y-3">
            <h2 className="text-lg font-semibold text-emerald-900">ปริมาณทุเรียนพร้อมจำหน่ายในสวน</h2>
            {harvestLoading ? (
              <p className="text-emerald-700">กำลังโหลดข้อมูล...</p>
            ) : harvestError ? (
              <p className="text-red-600">{harvestError}</p>
            ) : harvestSummary ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white border border-emerald-100 px-4 py-3">
                  <p className="text-sm text-emerald-600">รวมทั้งหมด</p>
                  <p className="text-2xl font-semibold text-emerald-900">{formatNumber(totalHarvest)} ลูก</p>
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'A', label: 'เกรด A' },
                    { key: 'B', label: 'เกรด B' },
                    { key: 'C', label: 'เกรด C' },
                    { key: 'reject', label: 'ตกเกรด' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-xl bg-white border border-emerald-100 px-4 py-2">
                      <span className="text-emerald-800">{item.label}</span>
                      <span className="font-semibold text-emerald-900">
                        {formatNumber(harvestSummary[item.key] || 0)} ลูก
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-emerald-700">ยังไม่มีข้อมูลผลผลิตในระบบ</p>
            )}
          </section>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="วันครบกำหนดติดต่อกลับ"
                name="contactDeadline"
                type="date"
                value={formData.contactDeadline}
                onChange={handleChange}
                required
              />
              <InputField
                label="ปริมาณที่ต้องการ (กิโลกรัม)"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="ราคาที่เสนอ (บาทต่อกิโลกรัม)"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />

              <div className="space-y-2">
                <label className="font-semibold text-emerald-900">วิธีการจ่ายเงิน</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="cash">เงินสด</option>
                  <option value="transfer">โอนเงิน</option>
                  <option value="installment">ผ่อนชำระ</option>
                  <option value="other">อื่น ๆ</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="note" className="font-semibold text-emerald-900">
                หมายเหตุ / รายละเอียดเพิ่มเติม
              </label>
              <textarea
                id="note"
                name="note"
                rows="4"
                value={formData.note}
                onChange={handleChange}
                className="w-full rounded-xl border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="ระบุรายละเอียดเพิ่มเติม เช่น เกรดที่ต้องการ กำหนดการขนส่ง"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="h-11 px-6 rounded-xl bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition-colors disabled:opacity-70"
              >
                {loading ? 'กำลังส่ง...' : 'ส่งข้อเสนอซื้อ'}
              </button>
            </div>
          </form>

          {status && (
            <div className="text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
              {status}
            </div>
          )}

          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h2 className="text-xl font-semibold text-emerald-900">ประวัติข้อเสนอของคุณ</h2>
              <span className="text-sm text-emerald-700">
                {historyLoading ? 'กำลังโหลด...' : `ทั้งหมด ${formatNumber(sortedHistory.length)} รายการ`}
              </span>
            </div>

            {historyError && <p className="text-red-600">{historyError}</p>}

            {historyLoading ? (
              <p className="text-emerald-700">กำลังโหลดข้อมูล...</p>
            ) : sortedHistory.length === 0 ? (
              <p className="text-emerald-700">ยังไม่มีการยื่นข้อเสนอ</p>
            ) : (
              <div className="space-y-3">
                {sortedHistory.map((item) => (
                  <article key={item.id} className="border border-emerald-100 rounded-2xl px-5 py-4 bg-emerald-50/60 space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-800">
                      <span className="font-semibold">ส่งเมื่อ: {formatDate(item.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      <span className="rounded-full bg-white border border-emerald-200 px-3 py-1">
                        {renderStatusLabel(item.status)}
                      </span>
                      <span>ติดต่อตอบกลับภายใน: {formatDate(item.contactDeadline)}</span>
                    </div>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-emerald-900">
                      <div>
                        <dt className="text-sm text-emerald-600">ปริมาณที่เสนอ</dt>
                        <dd className="font-semibold">{formatNumber(item.quantity)} กิโลกรัม</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-emerald-600">ราคาเสนอ</dt>
                        <dd className="font-semibold">{formatNumber(item.price)} บาท/กิโลกรัม</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-emerald-600">วิธีการจ่ายเงิน</dt>
                        <dd className="font-semibold">{item.paymentMethod || '-'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-emerald-600">หมายเหตุ</dt>
                        <dd className="font-semibold">{item.note || '-'}</dd>
                      </div>
                    </dl>
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

const InputField = ({ label, name, type = 'text', value, onChange, required, min }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="font-semibold text-emerald-900">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
    />
  </div>
);

export default SubmitProposalPage;
