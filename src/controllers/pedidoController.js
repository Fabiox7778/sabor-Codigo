import PedidoModel from '../models/pedidoModel.js';
import prisma from '../utils/prismaClient.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { clienteId } = req.body;

        if (clienteId === undefined || clienteId === null) {
            return res.status(400).json({ error: 'O campo "clienteId" é obrigatório!' });
        }
        const clienteInt = parseInt(clienteId);
        if (isNaN(clienteInt)) {
            return res
                .status(400)
                .json({ error: 'O campo "clienteId" deve ser um número válido.' });
        }

        const cliente = await prisma.cliente.findUnique({
            where: { id: clienteInt },
        });

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        if (cliente.ativo === false) {
            return res.status(400).json({
                error: 'Não é possível criar um pedido para esse cliente inativo.',
            });
        }

        const pedidoData = {
            clienteId: clienteInt,
            status: 'ABERTO',
        };

        const pedido = new PedidoModel(pedidoData);
        const data = await pedido.criar();

        res.status(201).json({ message: 'Pedido criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        res.status(500).json({ error: 'Erro interno ao salvar o pedido.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const pedidos = await PedidoModel.buscarTodos(req.query);

        if (!pedidos || pedidos.length === 0) {
            return res.status(200).json({ message: 'Nenhum pedido encontrado.'});
        }

        res.json(pedidos);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar pedidos.'});
    }
};

export const buscarPorId =async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido'});
        }

        const pedido = await PedidoModel.buscarPorId(parseInt(id));

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado.'});
        }

        res.json(pedido);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar pedido.'});
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const pedido = await PedidoModel.buscarPorId(parseInt(id));

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        if (pedido.status !== "ABERTO") {
            return res.status(400).json({
                error: 'Só é possível cancelar pedidos que estejam ABERTOS.'
            });
        }

        pedido.status = "CANCELADO";

        const data = await pedido.atualizar();

        res.json({
            message: `Pedido ${data.id} cancelado com sucesso!`,
            data
        });

    } catch (error) {
        console.error('Erro ao cancelar pedido:', error);
        res.status(500).json({ error: 'Erro ao cancelar pedido.' });
    }
};
