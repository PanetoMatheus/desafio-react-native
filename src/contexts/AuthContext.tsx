import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { useSQLiteContext } from "expo-sqlite";
import { buscarSessao,iniciarSessao,encerrarSessao,} from "./../database/sessao";
import {autenticarPessoa,} from "./../database/pessoa";
type Usuario = {
    id: number;
    nome: string;
    email: string;
};
type AuthContextData = {
    usuario: Usuario | null;
    carregando: boolean;
    entrar: (email: string, senha: string) => Promise<boolean>;
    sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const database = useSQLiteContext();

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function carregarSessao() {
            try {
                const sessao = await buscarSessao(database);

                if (sessao) {
                    const pessoa = await database.getFirstAsync<Usuario>(
                        "SELECT id, nome, email FROM pessoas WHERE id = ?",
                        sessao.pessoa_id
                    );

                    setUsuario(pessoa ?? null);

                    if (!pessoa) {
                        await encerrarSessao(database);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setCarregando(false);
            }
        }

        carregarSessao();
    }, [database]);

    async function entrar(email: string, senha: string) {
        const pessoa = await autenticarPessoa(database, email, senha);

        if (!pessoa) return false;

        await iniciarSessao(database, pessoa.id);
        setUsuario(pessoa);

        return true;
    }

    async function sair() {
        await encerrarSessao(database);
        setUsuario(null);
    }

    return (
        <AuthContext.Provider
            value={{ usuario, carregando, entrar, sair }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}