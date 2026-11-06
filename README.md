# Desafio mobile
App mobile de uma loja com carrinho de compras, login e funcionamento offline.
## Funcionalidades
- Listagem de produtos (API DummyJSON)
- Cadastro e login de usuários (SQLite local)
- Detalhes do produto e seleção de quantidade
- Carrinho de compras
- Modo offline: operações ficam pendentes no SQLite e são
  sincronizadas com a API quando a conexão volta

## Tecnologias
- React Native + Expo (Expo Router)
- TypeScript
- SQLite (expo-sqlite)
- NetInfo (detecção de conexão)
- API: https://dummyjson.com

## Pré-requisitos
- Node.js 18 ou superior
- Git
- App Expo Go no celular, ou emulador Android/iOS
## Como rodar
1. Clone o repositório:
   git clone https://github.com/PanetoMatheus/desafio-react-native.git
2. Instale as dependências:
   yarn install
3. Inicie o projeto:
   yarn expo start
   
Se algo der errado, limpe o cache: yarn expo start -c
