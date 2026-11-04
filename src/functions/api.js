export const getProdutos = () => fetch('https://dummyjson.com/products').then(res => res.json())

export const getProduto = (id) => fetch(`https://dummyjson.com/products/${id}`).then(res => res.json())
