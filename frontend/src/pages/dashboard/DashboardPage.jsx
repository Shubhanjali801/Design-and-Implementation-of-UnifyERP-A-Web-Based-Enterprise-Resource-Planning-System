// src/pages/dashboard/DashboardPage.jsx
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProducts } from "../../features/products/productSlice"
import { getCustomers } from "../../features/customers/customerSlice"
import { getSalesOrders } from "../../features/salesOrders/salesOrderSlice"
import { getPurchaseOrders } from "../../features/purchaseOrders/purchaseOrderSlice"
import { getInvoices } from "../../features/invoices/invoiceSlice"

import {
  Box, Grid, Card, CardContent, Typography,
  CircularProgress, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Divider
} from "@mui/material"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts"

import InventoryIcon    from "@mui/icons-material/Inventory"
import PeopleIcon       from "@mui/icons-material/People"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import DescriptionIcon  from "@mui/icons-material/Description"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import ShoppingBagIcon  from "@mui/icons-material/ShoppingBag"
import TrendingUpIcon   from "@mui/icons-material/TrendingUp"

// ── Palette ────────────────────────────────────────────────────
const ACCENT = {
  blue:   "#3b82f6",
  green:  "#22c55e",
  amber:  "#f59e0b",
  purple: "#a855f7",
  cyan:   "#06b6d4",
  red:    "#ef4444",
}

const PIE_COLORS = [ACCENT.amber, ACCENT.blue, ACCENT.green, ACCENT.red, ACCENT.purple]

const STATUS_COLOR = {
  delivered: "success",
  cancelled:  "error",
  shipped:    "primary",
  confirmed:  "info",
  pending:    "warning",
}

// ── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: "0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06)",
      border: "1px solid rgba(0,0,0,.06)",
      height: "100%",
      transition: "box-shadow .2s, transform .2s",
      "&:hover": { boxShadow: "0 8px 32px rgba(0,0,0,.12)", transform: "translateY(-2px)" },
    }}
  >
    <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: .5, textTransform: "uppercase", fontSize: "0.68rem" }}>
          {title}
        </Typography>
        <Box sx={{ bgcolor: `${color}18`, borderRadius: 2, p: 1, display: "flex", color }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" fontWeight={800} sx={{ color: "text.primary", lineHeight: 1, mb: 0.5 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: "text.secondary", display: "flex", alignItems: "center", gap: .5 }}>
          {trend && <TrendingUpIcon sx={{ fontSize: 13, color: ACCENT.green }} />}
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
)

// ── Section Header ─────────────────────────────────────────────
const SectionHeader = ({ title, subtitle }) => (
  <Box mb={1.5}>
    <Typography variant="subtitle1" fontWeight={700} sx={{ color: "text.primary" }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
    )}
  </Box>
)

// ── Custom Tooltip ─────────────────────────────────────────────
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <Box sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 2, px: 2, py: 1, boxShadow: 3 }}>
      <Typography variant="caption" fontWeight={700}>{label}</Typography>
      <Typography variant="body2" color={ACCENT.blue}>{payload[0].value} invoices</Typography>
    </Box>
  )
}

const DashboardPage = () => {
  const dispatch = useDispatch()

  const { items: products,       isLoading: loadingProducts }  = useSelector((s) => s.products      ?? {})
  const { items: customers,      isLoading: loadingCustomers } = useSelector((s) => s.customers     ?? {})
  const { items: salesOrders,    total: totalSales }           = useSelector((s) => s.salesOrders   ?? {})
  const { items: purchaseOrders }                              = useSelector((s) => s.purchaseOrders ?? {})
  const { items: invoices }                                    = useSelector((s) => s.invoices       ?? {})

  useEffect(() => {
    dispatch(getProducts({ page: 1, limit: 100 }))
    dispatch(getCustomers({ page: 1, limit: 100 }))
    dispatch(getSalesOrders({ page: 1, limit: 100 }))
    dispatch(getPurchaseOrders({ page: 1, limit: 100 }))
    dispatch(getInvoices({ page: 1, limit: 100 }))
  }, [dispatch])

  // ── Derived Stats ────────────────────────────────────────────
  const lowStockProducts = (products ?? []).filter(p => p.stock <= p.reorderLevel)

  const totalRevenue = (invoices ?? [])
    .filter(i => i.status === "paid")
    .reduce((sum, i) => sum + i.totalAmount, 0)

  const pendingSalesOrders    = (salesOrders    ?? []).filter(o => o.status === "pending").length
  const pendingPurchaseOrders = (purchaseOrders ?? []).filter(o => o.status === "pending").length

  const salesStatusData = ["pending","confirmed","shipped","delivered","cancelled"].map(status => ({
    name:  status.charAt(0).toUpperCase() + status.slice(1),
    value: (salesOrders ?? []).filter(o => o.status === status).length,
  })).filter(d => d.value > 0)

  const invoiceStatusData = ["draft","sent","paid","overdue","cancelled"].map(status => ({
    name:  status.charAt(0).toUpperCase() + status.slice(1),
    value: (invoices ?? []).filter(i => i.status === status).length,
  }))

  if (loadingProducts || loadingCustomers) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: "100%" }}>
      {/* ── Page Header ─────────────────────────────────────── */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: "text.primary", letterSpacing: -.3 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Live snapshot of your business
          </Typography>
        </Box>
      </Box>

      {/* ── Stat Cards ──────────────────────────────────────── */}
      <Grid container spacing={2} mb={3}>
        {[
          { title: "Total Products",    value: products?.length ?? 0,             icon: <InventoryIcon fontSize="small" />,    color: ACCENT.blue,   subtitle: `${lowStockProducts.length} low stock` },
          { title: "Total Customers",   value: customers?.length ?? 0,            icon: <PeopleIcon fontSize="small" />,       color: ACCENT.green,  subtitle: "Active accounts" },
          { title: "Total Sales Orders",value: totalSales ?? 0,                   icon: <ShoppingCartIcon fontSize="small" />, color: ACCENT.amber,  subtitle: `${pendingSalesOrders} pending` },
          { title: "Total Revenue",     value: `₹${totalRevenue.toLocaleString()}`,icon: <DescriptionIcon fontSize="small" />, color: ACCENT.purple, subtitle: "From paid invoices", trend: true },
          { title: "Purchase Orders",   value: purchaseOrders?.length ?? 0,       icon: <ShoppingBagIcon fontSize="small" />,  color: ACCENT.cyan,   subtitle: `${pendingPurchaseOrders} pending` },
          { title: "Low Stock Alerts",  value: lowStockProducts.length,           icon: <WarningAmberIcon fontSize="small" />, color: ACCENT.red,    subtitle: "Need reorder" },
        ].map((card) => (
          <Grid item xs={6} sm={4} md={2} key={card.title}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* ── Charts Row ──────────────────────────────────────── */}
      <Grid container spacing={2} mb={3}>

        {/* Sales Order Status — Pie */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,.08)", border: "1px solid rgba(0,0,0,.06)", height: "100%" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <SectionHeader title="Sales Orders by Status" subtitle={`${salesOrders?.length ?? 0} total orders`} />
              {salesStatusData.length === 0 ? (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 220 }}>
                  <Typography color="text.secondary" variant="body2">No sales orders yet</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Pie
                      data={salesStatusData}
                      cx="50%" cy="45%"
                      innerRadius={55}
                      outerRadius={85}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {salesStatusData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,.08)" }}
                      formatter={(v, n) => [`${v} orders`, n]}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Invoice Status — Bar */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,.08)", border: "1px solid rgba(0,0,0,.06)", height: "100%" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <SectionHeader title="Invoice Status Overview" subtitle={`${invoices?.length ?? 0} total invoices`} />
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={invoiceStatusData} barSize={32} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(59,130,246,.06)" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {invoiceStatusData.map((entry, i) => {
                      const colors = [ACCENT.blue, ACCENT.cyan, ACCENT.green, ACCENT.red, ACCENT.amber]
                      return <Cell key={i} fill={colors[i % colors.length]} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Revenue Summary */}
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,.08)", border: "1px solid rgba(0,0,0,.06)", height: "100%", background: `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)` }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 }, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,.5)", fontWeight: 600, letterSpacing: .5, textTransform: "uppercase", fontSize: "0.68rem" }}>
                  Revenue Summary
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ color: "#fff", mt: 1, mb: 0.5 }}>
                  ₹{totalRevenue.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,.45)" }}>
                  Total from paid invoices
                </Typography>
              </Box>

              <Box>
                {[
                  { label: "Paid Invoices",    value: (invoices ?? []).filter(i => i.status === "paid").length,    color: ACCENT.green },
                  { label: "Overdue",          value: (invoices ?? []).filter(i => i.status === "overdue").length, color: ACCENT.red },
                  { label: "Draft / Sent",     value: (invoices ?? []).filter(i => ["draft","sent"].includes(i.status)).length, color: ACCENT.amber },
                ].map((item) => (
                  <Box key={item.label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: item.color }} />
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,.6)", fontSize: 11 }}>{item.label}</Typography>
                    </Box>
                    <Typography variant="caption" fontWeight={700} sx={{ color: item.color }}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,.1)", my: 1 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,.4)", fontSize: 10 }}>Sales Orders</Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,.4)", fontSize: 10 }}>{salesOrders?.length ?? 0} total</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* ── Bottom Tables Row ────────────────────────────────── */}
      <Grid container spacing={2}>

        {/* Low Stock Products */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,.08)", border: "1px solid rgba(0,0,0,.06)", height: "100%" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Box sx={{ bgcolor: `${ACCENT.red}15`, borderRadius: 1.5, p: .6, display: "flex", color: ACCENT.red }}>
                  <WarningAmberIcon sx={{ fontSize: 16 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={700}>Low Stock Products</Typography>
                {lowStockProducts.length > 0 && (
                  <Chip label={lowStockProducts.length} size="small" sx={{ bgcolor: ACCENT.red, color: "#fff", fontWeight: 700, height: 20, fontSize: 11, ml: "auto" }} />
                )}
              </Box>
              {lowStockProducts.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">✅ All products are sufficiently stocked</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ "& th": { color: "text.secondary", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: .4, borderBottom: "2px solid", borderColor: "divider", py: 1 } }}>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">Stock</TableCell>
                        <TableCell align="center">Reorder</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lowStockProducts.slice(0, 6).map(p => (
                        <TableRow key={p._id} sx={{ "&:hover": { bgcolor: "rgba(0,0,0,.02)" }, "& td": { py: 1.2, fontSize: 13 } }}>
                          <TableCell sx={{ fontWeight: 500 }}>{p.title}</TableCell>
                          <TableCell align="center">
                            <Chip label={p.stock} size="small" sx={{ bgcolor: `${ACCENT.red}15`, color: ACCENT.red, fontWeight: 700, fontSize: 11, height: 22 }} />
                          </TableCell>
                          <TableCell align="center" sx={{ color: "text.secondary" }}>{p.reorderLevel}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Sales Orders */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,.08)", border: "1px solid rgba(0,0,0,.06)", height: "100%" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Box sx={{ bgcolor: `${ACCENT.amber}15`, borderRadius: 1.5, p: .6, display: "flex", color: ACCENT.amber }}>
                  <ShoppingCartIcon sx={{ fontSize: 16 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={700}>Recent Sales Orders</Typography>
                <Chip label={`${salesOrders?.length ?? 0} total`} size="small" variant="outlined" sx={{ fontSize: 11, height: 20, ml: "auto" }} />
              </Box>
              {(salesOrders ?? []).length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">No sales orders yet</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ "& th": { color: "text.secondary", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: .4, borderBottom: "2px solid", borderColor: "divider", py: 1 } }}>
                        <TableCell>Customer</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(salesOrders ?? []).slice(0, 7).map(order => (
                        <TableRow key={order._id} sx={{ "&:hover": { bgcolor: "rgba(0,0,0,.02)" }, "& td": { py: 1.2, fontSize: 13 } }}>
                          <TableCell sx={{ fontWeight: 500 }}>{order.customer?.name || "—"}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                            ₹{order.totalPrice?.toLocaleString()}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={order.status}
                              size="small"
                              color={STATUS_COLOR[order.status] ?? "default"}
                              sx={{ textTransform: "capitalize", fontWeight: 600, fontSize: 11, height: 22 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  )
}

export default DashboardPage
