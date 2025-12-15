const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllHeroes,
  getHeroById,
  createHero,
  updateHero,
  deleteHero,
  markHeroAsDone
} = require('../controllers/heroesController');
const { heroValidation } = require('../validators/heroValidator');

router.use(authenticateToken);

router.get('/', getAllHeroes);
router.get('/:id', getHeroById);
router.post('/', heroValidation, createHero);
router.put('/:id', heroValidation, updateHero);
router.delete('/:id', deleteHero);
router.put('/:id/done', markHeroAsDone);

module.exports = router;

