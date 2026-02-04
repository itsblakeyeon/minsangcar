const { Customer, Conversation } = require('../models');
const smsService = require('../services/smsService');

const parseCSV = (content) => {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || '';
    });
    return row;
  });
};

const createCustomer = async (req, res) => {
  try {
    const { name, phone, status, notes } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'name과 phone은 필수입니다' });
    }
    const customer = await Customer.create(name, phone, status, notes);
    res.status(201).json(customer);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: '이미 등록된 전화번호입니다' });
    }
    res.status(500).json({ error: error.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const customers = await Customer.findAll(limit);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: '고객을 찾을 수 없습니다' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.update(req.params.id, req.body);
    if (!customer) {
      return res.status(404).json({ error: '고객을 찾을 수 없습니다' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.delete(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: '고객을 찾을 수 없습니다' });
    }
    res.json({ message: '삭제되었습니다', customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'CSV 파일이 필요합니다' });
    }

    const content = req.file.buffer.toString('utf-8');
    const rows = parseCSV(content);

    const results = { success: [], failed: [], duplicates: [] };

    for (const row of rows) {
      if (!row.name || !row.phone) {
        results.failed.push({ ...row, reason: 'name 또는 phone 누락' });
        continue;
      }

      try {
        const existing = await Customer.findByPhone(row.phone);
        if (existing) {
          results.duplicates.push({ ...row, reason: '이미 등록된 번호' });
          continue;
        }

        const customer = await Customer.create(
          row.name,
          row.phone,
          row.status || 'new',
          row.notes || null
        );
        results.success.push(customer);
      } catch (error) {
        results.failed.push({ ...row, reason: error.message });
      }
    }

    res.json({
      message: 'CSV 업로드 완료',
      summary: {
        total: rows.length,
        success: results.success.length,
        duplicates: results.duplicates.length,
        failed: results.failed.length,
      },
      results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const VALID_STATUSES = ['new', 'contacted', 'interested', 'converted', 'active', 'inactive'];

const sendByStatus = async (req, res) => {
  try {
    const { status, message } = req.body;

    if (!status || !message) {
      return res.status(400).json({ error: 'status와 message는 필수입니다' });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `유효하지 않은 상태입니다. 가능한 값: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const customers = await Customer.findByStatus(status);

    if (customers.length === 0) {
      return res.json({
        message: '발송 대상이 없습니다',
        summary: { total: 0, success: 0, failed: 0 },
      });
    }

    const results = { success: [], failed: [] };

    for (const customer of customers) {
      try {
        const smsResult = await smsService.sendSms(customer.phone, message);
        // 대화 내역에 저장
        await Conversation.create(customer.id, message, 'ai');
        results.success.push({
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          logId: smsResult.logId,
        });
      } catch (error) {
        results.failed.push({
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          reason: error.message,
        });
      }
    }

    res.json({
      message: `[${status}] 상태 고객 문자 발송 완료`,
      summary: {
        total: customers.length,
        success: results.success.length,
        failed: results.failed.length,
      },
      results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  uploadCSV,
  sendByStatus,
};
