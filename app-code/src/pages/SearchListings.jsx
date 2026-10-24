import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { Search, SlidersHorizontal, Radar, LayoutGrid, List } from "lucide-react";
import ListingCard from "@/components/listings/ListingCard";
import SearchFilters from "@/components/listings/SearchFilters";

export default function SearchListings() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialType = urlParams.get("type") || "";
  const [filters, setFilters] = useState(initialType ? { listing_type: initialType } : {});
  const [searchText, setSearchText] = useState("");
  const [radarDialog, setRadarDialog] = useState(false);
  const [radarName, setRadarName] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .order("created_date", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (filters.listing_type && l.listing_type !== filters.listing_type) return false;
      if (filters.provincia && l.provincia !== filters.provincia) return false;
      if (filters.localidad && !l.localidad?.toLowerCase().includes(filters.localidad.toLowerCase())) return false;
      if (filters.codigo_postal && l.codigo_postal !== filters.codigo_postal) return false;
      if (filters.tipo_vivienda && l.tipo_vivienda !== filters.tipo_vivienda) return false;
      if (filters.max_price && l.precio_mensual > filters.max_price) return false;
      if (filters.plazo_alquiler && l.plazo_alquiler !== filters.plazo_alquiler) return false;
      if (filters.min_rooms && (l.num_dormitorios || 0) < filters.min_rooms) return false;
      if (filters.min_banos && (l.num_banos || 0) < filters.min_banos) return false;
      if (filters.sexo_permitido && l.sexo_permitido !== "indiferente" && l.sexo_permitido !== filters.sexo_permitido) return false;
      if (filters.actividad_permitida && l.actividad_permitida !== "indiferente" && l.actividad_permitida !== filters.actividad_permitida) return false;
      if (filters.bano_propio && !l.bano_propio) return false;
      if (filters.parking && !l.parking) return false;
      if (filters.calefaccion && !l.calefaccion) return false;
      if (filters.aire_acondicionado && !l.aire_acondicionado) return false;
      if (filters.mascotas && !l.mascotas) return false;
      if (filters.gastos_incluidos && !(l.gastos_agua && l.gastos_luz && l.gastos_internet)) return false;
      if (filters.max_dist_autobus && (l.dist_autobus || 9999) > filters.max_dist_autobus) return false;
      if (filters.max_dist_metro && (l.dist_metro || 9999) > filters.max_dist_metro) return false;
      if (filters.max_dist_ferrocarril && (l.dist_ferrocarril || 9999) > filters.max_dist_ferrocarril) return false;
      if (filters.max_dist_tranvia && (l.dist_tranvia || 9999) > filters.max_dist_tranvia) return false;
      if (searchText) {
        const text = searchText.toLowerCase();
        if (!l.title?.toLowerCase().includes(text) && !l.localidad?.toLowerCase().includes(text) && !l.provincia?.toLowerCase().includes(text)) return false;
      }
      return true;
    });
  }, [listings, filters, searchText]);

  const handleSaveRadar = () => setRadarDialog(true);

  const confirmSaveRadar = async () => {
    const { error } = await supabase.from("saved_searches").insert({
      created_by_id: user.id,
      name: radarName || "Mi búsqueda",
      search_type: filters.listing_type || "casa_completa",
      filters,
      notify: true,
      new_matches_count: 0,
    });
    if (error) {
      toast({ title: "Error al guardar el radar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "¡Radar guardado!", description: "Te notificaremos de nuevas coincidencias." });
    setRadarDialog(false);
    setRadarName("");
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== "" && v !== false && v !== undefined && v !== null).length;

  return (
    <div className="space-y-6">
      {/* Search header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Buscar alojamiento</h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            {activeFiltersCount > 0 && ` · ${activeFiltersCount} filtro${activeFiltersCount > 1 ? "s" : ""} activo${activeFiltersCount > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            className="pl-10 h-12 bg-card"
            placeholder="Buscar por ciudad, provincia o título..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        {/* Mobile filter button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="lg" className="lg:hidden h-12">
              <SlidersHorizontal className="w-5 h-5" />
              {activeFiltersCount > 0 && (
                <span className="ml-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-6">
            <SearchFilters filters={filters} setFilters={setFilters} onSaveRadar={handleSaveRadar} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-24 bg-card rounded-2xl border border-border p-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <SearchFilters filters={filters} setFilters={setFilters} onSaveRadar={handleSaveRadar} />
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground">Sin resultados</h3>
              <p className="text-muted-foreground mt-2">Prueba a ajustar tus filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>

      {/* Radar dialog */}
      <Dialog open={radarDialog} onOpenChange={setRadarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Radar className="w-5 h-5 text-secondary" />
              Guardar búsqueda en tu Radar
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Label>Nombre de la alerta</Label>
            <Input
              value={radarName}
              onChange={(e) => setRadarName(e.target.value)}
              placeholder="Ej: Piso en Salamanca < 400€"
            />
            <p className="text-xs text-muted-foreground">
              Recibirás notificaciones cuando aparezcan nuevos anuncios que coincidan con tus filtros actuales.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRadarDialog(false)}>Cancelar</Button>
            <Button onClick={confirmSaveRadar} className="bg-secondary hover:bg-secondary/90">
              <Radar className="w-4 h-4 mr-2" />
              Guardar Radar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
