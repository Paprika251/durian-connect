import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import BackButton from '../components/BackButton.jsx';
import { createProposal, fetchProposalSettings, fetchProposals, fetchTreeStatus } from '../services/api.js';

const initialState = {
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

  const [treeStatus, setTreeStatus] = useState([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeError, setTreeError] = useState('');
  const [submissionDeadline, setSubmissionDeadline] = useState(null);
  const [deadlineUpdatedAt, setDeadlineUpdatedAt] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');

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
      if (Object.prototype.hasOwnProperty.call(response || {}, 'submissionDeadline')) {
        setSubmissionDeadline(response.submissionDeadline || null);
      }
    } catch (err) {
      setHistoryError(err.message || 'ไม่สามารถโหลดประวัติข้อเสนอได้');
    } finally {
      setHistoryLoading(false);
    }
  }, [user?.id]);

  const loadSettings = useCallback(async () => {
    setSettingsLoading(true);
    setSettingsError('');
    try {
      const response = await fetchProposalSettings();
      setSubmissionDeadline(response?.submissionDeadline || null);
      setDeadlineUpdatedAt(response?.updatedAt || null);
    } catch (err) {
      setSettingsError(err.message || 'ไม่สามารถโหลดกำหนดรับข้อเสนอได้');
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  const loadTrees = useCallback(async () => {
    setTreeLoading(true);
    setTreeError('');
    try {
      const response = await fetchTreeStatus();
      setTreeStatus(Array.isArray(response?.trees) ? response.trees : []);
    } catch (err) {
      setTreeError(err.message || 'ไม่สามารถโหลดข้อมูลต้นทุเรียนได้');
    } finally {
      setTreeLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    loadTrees();
  }, [loadTrees]);

  if (!user) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const parsedDeadline = submissionDeadline ? new Date(submissionDeadline) : null;
  const hasValidDeadline = parsedDeadline && !Number.isNaN(parsedDeadline.getTime());
  const deadlinePassed = hasValidDeadline ? Date.now() > parsedDeadline.getTime() : false;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    if (deadlinePassed) {
      setStatus('หมดเขตรับข้อเสนอแล้ว');
      return;
    }
    setLoading(true);

    try {
      const payload = {
        brokerId: user.id,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        paymentMethod: formData.paymentMethod,
        note: formData.note,
      };
      if (submissionDeadline) {
        payload.contactDeadline = submissionDeadline;
      }
      const response = await createProposal(payload);
      if (Object.prototype.hasOwnProperty.call(response || {}, 'submissionDeadline')) {
        setSubmissionDeadline(response.submissionDeadline || null);
      }
      setStatus('ส่งข้อเสนอเรียบร้อยแล้ว รอการพิจารณาจากเจ้าของสวน');
      setFormData(initialState);
      await loadHistory();
      await loadSettings();
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

  const totalTrees = treeStatus.length;
  const statusCounts = useMemo(() => {
    return treeStatus.reduce(
      (acc, item) => {
        const key = item?.status || 'other';
        acc[key] = (acc[key] || 0) + 1;
        acc.other = acc.other || 0;
        return acc;
      },
      {},
    );
  }, [treeStatus]);

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
            <h2 className="text-lg font-semibold text-emerald-900">ข้อมูลต้นทุเรียนในสวน</h2>
            {treeLoading ? (
              <p className="text-emerald-700">กำลังโหลดข้อมูล...</p>
            ) : treeError ? (
              <p className="text-red-600">{treeError}</p>
            ) : totalTrees > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white border border-emerald-100 px-4 py-3">
                  <p className="text-sm text-emerald-600">จำนวนต้นทั้งหมด</p>
                  <p className="text-2xl font-semibold text-emerald-900">{formatNumber(totalTrees)} ต้น</p>
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'normal', label: 'ปกติ' },
                    { key: 'flowering', label: 'ออกดอก' },
                    { key: 'fruiting', label: 'ออกผล' },
                    { key: 'issue', label: 'มีปัญหา' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-xl bg-white border border-emerald-100 px-4 py-2">
                      <span className="text-emerald-800">{item.label}</span>
                      <span className="font-semibold text-emerald-900">
                        {formatNumber(statusCounts[item.key] || 0)} ต้น
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-emerald-700">ยังไม่มีข้อมูลต้นทุเรียนในระบบ</p>
            )}
          </section>

          <section className="bg-amber-50/70 border border-amber-200 rounded-2xl px-5 py-4 space-y-2">
            <h2 className="text-lg font-semibold text-amber-800">กำหนดรับข้อเสนอจากเจ้าของสวน</h2>
            {settingsLoading ? (
              <p className="text-amber-700">กำลังโหลดข้อมูลกำหนดการ...</p>
            ) : settingsError ? (
              <p className="text-red-600">{settingsError}</p>
            ) : hasValidDeadline ? (
              <div className="space-y-1">
                <p className={`text-base font-semibold ${deadlinePassed ? 'text-red-600' : 'text-emerald-900'}`}>
                  {deadlinePassed ? 'หมดเขตรับข้อเสนอเมื่อ' : 'เปิดรับข้อเสนอถึง'}
                </p>
                <p className={`text-xl font-bold ${deadlinePassed ? 'text-red-600' : 'text-emerald-900'}`}>
                  {formatDate(parsedDeadline, { dateStyle: 'long', timeStyle: 'short' })}
                </p>
                <p className="text-sm text-emerald-700">
                  {deadlinePassed
                    ? 'กรุณารอให้เจ้าของสวนเปิดรอบการรับข้อเสนอใหม่'
                    : 'โปรดยื่นข้อเสนอภายในเวลาที่กำหนดเพื่อให้พิจารณาได้ทันเวลา'}
                </p>
              </div>
            ) : (
              <p className="text-emerald-700">เจ้าของสวนยังไม่กำหนดวันสิ้นสุดการรับข้อเสนอในขณะนี้</p>
            )}
            {deadlineUpdatedAt && (
              <p className="text-xs text-amber-700">
                อัปเดตล่าสุด {formatDate(deadlineUpdatedAt, { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            )}
          </section>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="ปริมาณที่ต้องการ (กิโลกรัม)"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
              <InputField
                label="ราคาที่เสนอ (บาทต่อกิโลกรัม)"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

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
                disabled={loading || deadlinePassed}
                className="h-11 px-6 rounded-xl bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition-colors disabled:opacity-70"
              >
                {loading ? 'กำลังส่ง...' : 'ส่งข้อเสนอซื้อ'}
              </button>
            </div>
            {deadlinePassed && (
              <p className="text-sm text-red-600">
                หมดเขตรับข้อเสนอแล้ว กรุณารอให้เจ้าของสวนกำหนดรอบใหม่
              </p>
            )}
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
                      <span>กำหนดรับข้อเสนอ: {formatDate(item.contactDeadline)}</span>
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
