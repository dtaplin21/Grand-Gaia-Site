/*eslint-disable*/
import { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@shared/schema";

export interface CartItemType {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItemType[];
  addToCart: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
  cartCount: 0,
  isLoading: true,
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItemType[]>([]);
  
  // Load cart from localStorage on initial load
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("cart", JSON.stringify(cart));
      } catch (error) {
        console.error("Error saving cart to localStorage", error);
      }
    }
  }, [cart, isLoading]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(currentCart => {
      // Check if product already exists in cart
      const existingItemIndex = currentCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if product already exists
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new product to cart
        return [...currentCart, { product, quantity }];
      }
    });
  };

  const removeItem = (productId: number) => {
    setCart(currentCart => currentCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCart(currentCart => 
      currentCart.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  
  // Calculate total number of items
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeItem,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};
