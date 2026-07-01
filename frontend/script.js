const API = "/api";


// Fetch products from backend
fetch(`${API}/products`)
  .then(response => response.json())
  .then(data => {
    productData = data;
    console.log("Products from backend:", data);

    const table = document.getElementById("productTable");
    if (!table) return;

    data.forEach(product => {
      table.innerHTML += `
        <tr>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.remainingQuantity}</td>
          <td>${product.totalQuantity}</td>
        </tr>
      `;
    });
  })
  .catch(err => console.error("Backend connection failed", err));

function openTokenCutter() {
  if (!productData.length) {
    alert("No products available.");
    return;
  }

  const list = productData
    .map(p => `${p.id}: ${p.name} (Total: ${p.totalQuantity})`)
    .join("\n");

  const idinput = prompt(`Enter product ID to cut tokens from:\n${list}`);
  if (!idinput) return;

  const selectedProduct = productData.find(p => p.id === idinput.trim());
  if (!selectedProduct) {
    alert("Product not found.");
    return;
  }

  const countInput = prompt(`Enter number of tokens to cut from ${selectedProduct.name}:`, "1");
  const count = Number(countInput);
  if (!count || count < 1) {
    alert("Please enter a valid positive number.");
    return;
  }

  cutTokens(selectedProduct.id, count);
}

function cutTokens(id, count) {
  fetch(`${API}/cut-token`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id, count })
  })
    .then(response => response.json())
    .then(result => {
      if (result.product) {
        const tokenResult = document.getElementById("tokenResult");
        if (tokenResult) {
          tokenResult.textContent = `Cut ${count} token(s) from ${result.product.name}. Remaining quantity: ${result.product.remainingQuantity}. Total quantity stays: ${result.product.totalQuantity}.`;
        }
        setTimeout(() => window.location.reload(), 500);
      } else {
        alert(result.message || "Could not cut token.");
      }
    })
    .catch(err => {
      console.error("Failed to cut token", err);
      alert("Unable to cut token. Check backend connection.");
    });
}

function addProduct() {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const totalQuantity = document.getElementById("quantity").value.trim();

  if (!name || !price || !totalQuantity) {
    alert("Please fill in all fields.");
    return;
  }

  fetch(`${API}/add-product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, price, totalQuantity })
  })
    .then(response => response.json())
    .then(result => {
      if (result.message) {
        alert(result.message);
        window.location.reload();
      } else {
        alert("Product could not be added.");
      }
    })
    .catch(err => {
      console.error("Failed to add product", err);
      alert("Could not add product. Check backend connection.");
    });
}