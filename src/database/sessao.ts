
import { SQLiteDatabase } from "expo-sqlite";

export async function buscarSessao(database: SQLiteDatabase) {
    return database.getFirstAsync<{ pessoa_id: number }>(
        "SELECT pessoa_id FROM sessao WHERE id = 1"
    );
}

export async function iniciarSessao(
    database: SQLiteDatabase,
    pessoaId: number
) {
    await database.runAsync(
        `INSERT OR REPLACE INTO sessao (id, pessoa_id)
         VALUES (1, ?)`,
        pessoaId
    );
}

export async function encerrarSessao(database: SQLiteDatabase) {
    await database.runAsync(
        "DELETE FROM sessao WHERE id = 1"
    );
}
