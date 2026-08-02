"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import CustomerForm from "@/components/CustomerForm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Smart Fallback: Agar Wikipedia par car na mile, toh brand ke hisaab se ek HD car photo
const getCarFallbackImage = (make: string | null) => {
  if (!make) return "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80"; // Generic Car
  
  const m = make.toLowerCase();
  if (m.includes("bmw")) return "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&q=80";
  if (m.includes("audi")) return "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&q=80";
  if (m.includes("mercedes") || m.includes("benz")) return "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80";
  if (m.includes("ford")) return "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80";
  if (m.includes("toyota")) return "https://images.unsplash.com/photo-1629897048514-3dd74142fb79?w=800&q=80";
  if (m.includes("honda")) return "https://images.unsplash.com/photo-1605816988069-b11383b50717?w=800&q=80";
  if (m.includes("chevrolet") || m.includes("chevy")) return "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80";
  if (m.includes("porsche")) return "https://images.unsplash.com/photo-1503376710356-6f8afcd0e29b?w=800&q=80";
  
  return "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80"; 
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const year = searchParams.get("year") || "";
  const make = searchParams.get("make") || "";
  const model = searchParams.get("model") || "";
  const part = searchParams.get("part");

  const fullVehicleName = `${year} ${make} ${model}`.trim();
  const requestedPartName = part ? part : `Parts for ${fullVehicleName}`;
  const ebaySearchQuery = `${make} ${model} ${part || "parts"}`.trim();

  const [carImageUrl, setCarImageUrl] = useState<string | null>(null);
  const [isCarLoading, setIsCarLoading] = useState(false);

  // 🔥 WIKIPEDIA API HACK: GET REAL CAR PHOTOS 100% FREE 🔥
  useEffect(() => {
    if (!make || !model) return;

    const fetchWikipediaCarImage = async () => {
      setIsCarLoading(true);
      try {
        const query = `${make} ${model}`;
        const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=intitle:"${query}"&prop=pageimages&format=json&pithumbsize=800&origin=*`;
        
        const res = await fetch(url);
        const data = await res.json();

        // Check if Wikipedia found the car page and has a photo
        if (data.query && data.query.pages) {
          const pages = Object.values(data.query.pages) as any[];
          const pageWithImage = pages.find(p => p.thumbnail && p.thumbnail.source);
          
          if (pageWithImage) {
            setCarImageUrl(pageWithImage.thumbnail.source);
            return;
          }
        }
      } catch (error) {
        console.error("Wikipedia API error:", error);
      } finally {
        setIsCarLoading(false);
      }
    };

    fetchWikipediaCarImage();
  }, [make, model]);

  const displayCarImage = carImageUrl || getCarFallbackImage(make);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
      <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Request Part Availability
          </h1>
          <p className="text-muted-foreground text-lg">
            Review your selected vehicle details and fill out the form below to get a quote.
          </p>
        </div>
        
        {/* Vehicle Details Card */}
        <Card className="overflow-hidden shadow-lg border-primary/20">
          <div className="flex flex-col md:flex-row">
            
            {/* Dynamic Car Image Section */}
            <div className="md:w-2/5 h-64 md:h-auto relative bg-muted flex items-center justify-center overflow-hidden">
              {isCarLoading ? (
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <img 
                  src={displayCarImage} 
                  alt={fullVehicleName} 
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
              )}
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1 shadow-md">
                  {make ? `${make} Verified` : "OEM Fitment"}
                </Badge>
              </div>
            </div>
            
            {/* Details Section */}
            <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center bg-card">
              <div className="mb-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                Selected Vehicle
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {fullVehicleName}
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

      {/* Form Section (Works perfectly as before) */}
      <CustomerForm 
        partName={requestedPartName} 
        searchQuery={ebaySearchQuery} 
      />
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