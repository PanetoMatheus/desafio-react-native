import NetInfo from "@react-native-community/netinfo";
import { SQLiteDatabase } from "expo-sqlite";
import { addNoCarrinho } from "./api";
import { adicionarAoCarrinho } from "../database/carrinho";

async function estaOnline() {
    const estado = await NetInfo.fetch();
    return !!estado.isConnected && estado.isInternetReachable !== false;
}

export async function adicionarAoCarrinhoComSync(
    database: SQLiteDatabase,
    pessoaId: number,
    produtoId: number,
    quantidade: number,
    estoque: number
): Promise<"sincronizado" | "pendente"> {
    const qtd = Math.min(quantidade, estoque);
    let status: "sincronizado" | "pendente" = "pendente";

    if (await estaOnline()) {
        try {
            const aceito = await addNoCarrinho(pessoaId, produtoId, qtd);
            if (aceito) status = "sincronizado";
        } catch {
        }
    }

    await database.withTransactionAsync(async () => {
        await adicionarAoCarrinho(database, pessoaId, produtoId, qtd, estoque);
        await database.runAsync(
            `INSERT INTO operacoes_carrinho
                (pessoa_id, produto_id, quantidade, status, sincronizado_em)
             VALUES (?, ?, ?, ?, CASE WHEN ? = 'sincronizado' THEN datetime('now') END)`,
            pessoaId,
            produtoId,
            qtd,
            status,
            status
        );
    });

    return status;
}

let sincronizando = false;

export async function sincronizarPendentes(database: SQLiteDatabase) {
    if (sincronizando) return;
    sincronizando = true;

    try {
        const pendentes = await database.getAllAsync<{
            id: number;
            pessoa_id: number;
            produto_id: number;
            quantidade: number;
        }>(
            `SELECT id, pessoa_id, produto_id, quantidade
             FROM operacoes_carrinho
             WHERE status = 'pendente'
             ORDER BY id`
        );

        for (const op of pendentes) {
            try {
                const aceito = await addNoCarrinho(
                    op.pessoa_id,
                    op.produto_id,
                    op.quantidade
                );

                await database.runAsync(
                    `UPDATE operacoes_carrinho
                     SET status = ?, sincronizado_em = datetime('now')
                     WHERE id = ? AND status = 'pendente'`,
                    aceito ? "sincronizado" : "erro",
                    op.id
                );
            } catch {
                break; 
            }
        }
    } finally {
        sincronizando = false;
    }
}