const HeroService = require('../services/heroService');
const ResponseHelper = require('../utils/responseHelper');
const MESSAGES = require('../constants/messages');
const { handleValidationErrors } = require('../utils/validationHelper');

exports.getAllHeroes = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const heroes = await HeroService.getAllHeroes(userId);
    return ResponseHelper.success(res, heroes);
  } catch (error) {
    next(error);
  }
};

exports.getHeroById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;
    const hero = await HeroService.getHeroById(id, userId);
    return ResponseHelper.success(res, hero);
  } catch (error) {
    if (error.isOperational) {
      return ResponseHelper.error(res, error.message, error.statusCode, error.code);
    }
    next(error);
  }
};

exports.createHero = [
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const heroData = req.body;
      const hero = await HeroService.createHero(userId, heroData);
      return ResponseHelper.created(res, hero, MESSAGES.HEROES.CREATED);
    } catch (error) {
      next(error);
    }
  }
];

exports.updateHero = [
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.sub;
      const heroData = req.body;
      const hero = await HeroService.updateHero(id, userId, heroData);
      return ResponseHelper.success(res, hero, MESSAGES.HEROES.UPDATED);
    } catch (error) {
      if (error.isOperational) {
        return ResponseHelper.error(res, error.message, error.statusCode, error.code);
      }
      next(error);
    }
  }
];

exports.deleteHero = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;
    await HeroService.deleteHero(id, userId);
    return ResponseHelper.success(res, null, MESSAGES.HEROES.DELETED);
  } catch (error) {
    if (error.isOperational) {
      return ResponseHelper.error(res, error.message, error.statusCode, error.code);
    }
    next(error);
  }
};

exports.markHeroAsDone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;
    const hero = await HeroService.markHeroAsDone(id, userId);
    
    if (hero.isDone && !hero.updatedAt) {
      return ResponseHelper.success(
        res,
        hero,
        MESSAGES.HEROES.ALREADY_DONE
      );
    }
    
    return ResponseHelper.success(res, hero, MESSAGES.HEROES.MARKED_AS_DONE);
  } catch (error) {
    if (error.isOperational) {
      return ResponseHelper.error(res, error.message, error.statusCode, error.code);
    }
    
    try {
      const { id } = req.params;
      const userId = req.user.sub;
      const Hero = require('../models/hero');
      const hero = await Hero.findOneAndUpdate(
        { _id: id, userId },
        { isDone: true },
        { new: true }
      );

      if (!hero) {
        return ResponseHelper.notFound(res, MESSAGES.HEROES.NOT_FOUND);
      }

      return ResponseHelper.success(
        res,
        hero,
        'Heroe marcado como completado (fallback)'
      );
    } catch (fallbackError) {
      next(fallbackError);
    }
  }
};
