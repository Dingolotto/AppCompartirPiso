import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Home, Search, PlusCircle, List, Bell, MessageSquare,
  Menu, X, ChevronDown, LogOut, User, Radar, Shield, LogIn, UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { path: "/", label: "Inicio", icon: Home },
  { path: "/search", label: "Buscar", icon: Search },
  { path: "/create", label: "Publicar", icon: PlusCircle },
  { path: "/my-listings", label: "Mis anuncios", icon: List },
  { path: "/radar", label: "Mi Radar", icon: Radar },
  { path: "/contacts", label: "Contactos", icon: MessageSquare },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoadingAuth, authChecked, logout } = useAuth();
  const authLoading = isLoadingAuth || !authChecked;
  const signedIn = isAuthenticated && !!user;

  const handleLogin = () => navigate("/login", { state: { from: location.pathname } });
  const handleRegister = () => navigate("/register");
  const handleLogout = () => logout();

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                Comparte<span className="text-primary">tupiso.es</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                if (item.adminOnly && user?.role !== "admin") return null;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">
                      {authLoading ? "Mi Cuenta" : signedIn ? (user.full_name || "Mi Cuenta") : "Iniciar sesión"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {authLoading ? (
                    <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                      Comprobando sesión...
                    </DropdownMenuItem>
                  ) : signedIn ? (
                    <>
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.full_name || "Mi Cuenta"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      {user.role === "admin" && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link to="/admin">
                              <Shield className="w-4 h-4 mr-2" />
                              Panel Admin
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar sesión
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium text-foreground">Mi Cuenta</p>
                        <p className="text-xs text-muted-foreground">
                          Inicia sesión para publicar, guardar favoritos y contactar.
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogin}>
                        <LogIn className="w-4 h-4 mr-2" />
                        Iniciar sesión
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleRegister}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Registrarse
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {navItems.map((item) => {
              if (item.adminOnly && user?.role !== "admin") return null;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            {!authLoading && !signedIn && (
              <div className="pt-1 border-t border-border mt-1 grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => { setMobileOpen(false); handleLogin(); }}>
                  <LogIn className="w-4 h-4 mr-2" /> Iniciar sesión
                </Button>
                <Button onClick={() => { setMobileOpen(false); handleRegister(); }}>
                  <UserPlus className="w-4 h-4 mr-2" /> Registrarse
                </Button>
              </div>
            )}
            {!authLoading && signedIn && (
              <Button variant="outline" className="w-full mt-1" onClick={() => { setMobileOpen(false); handleLogout(); }}>
                <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
              </Button>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Botón flotante Admin (solo admins) */}
      {user?.role === "admin" && location.pathname !== "/admin" && (
        <Link
          to="/admin"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105"
        >
          <Shield className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-semibold">Panel Admin</span>
        </Link>
      )}
    </div>
  );
}
