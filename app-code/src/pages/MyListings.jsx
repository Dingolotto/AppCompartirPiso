import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  PlusCircle, MoreVertical, Eye, Pause, Play, Trash2, MapPin, Euro, Home, BedDouble, Users
} from "lucide-react";
import { LISTING_TYPE_LABELS } from "@/lib/constants";

const statusLabels = { active: "Activo", paused: "Pausado", rented: "Alquilado" };
const statusColors = {
  active: "bg-green-50 text-green-700 border-green-200",
  paused: "bg-yellow-50 text-yellow-700 border-yellow-200",
  rented: "bg-blue-50 text-blue-700 border-blue-200",
};
const typeIcons = { casa_completa: Home, plaza_alojamiento: BedDouble, companero_piso: Users, grupo_alquiler: Users };

export default function MyListings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["my-listings"],
    queryFn: () => base44.entities.Listing.filter({ created_by_id: user.id }, "-created_date"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Listing.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-listings"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Listing.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      toast({ title: "Anuncio eliminado" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis anuncios</h1>
          <p className="text-muted-foreground mt-1">{listings.length} anuncio{listings.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/create">
          <Button><PlusCircle className="w-4 h-4 mr-2" /> Nuevo anuncio</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <Home className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No tienes anuncios</h3>
          <p className="text-muted-foreground mt-2">Publica tu primer anuncio para empezar</p>
          <Link to="/create"><Button className="mt-4"><PlusCircle className="w-4 h-4 mr-2" /> Crear anuncio</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => {
            const TypeIcon = typeIcons[listing.listing_type] || Home;
            return (
              <Card key={listing.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TypeIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={`/listing/${listing.id}`} className="font-semibold text-foreground hover:text-primary truncate">
                        {listing.title || "Sin título"}
                      </Link>
                      <Badge className={`${statusColors[listing.status || "active"]} border text-xs`}>
                        {statusLabels[listing.status || "active"]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {listing.localidad}</span>
                      <span className="flex items-center gap-1"><Euro className="w-3 h-3" /> {listing.precio_mensual}€/mes</span>
                      <span className="text-xs">{LISTING_TYPE_LABELS[listing.listing_type]}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/listing/${listing.id}`}><Eye className="w-4 h-4 mr-2" /> Ver</Link>
                      </DropdownMenuItem>
                      {(listing.status || "active") === "active" ? (
                        <DropdownMenuItem onClick={() => updateMutation.mutate({ id: listing.id, data: { status: "paused" } })}>
                          <Pause className="w-4 h-4 mr-2" /> Pausar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => updateMutation.mutate({ id: listing.id, data: { status: "active" } })}>
                          <Play className="w-4 h-4 mr-2" /> Activar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => deleteMutation.mutate(listing.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
