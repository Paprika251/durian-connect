import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchTreeStatus } from '../services/api.js';

const STATUS_LABELS = {
  normal: 'ปกติ',
  issue: 'มีปัญหา',
  flowering: 'ออกดอก',
  fruiting: 'ออกผล',
};

export const useTreeOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTrees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchTreeStatus();
      const trees = Array.isArray(response?.trees) ? response.trees : [];
      setOptions(
        trees
          .filter((item) => item && item.treeId)
          .map((tree) => ({
            value: tree.treeId,
            status: tree.status || '',
            notes: tree.notes || '',
          })),
      );
    } catch (err) {
      setError(err?.message || 'ไม่สามารถโหลดรายชื่อต้นทุเรียนได้');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrees();
  }, [loadTrees]);

  const decoratedOptions = useMemo(
    () =>
      options.map((option) => ({
        ...option,
        label: `${option.value} · ${STATUS_LABELS[option.status] || option.status || 'ไม่ระบุสถานะ'}`,
      })),
    [options],
  );

  const getStatusLabel = useCallback((status) => STATUS_LABELS[status] || status || 'ไม่ระบุสถานะ', []);

  return {
    options: decoratedOptions,
    loading,
    error,
    reload: loadTrees,
    getStatusLabel,
  };
};

export default useTreeOptions;
