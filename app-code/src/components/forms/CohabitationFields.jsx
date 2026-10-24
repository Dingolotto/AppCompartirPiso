import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GENDER_LABELS, ACTIVITY_LABELS } from "@/lib/constants";
import { Users, PawPrint, Cigarette } from "lucide-react";

export default function CohabitationFields({ data, onChange }) {
  const update = (key, value) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" />
        Filtros de convivencia
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Sexo permitido *</Label>
          <Select value={data.sexo_permitido || ""} onValueChange={(v) => update("sexo_permitido", v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>
              {Object.entries(GENDER_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Actividad permitida *</Label>
          <Select value={data.actividad_permitida || ""} onValueChange={(v) => update("actividad_permitida", v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>
              {Object.entries(ACTIVITY_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
          <Label className="flex items-center gap-2"><PawPrint className="w-4 h-4 text-muted-foreground" /> Mascotas permitidas</Label>
          <Switch checked={data.mascotas || false} onCheckedChange={(v) => update("mascotas", v)} />
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
          <Label className="flex items-center gap-2"><Cigarette className="w-4 h-4 text-muted-foreground" /> Se permite fumar</Label>
          <Switch checked={data.fumar || false} onCheckedChange={(v) => update("fumar", v)} />
        </div>
      </div>
    </div>
  );
}
