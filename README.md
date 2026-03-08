## ERP Management System
erp-management-system
│
├── client (React Frontend)
│   ├── public
│   │
│   ├── src
│   │   ├── assets
│   │   │   ├── images
│   │   │   └── icons
│   │   │
│   │   ├── components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProductTable.jsx
│   │   │   ├── CustomerTable.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── Suppliers.jsx
│   │   │   ├── SalesOrders.jsx
│   │   │   ├── PurchaseOrders.jsx
│   │   │   ├── GRN.jsx
│   │   │   ├── Invoices.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── redux / context
│   │   │   ├── store.js
│   │   │   └── authSlice.js
│   │   │
│   │   ├── services
│   │   │   ├── api.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   └── authService.js
│   │   │
│   │   ├── utils
│   │   │   └── helpers.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
│
├── server (Node + Express Backend)
│
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── customerController.js
│   │   ├── supplierController.js
│   │   ├── salesOrderController.js
│   │   ├── purchaseOrderController.js
│   │   ├── grnController.js
│   │   └── invoiceController.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Customer.js
│   │   ├── Supplier.js
│   │   ├── SalesOrder.js
│   │   ├── PurchaseOrder.js
│   │   ├── GRN.js
│   │   └── Invoice.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── supplierRoutes.js
│   │   ├── salesOrderRoutes.js
│   │   ├── purchaseOrderRoutes.js
│   │   ├── grnRoutes.js
│   │   └── invoiceRoutes.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── utils
│   │   └── generateToken.js
│   │
│   ├── server.js
│   └── package.json
│
│
└── README.md