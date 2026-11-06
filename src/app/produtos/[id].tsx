import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { getProduto } from "../../functions/api";
import { theme } from "../../shared/themes/Theme";
import Header from "../../components/Header";
import { useSQLiteContext } from "expo-sqlite";
import {
    adicionarAoCarrinho,
    obterPessoaLogadaId,
} from "../../database/carrinho";

type Produto = {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
};

export default function ProdutoDetalhes() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [produto, setProduto] = useState<Produto | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    const database = useSQLiteContext();
const [quantidade, setQuantidade] = useState(1);
const [adicionando, setAdicionando] = useState(false);

const diminuir = () => setQuantidade((q) => Math.max(1, q - 1));
const aumentar = () =>
    setQuantidade((q) => Math.min(produto?.stock ?? 1, q + 1));

    const adicionar = async () => {
        if (!produto) return;

        try {
            setAdicionando(true);
            const pessoaId = await obterPessoaLogadaId(database);
            if (!pessoaId) {
                Alert.alert("Atenção", "Faça login para adicionar ao carrinho.");
                return;
            }
            await adicionarAoCarrinho(
                database,
                pessoaId,
                produto.id,
                quantidade,
                produto.stock
            );
            Alert.alert(
                "Pronto!",
                `${quantidade}x ${produto.title} adicionado ao carrinho.`
            );
            setQuantidade(1);
        } catch {
            Alert.alert("Erro", "Não foi possível adicionar ao carrinho.");
        } finally {
            setAdicionando(false);
        }
    };

    const carregarProduto = async () => {
        setCarregando(true);
        setErro(false);

        try {
            const data = await getProduto(id);
            setProduto(data);
        } catch {
            setErro(true);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarProduto();
    }, [id]);

    const preco = (valor: number) =>
        valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

    if (carregando) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centro}>
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.primary}
                    />
                </View>
            </SafeAreaView>
        );
    }

    if (erro || !produto) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centro}>
                    <Text style={styles.erroTexto}>
                        Não foi possível carregar o produto.
                    </Text>

                    <Pressable style={styles.botao} onPress={carregarProduto}>
                        <Text style={styles.botaoTexto}>
                            Tentar novamente
                        </Text>
                    </Pressable>

                    <Pressable onPress={() => router.back()}>
                        <Text style={styles.voltarTexto}>Voltar</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <Header />
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Text style={styles.headerVoltar}>‹ Voltar</Text>
                </Pressable>

                <Text style={styles.headerTitulo}>Detalhes do produto</Text>
            </View>

            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.imagemContainer}>
                    <Image
                        source={{ uri: produto.thumbnail }}
                        style={styles.imagem}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.categoria}>
                        {produto.category}
                    </Text>

                    <Text style={styles.nome}>
                        {produto.title}
                    </Text>

                    {!!produto.brand && (
                        <Text style={styles.marca}>
                            Marca: {produto.brand}
                        </Text>
                    )}

                    <View style={styles.avaliacao}>
                        <Text style={styles.estrela}>★</Text>
                        <Text style={styles.nota}>
                            {produto.rating.toFixed(1)}
                        </Text>
                        <Text style={styles.estoque}>
                            {produto.stock > 0
                                ? `${produto.stock} unidades em estoque`
                                : "Produto indisponível"}
                        </Text>
                    </View>

                    <Text style={styles.descricaoTitulo}>
                        Descrição
                    </Text>

                    <Text style={styles.descricao}>
                        {produto.description}
                    </Text>

                    <View style={styles.divisor} />

                    <View style={styles.precoContainer}>
                        <View>
                            <Text style={styles.precoLabel}>
                                Preço
                            </Text>

                            <Text style={styles.preco}>
                                {preco(produto.price)}
                            </Text>
                        </View>

                        <View style={styles.desconto}>
                            <Text style={styles.descontoTexto}>
                                {produto.discountPercentage.toFixed(0)}% OFF
                            </Text>
                        </View>
                    </View>

                    {produto.stock > 0 && (
                        <View style={styles.quantidadeContainer}>
                            <Text style={styles.quantidadeLabel}>Quantidade</Text>

                            <View style={styles.quantidadeControles}>
                                <Pressable
                                    style={[
                                        styles.quantidadeBotao,
                                        quantidade <= 1 && styles.botaoDesabilitado,
                                    ]}
                                    onPress={diminuir}
                                    disabled={quantidade <= 1}
                                >
                                    <Text style={styles.quantidadeBotaoTexto}>−</Text>
                                </Pressable>

                                <Text style={styles.quantidadeValor}>{quantidade}</Text>

                                <Pressable
                                    style={[
                                        styles.quantidadeBotao,
                                        quantidade >= produto.stock && styles.botaoDesabilitado,
                                    ]}
                                    onPress={aumentar}
                                    disabled={quantidade >= produto.stock}
                                >
                                    <Text style={styles.quantidadeBotaoTexto}>+</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}

                    <Pressable
                        style={[
                            styles.botaoComprar,
                            (produto.stock <= 0 || adicionando) && styles.botaoDesabilitado,
                        ]}
                        disabled={produto.stock <= 0 || adicionando}
                        onPress={adicionar}
                    >
                        {adicionando ? (
                            <ActivityIndicator color={theme.colors.paper} />
                        ) : (
                            <Text style={styles.botaoComprarTexto}>
                                {produto.stock > 0
                                    ? `Adicionar ao carrinho • ${preco(produto.price * quantidade)}`
                                    : "Indisponível"}
                            </Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
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
        paddingVertical: theme.spacing.large,
        paddingHorizontal: theme.spacing.large,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.medium,
    },

    headerVoltar: {
        color: theme.colors.paper,
        fontSize: theme.fonts.sizes.large,
        fontFamily: theme.fonts.family.bold,
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

    conteudo: {
        padding: theme.spacing.medium,
        paddingBottom: theme.spacing.extraLarge,
    },

    imagemContainer: {
        backgroundColor: theme.colors.paper,
        borderRadius: theme.corners.large,
        padding: theme.spacing.medium,
        marginBottom: theme.spacing.medium,
        alignItems: "center",
        justifyContent: "center",
    },

    imagem: {
        width: "100%",
        height: 280,
    },

    card: {
        backgroundColor: theme.colors.paper,
        borderRadius: theme.corners.large,
        padding: theme.spacing.large,
    },

    categoria: {
        color: theme.colors.primary,
        fontSize: theme.fonts.sizes.small,
        fontFamily: theme.fonts.family.bold,
        textTransform: "uppercase",
    },

    nome: {
        color: theme.colors.text,
        fontSize: theme.fonts.sizes.extraLarge,
        fontFamily: theme.fonts.family.bold,
        marginTop: theme.spacing.small,
    },

    marca: {
        color: theme.colors.secondaryText,
        fontSize: theme.fonts.sizes.body,
        marginTop: theme.spacing.small,
        fontFamily: theme.fonts.family.regular,
    },

    avaliacao: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: theme.spacing.medium,
        gap: theme.spacing.small,
    },

    estrela: {
        color: "#F5B301",
        fontSize: theme.fonts.sizes.large,
    },

    nota: {
        color: theme.colors.text,
        fontSize: theme.fonts.sizes.body,
        fontFamily: theme.fonts.family.bold,
    },

    estoque: {
        color: theme.colors.secondaryText,
        fontSize: theme.fonts.sizes.small,
        marginLeft: theme.spacing.small,
        flexShrink: 1,
    },

    descricaoTitulo: {
        color: theme.colors.text,
        fontSize: theme.fonts.sizes.large,
        fontFamily: theme.fonts.family.bold,
        marginTop: theme.spacing.large,
        marginBottom: theme.spacing.small,
    },

    descricao: {
        color: theme.colors.secondaryText,
        fontSize: theme.fonts.sizes.body,
        fontFamily: theme.fonts.family.regular,
        lineHeight: 22,
    },

    divisor: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.large,
    },

    precoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    precoLabel: {
        color: theme.colors.secondaryText,
        fontSize: theme.fonts.sizes.small,
    },

    preco: {
        color: theme.colors.primary,
        fontSize: theme.fonts.sizes.extraLarge,
        fontFamily: theme.fonts.family.bold,
        marginTop: theme.spacing.small,
    },

    desconto: {
        backgroundColor: "#E5F2EA",
        paddingVertical: theme.spacing.small,
        paddingHorizontal: theme.spacing.medium,
        borderRadius: theme.corners.body,
    },

    descontoTexto: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.family.bold,
        fontSize: theme.fonts.sizes.small,
    },

    botaoComprar: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.medium,
        borderRadius: theme.corners.body,
        alignItems: "center",
        marginTop: theme.spacing.large,
    },

    botaoDesabilitado: {
        opacity: 0.5,
    },

    botaoComprarTexto: {
        color: theme.colors.paper,
        fontSize: theme.fonts.sizes.body,
        fontFamily: theme.fonts.family.bold,
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

    erroTexto: {
        color: theme.colors.text,
        fontSize: theme.fonts.sizes.body,
        textAlign: "center",
    },

    voltarTexto: {
        color: theme.colors.primary,
        marginTop: theme.spacing.large,
        fontFamily: theme.fonts.family.bold,
    },
    quantidadeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.large,
},

quantidadeLabel: {
    color: theme.colors.text,
    fontSize: theme.fonts.sizes.body,
    fontFamily: theme.fonts.family.bold,
},

quantidadeControles: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.medium,
},

quantidadeBotao: {
    width: 36,
    height: 36,
    borderRadius: theme.corners.body,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
},

quantidadeBotaoTexto: {
    color: theme.colors.paper,
    fontSize: theme.fonts.sizes.large,
    fontFamily: theme.fonts.family.bold,
},

quantidadeValor: {
    minWidth: 28,
    textAlign: "center",
    color: theme.colors.text,
    fontSize: theme.fonts.sizes.large,
    fontFamily: theme.fonts.family.bold,
},
});