import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROVINCIAS_ESPANA } from "@/lib/constants";
import { MapPin } from "lucide-react";

export default function LocationFields({ data, onChange, grouped = false }) {
  const update = (key, value) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        Localización {grouped && <span className="text-xs font-normal text-muted-foreground">(zona donde buscas)</span>}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Provincia *</Label>
          <Select value={data.provincia || ""} onValueChange={(v) => update("provincia", v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar provincia" /></SelectTrigger>
            <SelectContent>
              {PROVINCIAS_ESPANA.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Localidad *</Label>
          <Input value={data.localidad || ""} onChange={(e) => update("localidad", e.target.value)} placeholder="Ej: Salamanca" />
        </div>
        <div className="space-y-1.5">
          <Label>Código Postal *</Label>
          <Input value={data.codigo_postal || ""} onChange={(e) => update("codigo_postal", e.target.value)} placeholder="Ej: 37001" />
        </div>
        {!grouped && (
          <div className="space-y-1.5">
            <Label>Dirección</Label>
            <Input value={data.direccion || ""} onChange={(e) => update("direccion", e.target.value)} placeholder="Ej: Calle Gran Vía, 10" />
          </div>
        )}
      </div>
    </div>
  );
}
