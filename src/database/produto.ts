import { SQLiteDatabase } from "expo-sqlite";

export async function salvarProdutoAcessado(
    database: SQLiteDatabase,
    produto: {
        id: number;
        nome: string;
        preco: number;
    }
) {
    await database.runAsync(
        `INSERT INTO produtosAcessados (id, nome, preco) VALUES (${produto.id}, '${produto.nome}', ${produto.preco}) ON CONFLICT(id) DO UPDATE SET nome = excluded.nome, preco = excluded.preco`
    );
}