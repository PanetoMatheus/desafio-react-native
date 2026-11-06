import { SQLiteDatabase } from "expo-sqlite";

export type ItemCarrinho = {
    id: number;
    title: string;
    price: number;
    imagem: string | null;
    stock: number;
    quantidade: number;
    pendente: number;
};

export async function adicionarAoCarrinho(
    database: SQLiteDatabase,
    pessoaId: number,
    produtoId: number,
    quantidade: number,
    estoque: number
) {
    await database.runAsync(
        `INSERT INTO carrinho (pessoa_id, produto_id, quantidade)
         VALUES (?, ?, ?)
         ON CONFLICT(pessoa_id, produto_id)
         DO UPDATE SET quantidade = MIN(quantidade + excluded.quantidade, ?)`,
        pessoaId,
        produtoId,
        Math.min(quantidade, estoque),
        estoque
    );
}

export async function buscarCarrinhoCompleto(
    database: SQLiteDatabase,
    pessoaId: number
) {
    return database.getAllAsync<ItemCarrinho>(
        `SELECT
            c.produto_id AS id,
            p.nome AS title,
            p.preco AS price,
            p.imagem AS imagem,
            COALESCE(p.estoque, c.quantidade) AS stock,
            c.quantidade AS quantidade,
            EXISTS (
                SELECT 1 FROM operacoes_carrinho o
                WHERE o.pessoa_id = c.pessoa_id
                  AND o.produto_id = c.produto_id
                  AND o.status = 'pendente'
            ) AS pendente
         FROM carrinho c
         JOIN produtosAcessados p ON p.id = c.produto_id
         WHERE c.pessoa_id = ?`,
        pessoaId
    );
}

export async function editarQuantidadeCarrinho(
    database: SQLiteDatabase,
    pessoaId: number,
    produtoId: number,
    quantidade: number
) {
    await database.runAsync(
        `UPDATE carrinho SET quantidade = ? WHERE pessoa_id = ? AND produto_id = ?`,
        quantidade,
        pessoaId,
        produtoId
    );
}

export async function removerDoCarrinho(
    database: SQLiteDatabase,
    pessoaId: number,
    produtoId: number
) {
    await database.runAsync(
        `DELETE FROM carrinho WHERE pessoa_id = ? AND produto_id = ?`,
        pessoaId,
        produtoId
    );
}

export async function limparCarrinho(
    database: SQLiteDatabase,
    pessoaId: number
) {
    await database.runAsync(
        `DELETE FROM carrinho WHERE pessoa_id = ?`,
        pessoaId
    );
}