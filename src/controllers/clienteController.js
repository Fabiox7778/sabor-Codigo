import ClienteModel from '../models/clienteModel.js';

export const buscarClima = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id))
            return res.status(400).json({ error: 'ID inválido. Informe um número válido.' });

        const cliente = await ClienteModel.buscarPorId(parseInt(id));

        if (!cliente) {
            return res.status(404).json({ erro: 'Cliente não encontrado.' });
        }

        return res.status(200).json(cliente);
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            erro: error.message,
        });
    }
};

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, telefone, email, cpf, cep } = req.body;

        if (!nome) return res.status(400).json({ erro: "O campo 'nome' é obrigatório." });
        if (!telefone) return res.status(400).json({ erro: "O campo 'telefone' é obrigatório." });
        if (!email) return res.status(400).json({ erro: "O campo 'email' é obrigatório." });
        if (!cpf) return res.status(400).json({ erro: "O campo 'cpf' é obrigatório." });
        if (!cep) return res.status(400).json({ erro: "O campo 'cep' é obrigatório." });

        const cliente = new ClienteModel({
            nome,
            telefone,
            email,
            cpf,
            cep,
        });

        const clienteCriado = await cliente.criar();
        return res.status(201).json({
            message: 'Registro cadastrado com sucesso!',
            clienteCriado,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            erro: error.message,
        });
    }
};

export const atualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id))
            return res.status(400).json({ error: 'ID inválido. Informe um número válido.' });

        if (!req.body || Object.keys(req.body).length === 0)
            return res.status(400).json({
                erro: 'Envie pelo menos um campo para atualizar.',
            });

        const cliente = new ClienteModel({
            id: parseInt(id),
            ...req.body,
        });

        const clienteAtualizado = await cliente.atualizar();

        return res.status(200).json({
            message: `O registro foi atualizado com sucesso!`,
            clienteAtualizado,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            erro: error.message,
        });
    }
};

export const deletar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id))
            return res.status(400).json({ error: 'ID inválido. Informe um número válido.' });

        const cliente = new ClienteModel({ id });

        const clienteApagado = await cliente.deletar();

        return res.status(200).json({
            mensagem: 'Cliente deletado com sucesso.',
            clienteApagado,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            erro: error.message,
        });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const filtros = req.query;
        const clientes = await ClienteModel.buscarTodos(filtros);

        if (clientes.length === 0) {
            return res.status(200).json({ mensagem: 'Nenhum cliente encontrado.' });
        }

        return res.status(200).json({
            total: clientes.length,
            message: 'Lista de clientes disponíveis',
            filtros,
            clientes,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            erro: error.message,
        });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id))
            return res.status(400).json({ error: 'ID inválido. Informe um número válido.' });

        const cliente = await ClienteModel.buscarPorId(parseInt(id));

        if (!cliente) {
            return res.status(404).json({ erro: 'Cliente não encontrado.' });
        }

        return res.status(200).json(cliente);
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            erro: error.message,
        });
    }
};

export default {
    buscarClima,
    criar,
    atualizar,
    deletar,
    buscarTodos,
    buscarPorId,
};
