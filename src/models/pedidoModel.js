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
        const data = {
            clienteId: this.clienteId,
        };
        if (this.total !== undefined && this.total !== null) data.total = this.total;
        if (this.status) data.status = this.status;

        return prisma.pedido.create({ data });
    }

    async atualizar() {
        const data = {};
        if (this.clienteId !== undefined) data.clienteId = this.clienteId;
        if (this.total !== undefined) data.total = this.total;
        if (this.status !== undefined) data.status = this.status;

        return prisma.pedido.update({ where: { id: this.id }, data });
    }

    async deletar() {
        return prisma.pedido.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.clienteId !== undefined) {
            const id = parseInt(filtros.clienteId);
            if (!isNaN(id)) where.clienteId = id;
        }
        if (filtros.status) where.status = filtros.status;
        if (filtros.total !== undefined) {
            const t = parseFloat(filtros.total);
            if (!isNaN(t)) where.total = t;
        }

        return prisma.pedido.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.pedido.findUnique({ where: { id } });
        if (!data) return null;
        return new PedidoModel(data);
    }
}
