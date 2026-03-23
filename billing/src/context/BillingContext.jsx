import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  productService, categoryService, customerService, posService, 
  inventoryService, supplierService, purchaseService, reportService, 
  expenseService, userService, settingService, notificationService 
} from '../utils/api';

const BillingContext = createContext();

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};

export const BillingProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [pos, setPos] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [reports, setReports] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [inventoryHistory, setInventoryHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [
        prodRes, catRes, custRes, posRes, invRes, 
        suppRes, purchRes, expRes, userRes, setRes, notifRes
      ] = await Promise.allSettled([
        productService.getAll(),
        categoryService.getAll(),
        customerService.getAll(),
        posService.getAll(),
        inventoryService.getAll(),
        supplierService.getAll(),
        purchaseService.getAll(),
        expenseService.getAll(),
        userService.getAll(),
        settingService.getAll(),
        notificationService.getAll()
      ]);

      if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data);
      if (catRes.status === 'fulfilled') setCategories(catRes.value.data);
      if (custRes.status === 'fulfilled') setCustomers(custRes.value.data);
      if (posRes.status === 'fulfilled') setPos(posRes.value.data);
      if (invRes.status === 'fulfilled') setInventory(invRes.value.data);
      if (suppRes.status === 'fulfilled') setSuppliers(suppRes.value.data);
      if (purchRes.status === 'fulfilled') setPurchases(purchRes.value.data);
      if (expRes.status === 'fulfilled') setExpenses(expRes.value.data);
      if (userRes.status === 'fulfilled') setUsers(userRes.value.data);
      if (setRes.status === 'fulfilled') setSettings(setRes.value.data);
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data);

      try {
        const reportRes = await reportService.getSummary();
        setReports(reportRes.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }

      const movementsRes = await inventoryService.getMovements();
      setInventoryHistory(movementsRes.data.map(m => ({
        ...m,
        product: m.productName,
        date: new Date(m.movementDate).toLocaleString()
      })).reverse());

      // Check for low stock and generate notifications
      if (prodRes.status === 'fulfilled' && prodRes.value.data) {
        checkLowStock(
          prodRes.value.data,
          notifRes.status === 'fulfilled' ? notifRes.value.data : undefined
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkLowStock = async (productList, currentNotifications = notifications) => {
    const lowStockThreshold = 10; // Can be dynamic from settings later
    for (const product of productList) {
      if (product.stock <= lowStockThreshold) {
        // Check if a notification for this product already exists and is unread
        const existing = currentNotifications.find(n => n.message.includes(product.name) && !n.read);
        if (!existing) {
          const newNotif = {
            title: 'Low Stock Alert',
            message: `Product ${product.name} is low on stock (${product.stock} left).`,
            type: 'LOW_STOCK',
            read: false,
            createdAt: new Date().toISOString()
          };
          const res = await notificationService.create(newNotif);
          setNotifications(prev => [res.data, ...prev]);
        }
      }
    }
  };

  // Notification Actions
  const markNotificationAsRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = async () => {
    await notificationService.clearAll();
    setNotifications([]);
  };

  const createNotification = async (title, message, type) => {
    const newNotif = {
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    const res = await notificationService.create(newNotif);
    setNotifications(prev => [res.data, ...prev]);
  };

  // Product Actions
  const addProduct = async (data) => {
    const res = await productService.create(data);
    const newProductList = [...products, res.data];
    setProducts(newProductList);
    checkLowStock(newProductList);
  };
  const updateProduct = async (id, data) => {
    const res = await productService.update(id, data);
    const newProductList = products.map(p => (p.id === id ? res.data : p));
    setProducts(newProductList);
    checkLowStock(newProductList);
  };
  const deleteProduct = async (id) => {
    await productService.delete(id);
    setProducts(products.filter(p => p.id !== id));
  };

  // Category Actions
  const addCategory = async (data) => {
    const res = await categoryService.create(data);
    setCategories([...categories, res.data]);
  };
  const updateCategory = async (id, data) => {
    const res = await categoryService.update(id, data);
    setCategories(categories.map(c => (c.id === id ? res.data : c)));
  };
  const deleteCategory = async (id) => {
    await categoryService.delete(id);
    setCategories(categories.filter(c => c.id !== id));
  };

  // Customer Actions
  const addCustomer = async (data) => {
    const res = await customerService.create(data);
    setCustomers([...customers, res.data]);
  };
  const updateCustomer = async (id, data) => {
    const res = await customerService.update(id, data);
    setCustomers(customers.map(c => (c.id === id ? res.data : c)));
  };
  const deleteCustomer = async (id) => {
    await customerService.delete(id);
    setCustomers(customers.filter(c => c.id !== id));
  };

  // POS Actions
  const completeSale = async (saleInfo) => {
    const { cart, customer, total, paymentMethod, billDiscount, gst } = saleInfo;
    
    const saleData = {
      transactionDate: new Date().toISOString(),
      totalAmount: total,
      paymentMethod: paymentMethod,
      customerId: customer?.id || null,
      subtotal: saleInfo.subtotal,
      discount: billDiscount,
      gst: gst,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.customPrice || item.price,
        itemDiscount: item.itemDiscount,
        itemDiscountType: item.itemDiscountType
      }))
    };
    
    const res = await posService.create(saleData);
    const newSale = res.data;
    setPos(prevPos => [...prevPos, newSale]);
    
    // Update Customer Balance if payment method is "Credit"
    if (paymentMethod === 'Credit' && customer?.id) {
      const updatedCustomer = {
        ...customer,
        credit: (Number(customer.credit) || 0) + Number(total)
      };
      await updateCustomer(customer.id, updatedCustomer);
    }
    
    // Update stock for each product in cart
    for (const item of cart) {
      const product = products.find(p => p.id === item.id);
      if (product) {
        const updatedStock = product.stock - item.quantity;
        await productService.update(product.id, {
          ...product,
          stock: updatedStock
        });

        // Record inventory movement
        await inventoryService.createMovement({
          productId: product.id,
          productName: product.name,
          quantity: -item.quantity,
          type: 'Stock Out',
          movementDate: new Date().toISOString()
        });
      }
    }

    // Notification for sale
    createNotification('New Sale', `Sale completed for ₹${total.toFixed(2)} via ${paymentMethod}`, 'SALE');
    
    // Refresh products and history
    const [prodRes, movementsRes] = await Promise.all([
      productService.getAll(),
      inventoryService.getMovements()
    ]);
    setProducts(prodRes.data);
    checkLowStock(prodRes.data);
    setInventoryHistory(movementsRes.data.map(m => ({
      ...m,
      product: m.productName,
      date: new Date(m.movementDate).toLocaleString()
    })).reverse());
    
    return { id: newSale.id, total: total };
  };

  // Inventory Actions
  const adjustStock = async (productId, amount, type) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const updatedProduct = {
        ...product,
        stock: product.stock + amount
      };
      await productService.update(productId, updatedProduct);
      
      // Record movement in backend
      await inventoryService.createMovement({
        productId: product.id,
        productName: product.name,
        quantity: amount,
        type: type,
        movementDate: new Date().toISOString()
      });
      
      // Refresh products and history
      const [prodRes, movementsRes] = await Promise.all([
        productService.getAll(),
        inventoryService.getMovements()
      ]);
      setProducts(prodRes.data);
      checkLowStock(prodRes.data);
      setInventoryHistory(movementsRes.data.map(m => ({
        ...m,
        product: m.productName,
        date: new Date(m.movementDate).toLocaleString()
      })).reverse());
    }
  };

  // Supplier Actions
  const addSupplier = async (data) => {
    const res = await supplierService.create(data);
    setSuppliers([...suppliers, res.data]);
  };
  const updateSupplier = async (id, data) => {
    const res = await supplierService.update(id, data);
    setSuppliers(suppliers.map(s => (s.id === id ? res.data : s)));
  };
  const deleteSupplier = async (id) => {
    await supplierService.delete(id);
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  // Purchase Actions
  const addPurchase = async (data) => {
    const res = await purchaseService.create(data);
    setPurchases([...purchases, res.data]);
    
    // Auto update stock when purchase is received (assuming simple case here)
    if (data.status === 'Received') {
      const product = products.find(p => p.name === data.productName);
      if (product) {
        await adjustStock(product.id, data.quantity, 'Purchase');
      }
    }
    createNotification('Purchase Order', `New purchase order for ${data.productName} created.`, 'PURCHASE');
  };

  // Expense Actions
  const addExpense = async (data) => {
    const res = await expenseService.create(data);
    setExpenses([...expenses, res.data]);
  };

  // User Actions
  const addUser = async (data) => {
    const res = await userService.create(data);
    setUsers([...users, res.data]);
  };
  const updateUser = async (id, data) => {
    const res = await userService.update(id, data);
    setUsers(users.map(u => (u.id === id ? res.data : u)));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(res.data);
      localStorage.setItem('currentUser', JSON.stringify(res.data));
    }
  };
  const deleteUser = async (id) => {
    await userService.delete(id);
    setUsers(users.filter(u => u.id !== id));
  };

  // Settings Actions
  const updateSettings = async (data) => {
    const settingsList = Object.keys(data).map(key => ({
      key: key,
      value: data[key] ? data[key].toString() : ""
    }));
    const res = await settingService.updateBatch(settingsList);
    setSettings(res.data);
  };

  // Auth Actions
  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const is2FAEnabled = settings.find(s => s.key === 'twoFactor')?.value === 'true';
      return { success: true, user, needs2FA: is2FAEnabled };
    }
    return { success: false, message: 'Invalid username or password' };
  };

  const completeLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const performBackup = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const backupData = {
          products, categories, customers, pos, inventory, suppliers, 
          purchases, expenses, users, settings, 
          backupDate: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartbill_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        createNotification('Backup Success', 'Your data has been backed up successfully.', 'BACKUP');
        resolve(true);
      }, 1500);
    });
  };

  return (
    <BillingContext.Provider value={{
      products, categories, customers, pos, inventory, suppliers, 
      purchases, reports, expenses, users, settings, inventoryHistory,
      notifications, markNotificationAsRead, clearNotifications,
      currentUser, login, logout, completeLogin, loading, performBackup,
      addProduct, updateProduct, deleteProduct,
      addCategory, updateCategory, deleteCategory,
      addCustomer, updateCustomer, deleteCustomer,
      completeSale, adjustStock,
      addSupplier, updateSupplier, deleteSupplier,
      addPurchase, addExpense,
      addUser, updateUser, deleteUser,
      updateSettings,
      createNotification,
      addToast,
      toasts
    }}>
      {children}
    </BillingContext.Provider>
  );
};
