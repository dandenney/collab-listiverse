
import { Link } from "react-router-dom";
import { ShoppingCart, BookOpen, Film, MapPin, ShoppingBag, UtensilsCrossed, Store } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  {
    path: "/grocery",
    title: "Grocery List",
    icon: ShoppingCart,
    description: "Manage your grocery shopping items"
  }, 
  {
    path: "/costco",
    title: "Costco List",
    icon: Store,
    description: "Track your Costco shopping items"
  },
  {
    path: "/shopping",
    title: "Shopping List",
    icon: ShoppingBag,
    description: "Keep track of items you want to buy"
  }, 
  {
    path: "/watch",
    title: "Watch List",
    icon: Film,
    description: "Save videos and movies to watch later"
  }, 
  {
    path: "/read",
    title: "Reading List",
    icon: BookOpen,
    description: "Bookmark articles and books"
  }, 
  {
    path: "/local",
    title: "Local List",
    icon: MapPin,
    description: "Track local places and activities"
  }, 
  {
    path: "/recipes",
    title: "Recipe List",
    icon: UtensilsCrossed,
    description: "Save your favorite recipes"
  }
];

export function LandingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => (
          <motion.div 
            key={section.path} 
            initial={{
              opacity: 0,
              y: 20
            }} 
            animate={{
              opacity: 1,
              y: 0
            }} 
            transition={{
              delay: index * 0.1
            }}
          >
            <Link 
              to={section.path} 
              className="block p-4 md:p-6 rounded-lg border border-border hover:border-primary transition-colors bg-card hover:bg-card/80"
            >
              <div className="flex flex-col items-center text-center gap-2">
                <section.icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                <h2 className="text-sm md:text-lg font-semibold">{section.title}</h2>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
