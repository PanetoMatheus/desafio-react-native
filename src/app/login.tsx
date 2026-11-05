import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../shared/themes/Theme";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const entrar = async () => {
        
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formulario}>
                <Text style={styles.titulo}>
                    Paneto's Store
                </Text>

                <Text style={styles.subtitulo}>
                    Entre na sua conta
                </Text>

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
                    onPress={entrar}
                >
                    <Text style={styles.botaoTexto}>
                        Entrar
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
});