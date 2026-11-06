import { SQLiteDatabase } from "expo-sqlite";

export async function obterPessoaLogadaId(database: SQLiteDatabase) {
    const sessao = await database.getFirstAsync<{ pessoa_id: number }>(
        `SELECT pessoa_id FROM sessao WHERE id = 1`
    );
    return sessao?.pessoa_id ?? null;
}

export async function adicionarAoCarrinho(
    database: SQLiteDatabase,
    pessoaId: number,
    produtoId: number,
    quantidade: number,
    estoque: number
) {
    await database.runAsync(
        `INSERT INTO carrinho (pessoa_id, produto_id, quantidade) VALUES (?, ?, ?) ON CONFLICT(pessoa_id, produto_id) DO UPDATE SET quantidade = MIN(quantidade + excluded.quantidade, ?)`,
        pessoaId,
        produtoId,
        Math.min(quantidade, estoque),
        estoque
    );
}

export async function removerDoCarrinho(
    database: SQLiteDatabase,
    pessoaId: number,
    produtoId: number
) {
    await database.execAsync(`
        DELETE FROM carrinho WHERE pessoa_id = ${pessoaId} AND produto_id = ${produtoId}
    `);
}

export async function editarQuantidadeCarrinho(
    database: SQLiteDatabase,
    pessoaId: number,
    produtoId: number,
    quantidade: number
) {
    await database.execAsync(`
        UPDATE carrinho SET quantidade = ${quantidade} WHERE pessoa_id = ${pessoaId} AND produto_id = ${produtoId}
    `);
}