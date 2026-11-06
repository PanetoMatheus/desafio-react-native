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
        `INSERT INTO carrinho (pessoa_id, produto_id, quantidade)VALUES (${pessoaId}, ${produtoId}, ${Math.min(quantidade, estoque)}) ON CONFLICT(pessoa_id, produto_id) DO UPDATE SET quantidade = MIN(quantidade + excluded.quantidade, ${estoque})`
    );
}

export async function buscarCarrinho(
    database: SQLiteDatabase,
    pessoaId: number
) {
    return database.getAllAsync<{ produto_id: number; quantidade: number }>(
        `SELECT produto_id, quantidade FROM carrinho WHERE pessoa_id = ${ pessoaId}`
    );
}

export async function editarQuantidadeCarrinho(
    database: SQLiteDatabase,
    pessoaId: number,
    produtoId: number,
    quantidade: number
) {
    await database.runAsync(
        `UPDATE carrinho SET quantidade = ${quantidade} WHERE pessoa_id = ${pessoaId} AND produto_id = ${produtoId}`
    );
}

export async function removerDoCarrinho(
    database: SQLiteDatabase,
    pessoaId: number,
    produtoId: number
) {
    await database.runAsync(
        `DELETE FROM carrinho WHERE pessoa_id = ${pessoaId} AND produto_id = ${produtoId}`,
        
    );
}

export async function limparCarrinho(
    database: SQLiteDatabase,
    pessoaId: number
) {
    await database.runAsync(
        `DELETE FROM carrinho WHERE pessoa_id = ${pessoaId}`,
    );
}