import Hero from "@/components/Hero";
import BrandShowcase from "@/components/BrandShowcase";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <BrandShowcase />
      <FeaturedProducts />
    </main>
  );
}