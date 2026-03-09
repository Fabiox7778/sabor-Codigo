import prisma from '../utils/prismaClient.js';

export default class itemPedido {
    constructor(id, pedidoId, produtoId, quantidade, precoUnitario) {
        this.id = id;
        this.pedidoId = pedidoId;
        this.produtoId = produtoId;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
    }

    async criar() {
        // Regra 1: 
        if (this.quantidade <= 0 || this.quantidade > 99) {
            throw new Error('A quantidade deve ser entre 1 e 99.');
        }

        const produto = await prisma.produto.findUnique({ where: { id: this.produtoId } });
        const pedido = await prisma.pedido.findUnique({ where: { id: this.pedidoId } });

        if (!produto) throw new Error('Produto não encontrado.');
        if (!pedido) throw new Error('Pedido não encontrado.');

        // Regra 3:
        if (!produto.disponivel) throw new Error('Produto indisponível no momento.');

        // Regra 4:
        if (pedido.status !== 'ABERTO') {
            throw new Error('Não é possível adicionar itens a um pedido PAGO ou CANCELADO.');
        }

        // Regra 2:
        const precoNoMomento = produto.preco;

        const registro = await prisma.itemPedido.create({
            data: {
                pedidoId: this.pedidoId,
                produtoId: this.produtoId,
                quantidade: this.quantidade,
                precoUnitario: precoNoMomento,
            },
        });

        await prisma.pedido.update({
            where: { id: this.pedidoId },
            data: { total: { increment: registro.quantidade * registro.precoUnitario } }
        });

        this.id = registro.id;
        this.precoUnitario = registro.precoUnitario;
        return registro;
    }

    async atualizar() {
        if (!this.id) throw new Error('ID não definido para atualização.');

        const itemAntigo = await prisma.itemPedido.findUnique({
            where: { id: this.id },
            include: { pedido: true }
        });

        if (!itemAntigo) throw new Error('Item não encontrado.');

        // Regra 4:
        if (itemAntigo.pedido.status !== 'ABERTO') {
            throw new Error('Não é possível alterar itens de um pedido PAGO ou CANCELADO.');
        }

        // Regra 1:
        if (this.quantidade <= 0 || this.quantidade > 99) {
            throw new Error('A quantidade deve ser entre 1 e 99.');
        }


        const diferencaTotal = (this.quantidade * itemAntigo.precoUnitario) - (itemAntigo.quantidade * itemAntigo.precoUnitario);

        const atualizado = await prisma.itemPedido.update({
            where: { id: this.id },
            data: { quantidade: this.quantidade },
        });

        await prisma.pedido.update({
            where: { id: itemAntigo.pedidoId },
            data: { total: { increment: diferencaTotal } }
        });

        return atualizado;
    }

    async deletar() {
        if (!this.id) throw new Error('ID não definido para exclusão.');

        const itemExistente = await prisma.itemPedido.findUnique({
            where: { id: this.id },
            include: { pedido: true }
        });

        if (!itemExistente) throw new Error('Item não encontrado.');

        // Regra 4:
        if (itemExistente.pedido.status !== 'ABERTO') {
            throw new Error('Não é possível remover itens de um pedido PAGO ou CANCELADO.');
        }


        await prisma.pedido.update({
            where: { id: itemExistente.pedidoId },
            data: { total: { decrement: itemExistente.quantidade * itemExistente.precoUnitario } }
        });

        return prisma.itemPedido.delete({
            where: { id: this.id },
        });
    }

    async buscarPorId() {
        if (!this.id) throw new Error('ID não definido para busca.');
        const registro = await prisma.itemPedido.findUnique({ where: { id: this.id } });
        if (!registro) return null;

        this.pedidoId = registro.pedidoId;
        this.produtoId = registro.produtoId;
        this.quantidade = registro.quantidade;
        this.precoUnitario = registro.precoUnitario;
        return this;
    }

    async buscarTodos() {
        return prisma.itemPedido.findMany();
    }
}
