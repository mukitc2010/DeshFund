import Link from "next/link";
import { Card } from "@/components/ui/Card";
import {
  Laptop, Heart, Sprout, GraduationCap, Stethoscope, ShoppingCart,
  UtensilsCrossed, Palette, Factory, Leaf, Landmark, Shirt,
} from "lucide-react";

const categories = [
  { name: "Technology", icon: Laptop, count: 84, description: "Software, AI, IoT, and digital innovation" },
  { name: "Social Impact", icon: Heart, count: 62, description: "Community development and social enterprises" },
  { name: "Agriculture", icon: Sprout, count: 45, description: "Farming, agritech, and food production" },
  { name: "Education", icon: GraduationCap, count: 53, description: "EdTech, training, and skill development" },
  { name: "Healthcare", icon: Stethoscope, count: 38, description: "HealthTech, telemedicine, and wellness" },
  { name: "E-commerce", icon: ShoppingCart, count: 41, description: "Online retail and marketplace platforms" },
  { name: "Food & Beverage", icon: UtensilsCrossed, count: 29, description: "Restaurants, food brands, and beverages" },
  { name: "Creative", icon: Palette, count: 35, description: "Arts, media, design, and entertainment" },
  { name: "Manufacturing", icon: Factory, count: 22, description: "Production, export, and industrial innovation" },
  { name: "Green Energy", icon: Leaf, count: 27, description: "Solar, biogas, and sustainable energy" },
  { name: "Fintech", icon: Landmark, count: 31, description: "Payments, lending, and financial services" },
  { name: "Fashion & Lifestyle", icon: Shirt, count: 19, description: "Clothing, beauty, and lifestyle brands" },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary-900 tracking-tight mb-4">
          Explore Categories
        </h1>
        <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
          Find campaigns in the industries that matter to you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const slug = cat.name.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-");
          return (
            <Link key={cat.name} href={`/categories/${slug}`}>
              <Card hover className="h-full p-6 flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-100 transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-secondary-500 mt-1">{cat.description}</p>
                  <p className="text-sm font-medium text-primary-600 mt-2">{cat.count} campaigns</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
