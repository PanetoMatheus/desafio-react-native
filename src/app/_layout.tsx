import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import "./../global.css";

import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "./../database/migrations";
import { AuthProvider } from "./../contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        PoppinsRegular: require('./../../assets/fonts/Poppins-Regular.ttf'),
        PoppinsBold: require('./../../assets/fonts/Poppins-Bold.ttf'),
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
        <SQLiteProvider databaseName="desafio-mobile.db" onInit={initializeDatabase}>
            <AuthProvider>
                <Stack>
                    <Stack.Screen name="(default)" options={{ headerShown: false }}/>
                    <Stack.Screen name="produtos/[id]"  options={{ headerShown: false }}/>
                </Stack>
            </AuthProvider>
        </SQLiteProvider>
    );
}