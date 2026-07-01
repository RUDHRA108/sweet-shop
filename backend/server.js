const express = require("express");
const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/product.routes");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use("/api", productRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});