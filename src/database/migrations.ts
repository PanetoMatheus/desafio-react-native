
import { SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS pessoas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha_hash TEXT,
            criado_em TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco REAL NOT NULL CHECK (preco >= 0),
            thumbnail TEXT,
            categoria TEXT,
            criado_em TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS carrinho (
            pessoa_id INTEGER NOT NULL,
            produto_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL DEFAULT 1 CHECK (quantidade > 0),

            PRIMARY KEY (pessoa_id, produto_id),

            FOREIGN KEY (pessoa_id)
                REFERENCES pessoas(id)
                ON DELETE CASCADE,

            FOREIGN KEY (produto_id)
                REFERENCES produtos(id)
                ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS sessao (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            pessoa_id INTEGER NOT NULL,

            FOREIGN KEY (pessoa_id)
                REFERENCES pessoas(id)
                ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_carrinho_pessoa
        ON carrinho(pessoa_id);
    `);
}
