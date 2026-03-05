import ClienteModel from '../models/clienteModel.js';

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
            cep
        });

        const clienteCriado = await cliente.criar();
        return res.status(201).json({
            message: 'Registro cadastrado com sucesso!',
            clienteCriado
        });

    } catch (error) {
        if (
            error.message.includes("CPF") ||
            error.message.includes("Telefone") ||
            error.message.includes("CEP") ||
            error.message.includes("ViaCEP") ||
            error.message.includes("não encontrado")
        ) {
            return res.status(400).json({ erro: error.message });
        }
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};

export const atualizar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        if (isNaN(id)) return res.status(400).json({ error: "ID inválido. Informe um número válido." });

        if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({
            erro: "Envie pelo menos um campo para atualizar."
        });

        const cliente = new ClienteModel({
            id: parseInt(id),
            ...req.body
        });

        const clienteAtualizado = await cliente.atualizar();

        return res.status(200).json({
            message: `O registro foi atualizado com sucesso!`, clienteAtualizado
        });

    } catch (error) {
        if (
            error.message.includes("Cliente não encontrado") ||
            error.message.includes("CPF") ||
            error.message.includes("Telefone") ||
            error.message.includes("CEP") ||
            error.message.includes("ViaCEP") ||
            error.message.includes("não encontrado")
        ) {
            return res.status(400).json({ erro: error.message });
        }
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};

export const deletar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        if (isNaN(id)) return res.status(400).json({ error: "ID inválido. Informe um número válido." });

        const cliente = new ClienteModel({ id });

        const clienteApagado = await cliente.deletar();

        return res.status(200).json({
            mensagem: "Cliente deletado com sucesso.",
            clienteApagado
        });

    } catch (error) {
        if (
            error.message.includes("Cliente não encontrado") ||
            error.message.includes("ABERTO")
        ) {
            return res.status(400).json({ erro: error.message });
        }

        return res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const filtros = req.query;
        const clientes = await ClienteModel.buscarTodos(filtros);

        if (clientes.length === 0) {
            return res.status(200).json({ mensagem: "Nenhum cliente encontrado." });
        }

        return res.status(200).json({
            total: clientes.length,
            message: 'Lista de clientes disponíveis',
            filtros,
            clientes
        });

    } catch (error) {
        if (error.message.includes("Informe pelo menos")) {
            return res.status(400).json({ erro: error.message });
        }

        return res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

export const buscarPorId = async (req, res) => {
    try {

        const id = Number(req.params.id);

        if (isNaN(id)) return res.status(400).json({ error: "ID inválido. Informe um número válido." });

        const cliente = await ClienteModel.buscarPorId(parseInt(id));

        if (!cliente) {
            return res.status(404).json({ erro: "Cliente não encontrado." });
        }

        return res.status(200).json(cliente);

    } catch (error) {
        return res.status(500).json({ erro: "Erro interno do servidor." });
    }
}

export default {
    criar,
    atualizar,
    deletar,
    buscarTodos,
    buscarPorId
};