import ProdutoModel from '../models/ProdutoModel.js';

//Validamos o preço
function validarPreco(preco) {
    const precoNumero = parseFloat(preco);

    if (isNaN(precoNumero) || precoNumero <= 0) {
        return { valido: false, mensagem: 'O preço deve ser um número maior que 0.' };
    }

    if (!/^\d+(\.\d{1,2})?$/.test(preco.toString())) {
        return { valido: false, mensagem: 'O preço deve ter no máximo 2 casas decimais.' };
    }

    return { valido: true, preco: precoNumero };
}

//Criando produto
export const criar = async (req, res) => {
    try {
        const { nome, descricao, categoria, preco, disponivel } = req.body;

        if (!nome || nome.trim().length < 3) {
            return res
                .status(400)
                .json({ error: 'O nome é obrigatório e deve ter no mínimo 3 caracteres.' });
        }

        if (descricao && descricao.length > 255) {
            return res
                .status(400)
                .json({ error: 'A descrição deve ter no máximo 255 caracteres.' });
        }

        if (preco === undefined || preco === null) {
            return res.status(400).json({ error: 'O campo "preco" é obrigatório!' });
        }

        const validacaoPreco = validarPreco(preco);

        if (!validacaoPreco.valido) {
            return res.status(400).json({ error: validacaoPreco.mensagem });
        }

        const categoriasValidas = ['LANCHE', 'BEBIDA', 'SOBREMESA', 'COMBO'];

        if (categoria && !categoriasValidas.includes(categoria)) {
            return res.status(400).json({ error: 'Categoria inválida!' });
        }

        const produto = new ProdutoModel({
            nome,
            descricao,
            categoria,
            preco: validacaoPreco.preco,
            disponivel,
        });

        const data = await produto.criar();

        res.status(201).json({
            message: 'Produto criado com sucesso!',
            data,
        });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: 'Erro interno ao criar o produto.' });
    }
};

//Buscar todos
export const buscarTodos = async (req, res) => {
    try {
        const registros = await ProdutoModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(200).json({
                message: 'Nenhum produto encontrado.',
            });
        }

        res.json(registros);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
};

//Buscar por ID
export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                error: 'O ID enviado não é um número válido.',
            });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            return res.status(404).json({
                error: 'Produto não encontrado.',
            });
        }

        res.json({
            data: produto,
        });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({
            error: 'Erro ao buscar o produto.',
        });
    }
};

//Atualizar produto
export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                error: 'ID inválido.',
            });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            return res.status(404).json({
                error: 'Produto não encontrado para atualizar.',
            });
        }

        if (req.body.nome !== undefined) {
            if (req.body.nome.trim().length < 3) {
                return res.status(400).json({
                    error: 'O nome deve ter no mínimo 3 caracteres.',
                });
            }

            produto.nome = req.body.nome;
        }

        if (req.body.descricao !== undefined) {
            if (req.body.descricao.length > 255) {
                return res.status(400).json({
                    error: 'A descrição deve ter no máximo 255 caracteres.',
                });
            }

            produto.descricao = req.body.descricao;
        }

        if (req.body.preco !== undefined) {
            const validacaoPreco = validarPreco(req.body.preco);

            if (!validacaoPreco.valido) {
                return res.status(400).json({
                    error: validacaoPreco.mensagem,
                });
            }

            produto.preco = validacaoPreco.preco;
        }

        if (req.body.categoria !== undefined) {
            const categoriasValidas = ['LANCHE', 'BEBIDA', 'SOBREMESA', 'COMBO'];

            if (!categoriasValidas.includes(req.body.categoria)) {
                return res.status(400).json({
                    error: 'Categoria inválida.',
                });
            }

            produto.categoria = req.body.categoria;
        }

        if (req.body.disponivel !== undefined) {
            produto.disponivel = req.body.disponivel;
        }

        const data = await produto.atualizar();

        res.json({
            message: `O produto "${data.nome}" foi atualizado com sucesso!`,
            data,
        });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({
            error: 'Erro ao atualizar o produto.',
        });
    }
};

//Deletar produto
export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                error: 'ID inválido.',
            });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            return res.status(404).json({
                error: 'Produto não encontrado para deletar.',
            });
        }

        const emPedidoAberto = await ProdutoModel.verificarPedidoAberto(id);

        if (emPedidoAberto) {
            return res.status(400).json({
                error: 'Não é possível deletar um produto que está em um pedido aberto.',
            });
        }

        await produto.deletar();

        res.json({
            message: `O produto "${produto.nome}" foi deletado com sucesso!`,
            deletado: produto,
        });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({
            error: 'Erro ao deletar o produto.',
        });
    }
};
