import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import vehixLogo from "@/assets/vehix-logo.png";

// Lucide ne brand icons hata diye hain, isliye exact same design ke liye SVG yahan add kiye hain
const Facebook = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const Twitter = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const Instagram = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const Youtube = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Shop",
      links: [
        { label: "Brake Pads", href: "/catalog?category=brake-pads" },
        { label: "Brake Rotors", href: "/catalog?category=brake-rotors" },
        { label: "Browse All Parts", href: "/catalog" },
        { label: "Vehicle Finder", href: "/" }
      ]
    },
    {
      title: "Brands",
      links: [
        { label: "Audi", href: "/brands/audi" },
        { label: "BMW", href: "/brands/bmw" },
        { label: "Mercedes-Benz", href: "/brands/mercedes" },
        { label: "Toyota", href: "/brands/toyota" },
        { label: "Lexus", href: "/brands/lexus" },
        { label: "Acura", href: "/brands/acura" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Shipping & Returns", href: "/support/shipping-returns" },
        { label: "Warranty", href: "/support/warranty" },
        { label: "Fitment Guarantee", href: "/support/fitment-guarantee" },
        { label: "Contact Us", href: "/contact" },
        { label: "Track Order", href: "/track-order" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Careers", href: "/careers" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <img 
                src={vehixLogo.src || vehixLogo} 
                alt="Vehix Auto Parts" 
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-background/80 mb-6 leading-relaxed">
              Your trusted source for premium brake pads and rotors for European and Japanese vehicles. 
              Serving customers nationwide with quality parts and exceptional service since 2020.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-background/80">(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-background/80">support@vehixautoparts.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-background/80">New York, NY</span>
              </div>
            </div>
          </div>

          {/* Footer links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-background/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter signup */}
        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center lg:text-left lg:max-w-none lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-background/80">
                Get the latest news about new products and exclusive offers.
              </p>
            </div>
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded bg-background/10 border border-background/20 text-background placeholder-background/60 focus:outline-none focus:border-primary"
                />
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary-hover transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/20 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-background/80 text-sm">
              © {currentYear} Vehix Auto Parts. All rights reserved.
            </div>
            
            {/* Trust badges */}
            <div className="flex items-center gap-6 text-sm text-background/80">
              <span>🔒 SSL Secured</span>
              <span>📦 Free Shipping $99+</span>
              <span>🛡️ 30-Day Returns</span>
            </div>
            
            {/* Social links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-background/60 hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Additional certifications */}
        <div className="text-center mt-8 pt-8 border-t border-background/20">
          <p className="text-xs text-background/60">
            Fitment Guarantee • 12-Month Warranty • Authorized Dealer • Made in USA
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;