import { SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS pessoas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS sessao (
            id integer PRIMARY KEY CHECK (id = 1),
            pessoa_id integer NOT NULL,
            FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS carrinho (
            pessoa_id integer NOT NULL,
            produto_id integer NOT NULL,
            quantidade integer NOT NULL DEFAULT 1,
            PRIMARY KEY (pessoa_id, produto_id),
            FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS produtosAcessados (
            id integer PRIMARY KEY,
            nome TEXT NOT NULL,
            preco real NOT NULL
        );

        CREATE TABLE IF NOT EXISTS operacoes_carrinho (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pessoa_id INTEGER NOT NULL,
            produto_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'pendente'
                CHECK (status IN ('pendente', 'sincronizado', 'erro')),
            criado_em TEXT NOT NULL DEFAULT (datetime('now')),
            sincronizado_em TEXT,
            FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_operacoes_status
            ON operacoes_carrinho(status);
    `);
}