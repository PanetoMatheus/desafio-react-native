import { SQLiteDatabase } from "expo-sqlite";

export async function salvarProdutoAcessado(
    database: SQLiteDatabase,
    produto: {
        id: number;
        nome: string;
        preco: number;
        imagem?: string;
        estoque?: number;
    }
) {
    await database.runAsync(
        `INSERT INTO produtosAcessados (id, nome, preco, imagem, estoque)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
            nome = excluded.nome,
            preco = excluded.preco,
            imagem = COALESCE(excluded.imagem, imagem),
            estoque = COALESCE(excluded.estoque, estoque)`,
        produto.id,
        produto.nome,
        produto.preco,
        produto.imagem ?? null,
        produto.estoque ?? null
    );
}

export async function buscarProdutoAcessado(
    database: SQLiteDatabase,
    id: number
) {
    return database.getFirstAsync<{
        id: number;
        nome: string;
        preco: number;
        imagem: string | null;
        estoque: number | null;
    }>(
        `SELECT id, nome, preco, imagem, estoque
         FROM produtosAcessados WHERE id = ?`,
        id
    );
}