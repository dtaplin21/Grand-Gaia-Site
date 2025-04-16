import { Link } from "@/lib/routing";
import { Product } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product, 1);
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
      <div className="relative cursor-pointer">
        <Link href={`/product/${product.slug}`} className="block">
          <img 
            src={product.slug === "pure-batana-oil" 
              ? `/images/batana-front.jpg` 
              : product.images[0]
            } 
            alt={product.name} 
            className="w-full h-64 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
            }}
          />
          {product.isBestseller && (
            <div className="absolute top-4 right-4 bg-[#588157] text-white text-xs px-3 py-1 rounded-full">
              Bestseller
            </div>
          )}
          {product.isNew && (
            <div className="absolute top-4 right-4 bg-[#a3b18a] text-white text-xs px-3 py-1 rounded-full">
              New
            </div>
          )}
        </Link>
      </div>
      <div className="p-6">
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="font-display font-semibold text-xl mb-2">{product.name}</h3>
          <p className="text-neutral-600 mb-4">{product.shortDescription}</p>
        </Link>
        <div className="flex justify-between items-center">
          <p className="font-display font-bold text-lg">${product.price.toFixed(2)}</p>
          <button 
            className="bg-[#3a5a40] hover:bg-[#588157] text-white py-2 px-4 rounded-full transition-colors text-sm"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
