import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  ChevronRight,
  Home,
  Package,
  BarChart3,
  Bell,
  Download,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Check,
  AlertTriangle,
  ChevronDown,
  Filter,
  RefreshCw,
  Save,
  XCircle,
  Minus,
} from "lucide-react";
import { Toaster, toast } from "sonner";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const buildCategory = (prefix, startId, priceBase, priceStep, specs) =>
  Array.from({ length: 8 }, (_, i) => ({
    id: startId + i,
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
            "Steel Rods": buildCategory(
              "SR",
              1001,
              2500,
              150,
              "Industrial Grade SS304",
            ).map((p, i) => ({ ...p, name: `SS304 Steel Rod ${i + 1}"` })),
            "Metal Sheet Rolls": buildCategory(
              "MS",
              1009,
              8000,
              500,
              "Galvanized Sheet",
            ).map((p, i) => ({
              ...p,
              name: `Galvanized Sheet Roll G${i + 20}`,
            })),
            "Aluminum Extrusions": buildCategory(
              "AE",
              1017,
              1200,
              80,
              "6063 T6 Alloy",
            ).map((p, i) => ({ ...p, name: `T6 Profile Slot ${i + 1}` })),
          },
        },
        "Heavy Duty Fasteners": {
          icon: "⚙️",
          color: "blue",
          subcategories: {
            "High Tensile Bolts": buildCategory(
              "HB",
              1025,
              450,
              20,
              "Grade 8.8 Carbon Steel",
            ).map((p, i) => ({
              ...p,
              name: `M${8 + i * 2} High Tensile Bolt`,
            })),
            "Hydraulic Springs": buildCategory(
              "HS",
              1033,
              1500,
              100,
              "Heavy Duty Compression",
            ).map((p, i) => ({ ...p, name: `Compression Spring H${i + 1}` })),
            "Anchor Fasteners": buildCategory(
              "AF",
              1041,
              300,
              15,
              "Expansion Sleeve Anchor",
            ).map((p, i) => ({
              ...p,
              name: `Sleeve Anchor Expansion M${10 + i}`,
            })),
          },
        },
        "Machinery Spares": {
          icon: "🛠️",
          color: "orange",
          subcategories: {
            "Pneumatic Valves": buildCategory(
              "PV",
              1049,
              3200,
              250,
              "Solenoid Controlled",
            ).map((p, i) => ({
              ...p,
              name: `Solenoid Valve 5/2 Way ${i + 1}`,
            })),
            "Ball Bearings": buildCategory(
              "BB",
              1057,
              600,
              40,
              "Double Shielded Chrome Steel",
            ).map((p, i) => ({ ...p, name: `Chrome Bearing 620${i} ZZ` })),
          },
        },
      };
    case "General Store":
      return {
        "Daily Hardware Tools": {
          icon: "🔨",
          color: "orange",
          subcategories: {
            "Hammer Sets": buildCategory(
              "HS",
              2001,
              350,
              30,
              "Claw Hammer Carbon Steel",
            ).map((p, i) => ({ ...p, name: `Claw Hammer ${12 + i * 2}oz` })),
            Screwdrivers: buildCategory(
              "SD",
              2009,
              150,
              15,
              "Magnetic Tip Chrome Vanadium",
            ).map((p, i) => ({
              ...p,
              name: `Magnetic Screwdriver Set ${i + 1}pcs`,
            })),
            "Pliers & Cutters": buildCategory(
              "PC",
              2017,
              280,
              20,
              "Combination Pliers Insulated",
            ).map((p, i) => ({
              ...p,
              name: `Combination Pliers ${i + 6}inch`,
            })),
          },
        },
        "Household Fittings": {
          icon: "🚪",
          color: "blue",
          subcategories: {
            "Door Stoppers": buildCategory(
              "DS",
              2025,
              120,
              10,
              "Rubber Floor Mounted",
            ).map((p, i) => ({ ...p, name: `Rubber Floor Stopper ${i + 1}` })),
            "Standard Cabinet Knobs": buildCategory(
              "CK",
              2033,
              80,
              5,
              "Wooden Round Knob",
            ).map((p, i) => ({ ...p, name: `Wooden Knob Design ${i + 1}` })),
            "Hanging Hooks": buildCategory(
              "HH",
              2041,
              50,
              4,
              "Adhesive Wall Hooks",
            ).map((p, i) => ({ ...p, name: `Sticky Hook Pack of ${i + 2}` })),
          },
        },
        "Utility & Tapes": {
          icon: "📦",
          color: "purple",
          subcategories: {
            "Adhesive Tapes": buildCategory(
              "AT",
              2049,
              90,
              8,
              "Heavy Duty Duct Tape",
            ).map((p, i) => ({ ...p, name: `Duct Tape Heavy Duty ${i + 1}"` })),
            "Lubricants & Oils": buildCategory(
              "LO",
              2057,
              180,
              12,
              "Anti-Rust Spray",
            ).map((p, i) => ({
              ...p,
              name: `Anti-Rust WD Spray ${100 + i * 50}ml`,
            })),
          },
        },
      };
    case "Mini Business":
      return {
        "Boutique Fittings": {
          icon: "💎",
          color: "purple",
          subcategories: {
            "Designer Lever Handles": buildCategory(
              "DLH",
              3001,
              1500,
              100,
              "Satin Brass Premium Finish",
            ).map((p, i) => ({
              ...p,
              name: `Satin Brass Handle Series ${String.fromCharCode(65 + i)}`,
            })),
            "Minimalist Pulls": buildCategory(
              "MP",
              3009,
              600,
              40,
              "Matte Black Aluminum",
            ).map((p, i) => ({
              ...p,
              name: `Matte Black T-Bar Pull ${100 + i * 20}mm`,
            })),
            "Glass Fittings": buildCategory(
              "GF",
              3017,
              950,
              50,
              "Stainless Steel Glass Clips",
            ).map((p, i) => ({
              ...p,
              name: `Glass Shower Clamp Bracket ${i + 1}`,
            })),
          },
        },
        "Smart Security": {
          icon: "🔐",
          color: "emerald",
          subcategories: {
            "Electronic Locks": buildCategory(
              "EL",
              3025,
              4500,
              300,
              "Fingerprint Keyless Smart Lock",
            ).map((p, i) => ({
              ...p,
              name: `Smart Lock Biometric Model ${i + 1}`,
            })),
            "Digital Viewers": buildCategory(
              "DV",
              3033,
              2800,
              200,
              "HD Peephole Camera WiFi",
            ).map((p, i) => ({
              ...p,
              name: `WiFi Peephole Digital Viewer ${i + 1}`,
            })),
          },
        },
      };
    case "Shopkeeper":
    default:
      return {
        "Fast Selling Retail": {
          icon: "🔑",
          color: "blue",
          subcategories: {
            "Cabinet Handles": buildCategory(
              "CH",
              4001,
              150,
              10,
              "Stainless Steel Satin Finish",
            ).map((p, i) => ({
              ...p,
              name: `SS Cabinet Handle ${100 + i * 20}mm`,
            })),
            "Drawer Pulls": buildCategory(
              "DP",
              4009,
              120,
              8,
              "Zinc Alloy Classic Design",
            ).map((p, i) => ({ ...p, name: `Zinc Alloy Pull Style ${i + 1}` })),
            "Magnetic Catches": buildCategory(
              "MC",
              4017,
              60,
              5,
              "Heavy Magnetic Cabinet Catch",
            ).map((p, i) => ({
              ...p,
              name: `Magnetic Catch Strength ${4 + i * 2}kg`,
            })),
          },
        },
        "Standard Screws": {
          icon: "🔩",
          color: "slate",
          subcategories: {
            "Wood Screws": buildCategory(
              "WS",
              4025,
              90,
              5,
              "Self-Tapping Carbon Steel",
            ).map((p, i) => ({
              ...p,
              name: `Self-Tapping Wood Screw Pack M${3 + i}`,
            })),
            "Machine Screws": buildCategory(
              "MS",
              4033,
              110,
              6,
              "SS314 Machine Bolt Pack",
            ).map((p, i) => ({
              ...p,
              name: `SS314 Machine Bolt Pack M${4 + i}`,
            })),
          },
        },
        "Display Fittings": {
          icon: "💡",
          color: "amber",
          subcategories: {
            "Shelf Brackets": buildCategory(
              "SB",
              4041,
              180,
              15,
              "L-Shape Decorative Iron",
            ).map((p, i) => ({
              ...p,
              name: `Decorative Shelf Bracket ${i + 1}`,
            })),
            "LED Cabinet Lights": buildCategory(
              "LCL",
              4049,
              320,
              25,
              "USB Rechargeable Under-Cabinet",
            ).map((p, i) => ({
              ...p,
              name: `Under-Cabinet LED Strip ${i + 1}`,
            })),
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
          tenant_username: username,
          name: p.name,
          sku: p.sku,
          stock: Number(p.stock),
          price: Number(p.price),
          specs: p.specs || "",
          category: catName,
          category_icon: catData.icon || "📦",
          category_color: catData.color || "blue",
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
        icon: p.category_icon || "📦",
        color: p.category_color || "blue",
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
// UTILITIES
// ─────────────────────────────────────────────
const formatPrice = (n) => `₹${n.toLocaleString("en-IN")}`;

const getStockStatus = (stock) => {
  if (stock >= 50)
    return {
      label: "In Stock",
      cls: "bg-emerald-100 text-emerald-700 border-emerald-200",
      bar: "bg-emerald-500",
      dot: "bg-emerald-500",
    };
  if (stock >= 20)
    return {
      label: "Medium Stock",
      cls: "bg-blue-100 text-blue-700 border-blue-200",
      bar: "bg-blue-500",
      dot: "bg-blue-500",
    };
  if (stock >= 5)
    return {
      label: "Low Stock",
      cls: "bg-amber-100 text-amber-700 border-amber-200",
      bar: "bg-amber-500",
      dot: "bg-amber-500",
    };
  return {
    label: "Critical",
    cls: "bg-red-100 text-red-700 border-red-200",
    bar: "bg-red-500",
    dot: "bg-red-500",
  };
};

const colorMap = {
  blue: {
    badge: "bg-blue-100 text-blue-700",
    active: "bg-blue-600 text-white shadow-blue-200",
    hover: "hover:bg-blue-50 hover:border-blue-300",
  },
  orange: {
    badge: "bg-orange-100 text-orange-700",
    active: "bg-orange-500 text-white shadow-orange-200",
    hover: "hover:bg-orange-50 hover:border-orange-300",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-700",
    active: "bg-emerald-600 text-white shadow-emerald-200",
    hover: "hover:bg-emerald-50 hover:border-emerald-300",
  },
  purple: {
    badge: "bg-purple-100 text-purple-700",
    active: "bg-purple-600 text-white shadow-purple-200",
    hover: "hover:bg-purple-50 hover:border-purple-300",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700",
    active: "bg-amber-500 text-white shadow-amber-200",
    hover: "hover:bg-amber-50 hover:border-amber-300",
  },
  slate: {
    badge: "bg-slate-100 text-slate-700",
    active: "bg-slate-700 text-white shadow-slate-200",
    hover: "hover:bg-slate-50 hover:border-slate-300",
  },
};

// Framer Motion variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const stagger = { show: { transition: { staggerChildren: 0.07 } } };
const slideIn = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

// ─────────────────────────────────────────────
// SHARED NAV COMPONENT
// ─────────────────────────────────────────────
function Navbar({ onNavigate, currentPage, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { key: "home", label: "Home" },
    { key: "products", label: "Products" },
    { key: "about", label: "About" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/98 shadow-lg border-b border-slate-200" : "bg-white/95 border-b border-slate-100"} backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:shadow-blue-300 transition-shadow">
            <span className="text-xl">🔧</span>
          </div>
          <div className="text-left">
            <div
              className="font-extrabold text-slate-900 leading-tight tracking-tight"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              SK INDUSTRIAL
            </div>
            <div className="text-xs text-slate-500 font-medium tracking-wide">
              Premium Hardware
            </div>
          </div>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentPage === key
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={onLogout}
            className="ml-4 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition font-semibold text-sm shadow-md shadow-red-100 hover:shadow-red-200"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-slate-100"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    onNavigate(key);
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition ${
                    currentPage === key
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={onLogout}
                className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-sm"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────
function HomePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl -z-0" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 text-blue-700 rounded-full text-sm font-semibold mb-8 border border-blue-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Multi-Tenant Inventory Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.15] tracking-tight"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Smart Stock Hub For
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Multiple Businesses
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            A SaaS inventory management system custom-tailored for Factory
            Owners, Shopkeepers, General Stores, and Mini Businesses. Keep your
            data isolated, pre-seeded, and fully customizable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => onNavigate("gateway-login")}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Started Portal →
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-sm">⚙️</span>
            </div>
            <span
              className="font-black text-lg"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              SK MULTI-STOK
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 SK Multi-Stok SaaS platform. All rights reserved.
          </p>
          <button
            onClick={() => onNavigate("gateway-login")}
            className="text-blue-400 hover:text-blue-300 font-bold text-sm transition"
          >
            Access Gateway Portal →
          </button>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────
// PRODUCTS PAGE
// ─────────────────────────────────────────────
function ProductsPage({ categories, onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const currentProducts = useMemo(() => {
    if (!selectedCategory || !selectedSubcategory) return [];
    const base =
      categories[selectedCategory]?.subcategories[selectedSubcategory] || [];
    return base.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStock =
        stockFilter === "all"
          ? true
          : stockFilter === "in"
            ? p.stock >= 50
            : stockFilter === "medium"
              ? p.stock >= 20 && p.stock < 50
              : stockFilter === "low"
                ? p.stock >= 5 && p.stock < 20
                : p.stock < 5;
      return matchSearch && matchStock;
    });
  }, [
    selectedCategory,
    selectedSubcategory,
    searchTerm,
    stockFilter,
    categories,
  ]);

  const catColor = selectedCategory
    ? colorMap[categories[selectedCategory]?.color || "blue"]
    : colorMap.blue;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <button
              onClick={() => onNavigate("home")}
              className="hover:text-blue-600 transition flex items-center gap-1"
            >
              <Home size={14} /> Home
            </button>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-semibold">Products</span>
            {selectedCategory && (
              <>
                <ChevronRight size={14} />
                <span className="text-slate-900 font-semibold">
                  {selectedCategory}
                </span>
              </>
            )}
            {selectedSubcategory && (
              <>
                <ChevronRight size={14} />
                <span className="text-slate-900 font-semibold">
                  {selectedSubcategory}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-32">
              <h3 className="font-bold text-slate-900 mb-5 text-sm uppercase tracking-wider">
                Categories
              </h3>
              <div className="space-y-1.5">
                {Object.entries(categories).map(([cat, data]) => {
                  const c = colorMap[data.color];
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedSubcategory(null);
                        setSearchTerm("");
                        setStockFilter("all");
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 text-sm font-semibold border ${
                        isActive
                          ? `${c.active} border-transparent shadow-md`
                          : `text-slate-700 border-transparent ${c.hover} hover:border-slate-200`
                      }`}
                    >
                      <span className="text-base">{data.icon}</span>
                      <span className="flex-1 leading-tight">{cat}</span>
                      {isActive && (
                        <ChevronRight size={14} className="opacity-70" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {selectedCategory ? (
              <>
                {/* Subcategory Pills */}
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6"
                >
                  <h2
                    className="text-2xl font-black text-slate-900 mb-5"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {categories[selectedCategory].icon} {selectedCategory}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(
                      categories[selectedCategory].subcategories,
                    ).map((subcat) => (
                      <button
                        key={subcat}
                        onClick={() => {
                          setSelectedSubcategory(subcat);
                          setSearchTerm("");
                          setStockFilter("all");
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                          selectedSubcategory === subcat
                            ? `${catColor.active} border-transparent shadow-md`
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {subcat}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Products Grid */}
                {selectedSubcategory && (
                  <motion.div
                    key={selectedSubcategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-5">
                      <div className="relative flex-1">
                        <Search
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder="Search product name or SKU..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm transition"
                        />
                      </div>
                      <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        className="px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-400 text-sm font-medium text-slate-700 cursor-pointer"
                      >
                        <option value="all">All Stock Levels</option>
                        <option value="in">In Stock (50+)</option>
                        <option value="medium">Medium (20-49)</option>
                        <option value="low">Low (5-19)</option>
                        <option value="critical">Critical (&lt;5)</option>
                      </select>
                    </div>

                    {currentProducts.length > 0 ? (
                      <>
                        <p className="text-xs text-slate-500 mb-4 font-medium">
                          {currentProducts.length} products found
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          {currentProducts.map((product, idx) => {
                            const status = getStockStatus(product.stock);
                            return (
                              <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 overflow-hidden group"
                              >
                                <div className="p-5">
                                  <div className="flex items-start justify-between mb-3">
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${status.cls}`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                                      />
                                      {status.label}
                                    </span>
                                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                                      {product.sku}
                                    </span>
                                  </div>

                                  <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                                    {product.name}
                                  </h4>
                                  <p className="text-xs text-slate-500 mb-4">
                                    {product.specs}
                                  </p>

                                  {/* Stock bar */}
                                  <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1.5">
                                      <span className="text-xs text-slate-500">
                                        Stock
                                      </span>
                                      <span className="text-xs font-bold text-slate-700">
                                        {product.stock} units
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                                      <div
                                        className={`h-1.5 rounded-full transition-all ${status.bar}`}
                                        style={{
                                          width: `${Math.min((product.stock / 100) * 100, 100)}%`,
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-lg font-black text-slate-900">
                                      {formatPrice(product.price)}
                                    </span>
                                    <button
                                      onClick={() => onNavigate("contact")}
                                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-bold transition"
                                    >
                                      Inquire
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                        <Search
                          size={40}
                          className="mx-auto text-slate-300 mb-4"
                        />
                        <p className="text-slate-600 font-semibold">
                          No products match your filters
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setStockFilter("all");
                          }}
                          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Clear filters
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-20 text-center">
                <Package size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-semibold text-lg">
                  Select a category to browse products
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Choose from the sidebar on the left
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────
function AboutPage({ onNavigate, categories }) {
  const totalProducts = Object.values(categories).reduce(
    (acc, cat) =>
      acc + Object.values(cat.subcategories).reduce((a, s) => a + s.length, 0),
    0,
  );

  const timeline = [
    {
      year: "2010",
      title: "Founded",
      desc: "Started as a small hardware distributor in the industrial district.",
    },
    {
      year: "2015",
      title: "Expansion",
      desc: "Expanded to 6 major product categories with 100+ SKUs.",
    },
    {
      year: "2019",
      title: "Digital Catalog",
      desc: "Launched our first online product catalog with real-time inventory.",
    },
    {
      year: "2024",
      title: "Today",
      desc: `Now featuring ${totalProducts}+ SKUs serving thousands of trade customers across India.`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-5"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            About SK Industrial
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-blue-100 text-lg"
          >
            India's premier door hardware distributor with over a decade of
            excellence.
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        {/* Mission */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-slate-200 p-10"
        >
          <h2
            className="text-3xl font-black text-slate-900 mb-5"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Our Mission
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            To provide builders, architects, and contractors across India with
            the highest quality door hardware at factory-direct prices, backed
            by real-time inventory visibility and exceptional service.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: `${totalProducts}+`, l: "Products" },
            { n: `${Object.keys(categories).length}`, l: "Categories" },
            { n: "14+", l: "Years" },
            { n: "10K+", l: "Clients" },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-slate-200 p-6 text-center"
            >
              <div
                className="text-3xl font-black text-blue-600 mb-1"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {s.n}
              </div>
              <div className="text-sm text-slate-600 font-semibold">{s.l}</div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-slate-200 p-10"
        >
          <h2
            className="text-3xl font-black text-slate-900 mb-8"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Our Journey
          </h2>
          <div className="space-y-6">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div
                  className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black flex-shrink-0 text-sm"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {t.year}
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-slate-900 mb-1">{t.title}</h3>
                  <p className="text-slate-600 text-sm">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Offerings */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-slate-200 p-10"
        >
          <h2
            className="text-3xl font-black text-slate-900 mb-7"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "316+ door hardware products across 21 subcategories",
              "Real-time inventory tracking for all SKUs",
              "Factory-direct pricing with volume discounts",
              "IS-certified quality materials (SS, Brass, Chrome)",
              "Bulk order handling with priority dispatch",
              "24-hour quote response time",
              "Dedicated trade account support",
              "Pan-India fast delivery network",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-emerald-600" />
                </div>
                <p className="text-slate-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────
function ContactPage({ onNavigate }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success("Inquiry sent! We'll respond within 24 hours.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Banner */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-4"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg"
          >
            Bulk orders, trade accounts, custom sourcing — we're here to help.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info cards */}
          <div className="lg:col-span-2 space-y-5">
            {[
              {
                icon: <Phone size={20} />,
                label: "Phone",
                value: "+91 98765 43210",
                sub: "Mon–Fri, 9AM–6PM IST",
                color: "blue",
              },
              {
                icon: <Mail size={20} />,
                label: "Email",
                value: "info@skindustrial.com",
                sub: "Reply within 24 hours",
                color: "emerald",
              },
              {
                icon: <MapPin size={20} />,
                label: "Address",
                value: "Hardware District, Industrial Zone",
                sub: "City, India – 400001",
                color: "orange",
              },
              {
                icon: <Clock size={20} />,
                label: "Hours",
                value: "Mon–Fri: 9:00 AM – 6:00 PM",
                sub: "Sat: 10:00 AM – 2:00 PM",
                color: "purple",
              },
            ].map((info, i) => {
              const colorCls = {
                blue: "bg-blue-100 text-blue-600",
                emerald: "bg-emerald-100 text-emerald-600",
                orange: "bg-orange-100 text-orange-600",
                purple: "bg-purple-100 text-purple-600",
              };
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex gap-5 items-start"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorCls[info.color]}`}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                      {info.label}
                    </p>
                    <p className="font-bold text-slate-900 text-sm">
                      {info.value}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{info.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-8"
          >
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <Check size={36} className="text-emerald-600" />
                </div>
                <h3
                  className="text-2xl font-black text-slate-900 mb-3"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Message Sent!
                </h3>
                <p className="text-slate-600 mb-8">
                  Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h2
                  className="text-2xl font-black text-slate-900 mb-7"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Quick Inquiry
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Product inquiry, bulk order, etc."
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us about your requirements..."
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm transition resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {sending ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />{" "}
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Send Inquiry
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// GATEWAY LOGIN PAGE (Unified Admin & User Login)
// ─────────────────────────────────────────────
function GatewayLoginPage({ onLogin, onNavigate, dbConnected }) {
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'register'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Shopkeeper");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    const lowerUser = username.trim().toLowerCase();

    // 1. MongoDB login attempt
    if (dbConnected) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: lowerUser, password })
        });

        if (res.ok) {
          const tenantData = await res.json();
          setLoading(false);
          onLogin(lowerUser, tenantData);
          return;
        } else {
          const errData = await res.json();
          setError(errData.error || "Incorrect username or password.");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("MongoDB login exception, falling back...", err);
      }
    }

    // 2. Local storage fallback
    setTimeout(() => {
      setLoading(false);
      const storageKey = "sk_multi_tenant_data";
      const rawData = localStorage.getItem(storageKey);
      const db = rawData ? JSON.parse(rawData) : { tenants: {} };

      const tenant = db.tenants[lowerUser];
      if (tenant && tenant.password === password) {
        onLogin(lowerUser, tenant);
      } else {
        setError("Incorrect username or password. Please try again.");
      }
    }, 600);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!businessName || !username || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 3) {
      setError("Password must be at least 3 characters.");
      return;
    }

    setLoading(true);
    const lowerUser = username.trim().toLowerCase();

    // 1. MongoDB registration attempt
    if (dbConnected) {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: lowerUser,
            password,
            businessName: businessName.trim(),
            businessType
          })
        });

        if (res.ok) {
          const tenantData = await res.json();
          toast.success(
            `Account registered for ${businessName}! (MongoDB connected)`,
          );
          setLoading(false);
          onLogin(lowerUser, tenantData);
          return;
        } else {
          const errData = await res.json();
          setError(errData.error || "Registration failed.");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error(
          "MongoDB registration exception, trying fallback...",
          err,
        );
      }
    }

    // 2. Local storage fallback
    setTimeout(() => {
      setLoading(false);
      const storageKey = "sk_multi_tenant_data";
      const rawData = localStorage.getItem(storageKey);
      const db = rawData ? JSON.parse(rawData) : { tenants: {} };

      if (db.tenants[lowerUser]) {
        setError("Username already exists. Please choose a different one.");
        return;
      }

      const localTenant = {
        username: lowerUser,
        password,
        businessName: businessName.trim(),
        businessType,
        categories: {},
      };

      db.tenants[lowerUser] = localTenant;
      localStorage.setItem(storageKey, JSON.stringify(db));
      toast.success(
        `Account registered for ${businessName}! (Local storage mode)`,
      );
      onLogin(lowerUser, localTenant);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl relative z-10"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
            <span className="text-3xl">⚙️</span>
          </div>
          <h1
            className="text-2xl font-black text-white tracking-tight"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            SK MULTI-STOK
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Multi-Tenant Inventory SaaS Hub
          </p>

          <div className="mt-2.5 flex justify-center">
            {dbConnected ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MongoDB Atlas Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Local Mode (Offline)
              </span>
            )}
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/5">
          <button
            onClick={() => {
              setActiveTab("login");
              setError("");
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "login" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setError("");
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "register" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
          >
            Create Account
          </button>
        </div>

        {activeTab === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm pr-12 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 flex items-center gap-1.5 font-medium"
              >
                <AlertTriangle size={14} /> {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Verifying...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Mohan Hardware Store"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Business Type
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400 text-sm cursor-pointer"
              >
                <option value="Shopkeeper">Shopkeeper (Retail hardware)</option>
                <option value="Factory Owner">
                  Factory Owner (Heavy Industrial)
                </option>
                <option value="General Store">
                  General Store (Variety tools)
                </option>
                <option value="Mini Business">
                  Mini Business (Boutique security)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose username"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm transition"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 flex items-center gap-1.5 font-medium"
              >
                <AlertTriangle size={14} /> {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Creating
                  Account...
                </>
              ) : (
                "Create & Login"
              )}
            </button>
          </form>
        )}

        <button
          onClick={() => onNavigate("home")}
          className="w-full mt-4 text-blue-400 font-semibold hover:text-blue-300 transition text-xs text-center"
        >
          ← Back to SaaS Landing Page
        </button>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────
function AdminDashboard({
  tenantInfo,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState("inventory");
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    sku: "",
    stock: "",
    price: "",
    specs: "",
    category: "",
    subcategory: "",
  });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [useCustomSubcategory, setUseCustomSubcategory] = useState(false);

  useEffect(() => {
    if (showAddModal) {
      const hasCategories = Object.keys(categories).length > 0;
      setUseCustomCategory(!hasCategories);
      setUseCustomSubcategory(!hasCategories);
    }
  }, [showAddModal, categories]);

  const PAGE_SIZE = 20;

  // Flatten all products
  const allProducts = useMemo(() => {
    return Object.entries(categories).flatMap(([catName, catData]) =>
      Object.entries(catData.subcategories).flatMap(([subName, products]) =>
        products.map((p) => ({
          ...p,
          _category: catName,
          _subcategory: subName,
        })),
      ),
    );
  }, [categories]);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchStock =
        stockFilter === "all"
          ? true
          : stockFilter === "in"
            ? p.stock >= 50
            : stockFilter === "medium"
              ? p.stock >= 20 && p.stock < 50
              : stockFilter === "low"
                ? p.stock >= 5 && p.stock < 20
                : p.stock < 5;
      const matchCat =
        categoryFilter === "all" || p._category === categoryFilter;
      return matchSearch && matchStock && matchCat;
    });
  }, [allProducts, search, stockFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Stats
  const totalStock = allProducts.reduce((a, p) => a + p.stock, 0);
  const inStock = allProducts.filter((p) => p.stock >= 50).length;
  const lowStock = allProducts.filter(
    (p) => p.stock >= 5 && p.stock < 50,
  ).length;
  const critical = allProducts.filter((p) => p.stock < 5).length;

  const updateProduct = (updated) => {
    onUpdateProduct({
      id: updated.id,
      name: updated.name,
      sku: updated.sku,
      stock: Number(updated.stock),
      price: Number(updated.price),
      specs: updated.specs,
      category: updated._category,
      subcategory: updated._subcategory
    });
    setEditingId(null);
    toast.success("Product updated successfully");
  };

  const deleteProduct = (product) => {
    onDeleteProduct({
      id: product.id,
      category: product._category,
      subcategory: product._subcategory,
      name: product.name
    });
    setConfirmDelete(null);
    toast.success("Product deleted");
  };

  const handleQuickAdjust = (product, actionType) => {
    const inputEl = document.getElementById(`quick-qty-${product.id}`);
    const qtyVal = inputEl ? inputEl.value : "";
    const qty = parseInt(qtyVal, 10);

    if (isNaN(qty) || qty <= 0) {
      toast.warning("Please enter a valid quantity greater than 0.");
      return;
    }

    let newStock = product.stock;
    if (actionType === "add") {
      newStock += qty;
    } else if (actionType === "dispatch") {
      if (product.stock < qty) {
        toast.error(
          `Cannot dispatch ${qty} units. Only ${product.stock} units in stock.`,
        );
        return;
      }
      newStock -= qty;
    }

    onUpdateProduct({
      id: product.id,
      name: product.name,
      sku: product.sku,
      stock: newStock,
      price: product.price,
      specs: product.specs,
      category: product._category,
      subcategory: product._subcategory
    });

    if (inputEl) {
      inputEl.value = "";
    }

    if (actionType === "add") {
      toast.success(
        `Added ${qty} units to ${product.name}. New Stock: ${newStock}`,
      );
    } else {
      toast.success(
        `Dispatched ${qty} units of ${product.name}. Remaining Stock: ${newStock}`,
      );
    }
  };

  const addProduct = () => {
    const prodName = addForm.name.trim();
    const prodSku = addForm.sku.trim();
    const catName = addForm.category.trim();
    const subName = addForm.subcategory.trim();

    if (!prodName || !prodSku || !catName || !subName) {
      toast.error("Fill in all required fields");
      return;
    }

    let catIcon = "📦";
    let catColor = "blue";
    if (categories[catName]) {
      catIcon = categories[catName].icon || "📦";
      catColor = categories[catName].color || "blue";
    } else {
      const colorsList = ["blue", "orange", "emerald", "purple", "amber", "slate"];
      const iconsList = ["📦", "🔨", "🔩", "⚙️", "🛠️", "🚪", "💡", "🔑", "🔐", "💎"];
      catColor = colorsList[Math.floor(Math.random() * colorsList.length)];
      catIcon = iconsList[Math.floor(Math.random() * iconsList.length)];
    }

    onAddProduct({
      name: prodName,
      sku: prodSku,
      stock: Number(addForm.stock) || 0,
      price: Number(addForm.price) || 0,
      specs: addForm.specs || "",
      category: catName,
      category_icon: catIcon,
      category_color: catColor,
      subcategory: subName
    });

    setShowAddModal(false);
    setAddForm({
      name: "",
      sku: "",
      stock: "",
      price: "",
      specs: "",
      category: "",
      subcategory: "",
    });
    toast.success("Product added successfully");
  };

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return "";
    return String(str).replace(/"/g, '""');
  };

  const exportCSV = () => {
    const header = "Name,SKU,Category,Subcategory,Stock,Price,Specs\n";
    const rows = allProducts
      .map(
        (p) =>
          `"${escapeCSV(p.name)}","${escapeCSV(p.sku)}","${escapeCSV(p._category)}","${escapeCSV(p._subcategory)}",${p.stock},${p.price},"${escapeCSV(p.specs)}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const filename = `${tenantInfo.businessName.toLowerCase().replace(/\s+/g, "-")}-inventory.csv`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Inventory exported as CSV");
  };

  const tabs = [
    { key: "inventory", label: "Inventory", icon: <Package size={16} /> },
    { key: "analytics", label: "Analytics", icon: <BarChart3 size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-xl">
        <div className="max-w-full px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
            <div>
              <div
                className="font-black text-lg leading-tight"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {tenantInfo.businessName}
              </div>
              <div className="text-blue-200 text-xs flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {tenantInfo.businessType} Portal
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500 px-5 py-2 rounded-xl font-bold text-sm transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="pt-16 max-w-full px-6 pb-16">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-8 mb-8">
          {[
            {
              label: "Total Products",
              value: allProducts.length,
              icon: <Package size={24} />,
              color: "blue",
              bg: "bg-blue-50",
              iconBg: "bg-blue-100 text-blue-600",
            },
            {
              label: "Total Stock Units",
              value: totalStock.toLocaleString(),
              icon: <TrendingUp size={24} />,
              color: "emerald",
              bg: "bg-emerald-50",
              iconBg: "bg-emerald-100 text-emerald-600",
            },
            {
              label: "In Stock (50+)",
              value: inStock,
              icon: <Check size={24} />,
              color: "green",
              bg: "bg-green-50",
              iconBg: "bg-green-100 text-green-600",
            },
            {
              label: "Low / Critical",
              value: lowStock + critical,
              icon: <AlertTriangle size={24} />,
              color: "red",
              bg: "bg-red-50",
              iconBg: "bg-red-100 text-red-600",
            },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-semibold mb-2">
                    {kpi.label}
                  </p>
                  <p
                    className={`text-3xl font-black ${kpi.color === "red" ? "text-red-600" : kpi.color === "emerald" ? "text-emerald-600" : kpi.color === "blue" ? "text-blue-600" : "text-green-600"}`}
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {kpi.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.iconBg}`}
                >
                  {kpi.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 border border-slate-200 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === t.key
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {activeTab === "inventory" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Table Controls */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h2
                className="text-xl font-black text-slate-900"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Product Inventory
              </h2>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Download size={16} /> Export CSV
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-bold hover:from-emerald-700 hover:to-emerald-800 transition shadow-md shadow-emerald-100"
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by name or SKU..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-400 text-sm transition"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-blue-400 text-sm font-medium text-slate-700 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {Object.keys(categories).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={stockFilter}
                onChange={(e) => {
                  setStockFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-blue-400 text-sm font-medium text-slate-700 cursor-pointer"
              >
                <option value="all">All Stock</option>
                <option value="in">In Stock (50+)</option>
                <option value="medium">Medium (20-49)</option>
                <option value="low">Low (5-19)</option>
                <option value="critical">Critical (&lt;5)</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Product
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">
                      SKU
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Category
                    </th>
                    <th className="px-5 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Stock
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Price
                    </th>
                    <th className="px-5 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((product) => {
                    const status = getStockStatus(product.stock);
                    const isEditing = editingId === product.id;
                    return (
                      <tr
                        key={product.id}
                        className="border-b border-slate-100 hover:bg-slate-50/60 transition"
                      >
                        <td className="px-5 py-3.5">
                          {isEditing ? (
                            <input
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1.5 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          ) : (
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">
                                {product.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                {product.specs}
                              </p>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                            {product.sku}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div>
                            <p className="text-xs font-semibold text-slate-700">
                              {product._category}
                            </p>
                            <p className="text-xs text-slate-400">
                              {product._subcategory}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm.stock}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  stock: e.target.value,
                                })
                              }
                              className="w-20 px-2 py-1.5 border border-blue-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${status.cls}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                              />
                              {product.stock}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm.price}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  price: e.target.value,
                                })
                              }
                              className="w-24 px-2 py-1.5 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          ) : (
                            <span className="font-bold text-slate-900 text-sm">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-1.5">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() =>
                                    updateProduct({
                                      ...editForm,
                                      _category: product._category,
                                      _subcategory: product._subcategory,
                                    })
                                  }
                                  className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition"
                                  title="Save"
                                >
                                  <Save size={15} />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                                  title="Cancel"
                                >
                                  <XCircle size={15} />
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center justify-center gap-3">
                                <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3">
                                  <button
                                    onClick={() => {
                                      setEditingId(product.id);
                                      setEditForm({ ...product });
                                    }}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                    title="Edit"
                                  >
                                    <Edit2 size={15} />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(product)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                    title="Delete"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1">
                                  <input
                                    id={`quick-qty-${product.id}`}
                                    type="number"
                                    placeholder="Qty"
                                    min="1"
                                    className="w-14 px-2 py-1 text-xs border border-slate-200 rounded-lg text-center text-slate-800 bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        handleQuickAdjust(product, "add");
                                    }}
                                  />
                                  <button
                                    onClick={() =>
                                      handleQuickAdjust(product, "add")
                                    }
                                    className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition font-bold text-xs flex items-center justify-center"
                                    title="Add Stock"
                                  >
                                    <Plus size={13} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleQuickAdjust(product, "dispatch")
                                    }
                                    className="p-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition font-bold text-xs flex items-center justify-center"
                                    title="Dispatch Stock"
                                  >
                                    <Minus size={13} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing <strong>{(page - 1) * PAGE_SIZE + 1}</strong>–
                <strong>{Math.min(page * PAGE_SIZE, filtered.length)}</strong>{" "}
                of <strong>{filtered.length}</strong> products
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-slate-50 transition"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pg = i + 1;
                  return (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold transition ${page === pg ? "bg-blue-600 text-white" : "hover:bg-slate-100 text-slate-700"}`}
                    >
                      {pg}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <span className="text-slate-400 text-sm">...</span>
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-slate-50 transition"
                >
                  Next →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Category breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2
                className="text-xl font-black text-slate-900 mb-7"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Category Breakdown
              </h2>
              <div className="space-y-5">
                {Object.entries(categories).map(([cat, data]) => {
                  const products = Object.values(data.subcategories).flat();
                  const totalSt = products.reduce((a, p) => a + p.stock, 0);
                  const totalAll = allProducts.reduce((a, p) => a + p.stock, 0);
                  const pct = totalAll
                    ? ((totalSt / totalAll) * 100).toFixed(1)
                    : 0;
                  return (
                    <div key={cat} className="flex items-center gap-4">
                      <span className="text-xl w-8">{data.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-bold text-slate-900">
                            {cat}
                          </span>
                          <span className="text-xs text-slate-500">
                            {products.length} products ·{" "}
                            {totalSt.toLocaleString()} units
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full bg-blue-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-700 w-12 text-right">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stock level distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2
                className="text-xl font-black text-slate-900 mb-7"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Stock Level Distribution
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    label: "In Stock",
                    count: inStock,
                    pct: ((inStock / allProducts.length) * 100).toFixed(1),
                    cls: "border-emerald-200 bg-emerald-50",
                    text: "text-emerald-600",
                    bar: "bg-emerald-500",
                  },
                  {
                    label: "Medium Stock",
                    count: lowStock,
                    pct: ((lowStock / allProducts.length) * 100).toFixed(1),
                    cls: "border-blue-200 bg-blue-50",
                    text: "text-blue-600",
                    bar: "bg-blue-500",
                  },
                  {
                    label: "Low Stock",
                    count: allProducts.filter(
                      (p) => p.stock >= 5 && p.stock < 20,
                    ).length,
                    pct: (
                      (allProducts.filter((p) => p.stock >= 5 && p.stock < 20)
                        .length /
                        allProducts.length) *
                      100
                    ).toFixed(1),
                    cls: "border-amber-200 bg-amber-50",
                    text: "text-amber-600",
                    bar: "bg-amber-500",
                  },
                  {
                    label: "Critical",
                    count: critical,
                    pct: ((critical / allProducts.length) * 100).toFixed(1),
                    cls: "border-red-200 bg-red-50",
                    text: "text-red-600",
                    bar: "bg-red-500",
                  },
                ].map((s, i) => (
                  <div key={i} className={`rounded-2xl border p-6 ${s.cls}`}>
                    <p className="text-xs font-bold text-slate-500 mb-2">
                      {s.label}
                    </p>
                    <p
                      className={`text-4xl font-black mb-1 ${s.text}`}
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      {s.count}
                    </p>
                    <p className="text-xs text-slate-500 mb-3">
                      products ({s.pct}%)
                    </p>
                    <div className="w-full bg-white/60 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${s.bar}`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setShowAddModal(false)
            }
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-7">
                <h2
                  className="text-2xl font-black text-slate-900"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Add New Product
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      Product Name *
                    </label>
                    <input
                      list="product-names-list"
                      value={addForm.name}
                      onChange={(e) =>
                        setAddForm({ ...addForm, name: e.target.value })
                      }
                      placeholder="Type or select product name"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                    <datalist id="product-names-list">
                      {Array.from(new Set(allProducts.map((p) => p.name))).map((name) => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      SKU *
                    </label>
                    <input
                      value={addForm.sku}
                      onChange={(e) =>
                        setAddForm({ ...addForm, sku: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-slate-600">
                        Category *
                      </label>
                      {Object.keys(categories).length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const mode = !useCustomCategory;
                            setUseCustomCategory(mode);
                            if (mode) {
                              setUseCustomSubcategory(true);
                            }
                            setAddForm((prev) => ({
                              ...prev,
                              category: "",
                              subcategory: "",
                            }));
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-bold transition cursor-pointer"
                        >
                          {useCustomCategory ? "Select Existing" : "Create Custom"}
                        </button>
                      )}
                    </div>
                    {useCustomCategory ? (
                      <input
                        value={addForm.category}
                        onChange={(e) =>
                          setAddForm({ ...addForm, category: e.target.value })
                        }
                        placeholder="Type custom category"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    ) : (
                      <select
                        value={addForm.category}
                        onChange={(e) => {
                          const cat = e.target.value;
                          const catHasSubs =
                            cat &&
                            categories[cat] &&
                            Object.keys(categories[cat].subcategories).length > 0;
                          setAddForm({
                            ...addForm,
                            category: cat,
                            subcategory: "",
                          });
                          setUseCustomSubcategory(!catHasSubs);
                        }}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 cursor-pointer"
                      >
                        <option value="">Select category</option>
                        {Object.keys(categories).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-slate-600">
                        Subcategory *
                      </label>
                      {!useCustomCategory &&
                        addForm.category &&
                        categories[addForm.category] &&
                        Object.keys(categories[addForm.category].subcategories)
                          .length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setUseCustomSubcategory(!useCustomSubcategory);
                              setAddForm((prev) => ({
                                ...prev,
                                subcategory: "",
                              }));
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 font-bold transition cursor-pointer"
                          >
                            {useCustomSubcategory ? "Select Existing" : "Create Custom"}
                          </button>
                        )}
                    </div>
                    {useCustomSubcategory || useCustomCategory ? (
                      <input
                        value={addForm.subcategory}
                        onChange={(e) =>
                          setAddForm({
                            ...addForm,
                            subcategory: e.target.value,
                          })
                        }
                        placeholder="Type custom subcategory"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        disabled={!addForm.category}
                      />
                    ) : (
                      <select
                        value={addForm.subcategory}
                        onChange={(e) =>
                          setAddForm({
                            ...addForm,
                            subcategory: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 cursor-pointer"
                        disabled={!addForm.category}
                      >
                        <option value="">Select subcategory</option>
                        {addForm.category &&
                          categories[addForm.category] &&
                          Object.keys(
                            categories[addForm.category].subcategories,
                          ).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={addForm.stock}
                      onChange={(e) =>
                        setAddForm({ ...addForm, stock: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={addForm.price}
                      onChange={(e) =>
                        setAddForm({ ...addForm, price: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Specs
                  </label>
                  <input
                    value={addForm.specs}
                    onChange={(e) =>
                      setAddForm({ ...addForm, specs: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addProduct}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition shadow-md"
                >
                  Add Product
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Trash2 size={28} className="text-red-600" />
              </div>
              <h3
                className="text-xl font-black text-slate-900 mb-2"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Delete Product?
              </h3>
              <p className="text-slate-600 text-sm mb-7">
                Are you sure you want to delete{" "}
                <strong>{confirmDelete.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteProduct(confirmDelete)}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [activeTenant, setActiveTenant] = useState(null); // tenant object or null
  const [categories, setCategories] = useState(null); // categories object or null
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          if (data.status === "ok" && data.database === "connected") {
            setDbConnected(true);
            return;
          }
        }
        setDbConnected(false);
      } catch (err) {
        setDbConnected(false);
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLogin = (username, tenantData) => {
    setActiveTenant({
      username,
      businessName: tenantData.businessName,
      businessType: tenantData.businessType,
    });
    setCategories(tenantData.categories);
    setCurrentPage("admin-dashboard");
    toast.success(`Welcome back, ${tenantData.businessName}!`);
  };

  const syncToLocalStorage = (updatedCats) => {
    if (activeTenant) {
      const storageKey = "sk_multi_tenant_data";
      const rawData = localStorage.getItem(storageKey);
      const db = rawData ? JSON.parse(rawData) : { tenants: {} };
      if (db.tenants[activeTenant.username]) {
        db.tenants[activeTenant.username].categories = updatedCats;
        localStorage.setItem(storageKey, JSON.stringify(db));
      }
    }
  };

  const handleAddProduct = async (productData) => {
    let newId = "local-" + Date.now();

    if (dbConnected) {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantUsername: activeTenant.username,
            name: productData.name,
            sku: productData.sku,
            stock: Number(productData.stock) || 0,
            price: Number(productData.price) || 0,
            specs: productData.specs || "",
            category: productData.category,
            categoryIcon: productData.category_icon || "📦",
            categoryColor: productData.category_color || "blue",
            subcategory: productData.subcategory
          })
        });
        if (res.ok) {
          const savedProduct = await res.json();
          newId = savedProduct.id;
        } else {
          toast.error("Failed to add product to database.");
        }
      } catch (err) {
        console.error("Error adding product to MongoDB:", err);
      }
    }

    const updatedCats = JSON.parse(JSON.stringify(categories));
    const catName = productData.category;
    const subName = productData.subcategory;

    if (!updatedCats[catName]) {
      updatedCats[catName] = {
        icon: productData.category_icon || "📦",
        color: productData.category_color || "blue",
        subcategories: {},
      };
    }
    if (!updatedCats[catName].subcategories[subName]) {
      updatedCats[catName].subcategories[subName] = [];
    }

    updatedCats[catName].subcategories[subName].push({
      id: newId,
      name: productData.name,
      sku: productData.sku,
      stock: Number(productData.stock) || 0,
      price: Number(productData.price) || 0,
      specs: productData.specs || "",
    });

    setCategories(updatedCats);
    syncToLocalStorage(updatedCats);
  };

  const handleUpdateProduct = async (productData) => {
    if (dbConnected) {
      try {
        const res = await fetch(`/api/products/${productData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: productData.name,
            sku: productData.sku,
            stock: Number(productData.stock) || 0,
            price: Number(productData.price) || 0,
            specs: productData.specs || ""
          })
        });
        if (!res.ok) {
          toast.error("Failed to update product on database.");
        }
      } catch (err) {
        console.error("Error updating product in MongoDB:", err);
      }
    }

    const updatedCats = JSON.parse(JSON.stringify(categories));
    const catName = productData.category;
    const subName = productData.subcategory;

    if (updatedCats[catName] && updatedCats[catName].subcategories[subName]) {
      updatedCats[catName].subcategories[subName] = updatedCats[catName].subcategories[subName].map(p =>
        p.id === productData.id
          ? {
              id: productData.id,
              name: productData.name,
              sku: productData.sku,
              stock: Number(productData.stock) || 0,
              price: Number(productData.price) || 0,
              specs: productData.specs || "",
            }
          : p
      );
      setCategories(updatedCats);
      syncToLocalStorage(updatedCats);
    }
  };

  const handleDeleteProduct = async (productData) => {
    if (dbConnected) {
      try {
        const res = await fetch(`/api/products/${productData.id}`, {
          method: 'DELETE'
        });
        if (!res.ok) {
          toast.error("Failed to delete product on database.");
        }
      } catch (err) {
        console.error("Error deleting product from MongoDB:", err);
      }
    }

    const updatedCats = JSON.parse(JSON.stringify(categories));
    const catName = productData.category;
    const subName = productData.subcategory;

    if (updatedCats[catName] && updatedCats[catName].subcategories[subName]) {
      updatedCats[catName].subcategories[subName] = updatedCats[catName].subcategories[subName].filter(
        p => p.id !== productData.id
      );

      if (updatedCats[catName].subcategories[subName].length === 0) {
        delete updatedCats[catName].subcategories[subName];
      }
      if (Object.keys(updatedCats[catName].subcategories).length === 0) {
        delete updatedCats[catName];
      }

      setCategories(updatedCats);
      syncToLocalStorage(updatedCats);
    }
  };

  const handleLogout = () => {
    setActiveTenant(null);
    setCategories(null);
    setCurrentPage("home");
    toast.success("Logged out successfully");
  };

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <AnimatePresence mode="wait">
        {activeTenant === null ? (
          currentPage === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomePage onNavigate={navigate} />
            </motion.div>
          ) : currentPage === "gateway-login" ? (
            <motion.div
              key="gateway-login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GatewayLoginPage onLogin={handleLogin} onNavigate={navigate} dbConnected={dbConnected} />
            </motion.div>
          ) : null
        ) : currentPage === "admin-dashboard" && categories ? (
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <AdminDashboard
              key={activeTenant.username}
              tenantInfo={activeTenant}
              categories={categories}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onLogout={handleLogout}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
