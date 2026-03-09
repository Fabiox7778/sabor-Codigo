import { Router } from 'express';
import ClienteController from '../controllers/clienteController.js';

const router = Router();

router.post('/', ClienteController.criar);
router.put('/:id', ClienteController.atualizar);
router.delete('/:id', ClienteController.deletar);
router.get('/', ClienteController.buscarTodos);
router.get('/:id', ClienteController.buscarPorId);
router.get('/:id/clima', ClienteController.buscarClima);

export default router;