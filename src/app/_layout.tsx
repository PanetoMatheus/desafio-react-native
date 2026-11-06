import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import NetInfo from "@react-native-community/netinfo";

import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { initializeDatabase } from "../database/migrations";
import { sincronizarPendentes } from "../functions/sincronizar";
import { AuthProvider } from "../contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

function Sincronizador() {
    const database = useSQLiteContext();

    useEffect(() => {
        sincronizarPendentes(database); 

        const cancelar = NetInfo.addEventListener((estado) => {
            if (estado.isConnected && estado.isInternetReachable !== false) {
                sincronizarPendentes(database); 
            }
        });

        return cancelar;
    }, [database]);

    return null;
}

export default function RootLayout() {
    const [loaded, error] = useFonts({
        PoppinsRegular: require("./../../assets/fonts/Poppins-Regular.ttf"),
        PoppinsBold: require("./../../assets/fonts/Poppins-Bold.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <SQLiteProvider databaseName="desafio-mobile.db1" onInit={initializeDatabase}>
            <AuthProvider>
                <Sincronizador />
                <Stack>
                    <Stack.Screen name="(default)" options={{ headerShown: false }} />
                    <Stack.Screen name="produtos/[id]" options={{ headerShown: false }} />
                </Stack>
            </AuthProvider>
        </SQLiteProvider>
    );
}