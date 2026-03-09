import express from 'express';
import * as controller from '../controllers/pedidoController.js';

const router = express.Router();

router.post('/', controller.criar);
router.get('/', controller.buscarTodos);
router.get('/:id', controller.buscarPorId);
router.put('/:id/cancelar', controller.atualizar);

export default router;
