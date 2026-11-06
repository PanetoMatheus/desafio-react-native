import {
    Image,
    Pressable,
    StyleSheet,
    Text,
} from "react-native";
import { router } from "expo-router";
import { theme } from "../shared/themes/Theme";
import { useSQLiteContext } from "expo-sqlite";
import { buscarSessao } from "../database/sessao";
import { salvarProdutoAcessado } from "../database/produto";

type Produto = {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    category: string;
};

type Props = {
    produto: Produto;
};

export default function CardProduto({ produto }: Props) {
    const preco = produto.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    const database = useSQLiteContext();

    const abrir = async () => {
    await salvarProdutoAcessado(database, {
        id: produto.id,
        nome: produto.title,
        preco: produto.price,
    });

    const abrir = async () => {
        const sessao = await buscarSessao(database);
        router.push(sessao ? `/produtos/${produto.id}` : "/login");
    };

    return (
        <Pressable
            style={styles.card}
            onPress={abrir}
        >
            <Image
                source={{ uri: produto.thumbnail }}
                style={styles.imagem}
                resizeMode="contain"
            />

            <Text style={styles.nome} numberOfLines={2}>
                {produto.title}
            </Text>

            <Text style={styles.preco}>
                {preco}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "48%",
        backgroundColor: theme.colors.paper,
        borderRadius: theme.corners.extraLarge,
        padding: theme.spacing.medium,
        marginBottom: theme.spacing.medium,
        elevation: 2,
    },

    imagem: {
        width: "100%",
        height: theme.sizes.productImage,
        marginBottom: theme.spacing.body,
    },

    nome: {
        fontSize: theme.fonts.sizes.body,
        fontFamily: theme.fonts.family.bold,
        color: theme.colors.text,
    },

    preco: {
        fontSize: theme.fonts.sizes.large,
        fontFamily: theme.fonts.family.bold,
        color: theme.colors.primary,
        marginTop: theme.spacing.body,
    },
})
}