import { SQLiteDatabase } from "expo-sqlite";
export async function adicionarAoCarrinho(
    database: SQLiteDatabase,
    pessoaId: number,
    produtoId: number,
    quantidade: number
) {
    await database.execAsync(`
        INSERT OR REPLACE INTO carrinho (pessoa_id, produto_id, quantidade) VALUES (${pessoaId}, ${produtoId}, ${quantidade})
    `);
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