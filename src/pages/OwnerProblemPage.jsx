import { useEffect, useMemo, useState } from 'react';
import BackButton from '../components/BackButton.jsx';
import { fetchProblemReports, respondProblemReport } from '../services/api.js';

const OwnerProblemPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responses, setResponses] = useState({});
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchProblemReports();
      setReports(response.reports || []);
    } catch (err) {
      setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (id, value) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleRespond = async (id) => {
    setMessage('');
    try {
      const messageToSend = responses[id];
      if (!messageToSend) {
        setMessage('กรุณากรอกคำแนะนำก่อนส่ง');
        return;
      }
      await respondProblemReport(id, messageToSend);
      setMessage('ส่งคำแนะนำให้ผู้รับเหมาเรียบร้อยแล้ว');
      setResponses((prev) => ({ ...prev, [id]: '' }));
      await loadData();
    } catch (err) {
      setMessage(err.message || 'ไม่สามารถตอบกลับได้');
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredReports = useMemo(() => {
    if (!normalizedSearch) return reports;
    return reports.filter((report) => {
      const haystack = [
        report.treeId,
        report.broker?.name,
        report.broker?.email,
        report.broker?.phone,
        report.notes,
        report.ownerResponse?.message,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [normalizedSearch, reports]);

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <BackButton fallback="/owner/dashboard" />
        <header className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">ปัญหาที่ผู้รับเหมารายงาน</h1>
            <p className="text-emerald-700">ติดตามสถานการณ์ในสวนและให้คำแนะนำกลับไปยังผู้รับเหมา</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <label className="w-full sm:w-auto text-sm text-emerald-800 flex flex-col gap-2">
              <span className="font-medium">ค้นหารายงาน</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full sm:w-72 h-11 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="ค้นหาจาก Tree ID หรือคำแนะนำที่เคยตอบ"
              />
            </label>
            <div className="text-sm text-emerald-700">
              พบ {filteredReports.length} จาก {reports.length} รายงาน
            </div>
          </div>
        </header>

        {loading ? (
          <div className="bg-white border border-emerald-100 rounded-3xl shadow p-6 text-center text-emerald-700">กำลังโหลดข้อมูล...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl shadow p-6 text-center">{error}</div>
        ) : (
          <div className="space-y-4">
            {message && (
              <div className="bg-emerald-100/70 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-3 text-sm">
                {message}
              </div>
            )}

            {filteredReports.length === 0 ? (
              <p className="text-emerald-700">
                {reports.length === 0 ? 'ยังไม่มีปัญหาที่รายงานเข้ามา' : 'ไม่พบรายงานที่ตรงกับคำค้น'}
              </p>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <article
                    key={report.id}
                    className="bg-white border border-emerald-100 rounded-3xl shadow p-6 space-y-4"
                  >
                    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-emerald-900">
                          ปัญหาจาก {report.broker?.name || 'ไม่ทราบชื่อ'}
                        </h2>
                        <p className="text-sm text-emerald-700">
                          รายงานเมื่อ {new Date(report.createdAt).toLocaleString('th-TH')}
                        </p>
                      </div>
                      <span className="px-4 py-2 text-sm font-semibold rounded-full bg-red-100 text-red-700">
                        {report.scopeType === 'whole-garden' ? 'ปัญหาภาพรวม' : 'ปัญหารายต้น'}
                      </span>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-800">
                      <Detail label="Tree ID" value={report.treeId || '-'} />
                      <Detail label="เบอร์ติดต่อ" value={report.broker?.phone || '-'} />
                      <Detail label="อีเมล" value={report.broker?.email || '-'} />
                      <Detail label="ที่อยู่" value={report.broker?.address || '-'} full />
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 text-emerald-800 text-sm">
                      <p className="font-semibold">รายละเอียดปัญหา</p>
                      <p>{report.notes}</p>
                    </div>

                    {report.ownerResponse && (
                      <div className="bg-lime-50 border border-lime-200 rounded-2xl px-4 py-3 text-lime-800 text-sm">
                        <p className="font-semibold">คำแนะนำที่เคยส่ง</p>
                        <p>{report.ownerResponse.message}</p>
                        <p className="text-xs text-lime-700 mt-1">
                          ส่งเมื่อ {new Date(report.ownerResponse.respondedAt).toLocaleString('th-TH')}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <textarea
                        rows="3"
                        value={responses[report.id] ?? ''}
                        onChange={(event) => handleChange(report.id, event.target.value)}
                        className="w-full rounded-2xl border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                        placeholder="ให้คำแนะนำหรือวิธีแก้ไขปัญหากับผู้รับเหมา"
                      />
                      <button
                        type="button"
                        onClick={() => handleRespond(report.id)}
                        className="h-10 px-5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                      >
                        ส่งคำแนะนำ
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
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

export default OwnerProblemPage;
