const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const Joi = require('joi');

// 🔽 Required for logo upload
const multer = require('multer');
const supabase = require('../supabase');
const upload = multer({ storage: multer.memoryStorage() });


// 🔹 POST /company - Create company profile
router.post('/', auth, async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    industry: Joi.string().required(),
    description: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, industry, description } = req.body;
  const userId = req.user.id;

  try {
    const existing = await db.query('SELECT * FROM companies WHERE user_id = $1', [userId]);
    if (existing.rows.length > 0) return res.status(400).json({ error: "Company profile already exists" });

    const result = await db.query(
      'INSERT INTO companies (user_id, name, industry, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, industry, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// 🔹 GET /company - Get current user's company
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query('SELECT * FROM companies WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Company not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// 🔹 PUT /company - Update company profile
router.put('/', auth, async (req, res) => {
  const schema = Joi.object({
    name: Joi.string(),
    industry: Joi.string(),
    description: Joi.string()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const userId = req.user.id;
  const { name, industry, description } = req.body;

  try {
    const result = await db.query(
      `UPDATE companies
       SET name = COALESCE($1, name),
           industry = COALESCE($2, industry),
           description = COALESCE($3, description)
       WHERE user_id = $4
       RETURNING *`,
      [name, industry, description, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// 🔹 POST /company/logo - Upload logo image to Supabase
router.post('/logo', auth, upload.single('logo'), async (req, res) => {
  const userId = req.user.id;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const fileExt = file.originalname.split('.').pop();
  const filePath = `company-${userId}-${Date.now()}.${fileExt}`;

  try {
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    await db.query(
      'UPDATE companies SET logo_url = $1 WHERE user_id = $2',
      [imageUrl, userId]
    );

    res.json({ imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// 🔍 GET /company/search?q=keyword
router.get('/search', async (req, res) => {
  const q = req.query.q?.toString().toLowerCase() || '';

  try {
    const result = await db.query(`
      SELECT id, name, industry, logo_url
      FROM companies
      WHERE LOWER(name) LIKE $1
         OR LOWER(industry) LIKE $1
         OR LOWER(description) LIKE $1
    `, [`%${q}%`]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// 📄 GET /company/:id - public company profile
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      SELECT id, name, industry, description, logo_url
      FROM companies
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch company profile' });
  }
});


// ✅ Export router (must be last line)
module.exports = router;
