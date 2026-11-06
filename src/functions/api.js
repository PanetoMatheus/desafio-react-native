export const getProdutos = () => fetch('https://dummyjson.com/products').then(res => res.json())

export const getProduto = (id) => fetch(`https://dummyjson.com/products/${id}`).then(res => res.json())

export const addNoCarrinho = async (userId, produtoId, qtd) => {
  const res = await fetch("https://dummyjson.com/carts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      products: [{ id: produtoId, quantity: qtd }],
    }),
  });
  return res.ok;
};