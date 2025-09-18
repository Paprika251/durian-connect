import { useEffect, useMemo, useState } from 'react';
import { fetchTreeStatus } from '../services/api.js';

const statusLabels = {
  normal: 'ปกติ',
  issue: 'มีปัญหา',
  flowering: 'ออกดอก',
  fruiting: 'ออกผล',
};

const statusColors = {
  normal: 'bg-emerald-100 text-emerald-800',
  issue: 'bg-red-100 text-red-700',
  flowering: 'bg-amber-100 text-amber-700',
  fruiting: 'bg-lime-100 text-lime-700',
};

const TreeStatusPage = () => {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const response = await fetchTreeStatus();
        if (isMounted) {
          setTrees(response.trees || []);
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

  const summary = useMemo(() => {
    return trees.reduce(
      (acc, tree) => {
        const key = tree.status || 'normal';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {},
    );
  }, [trees]);

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-emerald-900">สถานะต้นทุเรียนในสวน</h1>
          <p className="text-emerald-700">ติดตามสุขภาพต้นทุเรียนและวางแผนจัดการได้อย่างทันเวลา</p>
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
              {Object.entries(statusLabels).map(([key, label]) => (
                <div key={key} className="bg-white border border-emerald-100 rounded-3xl shadow p-5 space-y-2 text-center">
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${statusColors[key]}`}>
                    {label}
                  </span>
                  <p className="text-2xl font-bold text-emerald-900">{summary[key] || 0}</p>
                  <p className="text-sm text-emerald-600">ต้น</p>
                </div>
              ))}
            </section>

            <section className="bg-white border border-emerald-100 rounded-3xl shadow overflow-hidden">
              <table className="min-w-full divide-y divide-emerald-100">
                <thead className="bg-emerald-100/70">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">Tree ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">สถานะ</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {trees.map((tree) => (
                    <tr key={tree.treeId} className="hover:bg-emerald-50/70">
                      <td className="px-4 py-3 text-emerald-900 font-semibold">{tree.treeId}</td>
                      <td className="px-4 py-3 text-emerald-800">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[tree.status] || statusColors.normal}`}>
                          {statusLabels[tree.status] || statusLabels.normal}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-emerald-700 text-sm">{tree.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeStatusPage;
