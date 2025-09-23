import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ fallback = '/', label = 'ย้อนกลับ', className = '' }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    const hasWindow = typeof window !== 'undefined';
    if (hasWindow && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallback, { replace: true });
  }, [fallback, navigate]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-emerald-200 text-emerald-700 hover:border-emerald-400 transition-colors ${className}`.trim()}
    >
      <span aria-hidden="true" className="text-xl leading-none">
        ←
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default BackButton;
