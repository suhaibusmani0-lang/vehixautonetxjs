"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, CheckCircle2 } from "lucide-react";

const CustomerForm = () => {
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

  // Jab user billing address update kare aur checkbox tick ho, toh shipping bhi auto-update ho
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
        body: JSON.stringify(formData),
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

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center">
        <Card className="border-green-500 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="pt-6 flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Request Sent Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you, {formData.name}. Our team has received your details and will contact you shortly with the part availability and pricing.
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
    <Card className="shadow-lg max-w-xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Complete Your Request</CardTitle>
        <CardDescription className="text-lg mt-2">
          Enter your details and shipping address to get an exact quote.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Any specific part numbers or VIN details..."
            />
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : (
              <>
                <Send className="w-4 h-4 mr-2" />
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