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

    // ======= REGRAS DE NEGOCIO ======

    validarNome(nome) {
        if (!nome || nome.trim().length < 3 || nome.trim().length > 100) throw new Error("Nome deve conter entre 3 e 100 caracteres.");
        return nome.trim();
    }

    validarTelefone(telefone) { // remover tudo que nao for numero
        const telefoneNumerico = telefone.replace(/\D/g, '');
        if (telefoneNumerico.length < 10 || telefoneNumerico.length > 11) throw new Error("Telefone deve conter 10 ou 11 dígitos numéricos.");
        return telefoneNumerico;
    }

    validarEmail(email) { //Tem que ter texto + @ + texto + . + texto, sem espaços
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) throw new Error("Email em formato inválido.")
        return email.toLowerCase();
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

    // ======= INTEGRACAO ViaCEP =======

    async buscarEnderecoViaCep(cep) {
        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

            if (!resposta.ok) throw new Error("Serviço ViaCEP indisponível no momento.");

            const dados = await resposta.json();

            if (dados.erro) throw new Error(`CEP ${cep} não encontrado.`);

            return {
                logradouro: dados.logradouro,
                bairro: dados.bairro,
                localidade: dados.localidade,
                uf: dados.uf
            };

        } catch (error) {
            if (error.message.includes("não encontrado") || error.message.includes("ViaCEP")) {
                throw error;
            } throw new Error("Serviço ViaCEP indisponível no momento.");
        }
    }

    async criar() {

        const nomeValidado = this.validarNome(this.nome);
        const telefoneValidado = this.validarTelefone(this.telefone);
        const emailValidado = this.validarEmail(this.email);
        const cpfValidado = this.validarCPF(this.cpf);
        const cepValidado = this.validarCEP(this.cep);

        const endereco = await this.buscarEnderecoViaCep(cepValidado);


        // ======= VERIFICACOES DE DUPLICIDADE =======

        const cpfExistente = await prisma.cliente.findUnique({
            where: { cpf: cpfValidado }
        });
        if (cpfExistente) throw new Error("CPF já cadastrado no sistema.");

        const telefoneExistente = await prisma.cliente.findUnique({
            where: { telefone: telefoneValidado }
        });
        if (telefoneExistente) throw new Error("Telefone já cadastrado para outro cliente.");

        const emailExistente = await prisma.cliente.findUnique({
            where: { email: emailValidado }
        });
        if (emailExistente) throw new Error("Email já cadastrado no sistema.");

        return prisma.cliente.create({
            data: {
                nome: nomeValidado,
                telefone: telefoneValidado,
                email: emailValidado,
                cpf: cpfValidado,
                cep: cepValidado,
                logradouro: endereco.logradouro,
                bairro: endereco.bairro,
                localidade: endereco.localidade,
                uf: endereco.uf,
                ativo: this.ativo
            },
        });
    }

    async atualizar() {

        const clienteExistente = await prisma.cliente.findUnique({
            where: { id: this.id }
        });
        if (!clienteExistente) throw new Error("Cliente não encontrado.");

        const dataUpdate = {};

        if (this.nome) dataUpdate.nome = this.validarNome(this.nome);

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

        if (this.email) {
            const emailValidado = this.validarEmail(this.email);

            if (emailValidado !== clienteExistente.email) {
                const emailExistente = await prisma.cliente.findUnique({
                    where: { email: emailValidado }
                });

                if (emailExistente) throw new Error("Email já cadastrado no sistema.");
            }

            dataUpdate.email = emailValidado;
        }

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

        if (this.cep !== null) {
            const cepValidado = this.validarCEP(this.cep);

            if (cepValidado !== clienteExistente.cep) {
                const endereco = await this.buscarEnderecoViaCep(cepValidado);

                dataUpdate.cep = cepValidado;
                dataUpdate.logradouro = endereco.logradouro;
                dataUpdate.bairro = endereco.bairro;
                dataUpdate.localidade = endereco.localidade;
                dataUpdate.uf = endereco.uf;
            }
        }

        if (this.ativo !== undefined) dataUpdate.ativo = this.ativo;

        return prisma.cliente.update({
            where: { id: this.id },
            data: dataUpdate
        });
    }

    async deletar() {

        const cliente = await prisma.cliente.findUnique({
            where: { id: this.id },
            include: {
                pedidos: {
                    where: { status: "ABERTO" }
                }
            }
        });

        if (!cliente) {
            throw new Error("Cliente não encontrado.");
        }

        if (cliente.pedidos.length > 0) throw new Error("Não é possível deletar cliente com pedido em status ABERTO.");

        return prisma.cliente.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) where.nome = { contains: filtros.nome, mode: 'insensitive' };
        if (filtros.cpf) where.cpf = filtros.cpf.replace(/\D/g, '');
        if (filtros.ativo !== undefined) where.ativo = filtros.ativo === 'true' || filtros.ativo === true;

        return prisma.cliente.findMany({
            where,
            orderBy: { id: "asc" }
        });
    }

    static async buscarPorId(id) {
        return prisma.cliente.findUnique({
            where: { id }
        });
    }
}