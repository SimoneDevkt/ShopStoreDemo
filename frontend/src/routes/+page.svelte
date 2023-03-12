<script>
  const backend = 'http://localhost:3000';

  let products = [];

  updateProduct()

  async function fetchJson(url, opt = {}){
    const res = await fetch(url, opt)
    return await res.json()
  }

  async function updateProduct(){
    fetchJson(`${backend}/product`)
    .then(value => products = value)  
  }

  let selectedProduct = null;
  let editedProduct = null;
  let cart = [];

  function createProduct() {
    selectedProduct = editedProduct = null;
    const newProduct = {
      //id: products.length + 1,
      title: '',
      description: '',
      price: 0
    };
    
    fetchJson(`${backend}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newProduct)
    })
    .then(value => updateProduct())  
  }

  function deleteProduct(id) {
    fetchJson(`${backend}/product/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(value => updateProduct())
  }

  function editProduct(id) {
    
    selectedProduct = products.find(product => product.id === id);
    editedProduct = { ...selectedProduct };
  }

  function saveProduct() {
    const index = products.findIndex(product => product.id === editedProduct.id);

    let reallyEdit = {}
    for (const key in editedProduct) {
      if(products[index][key] !== editedProduct[key]){
        reallyEdit[key] = editedProduct[key]
      }
    }

    fetchJson(`http://localhost:3000/product/${editedProduct.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reallyEdit)
    })
    .then(value => updateProduct())

    //products[index] = editedProduct;
    selectedProduct = editedProduct = null;
  }

  let token = null
  function login() {
    fetchJson(`${backend}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(value => {
      token = value.token
      updateCart()
    }) 
  }
  function logout() {
    token = null
  }

  function updateCart() {
    fetchJson(`${backend}/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer: ${token}`
      }
    })
    .then(value => {
      cart = []//[ ...cart, product ];
      for (const e of value) {        
        fetchJson(`${backend}/product/${e.product_id}`)
        .then(value => {
          cart.push({
            id: value.id,
            title: value.title,
            quantity: e.quantity,
            price: e.quantity * value.price
          })
          cart = cart
        })        
      }
    }) 
  }
  function addToCart(product) {
    
    fetchJson(`${backend}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer: ${token}`
      },
      body: JSON.stringify({
        productId: product.id
      })
    })
    .then(value => {
      updateCart()
    })
  }
  function removeFromCart(id) {
    fetchJson(`${backend}/cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer: ${token}`
      },
      body: JSON.stringify({
        productId: id
      })
    })
    .then(value => {
      updateCart()
    })
  }

  
</script>
  
<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
  }
  .product {
    border: 1px solid #ccc;
    padding: 1rem;
  }
  .selected {
    background-color: #eee;
  }
</style>
  
<button on:click={createProduct}>Nuovo prodotto</button>
  
{#if selectedProduct}
  <h2>Dettaglio prodotto</h2>
  <div class="product">
    <label>
      Titolo:
      <input bind:value={editedProduct.title}>
    </label>
    <label>
      Descrizione:
      <textarea bind:value={editedProduct.description}></textarea>
    </label>
    <label>
      Prezzo:
      <input type="number" step="0.01" bind:value={editedProduct.price}>
    </label>
    <button on:click={saveProduct}>Salva</button>
  </div>
{/if}

<div class="grid">
  {#each products as product}
    <div class="product {selectedProduct && selectedProduct.id === product.id ? 'selected' : ''}">
      <h2 on:click={() => editProduct(product.id)}>{product.id}: {product.title}</h2>
      <p>{product.description.slice(0, 10)}{product.description.length > 10 ? '...' : ''}</p>
      <p>Prezzo: {product.price}€</p>
      {#if token}
      <button on:click={() => addToCart(product)}>Aggiungi al carrello</button>
      {/if}
      <button on:click={() => deleteProduct(product.id)}>Cancella</button>
    </div>
  {/each}
</div>


{#if token}
  <h2>Carrello</h2>
  <button on:click={logout}>Logout</button>
  <div class="cart">
    {#each cart as product}
      <div class="cart-item">
        <h3>{product.title}</h3>
        <p>Quantità: {product.quantity}</p>
        <p>Prezzo: {product.price}€</p>
        <button on:click={() => removeFromCart(product.id)}>Cancella</button>
      </div>
    {/each}
  </div>
{:else}
  <button on:click={login}>Login</button>
{/if}