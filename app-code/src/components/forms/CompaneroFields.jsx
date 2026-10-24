import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle } from "lucide-react";

export default function CompaneroFields({ data, onChange }) {
  const update = (key, value) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <UserCircle className="w-4 h-4 text-primary" />
        Tu perfil (visible para los buscadores)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Nombre y Apellidos *</Label>
          <Input value={data.contacto_nombre || ""} onChange={(e) => update("contacto_nombre", e.target.value)} placeholder="Tu nombre completo" />
        </div>
        <div className="space-y-1.5">
          <Label>Edad *</Label>
          <Input type="number" min={16} max={99} value={data.contacto_edad || ""} onChange={(e) => update("contacto_edad", Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <Label>Sexo *</Label>
          <Select value={data.contacto_sexo || ""} onValueChange={(v) => update("contacto_sexo", v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hombre">Hombre</SelectItem>
              <SelectItem value="mujer">Mujer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Actividad *</Label>
          <Select value={data.contacto_actividad || ""} onValueChange={(v) => update("contacto_actividad", v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="estudiante">Estudiante</SelectItem>
              <SelectItem value="trabajo">Trabajador/a</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Teléfono (privado)</Label>
          <Input value={data.contacto_telefono || ""} onChange={(e) => update("contacto_telefono", e.target.value)} placeholder="+34..." />
        </div>
        <div className="space-y-1.5">
          <Label>Email (privado)</Label>
          <Input type="email" value={data.contacto_email || ""} onChange={(e) => update("contacto_email", e.target.value)} placeholder="tu@email.com" />
        </div>
      </div>
    </div>
  );
}
