import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

// Envuelve rutas que exigen sesión iniciada (publicar, mis anuncios,
// contactos, radar, admin). El resto de la app (inicio, buscador, detalle
// de anuncio) es navegable sin cuenta.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingAuth, authChecked } = useAuth();
  const location = useLocation();

  if (isLoadingAuth || !authChecked) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
