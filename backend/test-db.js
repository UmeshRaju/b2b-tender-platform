const db = require('./db');

(async () => {
  try {
    const res = await db.query('SELECT NOW()');
    console.log(res.rows);
  } catch (err) {
    console.error('DB Error:', err);
  }
})();
