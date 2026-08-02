"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, CheckCircle2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CustomerFormProps {
  partName?: string;
  searchQuery?: string;
  fallbackImage?: string;
}

const CustomerForm = ({ 
  partName = "Premium Auto Part", 
  searchQuery = "BMW 335i Brake Pads",
  fallbackImage
}: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    billingAddress: "",
    shippingAddress: "",
    message: ""
  });
  
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery) return;

    const fetchImage = async () => {
      setIsImageLoading(true);
      try {
        const res = await fetch(`/api/ebay-search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        
        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        }
      } catch (error) {
        console.error("Failed to fetch image for form:", error);
      } finally {
        setIsImageLoading(false);
      }
    };

    fetchImage();
  }, [searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSameAsBilling(isChecked);
    if (isChecked) {
      setFormData({ ...formData, shippingAddress: formData.billingAddress });
    } else {
      setFormData({ ...formData, shippingAddress: "" });
    }
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBilling = e.target.value;
    setFormData({ 
      ...formData, 
      billingAddress: newBilling,
      ...(sameAsBilling ? { shippingAddress: newBilling } : {}) 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, partRequested: partName }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        alert("Failed to send details. Please try again.");
      }
    } catch (error) {
      console.error("API error:", error);
      alert("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayImage = imageUrl || fallbackImage;

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center">
        <Card className="border-green-500 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="pt-6 flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Request Sent Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you, {formData.name}. Our team has received your request for the <strong>{partName}</strong> and will contact you shortly.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="shadow-lg max-w-2xl mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold">Complete Your Request</CardTitle>
        <CardDescription className="text-lg mt-2">
          Enter your details and shipping address to get an exact quote.
        </CardDescription>
      </CardHeader>
      <CardContent>
        
        {/* 🔥 Updated Image Block: Much larger and more professional 🔥 */}
        <div className="mb-8 flex flex-col md:flex-row items-center gap-6 p-6 bg-muted/40 rounded-xl border border-border/60">
          <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-border shadow-sm shrink-0 relative">
            {isImageLoading ? (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : displayImage ? (
              <img 
                src={displayImage} 
                alt={partName} 
                className={`w-full h-full p-2 transition-opacity duration-300 ${imageUrl ? 'object-contain' : 'object-cover p-0'}`} 
              />
            ) : (
              <Package className="h-12 w-12 text-muted-foreground/40" />
            )}
          </div>
          <div className="text-center md:text-left">
            <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">Exact Fitment Verified</Badge>
            <h4 className="font-bold text-foreground text-xl md:text-2xl leading-tight">{partName}</h4>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Our specialists will verify availability from live inventory and send you the best pricing.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-2">
          {/* Basic Details */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <hr className="border-border/50 my-4" />

          {/* Addresses Section */}
          <div>
            <label className="block text-sm font-medium mb-1">Billing Address *</label>
            <textarea 
              name="billingAddress"
              required
              value={formData.billingAddress}
              onChange={handleBillingChange}
              rows={3}
              className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="123 Main St, City, State, ZIP"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="sameAsBilling" 
              checked={sameAsBilling}
              onChange={handleCheckboxChange}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="sameAsBilling" className="text-sm text-muted-foreground cursor-pointer">
              Shipping address is the same as billing
            </label>
          </div>

          {!sameAsBilling && (
            <div>
              <label className="block text-sm font-medium mb-1">Shipping Address *</label>
              <textarea 
                name="shippingAddress"
                required
                value={formData.shippingAddress}
                onChange={handleChange}
                rows={3}
                className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="456 Delivery Ave, City, State, ZIP"
              />
            </div>
          )}

          <hr className="border-border/50 my-4" />

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Additional Notes (Optional)</label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Any specific part numbers, VIN details, or questions..."
            />
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6 text-base h-12" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Request..." : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;