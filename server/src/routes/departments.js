const express = require('express');
const router = express.Router();
const { Department, Station } = require('../../models');

// GET /api/departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [
        {
          model: Station,
          as: 'stations'
        }
      ],
      order: [['id', 'ASC']]
    });

    res.json(departments);
  } catch (err) {
    console.error('[GET /api/departments]', err);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
});

module.exports = router;
