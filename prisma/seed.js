import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Resetando tabela exemplo...');

    console.log('📦 Inserindo clientes...');

    await prisma.cliente.createMany({
        data: [
            {
                nome: 'João Silva',
                telefone: '11987654321',
                email: 'joao@email.com',
                cpf: '12345678901',
                cep: '01310100',
                logradouro: 'Avenida Paulista',
                bairro: 'Bela Vista',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Maria Santos',
                telefone: '11987654322',
                email: 'maria@email.com',
                cpf: '12345678902',
                cep: '01310100',
                logradouro: 'Avenida Paulista',
                bairro: 'Bela Vista',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Pedro Oliveira',
                telefone: '11987654323',
                email: 'pedro@email.com',
                cpf: '12345678903',
                cep: '04567890',
                logradouro: 'Rua Augusta',
                bairro: 'Consolação',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Ana Costa',
                telefone: '11987654324',
                email: 'ana@email.com',
                cpf: '12345678904',
                cep: '05678901',
                logradouro: 'Rua Oscar Freire',
                bairro: 'Jardins',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Carlos Ferreira',
                telefone: '11987654325',
                email: 'carlos@email.com',
                cpf: '12345678905',
                cep: '06789012',
                logradouro: 'Avenida Rebouças',
                bairro: 'Pinheiros',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Juliana Lima',
                telefone: '11987654326',
                email: 'juliana@email.com',
                cpf: '12345678906',
                cep: '07890123',
                logradouro: 'Rua da Consolação',
                bairro: 'Centro',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Roberto Alves',
                telefone: '11987654327',
                email: 'roberto@email.com',
                cpf: '12345678907',
                cep: '08901234',
                logradouro: 'Avenida Faria Lima',
                bairro: 'Itaim Bibi',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Fernanda Souza',
                telefone: '11987654328',
                email: 'fernanda@email.com',
                cpf: '12345678908',
                cep: '09012345',
                logradouro: 'Rua Haddock Lobo',
                bairro: 'Cerqueira César',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Ricardo Martins',
                telefone: '11987654329',
                email: 'ricardo@email.com',
                cpf: '12345678909',
                cep: '10123456',
                logradouro: 'Avenida Brigadeiro',
                bairro: 'Bela Vista',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Patricia Rocha',
                telefone: '11987654330',
                email: 'patricia@email.com',
                cpf: '12345678910',
                cep: '11234567',
                logradouro: 'Rua Estados Unidos',
                bairro: 'Jardim América',
                localidade: 'São Paulo',
                uf: 'SP',
            },
        ],
    });

    console.log('🍔 Inserindo produtos...');

    await prisma.produto.createMany({
        data: [
            {
                nome: 'X-Burger',
                descricao: 'Hambúrguer artesanal com queijo',
                categoria: 'LANCHE',
                preco: 25.9,
            },
            {
                nome: 'Coca-Cola 350ml',
                descricao: 'Refrigerante gelado',
                categoria: 'BEBIDA',
                preco: 6.0,
            },
            {
                nome: 'X-Bacon',
                descricao: 'Hambúrguer com bacon crocante',
                categoria: 'LANCHE',
                preco: 28.9,
            },
            {
                nome: 'X-Salada',
                descricao: 'Hambúrguer com salada fresca',
                categoria: 'LANCHE',
                preco: 24.9,
            },
            {
                nome: 'Batata Frita',
                descricao: 'Porção de batatas fritas crocantes',
                categoria: 'LANCHE',
                preco: 15.0,
            },
            {
                nome: 'Suco de Laranja',
                descricao: 'Suco natural de laranja',
                categoria: 'BEBIDA',
                preco: 8.0,
            },
            {
                nome: 'Guaraná 350ml',
                descricao: 'Refrigerante de guaraná gelado',
                categoria: 'BEBIDA',
                preco: 6.0,
            },
            {
                nome: 'Milk Shake',
                descricao: 'Milk shake de chocolate',
                categoria: 'BEBIDA',
                preco: 12.0,
            },
            {
                nome: 'X-Tudo',
                descricao: 'Hambúrguer completo com todos os ingredientes',
                categoria: 'LANCHE',
                preco: 32.9,
            },
            {
                nome: 'Água Mineral',
                descricao: 'Água mineral sem gás',
                categoria: 'BEBIDA',
                preco: 4.0,
            },
        ],
    });

    const clientes = await prisma.cliente.findMany();
    const produtos = await prisma.produto.findMany();

    console.log('🧾 Inserindo pedidos...');

    await prisma.pedido.createMany({
        data: [
            { clienteId: clientes[0].id, total: 31.9, status: 'ABERTO' },
            { clienteId: clientes[1].id, total: 52.9, status: 'PAGO' },
            { clienteId: clientes[2].id, total: 28.9, status: 'CANCELADO' },
            { clienteId: clientes[3].id, total: 40.9, status: 'PAGO' },
            { clienteId: clientes[4].id, total: 15.0, status: 'ABERTO' },
            { clienteId: clientes[5].id, total: 44.9, status: 'PAGO' },
            { clienteId: clientes[6].id, total: 32.9, status: 'ABERTO' },
            { clienteId: clientes[7].id, total: 36.0, status: 'CANCELADO' },
            { clienteId: clientes[8].id, total: 20.0, status: 'ABERTO' },
            { clienteId: clientes[9].id, total: 48.9, status: 'CANCELADO' },
        ],
    });

    const pedidos = await prisma.pedido.findMany();

    console.log('📦 Inserindo itens dos pedidos...');

    await prisma.itemPedido.createMany({
        data: [
            {
                pedidoId: pedidos[0].id,
                produtoId: produtos[0].id,
                quantidade: 1,
                precoUnitario: 25.9,
            },
            {
                pedidoId: pedidos[0].id,
                produtoId: produtos[1].id,
                quantidade: 1,
                precoUnitario: 6.0,
            },
            {
                pedidoId: pedidos[1].id,
                produtoId: produtos[2].id,
                quantidade: 1,
                precoUnitario: 28.9,
            },
            {
                pedidoId: pedidos[1].id,
                produtoId: produtos[4].id,
                quantidade: 1,
                precoUnitario: 15.0,
            },
            {
                pedidoId: pedidos[2].id,
                produtoId: produtos[2].id,
                quantidade: 1,
                precoUnitario: 28.9,
            },
            {
                pedidoId: pedidos[3].id,
                produtoId: produtos[3].id,
                quantidade: 1,
                precoUnitario: 24.9,
            },
            {
                pedidoId: pedidos[4].id,
                produtoId: produtos[4].id,
                quantidade: 1,
                precoUnitario: 15.0,
            },
            {
                pedidoId: pedidos[5].id,
                produtoId: produtos[8].id,
                quantidade: 1,
                precoUnitario: 32.9,
            },
            {
                pedidoId: pedidos[6].id,
                produtoId: produtos[8].id,
                quantidade: 1,
                precoUnitario: 32.9,
            },
            {
                pedidoId: pedidos[7].id,
                produtoId: produtos[0].id,
                quantidade: 1,
                precoUnitario: 25.9,
            },
        ],
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
