import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';

// Force DNS resolution to use Google's Public DNS to prevent querySrv ECONNREFUSED errors on some local networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
// DATABASE CONNECTION
// ─────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in .env file.");
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected successfully to MongoDB Atlas."))
  .catch(err => console.error("MongoDB Atlas connection error:", err));

// ─────────────────────────────────────────────
// MONGOOSE SCHEMAS & MODELS
// ─────────────────────────────────────────────

// Tenant Schema
const tenantSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true }
}, { timestamps: true });

tenantSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Tenant = mongoose.model('Tenant', tenantSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  tenantUsername: { type: String, required: true, index: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  specs: { type: String, default: "" },
  category: { type: String, required: true },
  categoryIcon: { type: String, default: "📦" },
  categoryColor: { type: String, default: "blue" },
  subcategory: { type: String, required: true }
}, { timestamps: true });

productSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Product = mongoose.model('Product', productSchema);

// ─────────────────────────────────────────────
// SEED DATA CONFIGURATION (MATCHING FRONTEND)
// ─────────────────────────────────────────────
const buildCategory = (prefix, startId, priceBase, priceStep, specs) =>
  Array.from({ length: 8 }, (_, i) => ({
    stock: Math.floor(10 + Math.random() * 90),
    price: priceBase + i * priceStep,
    specs,
    sku: `${prefix}-${String(i + 1).padStart(3, "0")}`,
  }));

const getSeededCategories = (businessType) => {
  switch (businessType) {
    case "Factory Owner":
      return {
        "Raw Materials & Metals": {
          icon: "🔩",
          color: "slate",
          subcategories: {
            "Steel Rods": buildCategory("SR", 1001, 2500, 150, "Industrial Grade SS304")
              .map((p, i) => ({ ...p, name: `SS304 Steel Rod ${i + 1}"` })),
            "Metal Sheet Rolls": buildCategory("MS", 1009, 8000, 500, "Galvanized Sheet")
              .map((p, i) => ({ ...p, name: `Galvanized Sheet Roll G${i + 20}` })),
            "Aluminum Extrusions": buildCategory("AE", 1017, 1200, 80, "6063 T6 Alloy")
              .map((p, i) => ({ ...p, name: `T6 Profile Slot ${i + 1}` })),
          },
        },
        "Heavy Duty Fasteners": {
          icon: "⚙️",
          color: "blue",
          subcategories: {
            "High Tensile Bolts": buildCategory("HB", 1025, 450, 20, "Grade 8.8 Carbon Steel")
              .map((p, i) => ({ ...p, name: `M${8 + i * 2} High Tensile Bolt` })),
            "Hydraulic Springs": buildCategory("HS", 1033, 1500, 100, "Heavy Duty Compression")
              .map((p, i) => ({ ...p, name: `Compression Spring H${i + 1}` })),
            "Anchor Fasteners": buildCategory("AF", 1041, 300, 15, "Expansion Sleeve Anchor")
              .map((p, i) => ({ ...p, name: `Sleeve Anchor Expansion M${10 + i}` })),
          },
        },
        "Machinery Spares": {
          icon: "🛠️",
          color: "orange",
          subcategories: {
            "Pneumatic Valves": buildCategory("PV", 1049, 3200, 250, "Solenoid Controlled")
              .map((p, i) => ({ ...p, name: `Solenoid Valve 5/2 Way ${i + 1}` })),
            "Ball Bearings": buildCategory("BB", 1057, 600, 40, "Double Shielded Chrome Steel")
              .map((p, i) => ({ ...p, name: `Chrome Bearing 620${i} ZZ` })),
          },
        },
      };
    case "General Store":
      return {
        "Daily Hardware Tools": {
          icon: "🔨",
          color: "orange",
          subcategories: {
            "Hammer Sets": buildCategory("HS", 2001, 350, 30, "Claw Hammer Carbon Steel")
              .map((p, i) => ({ ...p, name: `Claw Hammer ${12 + i * 2}oz` })),
            "Screwdrivers": buildCategory("SD", 2009, 150, 15, "Magnetic Tip Chrome Vanadium")
              .map((p, i) => ({ ...p, name: `Magnetic Screwdriver Set ${i + 1}pcs` })),
            "Pliers & Cutters": buildCategory("PC", 2017, 280, 20, "Combination Pliers Insulated")
              .map((p, i) => ({ ...p, name: `Combination Pliers ${i + 6}inch` })),
          },
        },
        "Household Fittings": {
          icon: "🚪",
          color: "blue",
          subcategories: {
            "Door Stoppers": buildCategory("DS", 2025, 120, 10, "Rubber Floor Mounted")
              .map((p, i) => ({ ...p, name: `Rubber Floor Stopper ${i + 1}` })),
            "Standard Cabinet Knobs": buildCategory("CK", 2033, 80, 5, "Wooden Round Knob")
              .map((p, i) => ({ ...p, name: `Wooden Knob Design ${i + 1}` })),
            "Hanging Hooks": buildCategory("HH", 2041, 50, 4, "Adhesive Wall Hooks")
              .map((p, i) => ({ ...p, name: `Sticky Hook Pack of ${i + 2}` })),
          },
        },
        "Utility & Tapes": {
          icon: "📦",
          color: "purple",
          subcategories: {
            "Adhesive Tapes": buildCategory("AT", 2049, 90, 8, "Heavy Duty Duct Tape")
              .map((p, i) => ({ ...p, name: `Duct Tape Heavy Duty ${i + 1}"` })),
            "Lubricants & Oils": buildCategory("LO", 2057, 180, 12, "Anti-Rust Spray")
              .map((p, i) => ({ ...p, name: `Anti-Rust WD Spray ${100 + i * 50}ml` })),
          },
        },
      };
    case "Mini Business":
      return {
        "Boutique Fittings": {
          icon: "💎",
          color: "purple",
          subcategories: {
            "Designer Lever Handles": buildCategory("DLH", 3001, 1500, 100, "Satin Brass Premium Finish")
              .map((p, i) => ({ ...p, name: `Satin Brass Handle Series ${String.fromCharCode(65 + i)}` })),
            "Minimalist Pulls": buildCategory("MP", 3009, 600, 40, "Matte Black Aluminum")
              .map((p, i) => ({ ...p, name: `Matte Black T-Bar Pull ${100 + i * 20}mm` })),
            "Glass Fittings": buildCategory("GF", 3017, 950, 50, "Stainless Steel Glass Clips")
              .map((p, i) => ({ ...p, name: `Glass Shower Clamp Bracket ${i + 1}` })),
          },
        },
        "Smart Security": {
          icon: "🔐",
          color: "emerald",
          subcategories: {
            "Electronic Locks": buildCategory("EL", 3025, 4500, 300, "Fingerprint Keyless Smart Lock")
              .map((p, i) => ({ ...p, name: `Smart Lock Biometric Model ${i + 1}` })),
            "Digital Viewers": buildCategory("DV", 3033, 2800, 200, "HD Peephole Camera WiFi")
              .map((p, i) => ({ ...p, name: `WiFi Peephole Digital Viewer ${i + 1}` })),
          },
        },
      };
    default: // Shopkeeper
      return {
        "Fast Selling Retail": {
          icon: "🔑",
          color: "blue",
          subcategories: {
            "Cabinet Handles": buildCategory("CH", 4001, 150, 10, "Stainless Steel Satin Finish")
              .map((p, i) => ({ ...p, name: `SS Cabinet Handle ${100 + i * 20}mm` })),
            "Drawer Pulls": buildCategory("DP", 4009, 120, 8, "Zinc Alloy Classic Design")
              .map((p, i) => ({ ...p, name: `Zinc Alloy Pull Style ${i + 1}` })),
            "Magnetic Catches": buildCategory("MC", 4017, 60, 5, "Heavy Magnetic Cabinet Catch")
              .map((p, i) => ({ ...p, name: `Magnetic Catch Strength ${4 + i * 2}kg` })),
          },
        },
        "Standard Screws": {
          icon: "🔩",
          color: "slate",
          subcategories: {
            "Wood Screws": buildCategory("WS", 4025, 90, 5, "Self-Tapping Carbon Steel")
              .map((p, i) => ({ ...p, name: `Self-Tapping Wood Screw Pack M${3 + i}` })),
            "Machine Screws": buildCategory("MS", 4033, 110, 6, "SS314 Machine Bolt Pack")
              .map((p, i) => ({ ...p, name: `SS314 Machine Bolt Pack M${4 + i}` })),
          },
        },
        "Display Fittings": {
          icon: "💡",
          color: "amber",
          subcategories: {
            "Shelf Brackets": buildCategory("SB", 4041, 180, 15, "L-Shape Decorative Iron")
              .map((p, i) => ({ ...p, name: `Decorative Shelf Bracket ${i + 1}` })),
            "LED Cabinet Lights": buildCategory("LCL", 4049, 320, 25, "USB Rechargeable Under-Cabinet")
              .map((p, i) => ({ ...p, name: `Under-Cabinet LED Strip ${i + 1}` })),
          },
        },
      };
  }
};

const flattenCategories = (username, categories) => {
  const rows = [];
  Object.entries(categories).forEach(([catName, catData]) => {
    Object.entries(catData.subcategories).forEach(([subName, products]) => {
      products.forEach((p) => {
        rows.push({
          tenantUsername: username,
          name: p.name,
          sku: p.sku,
          stock: Number(p.stock),
          price: Number(p.price),
          specs: p.specs || "",
          category: catName,
          categoryIcon: catData.icon || "📦",
          categoryColor: catData.color || "blue",
          subcategory: subName,
        });
      });
    });
  });
  return rows;
};

const rebuildCategoriesFromDb = (dbProducts) => {
  const cats = {};
  dbProducts.forEach((p) => {
    const catName = p.category;
    if (!cats[catName]) {
      cats[catName] = {
        icon: p.categoryIcon || "📦",
        color: p.categoryColor || "blue",
        subcategories: {},
      };
    }
    const subName = p.subcategory;
    if (!cats[catName].subcategories[subName]) {
      cats[catName].subcategories[subName] = [];
    }
    cats[catName].subcategories[subName].push({
      id: p.id,
      name: p.name,
      sku: p.sku,
      stock: Number(p.stock),
      price: Number(p.price),
      specs: p.specs || "",
    });
  });
  return cats;
};

// ─────────────────────────────────────────────
// API ENDPOINTS
// ─────────────────────────────────────────────

// Status Endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Authentication: Register
app.post('/api/auth/register', async (req, res) => {
  const { username, password, businessName, businessType } = req.body;

  if (!username || !password || !businessName || !businessType) {
    return res.status(400).json({ error: "Missing required registration fields" });
  }

  const lowerUser = username.trim().toLowerCase();

  try {
    const existing = await Tenant.findOne({ username: lowerUser });
    if (existing) {
      return res.status(400).json({ error: "Username already exists. Please choose another." });
    }

    // Save tenant
    const newTenant = new Tenant({
      username: lowerUser,
      password,
      businessName: businessName.trim(),
      businessType
    });
    await newTenant.save();

    res.status(201).json({
      username: lowerUser,
      businessName: newTenant.businessName,
      businessType: newTenant.businessType,
      categories: {}
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server registration failed" });
  }
});

// Authentication: Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const lowerUser = username.trim().toLowerCase();

  try {
    const tenant = await Tenant.findOne({ username: lowerUser });
    if (!tenant || tenant.password !== password) {
      return res.status(401).json({ error: "Incorrect username or password" });
    }

    // Fetch all products for this tenant
    const products = await Product.find({ tenantUsername: lowerUser });
    const categories = rebuildCategoriesFromDb(products);

    res.json({
      username: lowerUser,
      businessName: tenant.businessName,
      businessType: tenant.businessType,
      categories
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server login failed" });
  }
});

// Products: Fetch All
app.get('/api/products', async (req, res) => {
  const { tenant } = req.query;

  if (!tenant) {
    return res.status(400).json({ error: "tenantUsername parameter is required" });
  }

  try {
    const products = await Product.find({ tenantUsername: tenant.toLowerCase() });
    res.json(products);
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Products: Create (Add Product)
app.post('/api/products', async (req, res) => {
  const {
    tenantUsername,
    name,
    sku,
    stock,
    price,
    specs,
    category,
    categoryIcon,
    categoryColor,
    subcategory
  } = req.body;

  if (!tenantUsername || !name || !sku || !category || !subcategory) {
    return res.status(400).json({ error: "Missing required product fields" });
  }

  try {
    const newProduct = new Product({
      tenantUsername: tenantUsername.toLowerCase(),
      name,
      sku,
      stock: Number(stock) || 0,
      price: Number(price) || 0,
      specs: specs || "",
      category,
      categoryIcon: categoryIcon || "📦",
      categoryColor: categoryColor || "blue",
      subcategory
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Products: Update (Edit Product & Adjust Stock)
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, sku, stock, price, specs } = req.body;

  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          sku,
          stock: Number(stock) || 0,
          price: Number(price) || 0,
          specs: specs || ""
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Products: Delete
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});
