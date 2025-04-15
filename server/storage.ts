import {
  products, Product, InsertProduct,
  users, User, InsertUser,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem,
  cartItems, CartItem, InsertCartItem,
  reviews, Review, InsertReview,
  subscribers, Subscriber, InsertSubscriber,
  contactMessages, ContactMessage, InsertContactMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, count } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Cart Items
  getCartItems(userId: number): Promise<CartItem[]>;
  getCartItemByUserAndProduct(userId: number, productId: number): Promise<CartItem | undefined>;
  createCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Reviews
  getAllReviews(): Promise<Review[]>;
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Newsletter subscribers
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  
  // Contact messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private users: Map<number, User>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private cartItems: Map<number, CartItem>;
  private reviews: Map<number, Review>;
  private subscribers: Map<number, Subscriber>;
  private contactMessages: Map<number, ContactMessage>;
  
  private currentProductId: number;
  private currentUserId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentCartItemId: number;
  private currentReviewId: number;
  private currentSubscriberId: number;
  private currentContactMessageId: number;
  
  constructor() {
    this.products = new Map();
    this.users = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.cartItems = new Map();
    this.reviews = new Map();
    this.subscribers = new Map();
    this.contactMessages = new Map();
    
    this.currentProductId = 1;
    this.currentUserId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentCartItemId = 1;
    this.currentReviewId = 1;
    this.currentSubscriberId = 1;
    this.currentContactMessageId = 1;
    
    // Initialize with some demo products
    this.seedProducts();
  }
  
  private seedProducts() {
    const demoProducts: InsertProduct[] = [
      {
        name: "Pure Batana Oil",
        slug: "pure-batana-oil",
        description: "Our 100% pure, cold-pressed Batana Oil is a traditional beauty elixir handcrafted by indigenous Miskito women in Honduras. This nutrient-rich oil has been used for centuries to nourish hair and skin with its exceptional moisturizing properties. Each bottle contains 2 oz (60ml) of premium Batana Oil in a protective amber glass bottle with a precision dropper for easy application.",
        shortDescription: "100% pure, cold-pressed batana oil in a protective amber glass bottle with precision dropper.",
        price: 29.95,
        images: ["/images/batana-front.jpg", "/images/batana-instructions.jpg", "/images/batana-benefits.jpg"],
        category: "oils",
        stock: 100,
        featured: true,
        benefits: [
          "Strengthens hair follicles and prevents breakage",
          "Deeply moisturizes skin without clogging pores",
          "Rich in omega-3, 6, and 9 fatty acids",
          "Improves skin elasticity and natural radiance",
          "Supports traditional indigenous knowledge and fair trade"
        ],
        usage: "For Hair: Apply a small amount to palms and work through damp hair, focusing on ends. Can be used as a deep conditioning treatment by leaving on for 30 minutes before washing. For Face: Warm 2-3 drops between fingertips and gently press into clean, slightly damp skin. Perfect as the final step in your evening skincare routine. For Body: Massage a generous amount into skin after bathing while still damp. Focus on dry areas like elbows, knees, and heels.",
        isBestseller: true,
        isNew: false
      },
      {
        name: "Batana Hair Mask",
        slug: "batana-hair-mask",
        description: "Our intensive Batana Hair Mask combines our signature cold-pressed Batana Oil with botanical extracts to create a deep conditioning treatment that repairs damaged hair, restores moisture, and adds natural shine. Perfect for all hair types, especially dry, damaged, or color-treated hair.",
        shortDescription: "Intensive treatment mask with Batana Oil and nourishing botanical extracts for damaged hair.",
        price: 34.95,
        images: ["/images/batana-front.jpg", "/images/batana-instructions.jpg"],
        category: "hair",
        stock: 75,
        featured: true,
        benefits: [
          "Deeply conditions dry, damaged hair",
          "Restores natural moisture balance",
          "Enhances natural shine and softness",
          "Strengthens hair to prevent breakage",
          "Made with 100% natural ingredients"
        ],
        usage: "Apply generously to clean, damp hair from mid-lengths to ends. Comb through for even distribution. Leave on for 15-30 minutes, then rinse thoroughly. Use weekly for best results.",
        isBestseller: false,
        isNew: true
      },
      {
        name: "Batana Gift Set",
        slug: "batana-gift-set",
        description: "Our luxurious Batana Gift Set includes our best-selling Pure Batana Oil, Batana Hair Mask, and Batana Body Butter packaged in a beautiful gift box made from sustainable materials. The perfect introduction to the transformative benefits of Batana or a thoughtful gift for someone special.",
        shortDescription: "Complete set including Pure Batana Oil, Hair Mask, and Body Butter in an elegant gift box.",
        price: 79.95,
        images: ["/images/batana-front.jpg", "/images/batana-benefits.jpg"],
        category: "gift-sets",
        stock: 50,
        featured: true,
        benefits: [
          "Complete Batana skincare collection",
          "Nourishing treatment for hair and body",
          "Elegant, eco-friendly packaging",
          "Perfect for gifting or self-care",
          "Includes our three bestselling products"
        ],
        usage: "See individual product instructions for detailed usage information.",
        isBestseller: false,
        isNew: false
      }
    ];
    
    demoProducts.forEach(product => {
      this.createProduct(product);
    });
    
    // Seed reviews
    this.createReview({
      userId: 1, // We'll create a fake user for this
      productId: 1,
      rating: 5,
      comment: "After just two weeks of using Batana Oil on my dry, damaged hair, I noticed incredible improvement in texture and shine. It's become the only hair product I'll ever need."
    });
    
    this.createReview({
      userId: 2,
      productId: 1,
      rating: 5,
      comment: "I've struggled with sensitive skin my entire life. Pure Batana is the first oil that moisturizes deeply without causing breakouts. It's truly miraculous."
    });
    
    this.createReview({
      userId: 3,
      productId: 1,
      rating: 4.5,
      comment: "The scent is subtle and natural, and the oil absorbs beautifully into my skin without feeling greasy. I love that it's ethically sourced too!"
    });
    
    // Create some demo users
    this.createUser({
      username: "sarah_k",
      password: "password123", // In a real app, this would be hashed
      email: "sarah_k@example.com",
      firstName: "Sarah",
      lastName: "K",
      address: "123 Main St",
      city: "Portland",
      state: "OR",
      zip: "97205",
      country: "USA",
      phone: "555-123-4567"
    });
    
    this.createUser({
      username: "michael_t",
      password: "password123",
      email: "michael_t@example.com",
      firstName: "Michael",
      lastName: "T",
      address: "456 Oak Ave",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA",
      phone: "555-987-6543"
    });
    
    this.createUser({
      username: "jennifer_l",
      password: "password123",
      email: "jennifer_l@example.com",
      firstName: "Jennifer",
      lastName: "L",
      address: "789 Pine St",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "USA",
      phone: "555-567-8901"
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.slug === slug);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct: Product = { 
      id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription ?? null,
      price: product.price,
      images: product.images,
      category: product.category,
      stock: product.stock ?? 0,
      featured: product.featured ?? null,
      benefits: product.benefits ?? null,
      usage: product.usage ?? null,
      isBestseller: product.isBestseller ?? null,
      isNew: product.isNew ?? null
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Users
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { 
      id,
      username: user.username,
      password: user.password,
      email: user.email,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      address: user.address ?? null,
      city: user.city ?? null,
      state: user.state ?? null,
      zip: user.zip ?? null,
      country: user.country ?? null,
      phone: user.phone ?? null
     };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...user };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const now = new Date();
    const newOrder: Order = { 
      id,
  userId: order.userId,
  status: order.status || 'pending',
  total: order.total,
  name: order.name,
  email: order.email ?? null,
  shippingAddress: order.shippingAddress ?? null,
  billingAddress: order.billingAddress ?? null, // Add this line
  createdAt: now,
  updatedAt: now
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) return undefined;
    
    const updatedOrder = { 
      ...existingOrder, 
      status,
      updatedAt: new Date()
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order Items
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const newItem: OrderItem = { ...item, id };
    this.orderItems.set(id, newItem);
    return newItem;
  }

  // Cart Items
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async getCartItemByUserAndProduct(userId: number, productId: number): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      item => item.userId === userId && item.productId === productId
    );
  }

  async createCartItem(item: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const newItem: CartItem = { ...item, id };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const existingItem = this.cartItems.get(id);
    if (!existingItem) return undefined;
    
    const updatedItem = { ...existingItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const userCartItems = await this.getCartItems(userId);
    for (const item of userCartItems) {
      this.cartItems.delete(item.id);
    }
    return true;
  }

  // Reviews
  async getAllReviews(): Promise<Review[]> {
    // Return all reviews with user information
    const allReviews = Array.from(this.reviews.values());
    return allReviews.map(review => {
      const user = this.users.get(review.userId);
      if (user) {
        return {
          ...review,
          user: {
            firstName: user.firstName,
            lastName: user.lastName
          }
        };
      }
      return review;
    });
  }
  
  async getProductReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.productId === productId);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const newReview: Review = { 
      id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      comment: review.comment ?? null,
      createdAt: new Date()
    };
    this.reviews.set(id, newReview);
    return newReview;
  }

  // Newsletter subscribers
  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.currentSubscriberId++;
    const newSubscriber: Subscriber = { 
      ...subscriber, 
      id,
      createdAt: new Date()
    };
    this.subscribers.set(id, newSubscriber);
    return newSubscriber;
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return Array.from(this.subscribers.values()).find(sub => sub.email === email);
  }

  // Contact messages
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const newMessage: ContactMessage = { 
      ...message, 
      id,
      createdAt: new Date()
    };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Users
  async getUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const now = new Date();
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: now })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Order Items
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    return newItem;
  }

  // Cart Items
  async getCartItems(userId: number): Promise<CartItem[]> {
    return db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async getCartItemByUserAndProduct(userId: number, productId: number): Promise<CartItem | undefined> {
    const [cartItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, productId)
        )
      );
    return cartItem;
  }

  async createCartItem(item: InsertCartItem): Promise<CartItem> {
    try {
      const [newItem] = await db.insert(cartItems).values(item).returning();
      return newItem;
    } catch (error) {
      // Handle unique constraint violation by updating the quantity instead
      if (error instanceof Error && error.message.includes('unique constraint')) {
        const existingItem = await this.getCartItemByUserAndProduct(item.userId, item.productId);
        if (existingItem) {
          const updatedItem = await this.updateCartItemQuantity(
            existingItem.id,
            existingItem.quantity + item.quantity
          );
          if (updatedItem) return updatedItem;
        }
      }
      throw error;
    }
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteCartItem(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async clearCart(userId: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.userId, userId));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Reviews
  async getAllReviews(): Promise<Review[]> {
    // Join with users to get the user information for each review
    const result = await db.select({
      review: reviews,
      user: {
        firstName: users.firstName,
        lastName: users.lastName
      }
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id));
    
    // Transform the results to match the Review type with added user info
    return result.map(({ review, user }) => ({
      ...review,
      user
    }));
  }
  
  async getProductReviews(productId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.productId, productId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  // Newsletter subscribers
  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const [newSubscriber] = await db.insert(subscribers).values(subscriber).returning();
    return newSubscriber;
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return subscriber;
  }

  // Contact messages
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }
}

// Initialize storage
export const storage = new DatabaseStorage();

// Define a function to seed the database with initial data if needed
export async function seedDatabase() {
  const productCount = await db.select({ count: count() }).from(products);
  
  if (productCount[0].count === 0) {
    console.log("Seeding database with initial data...");
    
    // Seed products
    const demoProducts: InsertProduct[] = [
      {
        name: "Pure Batana Oil",
        slug: "pure-batana-oil",
        description: "Our 100% pure, cold-pressed Batana Oil is a traditional beauty elixir handcrafted by indigenous Miskito women in Honduras. This nutrient-rich oil has been used for centuries to nourish hair and skin with its exceptional moisturizing properties. Each bottle contains 2 oz (60ml) of premium Batana Oil in a protective amber glass bottle with a precision dropper for easy application.",
        shortDescription: "100% pure, cold-pressed batana oil in a protective amber glass bottle with precision dropper.",
        price: 29.95,
        images: ["/images/batana-front.jpg", "/images/batana-instructions.jpg", "/images/batana-benefits.jpg"],
        category: "oils",
        stock: 100,
        featured: true,
        benefits: [
          "Strengthens hair follicles and prevents breakage",
          "Deeply moisturizes skin without clogging pores",
          "Rich in omega-3, 6, and 9 fatty acids",
          "Improves skin elasticity and natural radiance",
          "Supports traditional indigenous knowledge and fair trade"
        ],
        usage: "For Hair: Apply a small amount to palms and work through damp hair, focusing on ends. Can be used as a deep conditioning treatment by leaving on for 30 minutes before washing. For Face: Warm 2-3 drops between fingertips and gently press into clean, slightly damp skin. Perfect as the final step in your evening skincare routine. For Body: Massage a generous amount into skin after bathing while still damp. Focus on dry areas like elbows, knees, and heels.",
        isBestseller: true,
        isNew: false
      },
      {
        name: "Batana Hair Mask",
        slug: "batana-hair-mask",
        description: "Our intensive Batana Hair Mask combines our signature cold-pressed Batana Oil with botanical extracts to create a deep conditioning treatment that repairs damaged hair, restores moisture, and adds natural shine. Perfect for all hair types, especially dry, damaged, or color-treated hair.",
        shortDescription: "Intensive treatment mask with Batana Oil and nourishing botanical extracts for damaged hair.",
        price: 34.95,
        images: ["/images/batana-front.jpg", "/images/batana-instructions.jpg"],
        category: "hair",
        stock: 75,
        featured: true,
        benefits: [
          "Deeply conditions dry, damaged hair",
          "Restores natural moisture balance",
          "Enhances natural shine and softness",
          "Strengthens hair to prevent breakage",
          "Made with 100% natural ingredients"
        ],
        usage: "Apply generously to clean, damp hair from mid-lengths to ends. Comb through for even distribution. Leave on for 15-30 minutes, then rinse thoroughly. Use weekly for best results.",
        isBestseller: false,
        isNew: true
      },
      {
        name: "Batana Gift Set",
        slug: "batana-gift-set",
        description: "Our luxurious Batana Gift Set includes our best-selling Pure Batana Oil, Batana Hair Mask, and Batana Body Butter packaged in a beautiful gift box made from sustainable materials. The perfect introduction to the transformative benefits of Batana or a thoughtful gift for someone special.",
        shortDescription: "Complete set including Pure Batana Oil, Hair Mask, and Body Butter in an elegant gift box.",
        price: 79.95,
        images: ["/images/batana-front.jpg", "/images/batana-benefits.jpg"],
        category: "gift-sets",
        stock: 50,
        featured: true,
        benefits: [
          "Complete Batana skincare collection",
          "Nourishing treatment for hair and body",
          "Elegant, eco-friendly packaging",
          "Perfect for gifting or self-care",
          "Includes our three bestselling products"
        ],
        usage: "See individual product instructions for detailed usage information.",
        isBestseller: false,
        isNew: false
      }
    ];
    
    await db.insert(products).values(demoProducts);
    console.log("Added demo products");
    
    // Create demo users
    const demoUsers: InsertUser[] = [
      {
        username: "sarah_k",
        password: "password123", // In a real app, this would be hashed
        email: "sarah_k@example.com",
        firstName: "Sarah",
        lastName: "K",
        address: "123 Main St",
        city: "Portland",
        state: "OR",
        zip: "97205",
        country: "USA",
        phone: "555-123-4567"
      },
      {
        username: "michael_t",
        password: "password123",
        email: "michael_t@example.com",
        firstName: "Michael",
        lastName: "T",
        address: "456 Oak Ave",
        city: "Seattle",
        state: "WA",
        zip: "98101",
        country: "USA",
        phone: "555-987-6543"
      },
      {
        username: "jennifer_l",
        password: "password123",
        email: "jennifer_l@example.com",
        firstName: "Jennifer",
        lastName: "L",
        address: "789 Pine St",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        country: "USA",
        phone: "555-567-8901"
      }
    ];
    
    await db.insert(users).values(demoUsers);
    console.log("Added demo users");
    
    // Add reviews for the first product
    const allProducts = await db.select().from(products);
    const allUsers = await db.select().from(users);
    
    if (allProducts.length > 0 && allUsers.length >= 3) {
      const productId = allProducts[0].id;
      
      const demoReviews: InsertReview[] = [
        {
          userId: allUsers[0].id,
          productId: productId,
          rating: 5,
          comment: "After just two weeks of using Batana Oil on my dry, damaged hair, I noticed incredible improvement in texture and shine. It's become the only hair product I'll ever need."
        },
        {
          userId: allUsers[1].id,
          productId: productId,
          rating: 5,
          comment: "I've struggled with sensitive skin my entire life. Pure Batana is the first oil that moisturizes deeply without causing breakouts. It's truly miraculous."
        },
        {
          userId: allUsers[2].id,
          productId: productId,
          rating: 4, // Changed from 4.5 to 4 since rating is an integer
          comment: "The scent is subtle and natural, and the oil absorbs beautifully into my skin without feeling greasy. I love that it's ethically sourced too!"
        }
      ];
      
      await db.insert(reviews).values(demoReviews);
      console.log("Added demo reviews");
    }
    
    console.log("Database seeding complete");
  } else {
    console.log("Database already contains data, skipping seed");
  }
}
