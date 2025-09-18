import { useEffect, useState } from 'react';
import { fetchActivityLogs } from '../services/api.js';

const scopeLabels = {
  'single-tree': 'รายต้น',
  'whole-garden': 'ภาพรวม',
};

const OwnerActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const response = await fetchActivityLogs();
        if (isMounted) {
          setActivities(response.activities || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-emerald-900">กิจกรรมที่ผู้รับเหมาบันทึก</h1>
          <p className="text-emerald-700">ติดตามงานที่เกิดขึ้นในสวนจากผู้รับเหมาทุกคน</p>
        </header>

        {loading ? (
          <div className="bg-white border border-emerald-100 rounded-3xl shadow p-6 text-center text-emerald-700">กำลังโหลดข้อมูล...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl shadow p-6 text-center">{error}</div>
        ) : activities.length === 0 ? (
          <p className="text-emerald-700">ยังไม่มีกิจกรรมที่บันทึกไว้</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <article key={activity.id} className="bg-white border border-emerald-100 rounded-3xl shadow p-6 space-y-4">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-emerald-900">
                      กิจกรรมโดย {activity.broker?.name || 'ไม่ทราบชื่อ'}
                    </h2>
                    <p className="text-sm text-emerald-700">
                      บันทึกเมื่อ {new Date(activity.createdAt).toLocaleString('th-TH')}
                    </p>
                  </div>
                  <span className="px-4 py-2 text-sm font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    {scopeLabels[activity.scopeType] || 'อื่น ๆ'}
                  </span>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-800">
                  <Detail label="Tree ID" value={activity.treeId || '-'} />
                  <Detail label="เบอร์ติดต่อ" value={activity.broker?.phone || '-'} />
                  <Detail label="อีเมล" value={activity.broker?.email || '-'} />
                  <Detail label="ที่อยู่" value={activity.broker?.address || '-'} full />
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 text-emerald-800 text-sm">
                  <p className="font-semibold">รายละเอียดกิจกรรม</p>
                  <p>{activity.notes}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Detail = ({ label, value, full }) => (
  <div className={full ? 'md:col-span-2 space-y-1' : 'space-y-1'}>
    <p className="text-xs text-emerald-600 uppercase tracking-wide">{label}</p>
    <p className="text-emerald-900 font-medium">{value}</p>
  </div>
);

export default OwnerActivityPage;
