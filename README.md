## ERP Management System
```
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
│   │   │   ├── Product.table.jsx
│   │   │   ├── Customer.table.jsx
│   │   │   └── Protected.route.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── Suppliers.jsx
│   │   │   ├── Sales.orders.jsx
│   │   │   ├── Purchase,orders.jsx
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
│   │   │   ├── product.service.js
│   │   │   ├── order.service.js
│   │   │   └── auth.service.js
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
│   │
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── customer.controller.js
│   │   ├── supplier.controller.js
│   │   ├── sales.order.controller.js
│   │   ├── purchase.order.controller.js
│   │   ├── grn.controller.js
│   │   └── invoice.controller.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Customer.js
│   │   ├── Supplier.js
│   │   ├── Sales.order.js
│   │   ├── Purchase.order.js
│   │   ├── GRN.js
│   │   └── Invoice.js
│   │
│   ├── routes
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── customer.routes.js
│   │   ├── supplier.routes.js
│   │   ├── sales.order.routes.js
│   │   ├── purchase.order.routes.js
│   │   ├── grn.routes.js
│   │   └── invoice.routes.js
│   │
│   ├── middleware
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── utils
│   │   └── generate.token.js
│   │
│   ├── server.js
│   └── package.json
│
│
└── README.md

```