import { useEffect, useMemo, useState } from 'react';
import { fetchHarvestSummary } from '../services/api.js';

const gradeLabels = {
  A: 'เกรด A',
  B: 'เกรด B',
  C: 'เกรด C',
  reject: 'ตกเกรด',
};

const gradeColors = {
  A: 'bg-emerald-100 text-emerald-800',
  B: 'bg-lime-100 text-lime-700',
  C: 'bg-amber-100 text-amber-700',
  reject: 'bg-red-100 text-red-700',
};

const HarvestOverviewPage = () => {
  const [summary, setSummary] = useState({});
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const response = await fetchHarvestSummary();
        if (isMounted) {
          setSummary(response.summary || {});
          setRecords(response.records || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'ไม่สามารถดึงข้อมูลได้');
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

  const total = useMemo(() => {
    return Object.values(summary).reduce((acc, value) => acc + (Number(value) || 0), 0);
  }, [summary]);

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-emerald-900">สรุปผลการเก็บเกี่ยวทุเรียน</h1>
          <p className="text-emerald-700">ดูจำนวนผลผลิตที่เก็บได้ในแต่ละเกรดเพื่อวางแผนการขาย</p>
        </header>

        {loading ? (
          <div className="bg-white border border-emerald-100 rounded-3xl shadow p-6 text-center text-emerald-700">
            กำลังโหลดข้อมูล...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl shadow p-6 text-center">{error}</div>
        ) : (
          <div className="space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(gradeLabels).map(([key, label]) => (
                <div key={key} className="bg-white border border-emerald-100 rounded-3xl shadow p-5 space-y-2 text-center">
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${gradeColors[key]}`}>
                    {label}
                  </span>
                  <p className="text-2xl font-bold text-emerald-900">{summary[key] || 0}</p>
                  <p className="text-sm text-emerald-600">ลูก</p>
                </div>
              ))}
            </section>

            <section className="bg-white border border-emerald-100 rounded-3xl shadow p-6">
              <h2 className="text-xl font-semibold text-emerald-900 mb-4">ข้อมูลการบันทึกล่าสุด</h2>
              {records.length === 0 ? (
                <p className="text-emerald-700">ยังไม่มีการบันทึกผลผลิต</p>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-emerald-100">
                  <table className="min-w-full divide-y divide-emerald-100">
                    <thead className="bg-emerald-100/70">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">วันที่บันทึก</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">ผู้บันทึก</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">เกรด</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">จำนวน (ลูก)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-50">
                      {records.map((record) => (
                        <tr key={record.id} className="hover:bg-emerald-50/70">
                          <td className="px-4 py-3 text-emerald-800 text-sm">
                            {new Date(record.createdAt).toLocaleString('th-TH')}
                          </td>
                          <td className="px-4 py-3 text-emerald-800 text-sm">{record.broker?.name || '-'}</td>
                          <td className="px-4 py-3 text-emerald-800 text-sm">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${gradeColors[record.grade] || gradeColors.A}`}>
                              {gradeLabels[record.grade] || record.grade}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-emerald-800 text-sm">{record.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6 bg-emerald-100/60 border border-emerald-200 rounded-2xl px-4 py-4 text-emerald-800">
                <p className="font-semibold">รวมทั้งหมด: {total} ลูก</p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default HarvestOverviewPage;
