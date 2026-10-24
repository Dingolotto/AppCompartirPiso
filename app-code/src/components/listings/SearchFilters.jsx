import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PROPERTY_TYPE_LABELS, LEASE_LABELS, GENDER_LABELS,
  ACTIVITY_LABELS, PROVINCIAS_ESPANA
} from "@/lib/constants";
import {
  Search, MapPin, Home, Euro, Users, Car, Bus,
  Thermometer, Filter, RotateCcw, Radar
} from "lucide-react";

export default function SearchFilters({ filters, setFilters, onSaveRadar }) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pr-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            Filtros
          </h3>
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs text-muted-foreground">
            <RotateCcw className="w-3 h-3 mr-1" />
            Limpiar
          </Button>
        </div>

        {/* Search Type */}
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tipo de búsqueda</Label>
          <Select value={filters.listing_type || ""} onValueChange={(v) => updateFilter("listing_type", v)}>
            <SelectTrigger><SelectValue placeholder="Todos los tipos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="casa_completa">Casa Completa</SelectItem>
              <SelectItem value="plaza_alojamiento">Habitación</SelectItem>
              <SelectItem value="companero_piso">Compañero de Piso</SelectItem>
              <SelectItem value="grupo_alquiler">Grupo para Alquilar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-3">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Localización
          </Label>
          <Select value={filters.provincia || ""} onValueChange={(v) => updateFilter("provincia", v)}>
            <SelectTrigger><SelectValue placeholder="Provincia" /></SelectTrigger>
            <SelectContent>
              {PROVINCIAS_ESPANA.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Localidad"
            value={filters.localidad || ""}
            onChange={(e) => updateFilter("localidad", e.target.value)}
          />
          <Input
            placeholder="Código Postal"
            value={filters.codigo_postal || ""}
            onChange={(e) => updateFilter("codigo_postal", e.target.value)}
          />
        </div>

        <Separator />

        {/* Property Type */}
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Home className="w-3 h-3" /> Tipo de vivienda
          </Label>
          <Select value={filters.tipo_vivienda || ""} onValueChange={(v) => updateFilter("tipo_vivienda", v)}>
            <SelectTrigger><SelectValue placeholder="Cualquiera" /></SelectTrigger>
            <SelectContent>
              {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div className="space-y-3">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Euro className="w-3 h-3" /> Precio máximo: {filters.max_price || "Sin límite"}€
          </Label>
          <Slider
            value={[filters.max_price || 2000]}
            onValueChange={([v]) => updateFilter("max_price", v)}
            max={3000}
            min={100}
            step={50}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>100€</span><span>3000€</span>
          </div>
        </div>

        <Separator />

        {/* Lease */}
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Plazo alquiler</Label>
          <Select value={filters.plazo_alquiler || ""} onValueChange={(v) => updateFilter("plazo_alquiler", v)}>
            <SelectTrigger><SelectValue placeholder="Cualquiera" /></SelectTrigger>
            <SelectContent>
              {Object.entries(LEASE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rooms */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Dormitorios mín.</Label>
            <Input type="number" min={0} value={filters.min_rooms || ""} onChange={(e) => updateFilter("min_rooms", Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Baños mín.</Label>
            <Input type="number" min={0} value={filters.min_banos || ""} onChange={(e) => updateFilter("min_banos", Number(e.target.value))} />
          </div>
        </div>

        <Separator />

        {/* Cohabitation */}
        <div className="space-y-3">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" /> Convivencia
          </Label>
          <Select value={filters.sexo_permitido || ""} onValueChange={(v) => updateFilter("sexo_permitido", v)}>
            <SelectTrigger><SelectValue placeholder="Sexo: Cualquiera" /></SelectTrigger>
            <SelectContent>
              {Object.entries(GENDER_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.actividad_permitida || ""} onValueChange={(v) => updateFilter("actividad_permitida", v)}>
            <SelectTrigger><SelectValue placeholder="Actividad: Cualquiera" /></SelectTrigger>
            <SelectContent>
              {Object.entries(ACTIVITY_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Amenities toggles */}
        <div className="space-y-3">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Comodidades</Label>
          <div className="space-y-3">
            {[
              { key: "bano_propio", label: "Baño propio" },
              { key: "parking", label: "Parking" },
              { key: "calefaccion", label: "Calefacción" },
              { key: "aire_acondicionado", label: "Aire acondicionado" },
              { key: "mascotas", label: "Mascotas permitidas" },
              { key: "gastos_incluidos", label: "Gastos incluidos" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="text-sm">{label}</Label>
                <Switch
                  checked={filters[key] || false}
                  onCheckedChange={(v) => updateFilter(key, v)}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Transport */}
        <div className="space-y-3">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Bus className="w-3 h-3" /> Transporte (dist. máx metros)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Autobús</Label>
              <Input type="number" placeholder="m" value={filters.max_dist_autobus || ""} onChange={(e) => updateFilter("max_dist_autobus", Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Metro</Label>
              <Input type="number" placeholder="m" value={filters.max_dist_metro || ""} onChange={(e) => updateFilter("max_dist_metro", Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Ferrocarril</Label>
              <Input type="number" placeholder="m" value={filters.max_dist_ferrocarril || ""} onChange={(e) => updateFilter("max_dist_ferrocarril", Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Tranvía</Label>
              <Input type="number" placeholder="m" value={filters.max_dist_tranvia || ""} onChange={(e) => updateFilter("max_dist_tranvia", Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* Save Radar */}
        {onSaveRadar && (
          <>
            <Separator />
            <Button onClick={onSaveRadar} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Radar className="w-4 h-4 mr-2" />
              Guardar en mi Radar
            </Button>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
