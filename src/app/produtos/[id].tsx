import { useEffect, useState } from "react";
import {
    ActivityIndicator,
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

                    <Pressable
                        style={[
                            styles.botaoComprar,
                            produto.stock <= 0 && styles.botaoDesabilitado,
                        ]}
                        disabled={produto.stock <= 0}
                    >
                        <Text style={styles.botaoComprarTexto}>
                            {produto.stock > 0
                                ? "Adicionar ao carrinho"
                                : "Indisponível"}
                        </Text>
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
});