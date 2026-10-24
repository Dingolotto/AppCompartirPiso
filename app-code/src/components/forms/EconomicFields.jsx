import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Euro } from "lucide-react";

export default function EconomicFields({ data, onChange }) {
  const update = (key, value) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Euro className="w-4 h-4 text-primary" />
        Condiciones económicas
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Precio mensual (€) *</Label>
          <Input type="number" min={0} value={data.precio_mensual || ""} onChange={(e) => update("precio_mensual", Number(e.target.value))} placeholder="Ej: 450" />
        </div>
        <div className="space-y-1.5">
          <Label>Fianza (meses)</Label>
          <Input type="number" min={0} value={data.fianza_meses || ""} onChange={(e) => update("fianza_meses", Number(e.target.value))} placeholder="Ej: 1" />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Gastos incluidos</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { key: "gastos_agua", label: "Agua" },
            { key: "gastos_luz", label: "Luz" },
            { key: "gastos_internet", label: "Internet" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
              <Label>{label}</Label>
              <Switch checked={data[key] || false} onCheckedChange={(v) => update(key, v)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
