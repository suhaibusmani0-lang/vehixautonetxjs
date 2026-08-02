"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, CheckCircle2, Package, X, ZoomIn, ChevronLeft, ChevronRight, Tag, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CustomerFormProps {
  partName?: string;
  searchQuery?: string;
  fallbackImage?: string;
}

interface PartDetails {
  brand?: string;
  mpn?: string;
  title?: string;
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
  
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  const [partDetails, setPartDetails] = useState<PartDetails | null>(null);

  useEffect(() => {
    if (!searchQuery) return;

    const fetchImage = async () => {
      setIsImageLoading(true);
      try {
        const res = await fetch(`/api/ebay-search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        
        if (data.images && data.images.length > 0) {
          setImages(data.images);
        } else if (data.imageUrl) {
          setImages([data.imageUrl]);
        }

        if (data) {
          setPartDetails({
            brand: data.brand,
            mpn: data.mpn,
            title: data.title
          });
        }
      } catch (error) {
        console.error("Failed to fetch image for form:", error);
      } finally {
        setIsImageLoading(false);
      }
    };

    fetchImage();
  }, [searchQuery]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          partRequested: partName,
          partNumber: partDetails?.mpn || 'N/A' 
        }),
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

  const currentImage = images.length > 0 ? images[selectedImageIndex] : fallbackImage;

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center">
        <Card className="border-green-500 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="pt-6 flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Request Sent Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you, {formData.name}. Our team has received your request for the <strong>{partName}</strong> {partDetails?.mpn && `(Part #: ${partDetails.mpn})`} and will contact you shortly.
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
    <>
      {/* Slider Modal */}
      {isModalOpen && currentImage && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-sm transition-all" onClick={() => setIsModalOpen(false)}>
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50 pointer-events-none">
            {images.length > 1 ? (
              <div className="bg-black/50 text-white/90 px-4 py-2 rounded-full font-medium text-sm border border-white/10 pointer-events-auto backdrop-blur-md">
                {selectedImageIndex + 1} / {images.length}
              </div>
            ) : <div />}
            <button 
              className="text-white/70 hover:text-white transition-colors p-2 bg-black/50 hover:bg-black/80 rounded-full border border-white/10 pointer-events-auto backdrop-blur-md"
              onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>

          <div className="relative flex items-center justify-center w-full max-w-6xl flex-1 my-4">
            {images.length > 1 && (
              <button 
                className="absolute left-0 md:left-4 text-white/70 hover:text-white p-2 md:p-3 bg-black/50 hover:bg-black/80 rounded-full transition-all z-50 border border-white/10 hover:scale-110"
                onClick={prevImage}
              >
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
              </button>
            )}

            <img 
              src={currentImage} 
              alt="Full view" 
              className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-md shadow-2xl transition-transform duration-300 select-none bg-white p-2"
              onClick={(e) => e.stopPropagation()} 
            />

            {images.length > 1 && (
              <button 
                className="absolute right-0 md:right-4 text-white/70 hover:text-white p-2 md:p-3 bg-black/50 hover:bg-black/80 rounded-full transition-all z-50 border border-white/10 hover:scale-110"
                onClick={nextImage}
              >
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
              </button>
            )}
          </div>

          {images.length > 1 && (
            <div 
              className="mt-auto mb-4 flex gap-3 overflow-x-auto py-2 px-4 max-w-full scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((imgUrl, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md bg-white overflow-hidden cursor-pointer transition-all duration-300 ${selectedImageIndex === idx ? 'border-4 border-primary scale-110 shadow-lg' : 'border-2 border-transparent opacity-50 hover:opacity-100 hover:scale-105'}`}
                >
                  <img src={imgUrl} alt={`Thumb ${idx+1}`} className="w-full h-full object-contain p-1" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main UI */}
      <Card className="shadow-lg max-w-2xl mx-auto relative z-10">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold">Complete Your Request</CardTitle>
          <CardDescription className="text-lg mt-2">
            Enter your details and shipping address to get an exact quote.
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          <div className="mb-8 flex flex-col items-center gap-6 p-6 bg-muted/40 rounded-xl border border-border/60">
            
            <div className="flex flex-col md:flex-row items-center gap-6 w-full">
              <div 
                className="w-48 h-48 md:w-56 md:h-56 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-border shadow-sm shrink-0 relative group cursor-pointer"
                onClick={() => { if(currentImage) setIsModalOpen(true); }}
              >
                {isImageLoading ? (
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : currentImage ? (
                  <>
                    <img 
                      src={currentImage} 
                      alt={partName} 
                      className={`w-full h-full transition-all duration-300 group-hover:scale-105 ${images.length > 0 ? 'object-contain p-2' : 'object-cover p-0'}`} 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ZoomIn className="text-white opacity-0 group-hover:opacity-100 w-10 h-10 drop-shadow-md transition-transform scale-50 group-hover:scale-100 duration-300" />
                    </div>
                  </>
                ) : (
                  <Package className="h-12 w-12 text-muted-foreground/40" />
                )}
              </div>
              
              <div className="text-center md:text-left flex-1 w-full">
                <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">Exact Fitment Verified</Badge>
                
                <h4 className="font-bold text-foreground text-xl md:text-2xl leading-tight mb-3">{partName}</h4>
                
                {/* 🔥 Updated: Sirf Brand aur Part Number dikhayega 🔥 */}
                {(partDetails?.brand || partDetails?.mpn) && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                    {partDetails.brand && (
                      <Badge variant="outline" className="bg-background/50 py-1">
                        <Tag className="w-3 h-3 mr-1" /> Brand: <span className="ml-1 font-semibold">{partDetails.brand}</span>
                      </Badge>
                    )}
                    {partDetails.mpn && (
                      <Badge variant="outline" className="bg-background/50 py-1">
                        <Settings className="w-3 h-3 mr-1" /> Part #: <span className="ml-1 font-semibold">{partDetails.mpn}</span>
                      </Badge>
                    )}
                  </div>
                )}
                
                <p className="text-sm md:text-sm text-muted-foreground mt-2">
                  {partDetails?.title ? partDetails.title.substring(0, 80) + '...' : 'Our specialists will verify availability from live inventory and send you the best pricing.'}
                </p>

                {images.length > 1 && (
                  <p className="text-xs text-primary font-medium mt-3 flex items-center justify-center md:justify-start gap-1 cursor-pointer hover:underline" onClick={() => setIsModalOpen(true)}>
                    <ZoomIn className="w-4 h-4" /> View all {images.length} photos
                  </p>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex flex-wrap gap-3 justify-center w-full mt-2">
                {images.map((imgUrl, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-md bg-white border-2 overflow-hidden cursor-pointer transition-all hover:opacity-100 ${selectedImageIndex === idx ? 'border-primary opacity-100 scale-105 shadow-sm' : 'border-border/50 opacity-60 hover:border-primary/50'}`}
                  >
                    <img src={imgUrl} alt={`View ${idx+1}`} className="w-full h-full object-contain p-1" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-2">
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
    </>
  );
};

export default CustomerForm;