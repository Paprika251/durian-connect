import http from 'http';
import { URL } from 'url';
import { randomUUID, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { fileURLToPath } from 'url';
import path from 'path';
import { promises as fs } from 'fs';

const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, 'data.json');

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

function verifyPassword(password, storedValue) {
  if (!storedValue) return false;
  const [salt, key] = storedValue.split(':');
  const derivedKey = scryptSync(password, salt, 64);
  return timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
}

const createDefaultData = () => ({
  users: [
    {
      id: 'owner-1',
      role: 'owner',
      name: 'เจ้าของสวนหลัก',
      email: 'owner@durianfarm.com',
      phone: '099-000-0000',
      address: '123 หมู่บ้านทุเรียน ต.ผลไม้ อ.เมือง จ.จันทบุรี',
      passwordHash: hashPassword('owner123'),
      status: 'approved',
      createdAt: new Date().toISOString(),
    },
  ],
  proposals: [],
  activities: [],
  fruitRecords: [],
  financeRecords: [],
  problemReports: [],
  treeStatus: [
    { treeId: 'T-001', status: 'normal', notes: 'ต้นสมบูรณ์ดี' },
    { treeId: 'T-014', status: 'flowering', notes: 'เริ่มออกดอกชุดแรก' },
    { treeId: 'T-025', status: 'fruiting', notes: 'มีผลขนาดกลาง' },
    { treeId: 'T-032', status: 'issue', notes: 'พบอาการใบเหลือง ต้องตรวจสอบเพิ่มเติม' },
    { treeId: 'T-041', status: 'normal', notes: 'ผลโตใกล้เก็บเกี่ยว' },
  ],
});

async function ensureDataFile() {
  try {
    await fs.access(dataFile);
  } catch (err) {
    const defaultData = createDefaultData();
    await fs.writeFile(dataFile, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

async function loadData() {
  await ensureDataFile();
  const content = await fs.readFile(dataFile, 'utf-8');
  return JSON.parse(content);
}

async function saveData(data) {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8');
}

function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

function attachBroker(data, items) {
  return items.map((item) => ({
    ...item,
    broker: sanitizeUser(data.users.find((user) => user.id === item.brokerId)),
  }));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function matchPath(pathname, pattern) {
  const pathParts = pathname.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);
  if (pathParts.length !== patternParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];
    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart);
    } else if (patternPart !== pathPart) {
      return null;
    }
  }
  return params;
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve(null);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname, searchParams } = url;
  const method = req.method || 'GET';

  let body = {};
  if (method === 'POST' || method === 'PATCH') {
    body = await parseBody(req);
    if (body === null) {
      sendJson(res, 400, { message: 'ข้อมูลไม่ถูกต้อง' });
      return;
    }
  }

  try {
    if (method === 'POST' && pathname === '/api/auth/register-broker') {
      const { name, phone, address, email, password } = body || {};
      if (!name || !phone || !address || !email || !password) {
        sendJson(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        return;
      }
      const data = await loadData();
      const existingUser = data.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        sendJson(res, 409, { message: 'อีเมลนี้ถูกใช้งานแล้ว' });
        return;
      }
      const newBroker = {
        id: randomUUID(),
        role: 'broker',
        name,
        phone,
        address,
        email,
        passwordHash: hashPassword(password),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      data.users.push(newBroker);
      await saveData(data);
      sendJson(res, 201, { user: sanitizeUser(newBroker) });
      return;
    }

    const userMatch = matchPath(pathname, '/api/users/:id');
    if (method === 'PATCH' && userMatch) {
      const { id } = userMatch;
      const { phone, address, email, password } = body || {};

      if (!phone && !address && !email && !password) {
        sendJson(res, 400, { message: 'กรุณาระบุข้อมูลที่ต้องการแก้ไข' });
        return;
      }

      const data = await loadData();
      const user = data.users.find((item) => item.id === id);
      if (!user) {
        sendJson(res, 404, { message: 'ไม่พบบัญชีผู้ใช้' });
        return;
      }

      if (email && email !== user.email) {
        const emailTaken = data.users.some(
          (item) => item.id !== id && item.email.toLowerCase() === email.toLowerCase(),
        );
        if (emailTaken) {
          sendJson(res, 409, { message: 'อีเมลนี้ถูกใช้งานแล้ว' });
          return;
        }
        user.email = email;
      }

      if (phone) {
        user.phone = phone;
      }

      if (address) {
        user.address = address;
      }

      if (password) {
        user.passwordHash = hashPassword(password);
      }

      user.updatedAt = new Date().toISOString();
      await saveData(data);
      sendJson(res, 200, { user: sanitizeUser(user) });
      return;
    }

    if (method === 'POST' && pathname === '/api/auth/login') {
      const { email, password, role } = body || {};
      if (!email || !password || !role) {
        sendJson(res, 400, { message: 'ข้อมูลไม่ครบถ้วน' });
        return;
      }
      const data = await loadData();
      const user = data.users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.role === role);
      if (!user || !verifyPassword(password, user.passwordHash)) {
        sendJson(res, 401, { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        return;
      }
      sendJson(res, 200, { user: sanitizeUser(user) });
      return;
    }

    if (method === 'GET' && pathname === '/api/proposals') {
      const data = await loadData();
      const brokerId = searchParams.get('brokerId');
      const proposals = brokerId
        ? data.proposals.filter((proposal) => proposal.brokerId === brokerId)
        : data.proposals;
      sendJson(res, 200, { proposals: attachBroker(data, proposals) });
      return;
    }

    if (method === 'POST' && pathname === '/api/proposals') {
      const { brokerId, contactDeadline, quantity, price, paymentMethod, note } = body || {};
      if (!brokerId || !contactDeadline || typeof quantity !== 'number' || typeof price !== 'number') {
        sendJson(res, 400, { message: 'ข้อมูลข้อเสนอไม่ครบถ้วน' });
        return;
      }
      const data = await loadData();
      const broker = data.users.find((user) => user.id === brokerId && user.role === 'broker');
      if (!broker) {
        sendJson(res, 404, { message: 'ไม่พบผู้รับเหมา' });
        return;
      }
      const newProposal = {
        id: randomUUID(),
        brokerId,
        contactDeadline,
        quantity,
        price,
        paymentMethod,
        note: note || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      data.proposals.push(newProposal);
      await saveData(data);
      sendJson(res, 201, { proposal: newProposal });
      return;
    }

    const proposalMatch = matchPath(pathname, '/api/proposals/:id');
    if (method === 'PATCH' && proposalMatch) {
      const { id } = proposalMatch;
      const { status } = body || {};
      if (!['accepted', 'rejected'].includes(status)) {
        sendJson(res, 400, { message: 'สถานะไม่ถูกต้อง' });
        return;
      }
      const data = await loadData();
      const proposal = data.proposals.find((item) => item.id === id);
      if (!proposal) {
        sendJson(res, 404, { message: 'ไม่พบข้อเสนอ' });
        return;
      }
      proposal.status = status;
      proposal.decidedAt = new Date().toISOString();
      const broker = data.users.find((user) => user.id === proposal.brokerId);
      if (broker) {
        if (status === 'accepted') {
          broker.status = 'approved';
        } else if (status === 'rejected' && broker.status !== 'approved') {
          broker.status = 'pending';
        }
      }
      await saveData(data);
      sendJson(res, 200, { proposal });
      return;
    }

    if (method === 'POST' && pathname === '/api/activities') {
      const { brokerId, treeId: rawTreeId, scopeType, notes } = body || {};
      const normalizedScope = scopeType === 'whole-garden' ? 'whole-garden' : 'single-tree';
      const trimmedTreeId = typeof rawTreeId === 'string' ? rawTreeId.trim() : '';
      const trimmedNotes = typeof notes === 'string' ? notes.trim() : '';

      if (!brokerId || !normalizedScope || !trimmedNotes) {
        sendJson(res, 400, { message: 'ข้อมูลไม่ครบถ้วน' });
        return;
      }
      if (normalizedScope === 'single-tree' && !trimmedTreeId) {
        sendJson(res, 400, { message: 'กรุณาระบุหมายเลขต้นทุเรียน' });
        return;
      }
      const data = await loadData();
      const broker = data.users.find((user) => user.id === brokerId && user.role === 'broker');
      if (!broker) {
        sendJson(res, 404, { message: 'ไม่พบผู้รับเหมา' });
        return;
      }
      const log = {
        id: randomUUID(),
        brokerId,
        treeId: normalizedScope === 'single-tree' ? trimmedTreeId : null,
        scopeType: normalizedScope,
        notes: trimmedNotes,
        createdAt: new Date().toISOString(),
      };
      data.activities.push(log);
      await saveData(data);
      sendJson(res, 201, { activity: log });
      return;
    }

    if (method === 'GET' && pathname === '/api/activities') {
      const data = await loadData();
      const brokerId = searchParams.get('brokerId');
      const logs = brokerId
        ? data.activities.filter((activity) => activity.brokerId === brokerId)
        : data.activities;
      sendJson(res, 200, { activities: attachBroker(data, logs) });
      return;
    }

    if (method === 'POST' && pathname === '/api/fruit-records') {
      const { brokerId, amount, grade } = body || {};
      if (!brokerId || typeof amount !== 'number' || !grade) {
        sendJson(res, 400, { message: 'ข้อมูลไม่ครบถ้วน' });
        return;
      }
      const data = await loadData();
      const broker = data.users.find((user) => user.id === brokerId && user.role === 'broker');
      if (!broker) {
        sendJson(res, 404, { message: 'ไม่พบผู้รับเหมา' });
        return;
      }
      const record = {
        id: randomUUID(),
        brokerId,
        amount,
        grade,
        createdAt: new Date().toISOString(),
      };
      data.fruitRecords.push(record);
      await saveData(data);
      sendJson(res, 201, { record });
      return;
    }

    if (method === 'GET' && pathname === '/api/harvest-summary') {
      const data = await loadData();
      const summary = data.fruitRecords.reduce(
        (acc, record) => {
          const key = record.grade;
          acc[key] = (acc[key] || 0) + Number(record.amount || 0);
          return acc;
        },
        { A: 0, B: 0, C: 0, reject: 0 },
      );
      const records = attachBroker(data, data.fruitRecords).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      sendJson(res, 200, { summary, records });
      return;
    }

    if (method === 'POST' && pathname === '/api/finances') {
      const { brokerId, paymentMethod, type, invoiceRef, amount, notes } = body || {};
      if (!brokerId || !paymentMethod || !type || typeof amount !== 'number' || !notes) {
        sendJson(res, 400, { message: 'ข้อมูลไม่ครบถ้วน' });
        return;
      }
      const data = await loadData();
      const broker = data.users.find((user) => user.id === brokerId && user.role === 'broker');
      if (!broker) {
        sendJson(res, 404, { message: 'ไม่พบผู้รับเหมา' });
        return;
      }
      const record = {
        id: randomUUID(),
        brokerId,
        paymentMethod,
        type,
        invoiceRef: invoiceRef || '',
        amount,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      data.financeRecords.push(record);
      await saveData(data);
      sendJson(res, 201, { record });
      return;
    }

    if (method === 'GET' && pathname === '/api/finances') {
      const data = await loadData();
      const brokerId = searchParams.get('brokerId');
      const records = brokerId
        ? data.financeRecords.filter((item) => item.brokerId === brokerId)
        : data.financeRecords;
      const totals = records.reduce(
        (acc, item) => {
          if (item.status === 'approved') {
            if (item.type === 'income') {
              acc.income += Number(item.amount || 0);
            } else if (item.type === 'expense') {
              acc.expense += Number(item.amount || 0);
            }
          }
          return acc;
        },
        { income: 0, expense: 0, balance: 0 },
      );
      totals.balance = totals.income - totals.expense;
      const payload = attachBroker(data, records).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      sendJson(res, 200, { finances: payload, totals });
      return;
    }

    const financeMatch = matchPath(pathname, '/api/finances/:id');
    if (method === 'PATCH' && financeMatch) {
      const { id } = financeMatch;
      const { status } = body || {};
      if (!['approved', 'rejected'].includes(status)) {
        sendJson(res, 400, { message: 'สถานะไม่ถูกต้อง' });
        return;
      }
      const data = await loadData();
      const record = data.financeRecords.find((item) => item.id === id);
      if (!record) {
        sendJson(res, 404, { message: 'ไม่พบรายการ' });
        return;
      }
      record.status = status;
      record.reviewedAt = new Date().toISOString();
      await saveData(data);
      sendJson(res, 200, { record });
      return;
    }

    if (method === 'POST' && pathname === '/api/problems') {
      const { brokerId, treeId: rawTreeId, scopeType, notes } = body || {};
      const normalizedScope = scopeType === 'whole-garden' ? 'whole-garden' : 'single-tree';
      const trimmedTreeId = typeof rawTreeId === 'string' ? rawTreeId.trim() : '';
      const trimmedNotes = typeof notes === 'string' ? notes.trim() : '';

      if (!brokerId || !normalizedScope || !trimmedNotes) {
        sendJson(res, 400, { message: 'ข้อมูลไม่ครบถ้วน' });
        return;
      }
      if (normalizedScope === 'single-tree' && !trimmedTreeId) {
        sendJson(res, 400, { message: 'กรุณาระบุหมายเลขต้นทุเรียน' });
        return;
      }
      const data = await loadData();
      const broker = data.users.find((user) => user.id === brokerId && user.role === 'broker');
      if (!broker) {
        sendJson(res, 404, { message: 'ไม่พบผู้รับเหมา' });
        return;
      }
      const report = {
        id: randomUUID(),
        brokerId,
        treeId: normalizedScope === 'single-tree' ? trimmedTreeId : null,
        scopeType: normalizedScope,
        notes: trimmedNotes,
        createdAt: new Date().toISOString(),
        ownerResponse: null,
      };
      data.problemReports.push(report);
      await saveData(data);
      sendJson(res, 201, { report });
      return;
    }

    if (method === 'GET' && pathname === '/api/problems') {
      const data = await loadData();
      const brokerId = searchParams.get('brokerId');
      const reports = brokerId
        ? data.problemReports.filter((item) => item.brokerId === brokerId)
        : data.problemReports;
      sendJson(res, 200, { reports: attachBroker(data, reports) });
      return;
    }

    const problemMatch = matchPath(pathname, '/api/problems/:id/respond');
    if (method === 'POST' && problemMatch) {
      const { id } = problemMatch;
      const { message } = body || {};
      if (!message) {
        sendJson(res, 400, { message: 'กรุณากรอกข้อความตอบกลับ' });
        return;
      }
      const data = await loadData();
      const report = data.problemReports.find((item) => item.id === id);
      if (!report) {
        sendJson(res, 404, { message: 'ไม่พบรายงานปัญหา' });
        return;
      }
      report.ownerResponse = {
        message,
        respondedAt: new Date().toISOString(),
      };
      await saveData(data);
      sendJson(res, 200, { report });
      return;
    }

    if (method === 'GET' && pathname === '/api/tree-status') {
      const data = await loadData();
      sendJson(res, 200, { trees: data.treeStatus });
      return;
    }

    if (method === 'GET' && pathname === '/api/owner-contact') {
      const data = await loadData();
      const owner = data.users.find((user) => user.role === 'owner');
      if (!owner) {
        sendJson(res, 404, { message: 'ไม่พบข้อมูลเจ้าของสวน' });
        return;
      }
      sendJson(res, 200, {
        owner: {
          name: owner.name || 'เจ้าของสวน',
          phone: owner.phone || '',
          address: owner.address || '',
          email: owner.email || '',
        },
      });
      return;
    }

    sendJson(res, 404, { message: 'ไม่พบเส้นทางที่ร้องขอ' });
  } catch (err) {
    console.error('Server error', err);
    sendJson(res, 500, { message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
  }
});

server.listen(PORT, () => {
  console.log(`Durian farm API server running on port ${PORT}`);
});
