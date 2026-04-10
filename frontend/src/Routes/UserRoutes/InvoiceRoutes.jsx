import MyInvoice from "../../User/pages/MyInvoice";

// Header nav: Finances → "My Invoices" → "/invoices"
const InvoiceRoutes = [
  {
    path: "invoices",
    element: <MyInvoice />,
  },
];

export default InvoiceRoutes;