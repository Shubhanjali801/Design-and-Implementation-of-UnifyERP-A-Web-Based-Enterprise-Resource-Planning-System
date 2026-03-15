import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import productReducer from "../features/products/productSlice" 
import supplierReducer from "../features/suppliers/supplierSlice"
import salesOrderReducer from "../features/salesOrders/salesOrderSlice"      
import purchaseOrderReducer from "../features/purchaseOrders/purchaseOrderSlice"
import customerReducer from "../features/customers/customerSlice"
import invoiceReducer from "../features/invoices/invoiceSlice"
import grnReducer from "../features/grn/grnSlice" 


export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        customers: customerReducer,
        suppliers: supplierReducer,
        salesOrders: salesOrderReducer,
        purchaseOrders: purchaseOrderReducer,
        invoices: invoiceReducer,
        grn: grnReducer,
    },
})
