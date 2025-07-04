const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const Joi = require('joi');

// 🔹 Create Tender
router.post('/', auth, async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    deadline: Joi.date().required(),
    budget: Joi.number().required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const userId = req.user.id;

  try {
    // Get user's company
    const companyRes = await db.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    if (companyRes.rows.length === 0) return res.status(404).json({ error: "Company not found" });

    const companyId = companyRes.rows[0].id;
    const { title, description, deadline, budget } = req.body;

    const result = await db.query(
      `INSERT INTO tenders (company_id, title, description, deadline, budget)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [companyId, title, description, deadline, budget]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create tender" });
  }
});


// 🔹 List All Tenders (paginated)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const result = await db.query(
      `SELECT t.*, c.name AS company_name
       FROM tenders t
       JOIN companies c ON t.company_id = c.id
       ORDER BY t.id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tenders" });
  }
});


// 🔹 Get My Company’s Tenders
router.get('/my', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const companyRes = await db.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    if (companyRes.rows.length === 0) return res.status(404).json({ error: "Company not found" });

    const companyId = companyRes.rows[0].id;

    const tenders = await db.query(
      `SELECT * FROM tenders WHERE company_id = $1 ORDER BY id DESC`,
      [companyId]
    );

    res.json(tenders.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tenders" });
  }
});


// 🔹 Update Tender by ID
router.put('/:id', auth, async (req, res) => {
  const { title, description, deadline, budget } = req.body;
  const userId = req.user.id;

  try {
    const companyRes = await db.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    const companyId = companyRes.rows[0].id;

    const result = await db.query(
      `UPDATE tenders
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           deadline = COALESCE($3, deadline),
           budget = COALESCE($4, budget)
       WHERE id = $5 AND company_id = $6
       RETURNING *`,
      [title, description, deadline, budget, req.params.id, companyId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Tender not found or unauthorized" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update tender" });
  }
});


// 🔹 Delete Tender by ID
router.delete('/:id', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const companyRes = await db.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    const companyId = companyRes.rows[0].id;

    const result = await db.query(
      `DELETE FROM tenders WHERE id = $1 AND company_id = $2 RETURNING *`,
      [req.params.id, companyId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Tender not found or unauthorized" });
    }

    res.json({ message: "Tender deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete tender" });
  }
});

module.exports = router;
