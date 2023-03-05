<script>
    let products = [
      { id: 1, title: 'Prodotto 1', description: 'Descrizione del prodotto 1', price: 10.99 },
      { id: 2, title: 'Prodotto 2', description: 'Descrizione del prodotto 2', price: 19.99 },
      { id: 3, title: 'Prodotto 3', description: 'Descrizione del prodotto 3', price: 5.99 }
    ];
  
    let selectedProduct = null;
    let editedProduct = null;
    let cart = [];
  
    function deleteProduct(id) {
      products = products.filter(product => product.id !== id);
    }
  
    function editProduct(id) {
      selectedProduct = products.find(product => product.id === id);
      editedProduct = { ...selectedProduct };
    }
  
    function saveProduct() {
      const index = products.findIndex(product => product.id === editedProduct.id);
      products[index] = editedProduct;
      selectedProduct = editedProduct = null;
    }
  
    function addToCart(product) {
      cart = [ ...cart, product ];
    }

    function removeFromCart(id) {
        cart = cart.filter(product => product.id !== id);
    }
  
    function createProduct() {
      const newProduct = {
        id: products.length + 1,
        title: '',
        description: '',
        price: 0
      };
      products = [ ...products, newProduct ];
      editProduct(newProduct.id);
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
  
  <div class="grid">
    {#each products as product}
      <div class="product {selectedProduct && selectedProduct.id === product.id ? 'selected' : ''}">
        <h2 on:click={() => editProduct(product.id)}>{product.id}: {product.title}</h2>
        <p>{product.description.slice(0, 10)}...</p>
        <p>Prezzo: {product.price}€</p>
        <button on:click={() => addToCart(product)}>Aggiungi al carrello</button>
        <button on:click={() => deleteProduct(product.id)}>Cancella</button>
      </div>
    {/each}
  </div>
  
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
  
  <h2>Carrello</h2>
  <div class="cart">
    {#each cart as product}
      <div class="cart-item">
        <h3>{product.title}</h3>
        <p>Prezzo: {product.price}€</p>
        <button on:click={() => removeFromCart(product.id)}>Cancella</button>
      </div>
    {/each}
  </div>
  