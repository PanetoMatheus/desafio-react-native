import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { getProduto } from "../../functions/api";
import { buscarSessao } from "./../../database/sessao";
import {
    buscarCarrinho,
    editarQuantidadeCarrinho,
    limparCarrinho,
    removerDoCarrinho,
} from "../../database/carrinho"
import { theme } from "../../shared/themes/Theme";
import Header from "../../components/Header";

type Item = {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    stock: number;
    quantidade: number;
};

export default function Carrinho() {
    const database = useSQLiteContext();

    const [pessoaId, setPessoaId] = useState<number | null>(null);
    const [itens, setItens] = useState<Item[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    const preco = (valor: number) =>
        valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const carregar = async () => {
        setCarregando(true);
        setErro(false);

        try {
            const sessao = await buscarSessao(database);

            if (!sessao) {
                setPessoaId(null);
                setItens([]);
                return;
            }

            setPessoaId(sessao.pessoa_id);

            const linhas = await buscarCarrinho(database, sessao.pessoa_id);

            const lista = await Promise.all(
                linhas.map(async (linha) => {
                    const p = await getProduto(String(linha.produto_id));
                    return {
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        thumbnail: p.thumbnail,
                        stock: p.stock,
                        quantidade: linha.quantidade,
                    };
                })
            );

            setItens(lista);
        } catch {
            setErro(true);
        } finally {
            setCarregando(false);
        }
    };
    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    const alterar = async (item: Item, nova: number) => {
        if (!pessoaId || nova < 1 || nova > item.stock) return;

        await editarQuantidadeCarrinho(database, pessoaId, item.id, nova);
        setItens((atual) =>
            atual.map((i) => (i.id === item.id ? { ...i, quantidade: nova } : i))
        );
    };

    const remover = async (item: Item) => {
        if (!pessoaId) return;

        await removerDoCarrinho(database, pessoaId, item.id);
        setItens((atual) => atual.filter((i) => i.id !== item.id));
    };

    const finalizar = async () => {
        if (!pessoaId) return;

        await limparCarrinho(database, pessoaId);
        setItens([]);
    };

    const total = itens.reduce((soma, i) => soma + i.price * i.quantidade, 0);

    const renderConteudo = () => {
        if (carregando) {
            return (
                <View style={styles.centro}>
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.primary}
                    />
                </View>
            );
        }

        if (erro) {
            return (
                <View style={styles.centro}>
                    <Text style={styles.mensagem}>
                        Não foi possível carregar o carrinho.
                    </Text>
                    <Pressable style={styles.botao} onPress={carregar}>
                        <Text style={styles.botaoTexto}>Tentar novamente</Text>
                    </Pressable>
                </View>
            );
        }
        if (!pessoaId) {
            return (
                <View style={styles.centro}>
                    <Text style={styles.mensagem}>
                        Faça login para ver o carrinho.
                    </Text>
                    <Pressable
                        style={styles.botao}
                        onPress={() => router.push("/login")}
                    >
                        <Text style={styles.botaoTexto}>Fazer login</Text>
                    </Pressable>
                </View>
            );
        }

        if (itens.length === 0) {
            return (
                <View style={styles.centro}>
                    <Text style={styles.mensagem}>Carrinho vazio.</Text>
                </View>
            );
        }
        return (
            <>
                <FlatList
                    data={itens}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.lista}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image
                                source={{ uri: item.thumbnail }}
                                style={styles.imagem}
                                resizeMode="contain"
                            />

                            <View style={styles.info}>
                                <Text style={styles.nome} numberOfLines={2}>
                                    {item.title}
                                </Text>

                                <Text style={styles.preco}>
                                    {preco(item.price * item.quantidade)}
                                </Text>

                                <View style={styles.linha}>
                                    <View style={styles.controles}>
                                        <Pressable
                                            style={[
                                                styles.qtdBotao,
                                                item.quantidade <= 1 &&
                                                    styles.desabilitado,
                                            ]}
                                            disabled={item.quantidade <= 1}
                                            onPress={() =>
                                                alterar(item, item.quantidade - 1)
                                            }
                                        >
                                            <Text style={styles.qtdBotaoTexto}>
                                                −
                                            </Text>
                                        </Pressable>

                                        <Text style={styles.qtdValor}>
                                            {item.quantidade}
                                        </Text>

                                        <Pressable
                                            style={[
                                                styles.qtdBotao,
                                                item.quantidade >= item.stock &&
                                                    styles.desabilitado,
                                            ]}
                                            disabled={item.quantidade >= item.stock}
                                            onPress={() =>
                                                alterar(item, item.quantidade + 1)
                                            }
                                        >
                                            <Text style={styles.qtdBotaoTexto}>
                                                +
                                            </Text>
                                        </Pressable>
                                    </View>

                                    <Pressable onPress={() => remover(item)}>
                                        <Text style={styles.remover}>Remover</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    )}
                />

                <View style={styles.rodape}>
                    <View style={styles.totalLinha}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.total}>{preco(total)}</Text>
                    </View>

                    <Pressable style={styles.botaoComprar} onPress={finalizar}>
                        <Text style={styles.botaoComprarTexto}>
                           Limpar Carrinho
                        </Text>
                    </Pressable>
                </View>
            </>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <Header />
            {renderConteudo()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    header: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.large,
    },

    headerTitulo: {
        color: theme.colors.paper,
        fontSize: theme.fonts.sizes.large,
        fontFamily: theme.fonts.family.bold,
    },

    centro: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.extraLarge,
    },

    mensagem: {
        color: theme.colors.text,
        fontSize: theme.fonts.sizes.body,
        fontFamily: theme.fonts.family.regular,
        textAlign: "center",
    },

    botao: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.medium,
        borderRadius: theme.corners.body,
        marginTop: theme.spacing.medium,
    },

    botaoTexto: {
        color: theme.colors.paper,
        fontFamily: theme.fonts.family.bold,
    },

    lista: {
        padding: theme.spacing.medium,
        gap: theme.spacing.medium,
    },

    card: {
        flexDirection: "row",
        backgroundColor: theme.colors.paper,
        borderRadius: theme.corners.large,
        padding: theme.spacing.medium,
        gap: theme.spacing.medium,
    },

    imagem: {
        width: 90,
        height: 90,
    },

    info: {
        flex: 1,
        justifyContent: "space-between",
    },

    nome: {
        color: theme.colors.text,
        fontSize: theme.fonts.sizes.body,
        fontFamily: theme.fonts.family.bold,
    },

    preco: {
        color: theme.colors.primary,
        fontSize: theme.fonts.sizes.large,
        fontFamily: theme.fonts.family.bold,
    },

    linha: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    controles: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.medium,
    },

    qtdBotao: {
        width: 32,
        height: 32,
        borderRadius: theme.corners.body,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    qtdBotaoTexto: {
        color: theme.colors.paper,
        fontSize: theme.fonts.sizes.large,
        fontFamily: theme.fonts.family.bold,
    },

    qtdValor: {
        minWidth: 24,
        textAlign: "center",
        color: theme.colors.text,
        fontSize: theme.fonts.sizes.body,
        fontFamily: theme.fonts.family.bold,
    },

    desabilitado: {
        opacity: 0.5,
    },

    remover: {
        color: "#D32F2F",
        fontSize: theme.fonts.sizes.small,
        fontFamily: theme.fonts.family.bold,
    },

    rodape: {
        backgroundColor: theme.colors.paper,
        padding: theme.spacing.large,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },

    totalLinha: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    totalLabel: {
        color: theme.colors.secondaryText,
        fontSize: theme.fonts.sizes.body,
        fontFamily: theme.fonts.family.regular,
    },

    total: {
        color: theme.colors.primary,
        fontSize: theme.fonts.sizes.extraLarge,
        fontFamily: theme.fonts.family.bold,
    },

    botaoComprar: {
        backgroundColor: theme.colors.wrong,
        padding: theme.spacing.medium,
        borderRadius: theme.corners.body,
        alignItems: "center",
        marginTop: theme.spacing.large,
    },

    botaoComprarTexto: {
        color: theme.colors.paper,
        fontSize: theme.fonts.sizes.body,
        fontFamily: theme.fonts.family.bold,
    },
});