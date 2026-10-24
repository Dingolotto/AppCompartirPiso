import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PROPERTY_TYPE_LABELS, LEASE_LABELS, ROOM_USE_LABELS } from "@/lib/constants";
import { Home, BedDouble } from "lucide-react";

export default function PropertyFields({ data, onChange, listingType }) {
  const update = (key, value) => onChange({ ...data, [key]: value });
  const showRoomFields = listingType === "plaza_alojamiento" || listingType === "companero_piso";

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Home className="w-4 h-4 text-primary" />
        Características de la vivienda
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Tipo de vivienda *</Label>
          <Select value={data.tipo_vivienda || ""} onValueChange={(v) => update("tipo_vivienda", v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>
              {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Plazo de alquiler *</Label>
          <Select value={data.plazo_alquiler || ""} onValueChange={(v) => update("plazo_alquiler", v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>
              {Object.entries(LEASE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {data.plazo_alquiler === "otro" && (
          <div className="space-y-1.5">
            <Label>Meses</Label>
            <Input type="number" min={1} value={data.plazo_meses || ""} onChange={(e) => update("plazo_meses", Number(e.target.value))} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label>Nº Dormitorios</Label>
          <Input type="number" min={0} value={data.num_dormitorios || ""} onChange={(e) => update("num_dormitorios", Number(e.target.value))} />
        </div>
        {listingType === "casa_completa" && (
          <>
            <div className="space-y-1.5">
              <Label>Individuales</Label>
              <Input type="number" min={0} value={data.num_dormitorios_individuales || ""} onChange={(e) => update("num_dormitorios_individuales", Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Compartidos</Label>
              <Input type="number" min={0} value={data.num_dormitorios_compartidos || ""} onChange={(e) => update("num_dormitorios_compartidos", Number(e.target.value))} />
            </div>
          </>
        )}
        <div className="space-y-1.5">
          <Label>Nº Plazas</Label>
          <Input type="number" min={1} value={data.num_plazas || ""} onChange={(e) => update("num_plazas", Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <Label>Nº Baños</Label>
          <Input type="number" min={0} value={data.num_banos || ""} onChange={(e) => update("num_banos", Number(e.target.value))} />
        </div>
      </div>

      {/* Room-specific fields */}
      {showRoomFields && (
        <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-4">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-secondary" />
            Datos de la habitación
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Uso habitación *</Label>
              <Select value={data.uso_habitacion || ""} onValueChange={(v) => update("uso_habitacion", v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ROOM_USE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {data.uso_habitacion === "compartida" && (
              <div className="space-y-1.5">
                <Label>Plazas en habitación</Label>
                <Input type="number" min={1} value={data.plazas_habitacion || ""} onChange={(e) => update("plazas_habitacion", Number(e.target.value))} />
              </div>
            )}
            <div className="flex items-center gap-3 pt-6">
              <Switch checked={data.bano_propio || false} onCheckedChange={(v) => update("bano_propio", v)} />
              <Label>Baño propio</Label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
