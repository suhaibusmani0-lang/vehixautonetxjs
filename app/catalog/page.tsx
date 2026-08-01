"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CustomerForm from "@/components/CustomerForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Ye function part ke naam ke hisaab se image decide karega
const getPartImage = (partName: string | null) => {
  if (!partName) return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"; // Default Generic Parts

  const name = partName.toLowerCase();
  
  if (name.includes("brake") || name.includes("rotor") || name.includes("caliper") || name.includes("pad")) {
    return "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80"; // Brakes
  }
  if (name.includes("engine") || name.includes("filter") || name.includes("spark") || name.includes("pump")) {
    return "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80"; // Engine/Mechanic
  }
  if (name.includes("light") || name.includes("lamp") || name.includes("lens")) {
    return "https://images.unsplash.com/photo-1593368858364-77a835a805c8?w=800&q=80"; // Lights
  }
  if (name.includes("wheel") || name.includes("tire") || name.includes("rim")) {
    return "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80"; // Wheels
  }
  if (name.includes("glass") || name.includes("window") || name.includes("windshield")) {
    return "https://images.unsplash.com/photo-1512354734612-4ebdf768fba4?w=800&q=80"; // Glass/Windows
  }
  if (name.includes("a/c") || name.includes("condenser") || name.includes("compressor")) {
    return "https://images.unsplash.com/photo-1635399566978-75c13dc0972b?w=800&q=80"; // AC/Cooling
  }

  // Agar upar me se koi match nahi hua toh ye default image aayegi
  return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"; 
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const year = searchParams.get("year");
  const make = searchParams.get("make");
  const model = searchParams.get("model");
  const part = searchParams.get("part");

  const imageUrl = getPartImage(part);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
      <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Request Part Availability
          </h1>
          <p className="text-muted-foreground text-lg">
            Review your selected part details and fill out the form below to get a quote.
          </p>
        </div>
        
        {/* Product Details Card with Image */}
        <Card className="overflow-hidden shadow-lg border-primary/20">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-2/5 h-64 md:h-auto relative bg-muted">
              <img 
                src={imageUrl} 
                alt={part || "Auto Part"} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                  OEM Fitment
                </Badge>
              </div>
            </div>
            
            {/* Details Section */}
            <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center bg-card">
              <div className="mb-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                Selected Vehicle
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {year} {make} {model}
              </h2>
              
              {part ? (
                <div className="bg-muted/50 rounded-lg p-4 mt-2 border border-border">
                  <div className="text-sm text-muted-foreground mb-1">Requested Part:</div>
                  <div className="text-xl font-semibold text-primary">{part}</div>
                </div>
              ) : (
                <div className="bg-yellow-500/10 rounded-lg p-4 mt-2 border border-yellow-500/20">
                  <div className="text-yellow-600 dark:text-yellow-400 font-medium">
                    No specific part selected. Please mention what you need in the form notes.
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Form Section */}
      <CustomerForm />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl font-semibold">Loading Catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}