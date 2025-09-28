import { useEffect, useMemo, useState } from 'react';
import { updateUserProfile } from '../services/api.js';

const defaultStatus = { type: '', message: '' };

const ProfileEditor = ({ user, onUpdated, className = '' }) => {
  const [formData, setFormData] = useState({ phone: '', email: '', address: '', password: '' });
  const [status, setStatus] = useState(defaultStatus);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFormData({
      phone: user.phone || '',
      email: user.email || '',
      address: user.address || '',
      password: '',
    });
    setStatus(defaultStatus);
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const dirtyPayload = useMemo(() => {
    if (!user) return {};
    const payload = {};
    if (formData.phone !== user.phone) {
      payload.phone = formData.phone.trim();
    }
    if (formData.email !== user.email) {
      payload.email = formData.email.trim();
    }
    if (formData.address !== user.address) {
      payload.address = formData.address.trim();
    }
    if (formData.password) {
      payload.password = formData.password;
    }
    return payload;
  }, [formData, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;

    if (Object.keys(dirtyPayload).length === 0) {
      setStatus({ type: 'info', message: 'ไม่มีการเปลี่ยนแปลงข้อมูล' });
      return;
    }

    setSubmitting(true);
    setStatus(defaultStatus);
    try {
      const response = await updateUserProfile(user.id, dirtyPayload);
      if (response?.user && typeof onUpdated === 'function') {
        onUpdated(response.user);
      }
      setStatus({ type: 'success', message: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (error) {
      setStatus({ type: 'error', message: error?.message || 'ไม่สามารถบันทึกข้อมูลได้' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-5 bg-white border border-emerald-100 rounded-3xl shadow p-6 ${className}`.trim()}
    >
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-emerald-900">แก้ไขข้อมูลโปรไฟล์</h2>
        <p className="text-sm text-emerald-700">ปรับปรุงข้อมูลการติดต่อและรหัสผ่านของคุณได้ที่นี่</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          label="เบอร์โทร"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="เช่น 099-000-0000"
          required
        />
        <InputField
          label="อีเมล"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-emerald-800" htmlFor="address">
          ที่อยู่
        </label>
        <textarea
          id="address"
          name="address"
          className="mt-1 w-full rounded-2xl border border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 p-3 min-h-[100px]"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          label="รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="ปล่อยว่างหากไม่ต้องการเปลี่ยน"
        />
        <div className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <p className="font-medium">คำแนะนำ</p>
          <p className="mt-1">หากไม่ต้องการเปลี่ยนรหัสผ่าน ให้เว้นช่องรหัสผ่านว่างไว้</p>
        </div>
      </div>

      {status.message && (
        <p
          className={
            status.type === 'success'
              ? 'text-emerald-600'
              : status.type === 'error'
                ? 'text-red-600'
                : 'text-amber-600'
          }
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-emerald-600 text-white font-semibold shadow transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {submitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
      </button>
    </form>
  );
};

const InputField = ({ label, name, type = 'text', value, onChange, placeholder, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-emerald-800" htmlFor={name}>
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="mt-1 w-full rounded-2xl border border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 p-3"
    />
  </div>
);

export default ProfileEditor;
