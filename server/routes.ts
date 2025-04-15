import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import { 
  insertProductSchema, 
  insertUserSchema, 
  insertOrderSchema, 
  insertOrderItemSchema, 
  insertCartItemSchema, 
  insertReviewSchema, 
  insertSubscriberSchema, 
  insertContactMessageSchema 
} from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

// Initialize Stripe with secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - All prefixed with /api
  
  // Products
  app.get("/api/products", async (req, res): Promise<void> => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get("/api/products/:slug", async (req, res): Promise<void> => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });
  
  // Update product (for admin use)
  app.patch("/api/products/:id", express.json(), async (req, res): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      // We're only allowing price updates through this endpoint for security
      const { price } = req.body;
      
      if (typeof price !== 'number' || price < 0) {
        res.status(400).json({ message: "Invalid price. Price must be a non-negative number." });
        return;
      }
      
      const existingProduct = await storage.getProduct(id);
      if (!existingProduct) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      
      // Update only the price
      const updatedProduct = await storage.updateProduct(id, { price });
      
      if (!updatedProduct) {
        res.status(500).json({ message: "Failed to update product" });
        return;
      }
      
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Error updating product" });
    }
  });

  // Cart Items
  app.get("/api/cart/:userId", async (req, res): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const cartItems = await storage.getCartItems(userId);
      
      // Fetch product details for each cart item
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json(cartWithProducts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart items" });
    }
  });

  app.post("/api/cart", express.json(), async (req, res): Promise<void> => {
    try {
      const validation = insertCartItemSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid cart item data", errors: validation.error });
        return;
      }
      
      const { userId, productId, quantity } = validation.data;
      
      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      
      // Check if user already has this product in cart
      const existingCartItem = await storage.getCartItemByUserAndProduct(userId, productId);
      
      if (existingCartItem) {
        // Update quantity
        const updatedItem = await storage.updateCartItemQuantity(
          existingCartItem.id,
          existingCartItem.quantity + quantity
        );
        res.status(200).json(updatedItem);
        return;
      } else {
        // Create new cart item
        const newCartItem = await storage.createCartItem(validation.data);
        res.status(201).json(newCartItem);
      }
    } catch (error) {
      res.status(500).json({ message: "Error adding item to cart" });
    }
  });

  app.put("/api/cart/:id", express.json(), async (req, res): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        res.status(400).json({ message: "Invalid quantity" });
        return;
      }
      
      const updatedItem = await storage.updateCartItemQuantity(id, quantity);
      
      if (!updatedItem) {
        res.status(404).json({ message: "Cart item not found" });
        return;
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Error updating cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCartItem(id);
      
      if (!success) {
        res.status(404).json({ message: "Cart item not found" });
        return;
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error removing item from cart" });
    }
  });

  // Clear cart
  app.delete("/api/cart/user/:userId", async (req, res): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.clearCart(userId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error clearing cart" });
    }
  });

  // Users (simplified for demo - in a real app would include authentication)
  app.post("/api/users/register", express.json(), async (req, res): Promise<void> => {
    try {
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid user data", errors: validation.error });
        return;
      }
      
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(validation.data.username);
      if (existingUserByUsername) {
        res.status(400).json({ message: "Username already exists" });
        return;
      }
      
      const existingUserByEmail = await storage.getUserByEmail(validation.data.email);
      if (existingUserByEmail) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }
      
      // Create user
      const newUser = await storage.createUser(validation.data);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.post("/api/users/login", express.json(), async (req, res): Promise<void> => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) { // In a real app, you'd use proper password hashing
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      
      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error during login" });
    }
  });

  // Orders
  app.get("/api/orders/user/:userId", async (req, res): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }
      
      // Get order items
      const orderItems = await storage.getOrderItems(id);
      
      res.json({
        ...order,
        items: orderItems
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  app.post("/api/orders", express.json(), async (req, res): Promise<void> => {
    try {
      const orderData = insertOrderSchema.safeParse(req.body.order);
      if (!orderData.success) {
        res.status(400).json({ message: "Invalid order data", errors: orderData.error });
        return;
      }
      
      const orderItemsData = z.array(insertOrderItemSchema).safeParse(req.body.orderItems);
      if (!orderItemsData.success) {
        res.status(400).json({ message: "Invalid order items data", errors: orderItemsData.error });
        return;
      }
      
      // Create order
      const newOrder = await storage.createOrder(orderData.data);
      
      // Create order items
      const orderItemsPromises = orderItemsData.data.map(item => 
        storage.createOrderItem({
          ...item,
          orderId: newOrder.id
        })
      );
      
      const orderItems = await Promise.all(orderItemsPromises);
      
      // Clear user's cart
      await storage.clearCart(orderData.data.userId);
      
      // Send order confirmation email
      try {
        const { sendOrderConfirmationEmail } = await import('./email');
        
        // Get product details for each order item
        const orderItemsWithDetails = await Promise.all(
          orderItems.map(async (item) => {
            const product = await storage.getProduct(item.productId);
            return {
              name: product?.name || `Product #${item.productId}`,
              quantity: item.quantity,
              price: item.price
            };
          })
        );
        
        // Calculate totals
        const subtotal = orderItemsWithDetails.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 50 ? 0 : 5.95;
        const total = subtotal + shipping;
        
        // Generate a formatted order number
        const orderNumber = `PB${newOrder.id.toString().padStart(5, '0')}`;
        
        // Send the confirmation email
        await sendOrderConfirmationEmail({
          orderNumber,
          customerName: orderData.data.name,
          customerEmail: orderData.data.email,
          items: orderItemsWithDetails,
          subtotal,
          shipping,
          total,
          shippingAddress: orderData.data.shippingAddress || 'Address not Provided',
          dateCreated: newOrder.createdAt || new Date()
        });
        
      } catch (emailError) {
        // Log the error but don't fail the order creation
        console.error('Error sending order confirmation email:', emailError);
      }
      
      res.status(201).json({
        ...newOrder,
        items: orderItems
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating order" });
    }
  });

  // Reviews
  app.get("/api/reviews", async (req, res): Promise<void> => {
    try {
      // Get all reviews (will add pagination in a real app)
      const allReviews = await storage.getAllReviews();
      res.json(allReviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });

  app.get("/api/reviews/product/:productId", async (req, res): Promise<void> => {
    try {
      const productId = parseInt(req.params.productId);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });

  app.post("/api/reviews", express.json(), async (req, res): Promise<void> => {
    try {
      const validation = insertReviewSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid review data", errors: validation.error });
        return;
      }
      
      const newReview = await storage.createReview(validation.data);
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ message: "Error creating review" });
    }
  });

  // Newsletter
  app.post("/api/newsletter/subscribe", express.json(), async (req, res): Promise<void> => {
    try {
      const validation = insertSubscriberSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid email", errors: validation.error });
        return;
      }
      
      // Check if email already subscribed
      const existingSubscriber = await storage.getSubscriberByEmail(validation.data.email);
      if (existingSubscriber) {
        res.status(409).json({ message: "Email already subscribed" });
        return;
      }
      
      const newSubscriber = await storage.createSubscriber(validation.data);
      res.status(201).json(newSubscriber);
    } catch (error) {
      res.status(500).json({ message: "Error subscribing to newsletter" });
    }
  });

  // Contact
  app.post("/api/contact", express.json(), async (req, res): Promise<void> => {
    try {
      const validation = insertContactMessageSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid contact form data", errors: validation.error });
        return;
      }
      
      // First save to the database
      const newMessage = await storage.createContactMessage(validation.data);
      
      // Then send email using SendGrid
      const { sendEmail } = await import('./email');
      
      // Format the email content
      const emailText = `
Name: ${validation.data.name}
Email: ${validation.data.email}
Subject: ${validation.data.subject}
Message: ${validation.data.message}
      `;
      
      const emailHtml = `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${validation.data.name}</p>
<p><strong>Email:</strong> ${validation.data.email}</p>
<p><strong>Subject:</strong> ${validation.data.subject}</p>
<p><strong>Message:</strong></p>
<p>${validation.data.message.replace(/\n/g, '<br>')}</p>
      `;
      
      // Send the email to Dtaplin21@gmail.com
      await sendEmail({
        to: 'Dtaplin21@gmail.com',
        from: 'noreply@replit.com', // Using Replit's domain which should be pre-verified
        subject: `Pure Batana Contact: ${validation.data.subject}`,
        text: emailText,
        html: emailHtml,
        replyTo: validation.data.email // Set reply-to as the submitter's email
      });
      
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ message: "Error submitting contact form" });
    }
  });

  // Stripe payments
  app.post("/api/create-payment-intent", express.json(), async (req, res): Promise<void> => {
    try {
      const { amount, orderItems } = req.body;
      
      // Create a payment intent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          orderItems: JSON.stringify(orderItems)
        }
      });

      // Send the client secret to the client
      res.status(200).json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  });

  // Webhook for payment completion
  app.post("/api/webhook", express.raw({type: 'application/json'}), async (req, res): Promise<void> => {
    try {
      const sig = req.headers['stripe-signature'] as string;
      
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        res.status(400).send('Webhook secret is not set');
        return;
      }

      let event: Stripe.Event;
      
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      } catch (err: any) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      
      // Handle the event
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent succeeded:', paymentIntent.id);
        
        // If we have order metadata, we can send a confirmation email here as well
        if (paymentIntent.receipt_email) {
          try {
            // Look for an order that matches this payment (based on amount, etc.)
            // In a real implementation, we would have a more reliable way to match orders to payments
            const orders = await storage.getOrders();
            const matchingOrder = orders.find(order => 
              Math.round(order.total * 100) === paymentIntent.amount &&
              order.status === 'pending'
            );
            
            if (matchingOrder) {
              // Update order status to 'paid'
              await storage.updateOrderStatus(matchingOrder.id, 'paid');
              
              // Send order confirmation email if we have customer details
              if (matchingOrder.email && matchingOrder.name) {
                const { sendOrderConfirmationEmail } = await import('./email');
                const orderItems = await storage.getOrderItems(matchingOrder.id);
                
                // Get product details for each order item
                const orderItemsWithDetails = await Promise.all(
                  orderItems.map(async (item) => {
                    const product = await storage.getProduct(item.productId);
                    return {
                      name: product?.name || `Product #${item.productId}`,
                      quantity: item.quantity,
                      price: item.price
                    };
                  })
                );
                
                // Calculate totals
                const subtotal = orderItemsWithDetails.reduce((sum, item) => 
                  sum + (item.price * item.quantity), 0);
                const shipping = subtotal >= 50 ? 0 : 5.95;
                const total = subtotal + shipping;
                
                // Generate a formatted order number
                const orderNumber = `PB${matchingOrder.id.toString().padStart(5, '0')}`;
                
                // Send the confirmation email
                await sendOrderConfirmationEmail({
                  orderNumber,
                  customerName: matchingOrder.name,
                  customerEmail: matchingOrder.email,
                  items: orderItemsWithDetails,
                  subtotal,
                  shipping,
                  total,
                  shippingAddress: matchingOrder.shippingAddress || 'Address not Provided',
                  dateCreated: matchingOrder.createdAt || new Date(),
                });
              }
            }
          } catch (emailError) {
            console.error('Error sending confirmation email from webhook:', emailError);
          }
        }
      }
      
      res.json({received: true});
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}