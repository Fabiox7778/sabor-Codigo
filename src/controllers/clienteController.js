import ClienteModel from '../models/clienteModel.js';
export default class ClienteController {
    static async criar(req, res) {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
            }

            const cliente = new ClienteModel(req.body);
            const data = await cliente.criar();

            res.status(201).json({ message: 'Registro criado com sucesso!', data });

        } catch (error) {
            console.error('Erro ao criar:', error);
            res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
        }
    };

    static async atualizar(req, res) {
        try {

            const { id } = req.params;

            if (isNaN(id) || !id) return res.status(400).json({ error: "ID inválido. Informe um número válido." });

            const cliente = new ClienteModel({
                id: parseInt(id),
                ...req.body
            });

            const data = await cliente.atualizar();

            return res.status(200).json(data);

        } catch (error) {
            console.error('Erro ao atualizar:', error);
            res.status(500).json({ error: 'Erro ao atualizar registro.' });
        }
    };

    static async deletar(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id) || !id) return res.status(400).json({ error: "ID inválido. Informe um número válido." });

            const cliente = new ClienteModel({ id: parseInt(id) });

            const deletado = await cliente.deletar();

            return res.status(200).json({ message: `O registro "${deletado.nome}" foi deletado com sucesso!`, data: deletado });
        } catch (error) {
            console.error('Erro ao deletar:', error);
            res.status(500).json({ error: 'Erro ao deletar registro.' });
        }
    };

    static async buscarTodos(req, res) {
        try {
            const clientes = await ClienteModel.buscarTodos(req.query);

            return res.status(200).json(clientes);

        } catch (error) {
            console.error('Erro ao buscar regsitros', error);
            res.status(400).json({ error: 'Erro ao buscar registros.' });
        }
    };

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    error: "ID é obrigatório."
                });
            }
            const cliente = await ClienteModel.buscarPorId(parseInt(id));

            if (!cliente) {
                return res.status(404).json({
                    error: "Cliente não encontrado."
                });
            }

            return res.status(200).json(cliente);

        } catch (error) {
            console.error('Erro ao buscar regitro', error);
            res.status(500).json({ error: 'Erro ao buscar registro.' });
        }
    }
}