// api/controllers/hello.js
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Retorna un saludo.
 *     responses:
 *       200:
 *         description: Éxito
 */
router.get('/hello', (req, res) => {
  res.send('¡Hola, mundo!');
});

export default router;
