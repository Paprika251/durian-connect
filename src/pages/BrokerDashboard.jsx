import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ProfileEditor from '../components/ProfileEditor.jsx';
import { fetchProposals } from '../services/api.js';

const BrokerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  if (!user) {
    return null;
  }

  useEffect(() => {
    let isMounted = true;
    const checkApproval = async () => {
      if (!user) return;
      try {
        const response = await fetchProposals({ brokerId: user.id });
        if (!isMounted) return;
        const hasAccepted = (response.proposals || []).some((proposal) => proposal.status === 'accepted');
        if (hasAccepted && user.status !== 'approved') {
          updateUser({ ...user, status: 'approved' });
        }
      } catch (err) {
        // ignore sync errors on dashboard
      }
    };

    checkApproval();
    return () => {
      isMounted = false;
    };
  }, [user, updateUser]);

  const isApproved = user.status === 'approved';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-emerald-100 rounded-2xl shadow p-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">ยินดีต้อนรับคุณ {user.name || 'ผู้รับเหมา'}</h1>
            <p className="text-emerald-700">สถานะ: {isApproved ? 'ผ่านการอนุมัติ' : 'รอการอนุมัติจากเจ้าของสวน'}</p>
            {user.statusNote && <p className="text-sm text-emerald-600">{user.statusNote}</p>}
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/', { replace: true });
            }}
            className="self-start md:self-auto h-11 px-5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            ออกจากระบบ
          </button>
        </header>

        <ProfileEditor user={user} onUpdated={updateUser} />

        {!isApproved ? (
          <section className="bg-white border border-amber-100 rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-emerald-900">ขั้นตอนต่อไป</h2>
            <p className="text-emerald-700">
              เจ้าของสวนจะอนุมัติข้อเสนอของคุณเมื่อได้รับข้อมูลครบถ้วน กรุณายื่นข้อเสนอซื้อเพื่อให้เจ้าของสวนพิจารณา
            </p>
            <Link
              to="/broker/submit-proposal"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-amber-500 text-white font-semibold shadow hover:bg-amber-600"
            >
              ยื่นข้อเสนอซื้อทุเรียน
            </Link>
          </section>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
              title="ยื่นข้อเสนอซื้อ"
              description="ส่งรายละเอียดการรับซื้อให้เจ้าของสวนทราบ"
              to="/broker/submit-proposal"
            />
            <DashboardCard
              title="บันทึกกิจกรรมที่ทำ"
              description="บันทึกงานดูแลสวนหรือกิจกรรมที่ทำในแต่ละวัน"
              to="/broker/record-activity"
            />
            <DashboardCard
              title="บันทึกจำนวนผลทุเรียน"
              description="ระบุจำนวนและเกรดของทุเรียนที่เก็บเกี่ยวได้"
              to="/broker/record-fruit"
            />
            <DashboardCard
              title="บันทึกรายรับรายจ่าย"
              description="ส่งรายการค่าใช้จ่ายหรือรายรับให้เจ้าของสวนอนุมัติ"
              to="/broker/record-finance"
            />
            <DashboardCard
              title="รายงานปัญหา"
              description="แจ้งปัญหาที่พบในสวนพร้อมรายละเอียด"
              to="/broker/report-problem"
            />
          </section>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description, to }) => (
  <Link
    to={to}
    className="block bg-white border border-emerald-100 hover:border-emerald-300 rounded-2xl shadow p-6 transition-colors"
  >
    <h3 className="text-lg font-semibold text-emerald-900">{title}</h3>
    <p className="mt-2 text-emerald-700">{description}</p>
  </Link>
);

export default BrokerDashboard;
