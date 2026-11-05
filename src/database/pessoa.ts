import { SQLiteDatabase } from "expo-sqlite";

export async function cadastrarPessoa(
    database: SQLiteDatabase,
    nome: string,
    email: string,
    senha: string
) {
    await database.runAsync(
        `INSERT INTO pessoas (nome, email, senha)
         VALUES (?, ?, ?)`,
        nome,
        email.trim().toLowerCase(),
        senha
    );
}

export async function autenticarPessoa(
    database: SQLiteDatabase,
    email: string,
    senha: string
) {
    return database.getFirstAsync<{
        id: number;
        nome: string;
        email: string;
    }>(
        `SELECT id, nome, email
         FROM pessoas
         WHERE email = ? AND senha = ?`,
        email.trim().toLowerCase(),
        senha
    );
}