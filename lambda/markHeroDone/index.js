/**
 * AWS Lambda Function para marcar un héroe como completado
 * 
 * Esta función se puede desplegar en AWS Lambda
 * 
 * Event payload esperado:
 * {
 *   "heroId": "string",
 *   "userId": "string"
 * }
 */

const mongoose = require('mongoose');

// Schema del Hero (debe coincidir con el del backend)
const heroSchema = new mongoose.Schema({
  userId: String,
  name: String,
  description: String,
  power: String,
  isDone: Boolean
}, {
  timestamps: true
});

// Conectar a MongoDB
let Hero;
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI no está configurada');
  }

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
  Hero = mongoose.model('Hero', heroSchema);
}

exports.handler = async (event) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    const { heroId, userId } = event;

    if (!heroId || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'heroId y userId son requeridos'
        })
      };
    }

    // Buscar y actualizar el héroe
    const hero = await Hero.findOneAndUpdate(
      { _id: heroId, userId },
      { isDone: true },
      { new: true }
    );

    if (!hero) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          error: 'Heroe no encontrado o no pertenece al usuario'
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Heroe marcado como completado',
        data: {
          id: hero._id.toString(),
          name: hero.name,
          description: hero.description,
          power: hero.power,
          isDone: hero.isDone,
          userId: hero.userId
        }
      })
    };
  } catch (error) {
    console.error('Error en Lambda:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Error al procesar la solicitud'
      })
    };
  }
};

