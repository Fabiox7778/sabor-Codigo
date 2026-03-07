import express from 'express';
import 'dotenv/config';
import pedidoRoutes from './routes/pedidoRoute.js';
import produtoRoutes from './routes/produtoRoute.js';
import clienteRoutes from './routes/clienteRoute.js';
import itemPedidoRoutes from './routes/itemPedidoRoute.js'

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('📋 API de pedidos funcionando');
});

app.use('/pedidos', pedidoRoutes);
app.use('/produtos', produtoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/itemPedido', itemPedidoRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`✨ Servidor rodando em http://localhost:${PORT}`);
});
