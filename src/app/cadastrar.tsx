
import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import { theme } from "../shared/themes/Theme";
import { cadastrarPessoa } from "../database/pessoa";

export default function Cadastro() {
    const database = useSQLiteContext();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleCadastro = async () => {
        if (!nome.trim() || !email.trim() || !senha.trim()) {
            Alert.alert("Atenção", "Preencha todos os campos.");
            return;
        }

        try {
            await cadastrarPessoa(database, nome, email, senha);
            Alert.alert("Sucesso", "Conta criada com sucesso!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/login"),
                },
            ]);
        } catch (error) {
            Alert.alert("Erro", "Esse email já está cadastrado ou ocorreu um erro.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formulario}>
                <Text style={styles.titulo}>Paneto's Store</Text>

                <Text style={styles.subtitulo}>
                    Crie sua conta
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor={theme.colors.secondaryText}
                    value={nome}
                    onChangeText={setNome}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={theme.colors.secondaryText}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor={theme.colors.secondaryText}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                />

                <Pressable
                    style={styles.botao}
                    onPress={handleCadastro}
                >
                    <Text style={styles.botaoTexto}>
                        Cadastrar
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.botaoVoltar}
                    onPress={() => router.back()}
                >
                    <Text style={styles.botaoVoltarTexto}>
                        Já tenho uma conta
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        padding: theme.spacing.large,
    },
    formulario: {
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
    input: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.medium,
        borderRadius: theme.corners.body,
        marginBottom: theme.spacing.medium,
        color: theme.colors.text,
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
    botaoVoltar: {
        padding: theme.spacing.medium,
        alignItems: "center",
        marginTop: theme.spacing.small,
    },
    botaoVoltarTexto: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.family.bold,
        fontSize: theme.fonts.sizes.body,
    },
});
