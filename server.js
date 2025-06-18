const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors()); // Allows requests from React
app.use(express.json()); // parses incoming JSON

// 1. connect to your MongoDB (replace YOUR_MONGODB_URI with your own connection string)
mongoose
  .connect(
    "mongodb+srv://vidhyasagarmyana9598:Vsagarm@cluster0.ybqi23x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.log("❌ Database connection error", err));

// 2. Define Schema and Model
const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model("Item", ItemSchema);

// 3. CRUD routes

// CREATE
app.post("/api/items", async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.json(item);
});

// READ (GET all)
app.get("/api/items", async (req, res) => {
  const { page = 1, limit = 5, search = "" } = req.query;

  const filter = search ? { name: { $regex: search, $options: "i" } } : {};

  const total = await Item.countDocuments(filter);
  const items = await Item.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ total, page: Number(page), limit: Number(limit), items });
});

// UPDATE
app.put("/api/items/:id", async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(item);
});

// DELETE
app.delete("/api/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted..." });
});

// 4. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
