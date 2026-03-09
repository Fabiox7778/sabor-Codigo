import prisma from '../utils/prismaClient.js';

export default class PedidoModel {
    constructor({
        id = null,
        clienteId = null,
        total = 0,
        status = 'ABERTO',
        criadoEm = null,
    } = {}) {
        this.id = id;
        this.clienteId = clienteId;
        this.total = total;
        this.status = status;
        this.criadoEm = criadoEm;
    }

    async criar() {
        const data = { clienteId: this.clienteId };
        if (this.total !== undefined && this.total !== null) data.total = this.total;
        if (this.status) data.status = this.status;

        const pedido = await prisma.pedido.create({ data });
        return new PedidoModel(pedido);
    }

    async atualizar() {
        const data = {};
        if (this.clienteId !== undefined) data.clienteId = this.clienteId;
        if (this.total !== undefined) data.total = this.total;
        if (this.status !== undefined) data.status = this.status;

        const pedido = await prisma.pedido.update({ where: { id: this.id }, data });
        return new PedidoModel(pedido);
    }

    static async buscarPorId(id) {
        const pedido = await prisma.pedido.findUnique({ where: { id } });
        if (!pedido) return null;
        return new PedidoModel(pedido);
    }

    static async buscarTodos() {
        const pedidos = await prisma.pedido.findMany();
        return pedidos.map((p) => new PedidoModel(p));
    }
}
