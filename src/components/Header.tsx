import { View, Text, StyleSheet } from "react-native";
import { theme } from "../shared/themes/Theme";

export default function Header() {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitulo}>
                Paneto's Store
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: theme.colors.paper,
        paddingVertical: theme.spacing.large,
        paddingHorizontal: theme.spacing.large,
    },

    headerTitulo: {
        color: theme.colors.primary,
        fontSize: theme.fonts.sizes.title,
        fontFamily: theme.fonts.family.bold,
    },
     headerVoltar: {
        color: theme.colors.paper,
        fontSize: theme.fonts.sizes.large,
        fontFamily: theme.fonts.family.bold,
    },
});