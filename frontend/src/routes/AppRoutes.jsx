import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./protectedRoute"
import MainLayout from "../components/layout/MainLayout"
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import DashboardPage from "../pages/dashboard/DashboardPage"
import ProductsPage from "../pages/products/ProductsPage"
import CustomersPage from "../pages/customers/CustomersPage"
import SuppliersPage from "../pages/suppliers/SuppliersPage"
import SalesOrdersPage from "../pages/salesOrders/SalesOrdersPage"
import PurchaseOrdersPage from "../pages/purchaseOrders/PurchaseOrdersPage"
import GRNPage from "../pages/grn/GRNPage"
import InvoicesPage from "../pages/invoices/InvoicesPage"
import UsersPage from "../pages/admin/UsersPage" 
const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
    <Route path="/" element={<Navigate to="/register" />} />

    <Route path="/" element={
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    }>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="customers" element={<CustomersPage />} />
      <Route path="suppliers" element={<SuppliersPage />} />
      <Route path="sales-orders" element={<SalesOrdersPage />} />
      <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
      <Route path="grn" element={<GRNPage />} />
      <Route path="invoices" element={<InvoicesPage />} />
      <Route path="admin/users" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <UsersPage />
        </ProtectedRoute>
      } />
    </Route>
  </Routes>
)

export default AppRoutes