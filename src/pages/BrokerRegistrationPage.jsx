import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const BrokerRegistrationPage = () => {
  const navigate = useNavigate();
  const { registerBroker, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      await registerBroker(formData);
      setMessage('ลงทะเบียนสำเร็จ! กรุณารอการตอบรับจากเจ้าของสวน');
      navigate('/broker/dashboard', { replace: true });
    } catch (err) {
      setMessage(err.message || 'ไม่สามารถลงทะเบียนได้');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-emerald-50 via-amber-50 to-emerald-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur rounded-3xl border border-emerald-200 shadow-lg p-10">
        <header className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold text-emerald-900">ลงทะเบียนผู้รับเหมาใหม่</h1>
          <p className="text-emerald-700">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อให้เจ้าของสวนพิจารณา</p>
        </header>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label htmlFor="name" className="font-semibold text-emerald-900">
              ชื่อ-นามสกุล
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="ชื่อ-นามสกุล"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="font-semibold text-emerald-900">
              เบอร์โทรศัพท์
            </label>
            <input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="08X-XXX-XXXX"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="font-semibold text-emerald-900">
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

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="address" className="font-semibold text-emerald-900">
              ที่อยู่
            </label>
            <textarea
              id="address"
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="บ้านเลขที่ หมู่ ตำบล อำเภอ จังหวัด"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="password" className="font-semibold text-emerald-900">
              รหัสผ่านสำหรับเข้าใช้งานระบบ
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="ตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="col-span-1 md:col-span-2 h-12 rounded-xl bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition-colors disabled:opacity-70"
          >
            {loading ? 'กำลังบันทึก...' : 'ลงทะเบียนผู้รับเหมา'}
          </button>
        </form>

        {message && (
          <div className="mt-6 text-center text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            {message}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-emerald-800">
          <p>กลับสู่หน้าล็อกอิน</p>
          <Link to="/" className="font-semibold text-emerald-700 underline-offset-4 hover:underline">
            ไปที่หน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrokerRegistrationPage;
