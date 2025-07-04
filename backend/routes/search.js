const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');

// 🔍 GET /search/companies?query=somekeyword
router.get('/companies', async (req, res) => {
  const schema = Joi.object({
    query: Joi.string().required()
  });

  const { error } = schema.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const searchTerm = `%${req.query.query}%`;

  try {
    const result = await db.query(
      `SELECT DISTINCT c.*
       FROM companies c
       LEFT JOIN goods_and_services g ON c.id = g.company_id
       WHERE
         c.name ILIKE $1 OR
         c.industry ILIKE $1 OR
         g.name ILIKE $1`,
      [searchTerm]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
