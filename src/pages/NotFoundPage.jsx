import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton.jsx';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50 text-center px-4">
    <div className="max-w-md bg-white border border-emerald-100 rounded-3xl shadow p-8 space-y-4">
      <h1 className="text-4xl font-bold text-emerald-900">404</h1>
      <p className="text-emerald-700">ไม่พบหน้าที่คุณต้องการ</p>
      <BackButton className="w-full justify-center" />
      <Link
        to="/"
        className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
      >
        กลับสู่หน้าเข้าสู่ระบบ
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
