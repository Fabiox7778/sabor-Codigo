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

    // Remove todos os registros
    // await prisma.exemplo.deleteMany();

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
        ],
    });

    // Buscar registros inseridos
    const clientes = await prisma.cliente.findMany();
    const produtos = await prisma.produto.findMany();

    console.log('🧾 Inserindo pedidos...');

    await prisma.pedido.createMany({
        data: [{ clienteId: clientes[0].id, total: 31.9, status: 'ABERTO' }],
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
