import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./Utils/ProtectedRoute";

// Import lazy-loaded components
const Erreur = lazy(() => import("./Pages/ErreurPage"));
const Dashbord = lazy(() =>
  import("./components/Admin/pages/Configuration/Dashboard")
);
const LogAdmin = lazy(() => import("./Pages/loginadmin"));

const AppRouter = () => {
  return (
    <Suspense fallback={null}>
      {" "}
      {/* Removed LoadingSpinner */}
      <Routes>
        <Route path="/" element={<LogAdmin />} />
        <Route path="/Erreur" element={<Erreur />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashbord" element={<Dashbord />} />
        </Route>

        <Route path="/connexion" element={<LogAdmin />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
