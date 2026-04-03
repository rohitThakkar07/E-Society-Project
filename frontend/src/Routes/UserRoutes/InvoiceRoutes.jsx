import { lazy, Suspense } from "react";

const MyInvoice = lazy(() => import("../../User/pages/MyInvoice"));

// Header nav: Finances → "My Invoices" → "/invoices"
const InvoiceRoutes = [
  {
    path: "invoices",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <MyInvoice />
      </Suspense>
    ),
  },
];

export default InvoiceRoutes;