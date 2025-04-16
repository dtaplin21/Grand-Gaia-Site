import { Link } from "@/lib/routing";
import { CartItemType } from "@/context/CartContext";
import QuantitySelector from "./QuantitySelector";

interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const { product, quantity } = item;
  const totalPrice = product.price * quantity;
  
  return (
    <div className="p-4 border-b border-neutral-100 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
      <div className="col-span-6 flex items-center space-x-4 w-full md:w-auto">
        <div className="flex-shrink-0">
          <Link href={`/product/${product.slug}`}>
            <img 
              src={product.images && product.images.length > 0 ? product.images[0] : "/images/batana-front.jpg"} 
              alt={product.name} 
              className="w-16 h-16 object-cover rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/batana-front.jpg";
              }}
            />
          </Link>
        </div>
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-medium hover:text-[#588157] transition-colors">{product.name}</h3>
          </Link>
          <button 
            className="text-[#588157] hover:text-[#3a5a40] text-sm mt-1 flex items-center"
            onClick={onRemove}
          >
            <i className="fas fa-trash-alt mr-1"></i> Remove
          </button>
        </div>
      </div>
      
      <div className="col-span-2 text-center">
        <div className="md:hidden text-sm text-neutral-500 mb-1">Price:</div>
        <span className="font-medium">${product.price.toFixed(2)}</span>
      </div>
      
      <div className="col-span-2 flex justify-center">
        <div className="w-24">
          <div className="md:hidden text-sm text-neutral-500 mb-1 text-center">Quantity:</div>
          <QuantitySelector 
            quantity={quantity}
            onIncrease={() => onUpdateQuantity(quantity + 1)}
            onDecrease={() => onUpdateQuantity(quantity > 1 ? quantity - 1 : 1)}
            onChangeQuantity={(value) => onUpdateQuantity(parseInt(value) || 1)}
            small
          />
        </div>
      </div>
      
      <div className="col-span-2 text-right">
        <div className="md:hidden text-sm text-neutral-500 mb-1">Total:</div>
        <span className="font-bold">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}
