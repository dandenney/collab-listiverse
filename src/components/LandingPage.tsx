
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  BookOpen,
  Film,
  MapPin,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  { path: "/grocery", title: "Grocery List", icon: ShoppingCart, description: "Manage your grocery shopping items" },
  { path: "/shopping", title: "Shopping List", icon: ShoppingBag, description: "Keep track of items you want to buy" },
  { path: "/watch", title: "Watch List", icon: Film, description: "Save videos and movies to watch later" },
  { path: "/read", title: "Reading List", icon: BookOpen, description: "Bookmark articles and books" },
  { path: "/local", title: "Local List", icon: MapPin, description: "Track local places and activities" },
  { path: "/recipes", title: "Recipe List", icon: UtensilsCrossed, description: "Save your favorite recipes" },
];

export function LandingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to Your Lists</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => (
          <motion.div
            key={section.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={section.path}
              className="block p-6 rounded-lg border border-border hover:border-primary transition-colors bg-card hover:bg-card/80"
            >
              <div className="flex items-center gap-3 mb-3">
                <section.icon className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              <p className="text-muted-foreground">{section.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
