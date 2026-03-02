import prisma from '../utils/prismaClient.js';

export default class ClienteModel {
    constructor({ id = null, nome = null, telefone = null, email = null, cpf = null, cep = null, logradouro = null, bairro = null, localidade = null, uf = null, ativo = true } = {}) {

        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.cpf = cpf;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = ativo;
    }

    // ======= REGRAS DE NEGOCIO =======

    validarTelefone(telefone) {
        const telefoneNumerico = telefone.replace(/\D/g, '');
        if (telefoneNumerico.length < 10 || telefoneNumerico.length > 11) throw new Error("Telefone deve conter 10 ou 11 dígitos numéricos.");
        return telefoneNumerico;
    }

    validarCPF(cpf) {
        const cpfNumerico = cpf.replace(/\D/g, '');
        if (!/^\d{11}$/.test(cpfNumerico)) throw new Error("CPF deve conter 11 dígitos numéricos.");
        return cpfNumerico;
    }

    validarCEP(cep) {
        const cepNumerico = cep.replace(/\D/g, '');
        if (!/^\d{8}$/.test(cepNumerico)) {
            throw new Error("CEP deve conter exatamente 8 dígitos numéricos.");
        }
        return cepNumerico;
    }

    async criar() {

        // ======= VERIFICACOES DE OBRIGATORIEDADE =======

        if (!this.nome) throw new Error("O campo 'nome' é obrigatório.");
        if (!this.telefone) throw new Error("O campo 'telefone' é obrigatório.");
        if (!this.email) throw new Error("O campo 'email' é obrigatório.");
        if (!this.cpf) throw new Error("O campo 'cpf' é obrigatório.");

        const telefoneValidado = this.validarTelefone(this.telefone)
        const cpfValidado = this.validarCPF(this.cpf)
        const cepValidado = this.validarCEP(this.cep)

        // ======= VERIFICACOES DE DUPLICIDADE =======

        const cpfExistente = await prisma.cliente.findUnique({
            where: { cpf: cpfValidado }
        });
        if (cpfExistente) throw new Error("CPF já cadastrado no sistema.");

        const telefoneExistente = await prisma.cliente.findUnique({
            where: { telefone: telefoneValidado }
        });
        if (telefoneExistente) throw new Error("Telefone já cadastrado para outro cliente.");

        return prisma.cliente.create({
            data: {
                nome: this.nome,
                telefone: telefoneValidado,
                email: this.email,
                cpf: cpfValidado,
                cep: cepValidado,
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo
            },
        });
    }

    async atualizar() {

        if (!this.id) throw new Error("ID é obrigatório para atualização.");

        const clienteExistente = await prisma.cliente.findUnique({
            where: { id: this.id }
        });
        if (!clienteExistente) throw new Error("Cliente não encontrado.");

        const dataUpdate = {};

        if (this.nome) dataUpdate.nome = this.nome;

        if (this.telefone) {
            const telefoneValidado = this.validarTelefone(this.telefone);

            if (telefoneValidado !== clienteExistente.telefone) {
                const telefoneExistente = await prisma.cliente.findUnique({
                    where: { telefone: telefoneValidado }
                });

                if (telefoneExistente) {
                    throw new Error("Telefone já cadastrado para outro cliente.");
                }
            }

            dataUpdate.telefone = telefoneValidado;
        }

        if (this.email) dataUpdate.email = this.email;

        if (this.cpf) {
            const cpfValidado = this.validarCPF(this.cpf);

            if (cpfValidado !== clienteExistente.cpf) {
                const cpfExistente = await prisma.cliente.findUnique({
                    where: { cpf: cpfValidado }
                });

                if (cpfExistente) throw new Error("CPF já cadastrado no sistema.");
            }

            dataUpdate.cpf = cpfValidado;
        }

        if (this.cep) {
            dataUpdate.cep = this.validarCEP(this.cep);
        }

        if (this.logradouro !== undefined) dataUpdate.logradouro = this.logradouro;
        if (this.bairro !== undefined) dataUpdate.bairro = this.bairro;
        if (this.localidade !== undefined) dataUpdate.localidade = this.localidade;
        if (this.uf !== undefined) dataUpdate.uf = this.uf;
        if (this.ativo !== undefined) dataUpdate.ativo = this.ativo;

        return prisma.cliente.update({
            where: { id: this.id },
            data: dataUpdate
        });
    }

    async deletar() {

        if (!this.id) throw new Error("ID é obrigatório para deletar.");

        const cliente = await prisma.cliente.findUnique({
            where: { id: this.id },
            include: {
                pedidos: {
                    where: { status: "ABERTO" }
                }
            }
        });

        if (!cliente) throw new Error("Cliente não encontrado.");

        if (cliente.pedidos.length > 0) throw new Error("Não é possível deletar cliente com pedido em status ABERTO.");

        return prisma.cliente.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) where.nome = { contains: filtros.nome, mode: 'insensitive' };
        if (filtros.cpf) where.cpf = filtros.cpf.replace(/\D/g, '');
        if (filtros.ativo !== undefined) where.ativo = filtros.ativo === 'true' || filtros.ativo === true;
        if (Object.keys(where).length === 0) {
            throw new Error("Informe pelo menos um parâmetro para filtro.");
        }

        return prisma.cliente.findMany({
            where,
            orderBy: { nome: "asc" }
        });
    }

    static async buscarPorId(id) {
        const data = await prisma.cliente.findUnique({ where: { id } });
        if (!data) return null;
        return new ClienteModel(data);
    }
}