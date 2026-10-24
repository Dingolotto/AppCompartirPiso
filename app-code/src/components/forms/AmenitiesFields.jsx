import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Car, Bus, Thermometer, Wind } from "lucide-react";

export default function AmenitiesFields({ data, onChange }) {
  const update = (key, value) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      {/* Comfort */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-primary" />
          Comodidades
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
            <Label className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-muted-foreground" /> Calefacción</Label>
            <Switch checked={data.calefaccion || false} onCheckedChange={(v) => update("calefaccion", v)} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
            <Label className="flex items-center gap-2"><Wind className="w-4 h-4 text-muted-foreground" /> Aire acondicionado</Label>
            <Switch checked={data.aire_acondicionado || false} onCheckedChange={(v) => update("aire_acondicionado", v)} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
            <Label className="flex items-center gap-2"><Car className="w-4 h-4 text-muted-foreground" /> Parking</Label>
            <Switch checked={data.parking || false} onCheckedChange={(v) => update("parking", v)} />
          </div>
          {data.parking && (
            <div className="space-y-1.5">
              <Label>Nº plazas parking</Label>
              <Input type="number" min={1} value={data.parking_plazas || ""} onChange={(e) => update("parking_plazas", Number(e.target.value))} />
            </div>
          )}
        </div>
      </div>

      {/* Transport */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Bus className="w-4 h-4 text-primary" />
          Transporte público (distancia en metros)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: "dist_autobus", label: "Autobús" },
            { key: "dist_metro", label: "Metro" },
            { key: "dist_ferrocarril", label: "Ferrocarril" },
            { key: "dist_tranvia", label: "Tranvía" },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs">{label}</Label>
              <Input type="number" min={0} placeholder="metros" value={data[key] || ""} onChange={(e) => update(key, Number(e.target.value))} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
