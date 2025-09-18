import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { createActivityLog } from '../services/api.js';

const RecordActivityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    treeId: '',
    scopeType: 'single-tree',
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
            กรุณารอให้เจ้าของสวนอนุมัติข้อเสนอ ก่อนที่จะสามารถบันทึกกิจกรรมและใช้เครื่องมืออื่น ๆ ในระบบได้
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
      await createActivityLog({
        brokerId: user.id,
        treeId: formData.treeId,
        scopeType: formData.scopeType,
        notes: formData.notes,
      });
      setStatus('บันทึกกิจกรรมเรียบร้อย');
      setFormData({ treeId: '', scopeType: 'single-tree', notes: '' });
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
            <h1 className="text-2xl font-bold text-emerald-900">บันทึกกิจกรรมที่ทำในสวน</h1>
            <p className="text-emerald-700">ระบุรายละเอียดกิจกรรมเพื่อให้เจ้าของสวนติดตามความคืบหน้าได้</p>
          </header>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="หมายเลขต้นทุเรียน (Tree ID)"
                name="treeId"
                value={formData.treeId}
                onChange={handleChange}
                placeholder="เช่น T-101"
                required
              />
              <div className="space-y-2">
                <label className="font-semibold text-emerald-900">ประเภทกิจกรรม</label>
                <select
                  name="scopeType"
                  value={formData.scopeType}
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="single-tree">รายต้น</option>
                  <option value="whole-garden">ภาพรวม</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="font-semibold text-emerald-900">
                รายละเอียดกิจกรรม
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="5"
                value={formData.notes}
                onChange={handleChange}
                className="w-full rounded-xl border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="ตัวอย่าง: ตัดแต่งกิ่ง, พ่นฮอร์โมน, ตรวจเช็คแมลง"
                required
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
                {loading ? 'กำลังบันทึก...' : 'บันทึกกิจกรรม'}
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

const InputField = ({ label, name, value, onChange, placeholder, required }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="font-semibold text-emerald-900">
      {label}
    </label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
    />
  </div>
);

export default RecordActivityPage;
