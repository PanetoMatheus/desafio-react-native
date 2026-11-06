import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProdutos } from "../../functions/api";
import { theme } from "../../shared/themes/Theme";
import Header from "../../components/Header";
import CardProduto from "../../components/Cardproduto";

type Produto = {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    category: string;
};

export default function Home() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    const carregar = async () => {
        setCarregando(true);
        setErro(false);

        try {
            const data = await getProdutos();
            setProdutos(data.products);
        } catch {
            setErro(true);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <Header />

            {carregando ? (
                <View style={styles.centro}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : erro ? (
                <View style={styles.centro}>
                    <Text style={styles.erroTexto}>
                        Não foi possível carregar os produtos.
                    </Text>

                    <Pressable style={styles.botao} onPress={carregar}>
                        <Text style={styles.botaoTexto}>Tentar novamente</Text>
                    </Pressable>
                </View>
            ) : (
                <FlatList
                    data={produtos}
                    keyExtractor={(item) => String(item.id)}
                    numColumns={2}
                    columnWrapperStyle={styles.linha}
                    contentContainerStyle={styles.lista}
                    renderItem={({ item }) => <CardProduto produto={item} />}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centro: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.extraLarge,
    },
    erroTexto: {
        fontSize: theme.fonts.sizes.large,
        color: theme.colors.text,
        marginBottom: theme.spacing.medium,
        textAlign: "center",
        fontFamily: theme.fonts.family.regular,
    },
    botao: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: theme.corners.body,
    },
    botaoTexto: {
        color: theme.colors.primaryText,
        fontFamily: theme.fonts.family.bold,
    },
    lista: {
        padding: theme.spacing.medium,
    },
    linha: {
        justifyContent: "space-between",
    },
});