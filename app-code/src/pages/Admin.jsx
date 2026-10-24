import { useAuth } from "@/lib/AuthContext";
import { Navigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { adminEntities } from "@/lib/admin-config";
import AdminEntityPanel from "@/components/admin/AdminEntityPanel";

export default function Admin() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const entityNames = Object.keys(adminEntities);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          Panel de administración
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona los datos de la plataforma: anuncios, solicitudes, búsquedas guardadas y usuarios.
        </p>
      </div>

      <Tabs defaultValue="Listing">
        <TabsList className="flex flex-wrap h-auto">
          {entityNames.map((name) => {
            const cfg = adminEntities[name];
            const Icon = cfg.icon;
            return (
              <TabsTrigger key={name} value={name} className="gap-2">
                <Icon className="w-4 h-4" />
                {cfg.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {entityNames.map((name) => (
          <TabsContent key={name} value={name} className="mt-4">
            <AdminEntityPanel entityName={name} config={adminEntities[name]} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
