import { lazy, Suspense } from 'react';
import { PageLoader } from "../../components/PageLoader";
const FlatList = lazy(() => import("../../Admin/pages/Flats/FlatList"));
const AddEditFlat = lazy(() => import("../../Admin/pages/Flats/AddEditFlat"));
 
const flatRoutes = [
  { path: "flat/list",      element: <Suspense fallback={<PageLoader message="Loading…" />}><FlatList /></Suspense> },
  { path: "flat/add",       element: <Suspense fallback={<PageLoader message="Loading…" />}><AddEditFlat /></Suspense> },
  { path: "flat/edit/:id",  element: <Suspense fallback={<PageLoader message="Loading…" />}><AddEditFlat /></Suspense> },
];

export default flatRoutes;