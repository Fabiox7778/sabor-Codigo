import ProdutoModel from '../models/ProdutoModel.js';

// Função para criar um novo produto
export const criar = async (req, res) => {
    try {
        // Verifica se o corpo da requisição não está vazio
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, estado, preco, categoria, disponivel = true } = req.body;

        // Validação dos campos obrigatórios
        if (!nome) return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        if (preco === undefined || preco === null)
            return res.status(400).json({ error: 'O campo "preco" é obrigatório!' });

        // Validação da categoria
        const categoriasValidas = ['LANCHE', 'BEBIDA', 'SOBREMESA', 'COMBO'];
        if (categoria && !categoriasValidas.includes(categoria)) {
            return res.status(400).json({ error: 'Categoria inválida!' });
        }

        // Criação do novo produto
        const produto = new ProdutoModel({
            nome,
            estado,
            preco: parseFloat(preco),
            categoria,
            disponivel,
        });
        const data = await produto.criar();

        // Retorna resposta de sucesso
        res.status(201).json({ message: 'Produto criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: 'Erro interno ao criar o produto.' });
    }
};

// Função para buscar todos os produtos
export const buscarTodos = async (req, res) => {
    try {
        const registros = await ProdutoModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(200).json({ message: 'Nenhum produto encontrado.' });
        }

        res.json(registros);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
};

// Função para buscar um produto pelo ID
export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        res.json({ data: produto });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ error: 'Erro ao buscar o produto.' });
    }
};

// Função para atualizar os dados de um produto
export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado para atualizar.' });
        }

        // Atualização dos campos
        if (req.body.nome !== undefined) produto.nome = req.body.nome;
        if (req.body.estado !== undefined) produto.estado = req.body.estado;
        if (req.body.preco !== undefined) produto.preco = parseFloat(req.body.preco);
        if (req.body.categoria !== undefined) produto.categoria = req.body.categoria;
        if (req.body.disponivel !== undefined) produto.disponivel = req.body.disponivel;

        const data = await produto.atualizar();

        res.json({ message: `O produto "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ error: 'Erro ao atualizar o produto.' });
    }
};

// Função para deletar um produto
export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado para deletar.' });
        }

        await produto.deletar();

        res.json({
            message: `O produto "${produto.nome}" foi deletado com sucesso!`,
            deletado: produto,
        });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ error: 'Erro ao deletar o produto.' });
    }
};
