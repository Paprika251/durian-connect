import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BackButton from '../components/BackButton.jsx';
import { createProposal } from '../services/api.js';

const initialState = {
  contactDeadline: '',
  quantity: '',
  price: '',
  paymentMethod: 'cash',
  note: '',
};

const SubmitProposalPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

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
      navigate('/broker/dashboard');
    } catch (err) {
      setStatus(err.message || 'ไม่สามารถส่งข้อเสนอได้');
    } finally {
      setLoading(false);
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
              <BackButton fallback="/broker/dashboard" />
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
