import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from "react-native";

import { router } from "expo-router";

import { useAuth } from "./../../contexts/AuthContext";
import { theme } from "./../../shared/themes/Theme";

export default function Index() {
    const { usuario, sair, carregando } = useAuth();

    async function handleSair() {
        await sair();
    }

    if (carregando) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.titulo}>Minha conta</Text>

                {usuario ? (
                    <>
                        <Text style={styles.subtitulo}>
                            Você está logado!
                        </Text>

                        <View style={styles.informacoes}>
                            <Text style={styles.label}>Nome</Text>
                            <Text style={styles.valor}>
                                {usuario.nome}
                            </Text>

                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.valor}>
                                {usuario.email}
                            </Text>
                        </View>

                        <Pressable
                            style={styles.botao}
                            onPress={handleSair}
                        >
                            <Text style={styles.botaoTexto}>
                                Sair da conta
                            </Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Text style={styles.subtitulo}>
                            Você ainda não está logado.
                        </Text>

                        <Pressable
                            style={styles.botao}
                            onPress={() => router.push("/login")}
                        >
                            <Text style={styles.botaoTexto}>
                                Fazer login
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.botaoSecundario}
                            onPress={() => router.push("/cadastrar")}
                        >
                            <Text style={styles.botaoSecundarioTexto}>
                                Criar uma conta
                            </Text>
                        </Pressable>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        padding: theme.spacing.large,
    },

    card: {
        backgroundColor: theme.colors.paper,
        padding: theme.spacing.extraLarge,
        borderRadius: theme.corners.large,
    },

    titulo: {
        fontSize: theme.fonts.sizes.extraLarge,
        fontFamily: theme.fonts.family.bold,
        color: theme.colors.primary,
        textAlign: "center",
    },

    subtitulo: {
        fontSize: theme.fonts.sizes.body,
        color: theme.colors.secondaryText,
        textAlign: "center",
        marginVertical: theme.spacing.large,
    },

    informacoes: {
        marginVertical: theme.spacing.medium,
    },

    label: {
        color: theme.colors.secondaryText,
        fontSize: theme.fonts.sizes.small,
        marginTop: theme.spacing.medium,
    },

    valor: {
        color: theme.colors.text,
        fontSize: theme.fonts.sizes.large,
        fontFamily: theme.fonts.family.bold,
        marginTop: theme.spacing.small,
    },

    botao: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.medium,
        borderRadius: theme.corners.body,
        alignItems: "center",
        marginTop: theme.spacing.medium,
    },

    botaoTexto: {
        color: theme.colors.paper,
        fontFamily: theme.fonts.family.bold,
        fontSize: theme.fonts.sizes.body,
    },

    botaoSecundario: {
        padding: theme.spacing.medium,
        borderRadius: theme.corners.body,
        alignItems: "center",
        marginTop: theme.spacing.small,
    },

    botaoSecundarioTexto: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.family.bold,
        fontSize: theme.fonts.sizes.body,
    },
});