import PedidoModel from '../models/pedidoModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { clienteId, total, status } = req.body;

        if (clienteId === undefined || clienteId === null) {
            return res.status(400).json({ error: 'O campo "clienteId" é obrigatório!' });
        }
        const clienteInt = parseInt(clienteId);
        if (isNaN(clienteInt)) {
            return res
                .status(400)
                .json({ error: 'O campo "clienteId" deve ser um número válido.' });
        }

        const pedidoData = { clienteId: clienteInt };
        if (total !== undefined && total !== null) {
            const tot = parseFloat(total);
            if (isNaN(tot))
                return res.status(400).json({ error: 'O campo "total" deve ser numérico.' });
            pedidoData.total = tot;
        }
        if (status) {
            pedidoData.status = status;
        }

        const exemplo = new PedidoModel(pedidoData);
        const data = await exemplo.criar();

        res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await PedidoModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(200).json({ message: 'Nenhum registro encontrado.' });
        }

        res.json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const exemplo = await PedidoModel.buscarPorId(parseInt(id));

        if (!exemplo) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        res.json({ data: exemplo });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const exemplo = await PedidoModel.buscarPorId(parseInt(id));

        if (!exemplo) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        if (req.body.clienteId !== undefined) {
            const c = parseInt(req.body.clienteId);
            if (isNaN(c))
                return res.status(400).json({ error: 'O campo "clienteId" deve ser numérico.' });
            exemplo.clienteId = c;
        }
        if (req.body.total !== undefined) {
            const t = parseFloat(req.body.total);
            if (isNaN(t))
                return res.status(400).json({ error: 'O campo "total" deve ser numérico.' });
            exemplo.total = t;
        }
        if (req.body.status !== undefined) {
            exemplo.status = req.body.status;
        }

        const data = await exemplo.atualizar();

        res.json({ message: `O pedido com id ${data.id} foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const pedido = await PedidoModel.buscarPorId(parseInt(id));

        if (!pedido) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await pedido.deletar();

        res.json({
            message: `O pedido com id ${pedido.id} foi deletado com sucesso!`,
            deletado: pedido,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
