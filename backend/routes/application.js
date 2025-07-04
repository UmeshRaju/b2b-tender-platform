const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const Joi = require('joi');

// 🔹 POST /applications/:tenderId — Apply to tender
router.post('/:tenderId', auth, async (req, res) => {
  const schema = Joi.object({
    proposal: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { proposal } = req.body;
  const userId = req.user.id;
  const tenderId = req.params.tenderId;

  try {
    // Get the company ID of the logged-in user
    const companyRes = await db.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    if (companyRes.rows.length === 0) return res.status(404).json({ error: "Company not found" });

    const companyId = companyRes.rows[0].id;

    // Prevent duplicate applications
    const existing = await db.query(
      'SELECT * FROM applications WHERE tender_id = $1 AND company_id = $2',
      [tenderId, companyId]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Already applied to this tender" });
    }

    const result = await db.query(
      'INSERT INTO applications (tender_id, company_id, proposal) VALUES ($1, $2, $3) RETURNING *',
      [tenderId, companyId, proposal]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to apply to tender" });
  }
});

// 🔹 GET /applications/:tenderId — Get all proposals for a tender
router.get('/:tenderId', auth, async (req, res) => {
  const tenderId = req.params.tenderId;
  const userId = req.user.id;

  try {
    // Make sure this tender belongs to the user's company
    const companyRes = await db.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    const companyId = companyRes.rows[0].id;

    const tenderCheck = await db.query(
      'SELECT * FROM tenders WHERE id = $1 AND company_id = $2',
      [tenderId, companyId]
    );

    if (tenderCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized or tender not found" });
    }

    const apps = await db.query(
      `SELECT a.*, c.name AS company_name
       FROM applications a
       JOIN companies c ON a.company_id = c.id
       WHERE a.tender_id = $1`,
      [tenderId]
    );

    res.json(apps.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// 🔹 GET /applications/my — View tenders I've applied to
router.get('/my', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    // Get the company ID for the logged-in user
    const companyRes = await db.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    if (companyRes.rows.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    const companyId = companyRes.rows[0].id;

    const result = await db.query(`
      SELECT a.*, t.title, t.description, t.deadline, t.budget
      FROM applications a
      JOIN tenders t ON a.tender_id = t.id
      WHERE a.company_id = $1
      ORDER BY a.created_at DESC
    `, [companyId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error in /applications/my:', err); // Add this line for debugging
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Add this test route to your applications router
router.get('/test', (req, res) => {
  res.json({ message: 'Applications router is working!' });
});

module.exports = router;
