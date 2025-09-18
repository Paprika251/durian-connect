const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const config = { ...options };
  config.headers = config.headers || {};

  if (config.body && !(config.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, config);

  if (response.status === 204) {
    return {};
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || 'ไม่สามารถดำเนินการได้';
    throw new Error(message);
  }

  return data;
}

export function loginRequest(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function registerBrokerRequest(payload) {
  return request('/auth/register-broker', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createProposal(payload) {
  return request('/proposals', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchProposals(params = {}) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return request(`/proposals${suffix}`);
}

export function updateProposalStatus(id, status) {
  return request(`/proposals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function createActivityLog(payload) {
  return request('/activities', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchActivityLogs(params = {}) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return request(`/activities${suffix}`);
}

export function createFruitRecord(payload) {
  return request('/fruit-records', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchHarvestSummary() {
  return request('/harvest-summary');
}

export function createFinanceRecord(payload) {
  return request('/finances', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchFinanceRecords(params = {}) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return request(`/finances${suffix}`);
}

export function updateFinanceStatus(id, status) {
  return request(`/finances/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function createProblemReport(payload) {
  return request('/problems', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchProblemReports(params = {}) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return request(`/problems${suffix}`);
}

export function respondProblemReport(id, message) {
  return request(`/problems/${id}/respond`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export function fetchTreeStatus() {
  return request('/tree-status');
}
