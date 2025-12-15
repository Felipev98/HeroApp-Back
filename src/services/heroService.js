const Hero = require('../models/hero');
const { NotFoundError } = require('../errors/AppError');

class HeroService {

  static async getAllHeroes(userId) {
    return await Hero.find({ userId }).sort({ createdAt: -1 });
  }

  static async getHeroById(heroId, userId) {
    const hero = await Hero.findOne({ _id: heroId, userId });
    
    if (!hero) {
      throw new NotFoundError('Heroe no encontrado');
    }
    
    return hero;
  }

  static async createHero(userId, heroData) {
    const { name, description, power } = heroData;
    return await Hero.create({ userId, name, description, power });
  }

  static async updateHero(heroId, userId, heroData) {
    const { name, description, power } = heroData;
    
    const hero = await Hero.findOneAndUpdate(
      { _id: heroId, userId },
      { name, description, power },
      { new: true, runValidators: true }
    );

    if (!hero) {
      throw new NotFoundError('Heroe no encontrado');
    }

    return hero;
  }

  static async deleteHero(heroId, userId) {
    const hero = await Hero.findOneAndDelete({ _id: heroId, userId });

    if (!hero) {
      throw new NotFoundError('Heroe no encontrado');
    }

    return hero;
  }

  static async markHeroAsDone(heroId, userId) {
    const hero = await Hero.findOneAndUpdate(
      { _id: heroId, userId },
      { isDone: true },
      { new: true, runValidators: true }
    );

    if (!hero) {
      throw new NotFoundError('Heroe no encontrado');
    }

    return hero;
  }
}

module.exports = HeroService;

