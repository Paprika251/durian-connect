import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ProfileEditor from '../components/ProfileEditor.jsx';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  if (!user) {
    return null;
  }

  const menuItems = [
    { title: 'สถานะต้นทุเรียนในสวน', description: 'ตรวจสอบสุขภาพและสถานะของต้นทุเรียนแต่ละต้น', to: '/owner/tree-status' },
    { title: 'สรุปผลการเก็บเกี่ยว', description: 'ดูจำนวนทุเรียนที่เก็บได้แยกตามเกรด', to: '/owner/harvest' },
    { title: 'ข้อเสนอจากผู้รับเหมา', description: 'ตรวจสอบและตอบรับข้อเสนอการซื้อ', to: '/owner/proposals' },
    { title: 'รายการรายรับ/รายจ่าย', description: 'อนุมัติรายการและดูสรุปภาพรวมทางการเงิน', to: '/owner/finances' },
    { title: 'ปัญหาที่ถูกรายงาน', description: 'ตอบกลับและติดตามสถานการณ์ปัญหาในสวน', to: '/owner/problems' },
    { title: 'กิจกรรมที่บันทึก', description: 'ดูบันทึกกิจกรรมที่ผู้รับเหมาทำในสวน', to: '/owner/activities' },
  ];

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

        <ProfileEditor user={user} onUpdated={updateUser} />

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
