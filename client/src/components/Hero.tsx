import { Link } from "@/lib/routing";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-[rgba(58,90,64,0.05)] to-[rgba(163,177,138,0.1)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-[#3a5a40] mb-4 leading-tight">Pure Batana Oil</h1>
            <p className="text-[#588157] text-xl font-medium mb-6">Ancient Honduran beauty secret for hair & skin</p>
            <p className="text-neutral-800 mb-8 max-w-xl">Handcrafted by indigenous Miskito women in Honduras, our 100% pure, cold-pressed Batana Oil delivers transformative moisturizing and revitalizing benefits. This centuries-old beauty secret is now available to you in its purest form.</p>
            <div className="flex items-center mb-8">
              <div className="flex mr-3">
                <i className="fas fa-star text-yellow-500"></i>
                <i className="fas fa-star text-yellow-500"></i>
                <i className="fas fa-star text-yellow-500"></i>
                <i className="fas fa-star text-yellow-500"></i>
                <i className="fas fa-star-half-alt text-yellow-500"></i>
              </div>
              <span className="text-sm text-neutral-600">4.8/5 (124 reviews)</span>
            </div>
            <div className="flex items-center mb-8">
              <p className="text-2xl font-display font-bold mr-4">$29.95</p>
              <span className="text-neutral-600">2 oz (60ml)</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/product/pure-batana-oil">
                <Button className="bg-[#3a5a40] hover:bg-[#588157] h-12 px-8">
                  <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
                </Button>
              </Link>
              <Link href="/product/pure-batana-oil">
                <Button variant="outline" className="border-[#3a5a40] text-[#3a5a40] hover:bg-[#3a5a40] hover:text-white h-12 px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="/images/batana-front.jpg" 
              alt="Batana Oil Bottle" 
              className="w-full max-w-md mx-auto rounded-lg shadow-xl" 
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
