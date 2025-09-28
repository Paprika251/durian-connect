import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchOwnerContact } from '../services/api.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [role, setRole] = useState('owner');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [feedback, setFeedback] = useState('');
  const [ownerContact, setOwnerContact] = useState(null);
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadContact = async () => {
      try {
        const response = await fetchOwnerContact();
        if (!isMounted) return;
        setOwnerContact(response?.owner || null);
        setContactError('');
      } catch (err) {
        if (!isMounted) return;
        setContactError(err.message || 'ไม่สามารถดึงข้อมูลการติดต่อของเจ้าของสวนได้');
      }
    };

    loadContact();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback('');

    try {
      const user = await login({ ...formData, role });
      setFeedback('เข้าสู่ระบบสำเร็จ');
      const target = user.role === 'owner' ? '/owner/dashboard' : '/broker/dashboard';
      navigate(target, { replace: true });
    } catch (err) {
      setFeedback(err.message || 'ไม่สามารถเข้าสู่ระบบได้');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-lime-100 to-emerald-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-lime-200 p-10 space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-emerald-900">ระบบจัดการสวนทุเรียน</h1>
          <p className="text-emerald-700">เข้าสู่ระบบเพื่อบริหารจัดการสวนและทีมผู้รับเหมา</p>
        </header>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={`h-12 rounded-xl border transition-all ${
              role === 'owner'
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                : 'bg-white border-emerald-200 text-emerald-700 hover:border-emerald-400'
            }`}
            onClick={() => setRole('owner')}
          >
            เจ้าของสวน
          </button>
          <button
            type="button"
            className={`h-12 rounded-xl border transition-all ${
              role === 'broker'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                : 'bg-white border-amber-200 text-amber-700 hover:border-amber-400'
            }`}
            onClick={() => setRole('broker')}
          >
            ผู้รับเหมา
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="font-medium text-emerald-900">
              อีเมล
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="font-medium text-emerald-900">
              รหัสผ่าน
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="รหัสผ่าน"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-700 transition-colors disabled:opacity-70"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {(feedback || error) && (
          <div className="text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {feedback || error}
          </div>
        )}

        <div className="text-center text-sm text-emerald-800 space-y-2">
          <div>
            <p>ผู้รับเหมาใหม่สามารถลงทะเบียนเพื่อใช้งานระบบ</p>
            <Link to="/register-broker" className="font-semibold text-emerald-700 underline-offset-4 hover:underline">
              ลงทะเบียนผู้รับเหมาใหม่
            </Link>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-left">
            <p className="font-semibold text-emerald-900">ข้อมูลการติดต่อเจ้าของสวน</p>
            {ownerContact ? (
              <ul className="mt-2 space-y-1 text-emerald-700">
                <li>ชื่อ: {ownerContact.name}</li>
                {ownerContact.phone && <li>เบอร์โทร: {ownerContact.phone}</li>}
                {ownerContact.address && <li>ที่อยู่: {ownerContact.address}</li>}
                {ownerContact.email && <li>อีเมล: {ownerContact.email}</li>}
              </ul>
            ) : contactError ? (
              <p className="mt-2 text-red-600">{contactError}</p>
            ) : (
              <p className="mt-2 text-emerald-600">กำลังโหลดข้อมูลการติดต่อ...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
