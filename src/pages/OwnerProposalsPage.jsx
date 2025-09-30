import { useEffect, useMemo, useState } from 'react';
import BackButton from '../components/BackButton.jsx';
import { fetchProposals, updateProposalStatus } from '../services/api.js';

const statusLabels = {
  pending: 'รอการพิจารณา',
  accepted: 'ยอมรับแล้ว',
  rejected: 'ปฏิเสธ',
};

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-700',
};

const OwnerProposalsPage = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [search, setSearch] = useState('');
  const [submissionDeadline, setSubmissionDeadline] = useState(null);

  const formatDate = (value, options = { dateStyle: 'medium' }) => {
    if (!value) return '-';
    try {
      return new Date(value).toLocaleString('th-TH', options);
    } catch (err) {
      return value;
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchProposals();
      setProposals(response.proposals || []);
      if (Object.prototype.hasOwnProperty.call(response || {}, 'submissionDeadline')) {
        setSubmissionDeadline(response.submissionDeadline || null);
      }
    } catch (err) {
      setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setActionMessage('');
    try {
      await updateProposalStatus(id, status);
      setActionMessage(status === 'accepted' ? 'ยอมรับข้อเสนอเรียบร้อยแล้ว' : 'ปฏิเสธข้อเสนอเรียบร้อยแล้ว');
      await loadData();
    } catch (err) {
      setActionMessage(err.message || 'ไม่สามารถอัปเดตสถานะได้');
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredProposals = useMemo(() => {
    if (!normalizedSearch) return proposals;
    return proposals.filter((proposal) => {
      const haystack = [
        proposal.broker?.name,
        proposal.broker?.email,
        proposal.broker?.phone,
        proposal.paymentMethod,
        proposal.note,
        statusLabels[proposal.status],
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [normalizedSearch, proposals]);

  const deadlineDate = submissionDeadline ? new Date(submissionDeadline) : null;
  const deadlineValid = deadlineDate && !Number.isNaN(deadlineDate.getTime());
  const deadlineExpired = deadlineValid ? Date.now() > deadlineDate.getTime() : false;
  const deadlineInfo = deadlineValid
    ? `${deadlineExpired ? 'หมดเขตรับข้อเสนอเมื่อ' : 'เปิดรับข้อเสนอถึง'} ${formatDate(deadlineDate, {
        dateStyle: 'long',
      })}`
    : 'ยังไม่ได้กำหนดวันสิ้นสุดการรับข้อเสนอ';
  const deadlineClass = deadlineExpired ? 'text-red-600' : 'text-emerald-700';

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <BackButton fallback="/owner/dashboard" />
        <header className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">ข้อเสนอจากผู้รับเหมา</h1>
            <p className="text-emerald-700">ตรวจสอบรายละเอียดและยืนยันการทำงานกับผู้รับเหมา</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <label className="w-full sm:w-auto text-sm text-emerald-800 flex flex-col gap-2">
              <span className="font-medium">ค้นหาข้อเสนอ</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full sm:w-72 h-11 rounded-xl border border-emerald-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="ค้นหาจากชื่อผู้รับเหมา สถานะ หรือหมายเหตุ"
              />
            </label>
            <div className="text-sm text-emerald-700">
              พบ {filteredProposals.length} จาก {proposals.length} ข้อเสนอ
            </div>
          </div>
          <p className={`text-sm ${deadlineClass}`}>{deadlineInfo}</p>
        </header>

        {loading ? (
          <div className="bg-white border border-emerald-100 rounded-3xl shadow p-6 text-center text-emerald-700">กำลังโหลดข้อมูล...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl shadow p-6 text-center">{error}</div>
        ) : (
          <div className="space-y-4">
            {actionMessage && (
              <div className="bg-emerald-100/70 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-3 text-sm">
                {actionMessage}
              </div>
            )}

            {filteredProposals.length === 0 ? (
              <p className="text-emerald-700">
                {proposals.length === 0 ? 'ยังไม่มีข้อเสนอเข้ามา' : 'ไม่พบข้อเสนอที่ตรงกับคำค้น'}
              </p>
            ) : (
              <div className="space-y-4">
                {filteredProposals.map((proposal) => (
                  <article
                    key={proposal.id}
                    className="bg-white border border-emerald-100 rounded-3xl shadow p-6 space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-emerald-900">
                          ข้อเสนอจาก {proposal.broker?.name || 'ไม่ทราบชื่อ'}
                        </h2>
                        <p className="text-sm text-emerald-700">
                          ส่งเมื่อ {formatDate(proposal.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                      <span className={`px-4 py-2 text-sm font-semibold rounded-full ${statusColors[proposal.status] || statusColors.pending}`}>
                        {statusLabels[proposal.status] || statusLabels.pending}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-800">
                      <Detail label="กำหนดรับข้อเสนอ" value={formatDate(proposal.contactDeadline, { dateStyle: 'long' })} />
                      <Detail label="ปริมาณที่ต้องการ" value={`${proposal.quantity} กิโลกรัม`} />
                      <Detail label="ราคาที่เสนอ" value={`${proposal.price} บาท/กิโลกรัม`} />
                      <Detail label="วิธีการจ่ายเงิน" value={mapPaymentMethod(proposal.paymentMethod)} />
                      <Detail label="เบอร์ติดต่อ" value={proposal.broker?.phone || '-'} />
                      <Detail label="อีเมล" value={proposal.broker?.email || '-'} />
                      <Detail label="ที่อยู่" value={proposal.broker?.address || '-'} full />
                    </div>

                    {proposal.note && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 text-emerald-800 text-sm">
                        <p className="font-semibold">หมายเหตุ</p>
                        <p>{proposal.note}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(proposal.id, 'accepted')}
                        disabled={proposal.status === 'accepted'}
                        className="h-10 px-5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
                      >
                        ยอมรับข้อเสนอ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(proposal.id, 'rejected')}
                        disabled={proposal.status === 'rejected'}
                        className="h-10 px-5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
                      >
                        ปฏิเสธข้อเสนอ
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

const mapPaymentMethod = (value) => {
  switch (value) {
    case 'cash':
      return 'เงินสด';
    case 'transfer':
      return 'โอนเงิน';
    case 'installment':
      return 'ผ่อนชำระ';
    case 'credit':
      return 'บัตรเครดิต';
    case 'other':
    default:
      return 'อื่น ๆ';
  }
};

export default OwnerProposalsPage;
