"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Truck, CreditCard, Award } from "lucide-react";
import { years, makes, getModels } from "@/data/vehicles";
import { allParts } from "@/data/parts";

const Hero = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPart, setSelectedPart] = useState("");

  const usps = [
    {
      icon: Shield,
      title: "Fitment Guarantee",
      description: "100% guaranteed to fit your vehicle or money back"
    },
    {
      icon: Truck,
      title: "Fast US Shipping",
      description: "Free shipping on orders over $99. Same-day processing"
    },
    {
      icon: CreditCard,
      title: "Secure Checkout",
      description: "SSL encrypted payments with Stripe & PayPal"
    },
    {
      icon: Award,
      title: "Genuine Quality",
      description: "OEM-grade Auto parts with 12-month warranty"
    }
  ];

  const handleSearch = () => {
    if (selectedYear && selectedMake && selectedModel) {
      const params = new URLSearchParams({
        year: selectedYear,
        make: selectedMake,
        model: selectedModel,
      });
      if (selectedPart) params.set("part", selectedPart);
      window.location.href = `/catalog?${params.toString()}`;
    }
  };

  return (
    <section className="relative">
      {/* Hero background */}
      <div className="bg-gradient-hero text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Premium Auto Parts for
              <span className="text-green-500 block mt-2">
                European, Japanese & American Vehicles
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8">
              Parts for Audi, BMW, Mercedes-Benz, Toyota, Lexus, and Acura
            </p>

            {/* Vehicle selector */}
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                  Find Parts for Your Vehicle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedMake}
                    onValueChange={(value) => {
                      setSelectedMake(value);
                      setSelectedModel("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Make" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {makes.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={selectedModel} 
                    onValueChange={setSelectedModel}
                    disabled={!selectedMake}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Model" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {getModels(selectedMake).map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedPart} onValueChange={setSelectedPart}>
                    <SelectTrigger>
                      <SelectValue placeholder="Part" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {[...new Set(allParts)].map((part) => (
                        <SelectItem key={part} value={part}>
                          {part}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary-hover"
                    onClick={handleSearch}
                    disabled={!selectedYear || !selectedMake || !selectedModel}
                  >
                    Find Parts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* USPs */}
      <div className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {usps.map((usp, index) => {
              const Icon = usp.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{usp.title}</h3>
                  <p className="text-muted-foreground">{usp.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;