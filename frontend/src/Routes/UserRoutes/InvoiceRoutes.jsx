import { lazy, Suspense } from "react";
import { PageLoader } from "../../components/PageLoader";

const MyInvoice = lazy(() => import("../../User/pages/MyInvoice"));

// Header nav: Finances → "My Invoices" → "/invoices"
const InvoiceRoutes = [
  {
    path: "invoices",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <MyInvoice />
      </Suspense>
    ),
  },
];

export default InvoiceRoutes;