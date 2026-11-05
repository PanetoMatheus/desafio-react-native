import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {theme} from './../../shared/themes/Theme'

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({size }) => (
            <Ionicons name="home" size={size} color={"#1e5139"} />
          ),
        }}
      />
      <Tabs.Screen
        name="carrinho"
        options={{
          title: "Carrinho",
          tabBarIcon: ({size }) => (
            <Ionicons name="cart" size={size} color={"#1e5139"} />
          ),
        }}
      />
      <Tabs.Screen
        name="usuario"
        options={{
          title: "Usuário",
          tabBarIcon: ({ size }) => (
            <Ionicons name="person" size={size} color={"#1e5139"} />
          ),
        }}
      />
    </Tabs>
  );
}