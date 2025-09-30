import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchProposalSettings, updateProposalSettings } from '../services/api.js';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [deadlineInput, setDeadlineInput] = useState('');
  const [currentDeadline, setCurrentDeadline] = useState(null);
  const [deadlineUpdatedAt, setDeadlineUpdatedAt] = useState(null);
  const [deadlineFetching, setDeadlineFetching] = useState(false);
  const [deadlineSaving, setDeadlineSaving] = useState(false);
  const [deadlineMessage, setDeadlineMessage] = useState({ type: '', text: '' });

  if (!user) {
    return null;
  }

  const toDateInputValue = useCallback((value) => {
    if (!value) return '';
    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return '';
      }
      return date.toISOString().split('T')[0];
    } catch (_error) {
      return '';
    }
  }, []);

  const formatDateTime = useCallback((value, options = { dateStyle: 'medium', timeStyle: 'short' }) => {
    if (!value) return '-';
    try {
      return new Date(value).toLocaleString('th-TH', options);
    } catch (_error) {
      return value;
    }
  }, []);

  const loadDeadline = useCallback(async () => {
    setDeadlineFetching(true);
    try {
      const response = await fetchProposalSettings();
      const deadline = response?.submissionDeadline || null;
      setCurrentDeadline(deadline);
      setDeadlineUpdatedAt(response?.updatedAt || null);
      setDeadlineInput(toDateInputValue(deadline));
    } catch (error) {
      setDeadlineMessage({ type: 'error', text: error?.message || 'ไม่สามารถโหลดกำหนดการได้' });
    } finally {
      setDeadlineFetching(false);
    }
  }, [toDateInputValue]);

  useEffect(() => {
    loadDeadline();
  }, [loadDeadline]);

  const handleSaveDeadline = async (event) => {
    event.preventDefault();
    setDeadlineMessage({ type: '', text: '' });
    setDeadlineSaving(true);
    const isClearing = !deadlineInput;
    try {
      const response = await updateProposalSettings({ submissionDeadline: deadlineInput || null });
      const deadline = response?.submissionDeadline || null;
      setCurrentDeadline(deadline);
      setDeadlineUpdatedAt(response?.updatedAt || null);
      setDeadlineInput(toDateInputValue(deadline));
      setDeadlineMessage({
        type: 'success',
        text: isClearing ? 'ลบกำหนดรับข้อเสนอเรียบร้อยแล้ว' : 'บันทึกกำหนดรับข้อเสนอเรียบร้อยแล้ว',
      });
    } catch (error) {
      setDeadlineMessage({ type: 'error', text: error?.message || 'ไม่สามารถบันทึกกำหนดได้' });
    } finally {
      setDeadlineSaving(false);
    }
  };

  const deadlineDate = currentDeadline ? new Date(currentDeadline) : null;
  const deadlineValid = deadlineDate && !Number.isNaN(deadlineDate.getTime());
  const deadlineExpired = deadlineValid ? Date.now() > deadlineDate.getTime() : false;

  const menuItems = [
    { title: 'สถานะต้นทุเรียนในสวน', description: 'ตรวจสอบสุขภาพและสถานะของต้นทุเรียนแต่ละต้น', to: '/owner/tree-status' },
    { title: 'สรุปผลการเก็บเกี่ยว', description: 'ดูจำนวนทุเรียนที่เก็บได้แยกตามเกรด', to: '/owner/harvest' },
    { title: 'ข้อเสนอจากผู้รับเหมา', description: 'ตรวจสอบและตอบรับข้อเสนอการซื้อ', to: '/owner/proposals' },
    { title: 'รายการรายรับ/รายจ่าย', description: 'อนุมัติรายการและดูสรุปภาพรวมทางการเงิน', to: '/owner/finances' },
    { title: 'ปัญหาที่ถูกรายงาน', description: 'ตอบกลับและติดตามสถานการณ์ปัญหาในสวน', to: '/owner/problems' },
    { title: 'กิจกรรมที่บันทึก', description: 'ดูบันทึกกิจกรรมที่ผู้รับเหมาทำในสวน', to: '/owner/activities' },
  ];

  const deadlineStatusText = deadlineFetching
    ? 'กำลังตรวจสอบกำหนดปัจจุบัน...'
    : deadlineValid
      ? `${deadlineExpired ? 'หมดเขตรับข้อเสนอเมื่อ' : 'เปิดรับข้อเสนอถึง'} ${formatDateTime(deadlineDate, {
          dateStyle: 'long',
        })}`
      : 'ยังไม่ได้กำหนดวันสิ้นสุดการรับข้อเสนอ';
  const deadlineStatusClass = deadlineExpired ? 'text-red-600' : 'text-emerald-700';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-emerald-100 rounded-3xl shadow p-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">แดชบอร์ดเจ้าของสวน</h1>
            <p className="text-emerald-700">ยินดีต้อนรับ คุณ{user.name ? ` ${user.name}` : ''}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/', { replace: true });
            }}
            className="self-start md:self-auto h-11 px-5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            ออกจากระบบ
          </button>
        </header>

        <section className="bg-white border border-emerald-100 rounded-3xl shadow p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-emerald-900">จัดการข้อมูลโปรไฟล์</h2>
            <p className="text-emerald-700">อัปเดตเบอร์โทร อีเมล ที่อยู่ หรือรหัสผ่านของคุณได้จากหน้าเฉพาะ</p>
          </div>
          <Link
            to="/owner/profile"
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700"
          >
            ไปยังหน้าแก้ไขโปรไฟล์
          </Link>
        </section>

        <section className="bg-white border border-emerald-100 rounded-3xl shadow p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-emerald-900">กำหนดวันสิ้นสุดการรับข้อเสนอ</h2>
            <p className="text-emerald-700">
              ตั้งวันสิ้นสุดเพื่อควบคุมรอบการยื่นข้อเสนอของผู้รับเหมา หากหมดเขตระบบจะปิดการยื่นข้อเสนออัตโนมัติ
            </p>
            <p className={`text-sm font-medium ${deadlineStatusClass}`}>{deadlineStatusText}</p>
            {deadlineUpdatedAt && (
              <p className="text-xs text-emerald-600">
                อัปเดตล่าสุด {formatDateTime(deadlineUpdatedAt, { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            )}
          </div>
          <form className="flex flex-col gap-4 md:flex-row md:items-end" onSubmit={handleSaveDeadline}>
            <label className="flex-1 text-sm text-emerald-800 flex flex-col gap-2">
              <span className="font-medium">วันที่สิ้นสุดการรับข้อเสนอ</span>
              <input
                type="date"
                value={deadlineInput}
                onChange={(event) => {
                  setDeadlineInput(event.target.value);
                  setDeadlineMessage({ type: '', text: '' });
                }}
                className="h-11 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={deadlineSaving}
                className="h-11 px-5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
              >
                {deadlineSaving ? 'กำลังบันทึก...' : 'บันทึกกำหนด'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeadlineInput('');
                  setDeadlineMessage({ type: '', text: '' });
                }}
                disabled={deadlineSaving}
                className="h-11 px-5 rounded-xl border border-emerald-200 text-emerald-700 font-semibold hover:border-emerald-300 disabled:opacity-60"
              >
                ล้างกำหนด
              </button>
            </div>
          </form>
          {deadlineMessage.text && (
            <p className={`text-sm ${deadlineMessage.type === 'error' ? 'text-red-600' : 'text-emerald-700'}`}>
              {deadlineMessage.text}
            </p>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block bg-white border border-emerald-100 hover:border-emerald-300 rounded-3xl shadow p-6 transition-colors"
            >
              <h2 className="text-xl font-semibold text-emerald-900">{item.title}</h2>
              <p className="mt-2 text-emerald-700">{item.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
};

export default OwnerDashboard;
