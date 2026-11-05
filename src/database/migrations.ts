import { SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        PRAGMA foreign_keys = OFF;

        DROP TABLE IF EXISTS carrinho;
        DROP TABLE IF EXISTS sessao;
        DROP TABLE IF EXISTS produtos;
        DROP TABLE IF EXISTS pessoas;

        PRAGMA foreign_keys = ON;

        CREATE TABLE pessoas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL
        );

        CREATE TABLE produtos (
            id INTEGER PRIMARY KEY,
            nome TEXT NOT NULL,
            preco REAL NOT NULL CHECK (preco >= 0)
        );

        CREATE TABLE carrinho (
            pessoa_id INTEGER NOT NULL,
            produto_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL DEFAULT 1,

            PRIMARY KEY (pessoa_id, produto_id),

            FOREIGN KEY (pessoa_id)
                REFERENCES pessoas(id)
                ON DELETE CASCADE,

            FOREIGN KEY (produto_id)
                REFERENCES produtos(id)
                ON DELETE CASCADE
        );

        CREATE TABLE sessao (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            pessoa_id INTEGER NOT NULL,

            FOREIGN KEY (pessoa_id)
                REFERENCES pessoas(id)
                ON DELETE CASCADE
        );
    `);
}