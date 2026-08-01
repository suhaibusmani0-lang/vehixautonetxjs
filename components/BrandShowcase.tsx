"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BrandShowcase = () => {
  const brands = [
    {
      name: "Audi",
      logo: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&h=120&fit=crop",
      description: "Premium auto parts for Audi vehicles",
      models: ["A3", "A4", "A6", "Q5", "Q7", "TT"],
      productCount: 450,
      slug: "audi"
    },
    {
      name: "BMW",
      logo: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=120&fit=crop",
      description: "Performance auto parts for BMW models",
      models: ["3 Series", "5 Series", "X3", "X5", "Z4"],
      productCount: 520,
      slug: "bmw"
    },
    {
      name: "Mercedes-Benz",
      logo: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200&h=120&fit=crop",
      description: "Luxury auto parts for Mercedes vehicles",
      models: ["C-Class", "E-Class", "GLC", "GLE", "S-Class"],
      productCount: 380,
      slug: "mercedes"
    },
    {
      name: "Toyota",
      logo: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200&h=120&fit=crop",
      description: "Reliable auto parts for Toyota cars",
      models: ["Camry", "Corolla", "RAV4", "Highlander", "Prius"],
      productCount: 650,
      slug: "toyota"
    },
    {
      name: "Lexus",
      logo: "https://images.unsplash.com/photo-1564136707835-95d8c264e7b7?w=200&h=120&fit=crop",
      description: "Premium auto parts for Lexus luxury vehicles",
      models: ["ES", "RX", "NX", "GX", "LS"],
      productCount: 320,
      slug: "lexus"
    },
    {
      name: "Acura",
      logo: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=200&h=120&fit=crop",
      description: "Performance auto parts for Acura models",
      models: ["TLX", "MDX", "RDX", "ILX", "NSX"],
      productCount: 280,
      slug: "acura"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Shop by Brand
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We specialize in auto parts for premium European and Japanese automotive brands
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Card key={brand.slug} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={brand.logo} 
                      alt={`${brand.name} logo`}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{brand.name}</h3>
                  <p className="text-muted-foreground mb-4">{brand.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Popular Models:</h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {brand.models.slice(0, 4).map((model) => (
                        <span 
                          key={model} 
                          className="px-2 py-1 bg-muted text-xs rounded"
                        >
                          {model}
                        </span>
                      ))}
                      {brand.models.length > 4 && (
                        <span className="px-2 py-1 bg-muted text-xs rounded">
                          +{brand.models.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm text-muted-foreground">
                      {brand.productCount}+ auto parts available
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => window.location.href = `/brands/${brand.slug}`}
                  >
                    Shop {brand.name} Parts
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-muted rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">
              Can't Find Your Vehicle?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We specialize in auto parts for Audi, BMW, Mercedes-Benz, Toyota, Lexus, and Acura vehicles. 
              If you need help finding the right parts for your specific vehicle, our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Contact Support
              </Button>
              <Button size="lg" variant="outline">
                Browse All Parts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;