import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: () => (
            <Ionicons name="home" size={25} color={"#1e5139"} />
          ),
        }}
      />
      <Tabs.Screen
        name="carrinho"
        options={{
          title: "Carrinho",
          tabBarIcon: () => (
            <Ionicons name="cart" size={25} color={"#1e5139"} />
          ),
        }}
      />
      <Tabs.Screen
        name="usuario"
        options={{
          title: "Usuário",
          tabBarIcon: () => (
            <Ionicons name="person" size={25} color={"#1e5139"} />
          ),
        }}
      />
    </Tabs>
  );
}