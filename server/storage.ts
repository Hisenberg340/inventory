import {
  users, categories, suppliers, customers, products, inventoryTransactions,
  purchaseOrders, purchaseOrderItems, salesOrders, salesOrderItems,
  type User, type InsertUser, type Category, type InsertCategory,
  type Supplier, type InsertSupplier, type Customer, type InsertCustomer,
  type Product, type InsertProduct, type InventoryTransaction, type InsertInventoryTransaction,
  type PurchaseOrder, type InsertPurchaseOrder, type PurchaseOrderItem, type InsertPurchaseOrderItem,
  type SalesOrder, type InsertSalesOrder, type SalesOrderItem, type InsertSalesOrderItem
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Suppliers
  getAllSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;

  // Customers
  getAllCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getLowStockProducts(): Promise<Product[]>;

  // Inventory Transactions
  getAllInventoryTransactions(): Promise<InventoryTransaction[]>;
  getInventoryTransactionsByProduct(productId: number): Promise<InventoryTransaction[]>;
  createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction>;

  // Purchase Orders
  getAllPurchaseOrders(): Promise<PurchaseOrder[]>;
  getPurchaseOrder(id: number): Promise<PurchaseOrder | undefined>;
  createPurchaseOrder(order: InsertPurchaseOrder): Promise<PurchaseOrder>;
  updatePurchaseOrder(id: number, order: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder | undefined>;
  getPurchaseOrderItems(orderId: number): Promise<PurchaseOrderItem[]>;
  createPurchaseOrderItem(item: InsertPurchaseOrderItem): Promise<PurchaseOrderItem>;

  // Sales Orders
  getAllSalesOrders(): Promise<SalesOrder[]>;
  getSalesOrder(id: number): Promise<SalesOrder | undefined>;
  createSalesOrder(order: InsertSalesOrder): Promise<SalesOrder>;
  updateSalesOrder(id: number, order: Partial<InsertSalesOrder>): Promise<SalesOrder | undefined>;
  getSalesOrderItems(orderId: number): Promise<SalesOrderItem[]>;
  createSalesOrderItem(item: InsertSalesOrderItem): Promise<SalesOrderItem>;

  // Dashboard Stats
  getDashboardStats(): Promise<{
    totalProducts: number;
    lowStockItems: number;
    todaySales: number;
    expiringSoon: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private categories: Map<number, Category> = new Map();
  private suppliers: Map<number, Supplier> = new Map();
  private customers: Map<number, Customer> = new Map();
  private products: Map<number, Product> = new Map();
  private inventoryTransactions: Map<number, InventoryTransaction> = new Map();
  private purchaseOrders: Map<number, PurchaseOrder> = new Map();
  private purchaseOrderItems: Map<number, PurchaseOrderItem> = new Map();
  private salesOrders: Map<number, SalesOrder> = new Map();
  private salesOrderItems: Map<number, SalesOrderItem> = new Map();

  private currentUserId = 1;
  private currentCategoryId = 1;
  private currentSupplierId = 1;
  private currentCustomerId = 1;
  private currentProductId = 1;
  private currentInventoryTransactionId = 1;
  private currentPurchaseOrderId = 1;
  private currentPurchaseOrderItemId = 1;
  private currentSalesOrderId = 1;
  private currentSalesOrderItemId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      password: "admin123", // In real app, this would be hashed
      name: "John Admin",
      role: "admin",
      isActive: true
    };
    this.users.set(adminUser.id, adminUser);

    // Seed categories
    const categories = [
      { name: "Electronics", description: "Electronic devices and components" },
      { name: "Accessories", description: "Device accessories and peripherals" },
      { name: "Computers", description: "Desktop and laptop computers" },
      { name: "Mobile", description: "Mobile phones and tablets" }
    ];

    categories.forEach(cat => {
      const category: Category = { id: this.currentCategoryId++, ...cat };
      this.categories.set(category.id, category);
    });

    // Seed suppliers
    const suppliers = [
      {
        name: "Tech Supplies Co.",
        contactPerson: "John Smith",
        email: "john@techsupplies.com",
        phone: "+1-555-0123",
        address: "123 Tech Street, Silicon Valley, CA",
        gst: "GST123456789",
        isActive: true
      }
    ];

    suppliers.forEach(sup => {
      const supplier: Supplier = { id: this.currentSupplierId++, ...sup };
      this.suppliers.set(supplier.id, supplier);
    });

    // Seed customers
    const customers = [
      {
        name: "ABC Electronics Store",
        email: "orders@abcelectronics.com",
        phone: "+1-555-0456",
        address: "456 Retail Ave, Commerce City, CA",
        gst: "GST987654321",
        isActive: true
      }
    ];

    customers.forEach(cust => {
      const customer: Customer = { id: this.currentCustomerId++, ...cust };
      this.customers.set(customer.id, customer);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      ...insertUser, 
      id: this.currentUserId++,
      role: insertUser.role || 'staff',
      isActive: insertUser.isActive ?? true
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = { 
      ...insertCategory, 
      id: this.currentCategoryId++,
      description: insertCategory.description ?? null
    };
    this.categories.set(category.id, category);
    return category;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    const updatedCategory = { ...category, ...updateData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Supplier methods
  async getAllSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const supplier: Supplier = { 
      ...insertSupplier, 
      id: this.currentSupplierId++,
      isActive: insertSupplier.isActive ?? true,
      contactPerson: insertSupplier.contactPerson ?? null,
      email: insertSupplier.email ?? null,
      phone: insertSupplier.phone ?? null,
      address: insertSupplier.address ?? null,
      gst: insertSupplier.gst ?? null
    };
    this.suppliers.set(supplier.id, supplier);
    return supplier;
  }

  async updateSupplier(id: number, updateData: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;
    const updatedSupplier = { ...supplier, ...updateData };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Customer methods
  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const customer: Customer = { 
      ...insertCustomer, 
      id: this.currentCustomerId++,
      isActive: insertCustomer.isActive ?? true,
      email: insertCustomer.email ?? null,
      phone: insertCustomer.phone ?? null,
      address: insertCustomer.address ?? null,
      gst: insertCustomer.gst ?? null
    };
    this.customers.set(customer.id, customer);
    return customer;
  }

  async updateCustomer(id: number, updateData: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    const updatedCustomer = { ...customer, ...updateData };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product: Product = { 
      ...insertProduct, 
      id: this.currentProductId++,
      brand: insertProduct.brand ?? null,
      isActive: insertProduct.isActive ?? true,
      barcode: insertProduct.barcode ?? null,
      categoryId: insertProduct.categoryId ?? null,
      unit: insertProduct.unit || 'pcs',
      taxPercent: insertProduct.taxPercent || '0',
      minStockLevel: insertProduct.minStockLevel ?? 0,
      currentStock: insertProduct.currentStock ?? 0
    };
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    const updatedProduct = { ...product, ...updateData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async getLowStockProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.currentStock <= product.minStockLevel
    );
  }

  // Inventory Transaction methods
  async getAllInventoryTransactions(): Promise<InventoryTransaction[]> {
    return Array.from(this.inventoryTransactions.values());
  }

  async getInventoryTransactionsByProduct(productId: number): Promise<InventoryTransaction[]> {
    return Array.from(this.inventoryTransactions.values()).filter(
      transaction => transaction.productId === productId
    );
  }

  async createInventoryTransaction(insertTransaction: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const transaction: InventoryTransaction = {
      ...insertTransaction,
      id: this.currentInventoryTransactionId++,
      createdAt: new Date(),
      reason: insertTransaction.reason ?? null,
      reference: insertTransaction.reference ?? null,
      performedBy: insertTransaction.performedBy ?? null
    };
    this.inventoryTransactions.set(transaction.id, transaction);

    // Update product stock
    const product = this.products.get(transaction.productId);
    if (product) {
      let newStock = product.currentStock;
      if (transaction.type === 'in') {
        newStock += transaction.quantity;
      } else if (transaction.type === 'out') {
        newStock -= transaction.quantity;
      } else if (transaction.type === 'adjustment') {
        newStock = transaction.quantity;
      }
      product.currentStock = Math.max(0, newStock);
      this.products.set(product.id, product);
    }

    return transaction;
  }

  // Purchase Order methods
  async getAllPurchaseOrders(): Promise<PurchaseOrder[]> {
    return Array.from(this.purchaseOrders.values());
  }

  async getPurchaseOrder(id: number): Promise<PurchaseOrder | undefined> {
    return this.purchaseOrders.get(id);
  }

  async createPurchaseOrder(insertOrder: InsertPurchaseOrder): Promise<PurchaseOrder> {
    const order: PurchaseOrder = {
      ...insertOrder,
      id: this.currentPurchaseOrderId++,
      createdAt: new Date(),
      status: insertOrder.status || 'draft',
      createdBy: insertOrder.createdBy ?? null
    };
    this.purchaseOrders.set(order.id, order);
    return order;
  }

  async updatePurchaseOrder(id: number, updateData: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder | undefined> {
    const order = this.purchaseOrders.get(id);
    if (!order) return undefined;
    const updatedOrder = { ...order, ...updateData };
    this.purchaseOrders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getPurchaseOrderItems(orderId: number): Promise<PurchaseOrderItem[]> {
    return Array.from(this.purchaseOrderItems.values()).filter(
      item => item.purchaseOrderId === orderId
    );
  }

  async createPurchaseOrderItem(insertItem: InsertPurchaseOrderItem): Promise<PurchaseOrderItem> {
    const item: PurchaseOrderItem = { ...insertItem, id: this.currentPurchaseOrderItemId++ };
    this.purchaseOrderItems.set(item.id, item);
    return item;
  }

  // Sales Order methods
  async getAllSalesOrders(): Promise<SalesOrder[]> {
    return Array.from(this.salesOrders.values());
  }

  async getSalesOrder(id: number): Promise<SalesOrder | undefined> {
    return this.salesOrders.get(id);
  }

  async createSalesOrder(insertOrder: InsertSalesOrder): Promise<SalesOrder> {
    const order: SalesOrder = {
      ...insertOrder,
      id: this.currentSalesOrderId++,
      createdAt: new Date(),
      status: insertOrder.status || 'draft',
      createdBy: insertOrder.createdBy ?? null,
      customerId: insertOrder.customerId ?? null
    };
    this.salesOrders.set(order.id, order);
    return order;
  }

  async updateSalesOrder(id: number, updateData: Partial<InsertSalesOrder>): Promise<SalesOrder | undefined> {
    const order = this.salesOrders.get(id);
    if (!order) return undefined;
    const updatedOrder = { ...order, ...updateData };
    this.salesOrders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getSalesOrderItems(orderId: number): Promise<SalesOrderItem[]> {
    return Array.from(this.salesOrderItems.values()).filter(
      item => item.salesOrderId === orderId
    );
  }

  async createSalesOrderItem(insertItem: InsertSalesOrderItem): Promise<SalesOrderItem> {
    const item: SalesOrderItem = { ...insertItem, id: this.currentSalesOrderItemId++ };
    this.salesOrderItems.set(item.id, item);
    return item;
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{
    totalProducts: number;
    lowStockItems: number;
    todaySales: number;
    expiringSoon: number;
  }> {
    const totalProducts = this.products.size;
    const lowStockItems = Array.from(this.products.values()).filter(
      p => p.currentStock <= p.minStockLevel
    ).length;

    // Calculate today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = Array.from(this.salesOrders.values()).filter(
      order => order.createdAt >= today && order.status === 'completed'
    );
    const todaySales = todayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);

    return {
      totalProducts,
      lowStockItems,
      todaySales,
      expiringSoon: 0 // Simplified for now
    };
  }
}

export const storage = new MemStorage();
