import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProdutos } from "../../functions/api";

type Produto = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
};

const VERDE = "#1e5139";
const FUNDO = "#f6f7f5";

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

  const preco = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Paneto's Store</Text>
      </View>

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={VERDE} />
        </View>
      ) : erro ? (
        <View style={styles.centro}>
          <Text style={styles.erroTexto}>Não foi possível carregar os produtos.</Text>
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
          renderItem={({ item }) => (
            <Pressable style={styles.card}>
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.imagem}
                resizeMode="contain"
              />
              <Text style={styles.nome} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.categoria}>{item.category}</Text>
              <Text style={styles.preco}>{preco(item.price)}</Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: FUNDO },
  header: {
    backgroundColor: VERDE,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitulo: { color: "#fff", fontSize: 22, fontWeight: "700" },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  erroTexto: { fontSize: 16, color: "#444", marginBottom: 12, textAlign: "center" },
  botao: {
    backgroundColor: VERDE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  botaoTexto: { color: "#fff", fontWeight: "600" },
  lista: { padding: 12 },
  linha: { justifyContent: "space-between" },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },
  imagem: { width: "100%", height: 120, marginBottom: 8 },
  nome: { fontSize: 14, fontWeight: "600", color: "#222" },
  categoria: { fontSize: 12, color: "#777", marginTop: 2 },
  preco: { fontSize: 16, fontWeight: "700", color: VERDE, marginTop: 6 },
});