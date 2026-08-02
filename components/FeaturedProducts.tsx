"use client";

import { useState, useEffect } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const featuredProducts = [
  {
    id: 1,
    sku: "BMW-335i-2011-F-PAD-CER-01",
    title: "Ceramic Brake Pads - Front",
    brand: "BMW",
    model: "335i",
    years: "2011-2016",
    category: "Brake Pads",
    axle: "Front",
    material: "Ceramic",
    price: 89.99,
    msrp: 129.99,
    rating: 4.8,
    reviews: 124,
    stock: 15,
    query: "BMW 335i Front Ceramic Brake Pads OEM", // eBay search query
    fallbackImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    features: ["Low dust", "Quiet operation", "Extended life"]
  },
  {
    id: 2,
    sku: "AUDI-A4-2018-ENG-FIL-01",
    title: "High-Flow Air Filter",
    brand: "Audi",
    model: "A4",
    years: "2017-2023",
    category: "Filters",
    axle: "Engine",
    style: "Performance",
    price: 49.99,
    msrp: 65.00,
    rating: 4.9,
    reviews: 89,
    stock: 32,
    query: "Audi A4 Engine Air Filter OEM", // eBay search query
    fallbackImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop",
    features: ["Increased airflow", "Washable", "Long lasting"]
  },
  {
    id: 3,
    sku: "TOYOTA-CAMRY-2020-IGN-SPK-01",
    title: "Platinum Spark Plugs (Set of 4)",
    brand: "Toyota",
    model: "Camry",
    years: "2018-2024",
    category: "Ignition",
    axle: "Engine",
    material: "Platinum",
    price: 54.99,
    msrp: 79.99,
    rating: 4.6,
    reviews: 203,
    stock: 25,
    query: "Toyota Camry Platinum Spark Plugs Set of 4 OEM", // eBay search query
    fallbackImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    features: ["Better fuel economy", "Quick starts", "Durability"]
  },
  {
    id: 4,
    sku: "MERCEDES-C300-2019-ELE-ALT-01",
    title: "Premium Alternator",
    brand: "Mercedes-Benz",
    model: "C300",
    years: "2015-2021",
    category: "Electrical",
    axle: "Electrical",
    style: "OEM Spec",
    price: 199.99,
    msrp: 299.99,
    rating: 4.7,
    reviews: 67,
    stock: 12,
    query: "Mercedes C300 Alternator OEM", // eBay search query
    fallbackImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop",
    features: ["High output", "Tested reliability", "Premium quality"]
  }
];

const FeaturedProducts = () => {
  const [images, setImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    featuredProducts.forEach(async (product) => {
      setLoading((prev) => ({ ...prev, [product.id]: true }));
      try {
        const res = await fetch(`/api/ebay-search?q=${encodeURIComponent(product.query)}`);
        const data = await res.json();
        
        if (data.imageUrl) {
          setImages((prev) => ({ ...prev, [product.id]: data.imageUrl }));
        }
      } catch (error) {
        console.error("Failed to fetch image for", product.title);
      } finally {
        setLoading((prev) => ({ ...prev, [product.id]: false }));
      }
    });
  }, []);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Featured Auto Parts
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium quality auto parts and accessories for your European and Japanese vehicles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg h-48 bg-white flex items-center justify-center">
                  
                  {/* eBay API Loading Logic */}
                  {loading[product.id] ? (
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <img 
                      src={images[product.id] || product.fallbackImage} 
                      alt={product.title}
                      // Note: Changed from object-cover to object-contain so real parts don't get cropped
                      className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${images[product.id] ? 'object-contain p-4' : 'object-cover'}`}
                    />
                  )}

                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-primary text-primary-foreground shadow-sm">
                      {product.brand}
                    </Badge>
                  </div>
                  {product.msrp > product.price && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="destructive" className="shadow-sm">
                        Save {Math.round(((product.msrp - product.price) / product.msrp) * 100)}%
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold text-lg leading-tight mb-1 truncate">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {product.brand} {product.model} ({product.years})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.axle} • {product.material || product.style}
                  </p>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {renderStars(product.rating)}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({product.reviews})
                  </span>
                </div>

                <div className="mb-3 flex flex-wrap gap-1">
                  {product.features.map((feature, index) => (
                    <span key={index} className="text-xs text-muted-foreground">
                      {feature}{index < product.features.length - 1 ? " • " : ""}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.msrp > product.price && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        {formatPrice(product.msrp)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {product.stock} in stock
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="px-3">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button size="lg" variant="outline">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;