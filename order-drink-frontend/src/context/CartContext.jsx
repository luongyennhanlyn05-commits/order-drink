import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [tableNumber, setTableNumber] = useState('01');
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kopi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Tự động lưu giỏ hàng vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kopi_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Lỗi khi lưu giỏ hàng:', e);
    }
  }, [cartItems]);

  // Tạo key phân biệt các tùy chỉnh của cùng 1 món
  const generateItemKey = (item) => {
    const toppingsKey = (item.toppings || []).slice().sort().join('-');
    return `${item.productId}_${item.size}_${toppingsKey}_${item.note || ''}`;
  };

  // Thêm món vào giỏ
  const addToCart = (newItem) => {
    const key = generateItemKey(newItem);
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === key);
      if (existingIndex > -1) {
        // Tăng số lượng
        const updated = [...prev];
        const updatedQty = updated[existingIndex].quantity + newItem.quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updatedQty,
          itemTotal: updated[existingIndex].unitPrice * updatedQty,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            ...newItem,
            key,
            itemTotal: newItem.unitPrice * newItem.quantity,
          },
        ];
      }
    });
  };

  // Thay đổi số lượng món (+1 hoặc -1)
  const updateQuantity = (key, delta) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.key === key) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              itemTotal: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Xóa món khỏi giỏ
  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  // Xóa sạch giỏ hàng (khi đã đặt đơn thành công)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('kopi_cart');
  };

  // Tổng số món
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Tổng tiền
  const totalAmount = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  return (
    <CartContext.Provider
      value={{
        tableNumber,
        setTableNumber,
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalCount,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
