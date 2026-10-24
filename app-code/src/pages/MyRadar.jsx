import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  Radar, Trash2, Bell, BellOff, Search, ArrowRight
} from "lucide-react";
import { LISTING_TYPE_LABELS } from "@/lib/constants";

export default function MyRadar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: searches = [], isLoading } = useQuery({
    queryKey: ["saved-searches"],
    queryFn: () => base44.entities.SavedSearch.filter({ created_by_id: user.id }, "-created_date"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SavedSearch.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
      toast({ title: "Alerta eliminada" });
    },
  });

  const toggleNotify = useMutation({
    mutationFn: ({ id, notify }) => base44.entities.SavedSearch.update(id, { notify }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved-searches"] }),
  });

  const getFilterSummary = (filters) => {
    const parts = [];
    if (filters?.provincia) parts.push(filters.provincia);
    if (filters?.localidad) parts.push(filters.localidad);
    if (filters?.max_price) parts.push(`< ${filters.max_price}€`);
    if (filters?.sexo_permitido) parts.push(filters.sexo_permitido.replace("solo_", "").replace("_", " "));
    if (filters?.actividad_permitida) parts.push(filters.actividad_permitida.replace("solo_", "").replace("_", " "));
    return parts.length > 0 ? parts.join(" · ") : "Sin filtros específicos";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Radar className="w-8 h-8 text-secondary" />
          Mi Radar
        </h1>
        <p className="text-muted-foreground mt-1">
          Búsquedas guardadas — recibirás alertas de nuevos anuncios que coincidan
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : searches.length === 0 ? (
        <div className="text-center py-20">
          <Radar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">Tu Radar está vacío</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Busca alojamiento y guarda tus filtros para recibir alertas automáticas de nuevos anuncios.
          </p>
          <Link to="/search">
            <Button className="mt-4">
              <Search className="w-4 h-4 mr-2" /> Ir al buscador
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {searches.map((search) => (
            <Card key={search.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Radar className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{search.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {LISTING_TYPE_LABELS[search.search_type] || search.search_type}
                    </Badge>
                    {search.new_matches_count > 0 && (
                      <Badge className="bg-secondary text-secondary-foreground text-xs">
                        {search.new_matches_count} nuevo{search.new_matches_count > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {getFilterSummary(search.filters)}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {search.notify ? <Bell className="w-4 h-4 text-secondary" /> : <BellOff className="w-4 h-4 text-muted-foreground" />}
                    <Switch
                      checked={search.notify}
                      onCheckedChange={(v) => toggleNotify.mutate({ id: search.id, notify: v })}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(search.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
