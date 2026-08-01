"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Make sure your logo is placed in the 'assets' folder or adjust the path
import vehixLogo from "@/assets/vehix-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Browse Parts" },
    { href: "/brands", label: "Brands" },
    { href: "/support", label: "Support" },
    { href: "/about", label: "About" },
  ];

  const brands = ["Audi", "BMW", "Mercedes-Benz", "Toyota", "Lexus", "Acura"];

  return (
    <header className="bg-background border-b border-border shadow-sm">
      {/* Top bar with contact info */}
      <div className="bg-muted">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>support@vehixautoparts.com</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span>Free shipping on orders over $99 | 30-day returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              // Note: In Next.js, if you import an image directly, you might need to use .src 
              // like this: src={vehixLogo.src}. If it shows an error, add .src here.
              src={vehixLogo.src || vehixLogo} 
              alt="Vehix Auto Parts" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for brake pads, rotors, or enter your vehicle..."
                className="pr-10"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1 h-8 px-3"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Cart</span>
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Search bar - Mobile */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search parts or vehicle..."
              className="pr-10"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1 h-8 px-3"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-secondary border-t border-border">
        <div className="container mx-auto px-4">
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center justify-between py-3">
            <div className="flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Shop by Brand:</span>
              {brands.map((brand) => (
                <Link
                  key={brand}
                  href={`/brands/${brand.toLowerCase().replace('-', '')}`}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-3">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Shop by Brand:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {brands.map((brand) => (
                      <Link
                        key={brand}
                        href={`/brands/${brand.toLowerCase().replace('-', '')}`}
                        className="text-sm text-foreground hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {brand}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;