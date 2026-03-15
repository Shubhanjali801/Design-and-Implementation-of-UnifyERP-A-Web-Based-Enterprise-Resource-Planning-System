// // src/pages/invoices/InvoicesPage.jsx
// import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { getInvoices, editInvoice, removeInvoice } from "../../features/invoices/invoiceSlice"
// import jsPDF from "jspdf"
// 
// import {
//   Box, Button, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, IconButton, Typography,
//   Pagination, CircularProgress, Chip, MenuItem, Select,
//   TextField, InputAdornment
// } from "@mui/material"
// import AddIcon        from "@mui/icons-material/Add"
// import DeleteIcon     from "@mui/icons-material/Delete"
// import DownloadIcon   from "@mui/icons-material/Download"
// import SearchIcon     from "@mui/icons-material/Search"
// 
// import InvoiceForm from "./InvoiceDetail"
// 
// // ── Constants ──────────────────────────────────────────────────
// const COMPANY = {
//   name:    "Unify ERP Solutions Pvt. Ltd.",
//   address: "123, Business Park, Sector 18",
//   city:    "Noida, Uttar Pradesh - 201301",
//   phone:   "+91 98765 43210",
//   email:   "billing@unifyerp.com",
//   gstin:   "09ABCDE1234F1Z5",
// }
// 
// const STATUS_COLORS = {
//   draft:     "default",
//   sent:      "info",
//   paid:      "success",
//   overdue:   "error",
//   cancelled: "error",
// }
// 
// // ── Helpers ────────────────────────────────────────────────────
// const fmt     = (n) => Number(n ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })
// const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"
// 
// // ── PDF Generator ──────────────────────────────────────────────
// const generateInvoicePDF = (invoice) => {
//   const doc = new jsPDF({ unit: "pt", format: "a4" })
//   const W      = doc.internal.pageSize.getWidth()   // 595
//   const pageH  = doc.internal.pageSize.getHeight()  // 842
//   const margin = 40
// 
//   // helpers
//   const rect = (x, y, w, h, fill) => {
//     doc.setFillColor(...fill)
//     doc.roundedRect(x, y, w, h, 4, 4, "F")
//   }
//   const hline = (y, x1 = margin, x2 = W - margin, color = [220, 220, 220]) => {
//     doc.setDrawColor(...color)
//     doc.setLineWidth(0.5)
//     doc.line(x1, y, x2, y)
//   }
//   const t = (str, x, y, opts = {}) => doc.text(String(str ?? ""), x, y, opts)
// 
//   // ── HEADER BAND ──────────────────────────────────────────────
//   rect(0, 0, W, 88, [15, 32, 64])
// 
//   doc.setFont("helvetica", "bold")
//   doc.setFontSize(20)
//   doc.setTextColor(255, 255, 255)
//   t(COMPANY.name, margin, 36)
// 
//   doc.setFont("helvetica", "normal")
//   doc.setFontSize(8.5)
//   doc.setTextColor(170, 195, 230)
//   t(`${COMPANY.address}, ${COMPANY.city}`, margin, 50)
//   t(`Ph: ${COMPANY.phone}   |   ${COMPANY.email}   |   GSTIN: ${COMPANY.gstin}`, margin, 63)
// 
//   // INVOICE title right side
//   doc.setFont("helvetica", "bold")
//   doc.setFontSize(26)
//   doc.setTextColor(255, 255, 255)
//   t("INVOICE", W - margin, 40, { align: "right" })
// 
//   doc.setFont("helvetica", "normal")
//   doc.setFontSize(9)
//   doc.setTextColor(150, 185, 220)
//   t(`No. ${invoice.invoiceNumber}`, W - margin, 55, { align: "right" })
// 
//   // Status badge
//   const statusBg = {
//     paid:      [34,  197, 94],
//     overdue:   [239, 68,  68],
//     cancelled: [107, 114, 128],
//     sent:      [59,  130, 246],
//     draft:     [156, 163, 175],
//   }[invoice.status] ?? [156, 163, 175]
// 
//   rect(W - margin - 68, 62, 68, 18, statusBg)
//   doc.setFont("helvetica", "bold")
//   doc.setFontSize(8)
//   doc.setTextColor(255, 255, 255)
//   t(invoice.status.toUpperCase(), W - margin - 34, 74.5, { align: "center" })
// 
//   // ── INFO BOXES: Invoice Details + Sold By + Bill To ───────────
//   let y = 108
// 
//   // — Sold By (left) —
//   rect(margin, y, 155, 108, [245, 247, 250])
//   doc.setFont("helvetica", "bold")
//   doc.setFontSize(8)
//   doc.setTextColor(100, 100, 100)
//   t("SOLD BY", margin + 10, y + 16)
//   hline(y + 21, margin + 6, margin + 149, [215, 215, 220])
// 
//   doc.setFont("helvetica", "bold")
//   doc.setFontSize(9)
//   doc.setTextColor(15, 23, 42)
//   t(COMPANY.name, margin + 10, y + 34)
// 
//   doc.setFont("helvetica", "normal")
//   doc.setFontSize(8.5)
//   doc.setTextColor(90, 90, 90)
//   t(COMPANY.address,               margin + 10, y + 48)
//   t(COMPANY.city,                  margin + 10, y + 62)
//   t(`Ph: ${COMPANY.phone}`,        margin + 10, y + 76)
//   t(`GSTIN: ${COMPANY.gstin}`,     margin + 10, y + 90)
// 
//   // — Bill To (center) —
//   const customer = invoice.salesOrder?.customer
//   rect(margin + 165, y, 190, 108, [245, 247, 250])
//   doc.setFont("helvetica", "bold")
//   doc.setFontSize(8)
//   doc.setTextColor(100, 100, 100)
//   // t("BILL TO", margin + 175, y + 16)
//   t(customer?.name, margin + 175, y + 16)
//   hline(y + 21, margin + 171, margin + 349, [215, 215, 220])
// 
// //   // no "BILL TO" label at all
// // t(customer?.name, margin + 175, y + 16)  // ← name IS the header
// // hline(...)
// // email, phone, address follow below
//   doc.setFont("helvetica", "bold")
//   doc.setFontSize(9)
//   doc.setTextColor(15, 23, 42)
//   t(customer?.name ?? "Customer", margin + 175, y + 34)
// 
//   doc.setFont("helvetica", "normal")
//   doc.setFontSize(8.5)
//   doc.setTextColor(90, 90, 90)
//   if (customer?.email)   t(customer.email,         margin + 175, y + 48)
//   if (customer?.phone)   t(`Ph: ${customer.phone}`, margin + 175, y + 62)
//   t(customer?.address ?? "Address not present",     margin + 175, y + 76)
// 
//   // — Invoice Details (right) —
//   rect(W - margin - 155, y, 155, 108, [245, 247, 250])
//   doc.setFont("helvetica", "bold")
//   doc.setFontSize(8)
//   doc.setTextColor(100, 100, 100)
//   t("INVOICE DETAILS", W - margin - 145, y + 16)
//   hline(y + 21, W - margin - 149, W - margin - 6, [215, 215, 220])
// 
//   const details = [
//     ["Invoice No.",   invoice.invoiceNumber],
//     ["Invoice Date",  fmtDate(invoice.createdAt)],
//     ["Due Date",      fmtDate(invoice.dueDate)],
//   ]
//   details.forEach(([label, val], i) => {
//     const ry = y + 34 + i * 18
//     doc.setFont("helvetica", "normal")
//     doc.setFontSize(8.5)
//     doc.setTextColor(120, 120, 120)
//     t(label, W - margin - 145, ry)
//     doc.setFont("helvetica", "bold")
//     doc.setTextColor(20, 20, 20)
//     t(val, W - margin - 10, ry, { align: "right" })
//   })
// 
//   // ── ITEMS TABLE ───────────────────────────────────────────────
//   y += 124
// 
//   // column x positions
//   const C = {
//     sno:     margin + 8,
//     product: margin + 30,
//     hsn:     W - 270,
//     qty:     W - 205,
//     rate:    W - 148,
//     tax:     W - 88,
//     amount:  W - margin,
//   }
// 
//   // Table header
//   rect(margin, y, W - margin * 2, 26, [15, 32, 64])
//   doc.setFont("helvetica", "bold")
//   doc.setFontSize(8.5)
//   doc.setTextColor(255, 255, 255)
//   t("#",          C.sno,     y + 17)
//   t("Product",    C.product, y + 17)
//   t("Qty",        C.qty,     y + 17, { align: "right" })
//   t("Unit Price", C.rate,    y + 17, { align: "right" })
//   t("Total",      C.amount,  y + 17, { align: "right" })
//   y += 26
// 
//   const items = invoice.items ?? []
//   items.forEach((item, i) => {
//     const rowH  = 30
//     const rowBg = i % 2 === 0 ? [255, 255, 255] : [249, 250, 251]
//     rect(margin, y, W - margin * 2, rowH, rowBg)
// 
//     const unitPrice = item.unitPrice ?? item.price ?? 0
//     const rowTotal  = item.total ?? (unitPrice * (item.quantity ?? 0))
// 
//     doc.setTextColor(130, 130, 130)
//     doc.setFont("helvetica", "normal")
//     doc.setFontSize(8.5)
//     t(String(i + 1), C.sno, y + 19)
// 
//     const name = item.product?.title ?? "Product"
//     doc.setFont("helvetica", "bold")
//     doc.setTextColor(15, 23, 42)
//     t(name.length > 42 ? name.slice(0, 40) + "…" : name, C.product, y + 19)
// 
//     doc.setFont("helvetica", "normal")
//     doc.setTextColor(60, 60, 60)
//     t(String(item.quantity ?? 0),      C.qty,    y + 19, { align: "right" })
//     t(`Rs. ${fmt(unitPrice)}`,          C.rate,   y + 19, { align: "right" })
//     doc.setFont("helvetica", "bold")
//     doc.setTextColor(15, 32, 64)
//     t(`Rs. ${fmt(rowTotal)}`,           C.amount, y + 19, { align: "right" })
// 
//     y += rowH
//   })
// 
//   hline(y, margin, W - margin, [200, 200, 210])
//   y += 18
// 
//   // ── TOTALS BLOCK ──────────────────────────────────────────────
//   const subtotal = items.reduce((s, i) => s + (i.total ?? 0), 0)
//   const taxPct   = invoice.tax      ?? 0
//   const taxAmt   = subtotal * taxPct / 100
//   const discount = invoice.discount ?? 0
//   const total    = invoice.totalAmount ?? subtotal
// 
//   const tX = W - margin - 210
// 
//   const totRows = [
//     { label: "Subtotal",               val: `Rs. ${fmt(subtotal)}` },
//     { label: `GST / Tax (${taxPct}%)`, val: `Rs. ${fmt(taxAmt)}` },
//     { label: "Discount",               val: `- Rs. ${fmt(discount)}` },
//   ]
// 
//   doc.setFontSize(9)
//   totRows.forEach(({ label, val }) => {
//     doc.setFont("helvetica", "normal")
//     doc.setTextColor(110, 110, 110)
//     t(label, tX, y)
//     doc.setFont("helvetica", "normal")
//     doc.setTextColor(30, 30, 30)
//     t(val, W - margin, y, { align: "right" })
//     y += 18
//   })
// 
//   hline(y - 3, tX, W - margin, [200, 200, 210])
//   y += 4
// 
//   rect(tX - 8, y, W - margin - tX + 8, 30, [15, 32, 64])
//   doc.setFont("helvetica", "bold")
//   doc.setFontSize(11)
//   doc.setTextColor(255, 255, 255)
//   t("GRAND TOTAL",       tX,         y + 20)
//   t(`Rs. ${fmt(total)}`, W - margin, y + 20, { align: "right" })
//   y += 46
// 
//   // ── NOTES ─────────────────────────────────────────────────────
//   if (invoice.notes) {
//     doc.setFont("helvetica", "bold")
//     doc.setFontSize(9)
//     doc.setTextColor(80, 80, 80)
//     t("Notes:", margin, y)
//     doc.setFont("helvetica", "normal")
//     doc.setTextColor(120, 120, 120)
//     t(invoice.notes, margin, y + 14)
//     y += 32
//   }
// 
//   // Terms
//   y = Math.max(y, pageH - 100)
//   hline(y, margin, W - margin, [220, 220, 225])
//   doc.setFont("helvetica", "normal")
//   doc.setFontSize(8)
//   doc.setTextColor(150, 150, 150)
//   t("Terms & Conditions: Payment is due by the date shown above. Late payments may incur additional charges.", margin, y + 14)
//   t("This is a computer-generated invoice and does not require a physical signature.", margin, y + 26)
// 
//   // ── FOOTER ────────────────────────────────────────────────────
//   rect(0, pageH - 36, W, 36, [15, 32, 64])
//   doc.setFont("helvetica", "normal")
//   doc.setFontSize(8)
//   doc.setTextColor(160, 190, 220)
//   t("Thank you for your business!", W / 2, pageH - 16, { align: "center" })
//   t(COMPANY.email,                  margin,    pageH - 16)
//   t("Page 1 of 1",                  W - margin, pageH - 16, { align: "right" })
// 
//   doc.save(`${invoice.invoiceNumber}.pdf`)
// }
// 
// // ── Page Component ─────────────────────────────────────────────
// const InvoicesPage = () => {
//   const dispatch = useDispatch()
//   const { items = [], totalPages = 1, isLoading = false } = useSelector((s) => s.invoices ?? {})
// 
//   const [page,     setPage]     = useState(1)
//   const [search,   setSearch]   = useState("")
//   const [openForm, setOpenForm] = useState(false)
// 
//   useEffect(() => {
//     dispatch(getInvoices({ page, limit: 10, search }))
//   }, [dispatch, page, search])
// 
//   const handleStatusChange = (id, status) => {
//     dispatch(editInvoice({ id, data: { status } }))
//   }
// 
//   const handleDelete = (id) => {
//     if (window.confirm("Delete this invoice?")) dispatch(removeInvoice(id))
//   }
// 
//   return (
//     <Box>
//       {/* Header */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//         <Typography variant="h5" fontWeight="bold">Invoices</Typography>
//         <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenForm(true)}>
//           Create Invoice
//         </Button>
//       </Box>
// 
//       {/* Search */}
//       <TextField
//         placeholder="Search by invoice number..."
//         size="small" sx={{ mb: 2, width: 300 }}
//         value={search}
//         onChange={(e) => { setSearch(e.target.value); setPage(1) }}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
//           )
//         }}
//       />
// 
//       {/* Table */}
//       <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//         <Table>
//           <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//             <TableRow>
//               <TableCell><b>Invoice No</b></TableCell>
//               <TableCell><b>Customer</b></TableCell>
//               <TableCell><b>Total</b></TableCell>
//               <TableCell><b>Due Date</b></TableCell>
//               <TableCell><b>Status</b></TableCell>
//               <TableCell><b>Actions</b></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {isLoading ? (
//               <TableRow>
//                 <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
//                   <CircularProgress />
//                 </TableCell>
//               </TableRow>
//             ) : items.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
//                   <Typography color="text.secondary">No invoices found</Typography>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               items.map((invoice) => (
//                 <TableRow key={invoice._id} hover>
//                   <TableCell sx={{ fontWeight: 600 }}>{invoice.invoiceNumber}</TableCell>
//                   <TableCell>{invoice.salesOrder?.customer?.name || "—"}</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>
//                     ₹{Number(invoice.totalAmount ?? 0).toLocaleString("en-IN")}
//                   </TableCell>
//                   <TableCell>{fmtDate(invoice.dueDate)}</TableCell>
//                   <TableCell>
//                     {invoice.status === "paid" || invoice.status === "cancelled" ? (
//                       <Chip
//                         label={invoice.status}
//                         color={STATUS_COLORS[invoice.status]}
//                         size="small"
//                         sx={{ textTransform: "capitalize" }}
//                       />
//                     ) : (
//                       <Select
//                         value={invoice.status}
//                         size="small"
//                         onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
//                         sx={{ fontSize: 13 }}
//                       >
//                         {["draft", "sent", "paid", "overdue", "cancelled"].map(s => (
//                           <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>{s}</MenuItem>
//                         ))}
//                       </Select>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <IconButton color="primary" title="Download PDF" onClick={() => generateInvoicePDF(invoice)}>
//                       <DownloadIcon fontSize="small" />
//                     </IconButton>
//                     <IconButton
//                       color="error"
//                       title="Delete"
//                       disabled={invoice.status === "paid"}
//                       onClick={() => handleDelete(invoice._id)}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
// 
//       {/* Pagination */}
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//         <Pagination
//           count={totalPages} page={page}
//           onChange={(_, val) => setPage(val)} color="primary"
//         />
//       </Box>
// 
//       <InvoiceForm open={openForm} onClose={() => setOpenForm(false)} />
//     </Box>
//   )
// }
// 
// export default InvoicesPage


// src/pages/invoices/InvoicesPage.jsx
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getInvoices, editInvoice, removeInvoice } from "../../features/invoices/invoiceSlice"
import jsPDF from "jspdf"

import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography,
  Pagination, CircularProgress, Chip, MenuItem, Select,
  TextField, InputAdornment
} from "@mui/material"
import AddIcon        from "@mui/icons-material/Add"
import DeleteIcon     from "@mui/icons-material/Delete"
import DownloadIcon   from "@mui/icons-material/Download"
import SearchIcon     from "@mui/icons-material/Search"

import InvoiceForm from "./InvoiceDetail"

// ── Constants ──────────────────────────────────────────────────
const COMPANY = {
  name:    "Unify ERP Solutions Pvt. Ltd.",
  address: "123, Business Park, Sector 18",
  city:    "Noida, Uttar Pradesh - 201301",
  phone:   "+91 98765 43210",
  email:   "billing@unifyerp.com",
  gstin:   "09ABCDE1234F1Z5",
}

const STATUS_COLORS = {
  draft:     "default",
  sent:      "info",
  paid:      "success",
  overdue:   "error",
  cancelled: "error",
}

// ── Helpers ────────────────────────────────────────────────────
const fmt     = (n) => Number(n ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"

// ── PDF Generator ──────────────────────────────────────────────
const generateInvoicePDF = (invoice) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const W      = doc.internal.pageSize.getWidth()
  const pageH  = doc.internal.pageSize.getHeight()
  const margin = 40

  const rect = (x, y, w, h, fill) => {
    doc.setFillColor(...fill)
    doc.roundedRect(x, y, w, h, 4, 4, "F")
  }
  const hline = (y, x1 = margin, x2 = W - margin, color = [220, 220, 220]) => {
    doc.setDrawColor(...color)
    doc.setLineWidth(0.5)
    doc.line(x1, y, x2, y)
  }
  const t = (str, x, y, opts = {}) => doc.text(String(str ?? ""), x, y, opts)

  // ── HEADER BAND ──────────────────────────────────────────────
  rect(0, 0, W, 88, [15, 32, 64])

  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.setTextColor(255, 255, 255)
  t(COMPANY.name, margin, 36)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(170, 195, 230)
  t(`${COMPANY.address}, ${COMPANY.city}`, margin, 50)
  t(`Ph: ${COMPANY.phone}   |   ${COMPANY.email}   |   GSTIN: ${COMPANY.gstin}`, margin, 63)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(26)
  doc.setTextColor(255, 255, 255)
  t("INVOICE", W - margin, 40, { align: "right" })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(150, 185, 220)
  t(`No. ${invoice.invoiceNumber}`, W - margin, 55, { align: "right" })

  // Status badge
  const statusBg = {
    paid:      [34,  197, 94],
    overdue:   [239, 68,  68],
    cancelled: [107, 114, 128],
    sent:      [59,  130, 246],
    draft:     [156, 163, 175],
  }[invoice.status] ?? [156, 163, 175]

  rect(W - margin - 68, 62, 68, 18, statusBg)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  t(invoice.status.toUpperCase(), W - margin - 34, 74.5, { align: "center" })

  // ── INVOICE DETAILS BOX ONLY ──────────────────────────────────
  let y = 108

  rect(margin, y, W - margin * 2, 70, [245, 247, 250])
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  t("INVOICE DETAILS", margin + 10, y + 16)
  hline(y + 21, margin + 6, W - margin - 6, [215, 215, 220])

  const details = [
    ["Invoice No.",  invoice.invoiceNumber],
    ["Invoice Date", fmtDate(invoice.createdAt)],
    ["Due Date",     fmtDate(invoice.dueDate)],
  ]

  details.forEach(([label, val], i) => {
    const col  = Math.floor(i / 2)
    const row  = i % 2
    const dx   = margin + 10 + col * 200
    const dy   = y + 34 + row * 18

    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    doc.setTextColor(120, 120, 120)
    t(label, dx, dy)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(20, 20, 20)
    t(val, dx + 80, dy)
  })

  // ── ITEMS TABLE ───────────────────────────────────────────────
  y += 86

  const C = {
    sno:     margin + 8,
    product: margin + 30,
    qty:     W - 205,
    rate:    W - 148,
    amount:  W - margin,
  }

  rect(margin, y, W - margin * 2, 26, [15, 32, 64])
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.setTextColor(255, 255, 255)
  t("#",          C.sno,     y + 17)
  t("Product",    C.product, y + 17)
  t("Qty",        C.qty,     y + 17, { align: "right" })
  t("Unit Price", C.rate,    y + 17, { align: "right" })
  t("Total",      C.amount,  y + 17, { align: "right" })
  y += 26

  const items = invoice.items ?? []
  items.forEach((item, i) => {
    const rowH  = 30
    const rowBg = i % 2 === 0 ? [255, 255, 255] : [249, 250, 251]
    rect(margin, y, W - margin * 2, rowH, rowBg)

    const unitPrice = item.unitPrice ?? item.price ?? 0
    const rowTotal  = item.total ?? (unitPrice * (item.quantity ?? 0))

    doc.setTextColor(130, 130, 130)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    t(String(i + 1), C.sno, y + 19)

    const name = item.product?.title ?? "Product"
    doc.setFont("helvetica", "bold")
    doc.setTextColor(15, 23, 42)
    t(name.length > 42 ? name.slice(0, 40) + "…" : name, C.product, y + 19)

    doc.setFont("helvetica", "normal")
    doc.setTextColor(60, 60, 60)
    t(String(item.quantity ?? 0), C.qty,    y + 19, { align: "right" })
    t(`Rs. ${fmt(unitPrice)}`,     C.rate,   y + 19, { align: "right" })
    doc.setFont("helvetica", "bold")
    doc.setTextColor(15, 32, 64)
    t(`Rs. ${fmt(rowTotal)}`,      C.amount, y + 19, { align: "right" })

    y += rowH
  })

  hline(y, margin, W - margin, [200, 200, 210])
  y += 18

  // ── TOTALS BLOCK ──────────────────────────────────────────────
  const subtotal = items.reduce((s, i) => s + (i.total ?? 0), 0)
  const taxPct   = invoice.tax      ?? 0
  const taxAmt   = subtotal * taxPct / 100
  const discount = invoice.discount ?? 0
  const total    = invoice.totalAmount ?? subtotal
  const tX       = W - margin - 210

  ;[
    { label: "Subtotal",               val: `Rs. ${fmt(subtotal)}` },
    { label: `GST / Tax (${taxPct}%)`, val: `Rs. ${fmt(taxAmt)}` },
    { label: "Discount",               val: `- Rs. ${fmt(discount)}` },
  ].forEach(({ label, val }) => {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(110, 110, 110)
    t(label, tX, y)
    doc.setTextColor(30, 30, 30)
    t(val, W - margin, y, { align: "right" })
    y += 18
  })

  hline(y - 3, tX, W - margin, [200, 200, 210])
  y += 4

  rect(tX - 8, y, W - margin - tX + 8, 30, [15, 32, 64])
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  t("GRAND TOTAL",       tX,         y + 20)
  t(`Rs. ${fmt(total)}`, W - margin, y + 20, { align: "right" })
  y += 46

  // ── NOTES ─────────────────────────────────────────────────────
  if (invoice.notes) {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    t("Notes:", margin, y)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(120, 120, 120)
    t(invoice.notes, margin, y + 14)
    y += 32
  }

  // ── TERMS ─────────────────────────────────────────────────────
  y = Math.max(y, pageH - 100)
  hline(y, margin, W - margin, [220, 220, 225])
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  t("Terms & Conditions: Payment is due by the date shown above. Late payments may incur additional charges.", margin, y + 14)
  t("This is a computer-generated invoice and does not require a physical signature.", margin, y + 26)

  // ── FOOTER ────────────────────────────────────────────────────
  rect(0, pageH - 36, W, 36, [15, 32, 64])
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(160, 190, 220)
  t("Thank you for your business!", W / 2, pageH - 16, { align: "center" })
  t(COMPANY.email,  margin,     pageH - 16)
  t("Page 1 of 1", W - margin, pageH - 16, { align: "right" })

  doc.save(`${invoice.invoiceNumber}.pdf`)
}

// ── Page Component ─────────────────────────────────────────────
const InvoicesPage = () => {
  const dispatch = useDispatch()
  const { items = [], totalPages = 1, isLoading = false } = useSelector((s) => s.invoices ?? {})

  const [page,     setPage]     = useState(1)
  const [search,   setSearch]   = useState("")
  const [openForm, setOpenForm] = useState(false)

  useEffect(() => {
    dispatch(getInvoices({ page, limit: 10, search }))
  }, [dispatch, page, search])

  const handleStatusChange = (id, status) => {
    dispatch(editInvoice({ id, data: { status } }))
  }

  const handleDelete = (id) => {
    if (window.confirm("Delete this invoice?")) dispatch(removeInvoice(id))
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Invoices</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenForm(true)}>
          Create Invoice
        </Button>
      </Box>

      <TextField
        placeholder="Search by invoice number..."
        size="small" sx={{ mb: 2, width: 300 }}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
          )
        }}
      />

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Invoice No</b></TableCell>
              <TableCell><b>Customer</b></TableCell>
              <TableCell><b>Total</b></TableCell>
              <TableCell><b>Due Date</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No invoices found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((invoice) => (
                <TableRow key={invoice._id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.salesOrder?.customer?.name || "—"}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    ₹{Number(invoice.totalAmount ?? 0).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>{fmtDate(invoice.dueDate)}</TableCell>
                  <TableCell>
                    {invoice.status === "paid" || invoice.status === "cancelled" ? (
                      <Chip
                        label={invoice.status}
                        color={STATUS_COLORS[invoice.status]}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    ) : (
                      <Select
                        value={invoice.status}
                        size="small"
                        onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
                        sx={{ fontSize: 13 }}
                      >
                        {["draft", "sent", "paid", "overdue", "cancelled"].map(s => (
                          <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>{s}</MenuItem>
                        ))}
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" title="Download PDF" onClick={() => generateInvoicePDF(invoice)}>
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      title="Delete"
                      disabled={invoice.status === "paid"}
                      onClick={() => handleDelete(invoice._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages} page={page}
          onChange={(_, val) => setPage(val)} color="primary"
        />
      </Box>

      <InvoiceForm open={openForm} onClose={() => setOpenForm(false)} />
    </Box>
  )
}

export default InvoicesPage
