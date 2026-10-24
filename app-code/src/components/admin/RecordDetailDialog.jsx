import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Pencil, Trash2, Save, X } from "lucide-react";

// Formatea un valor para mostrarlo en la tabla / vista detalle.
function formatValue(value) {
  if (value === undefined || value === null) return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "string" && value.length > 60) return value.slice(0, 57) + "...";
  if (Array.isArray(value)) return `${value.length} elemento(s)`;
  if (typeof value === "object") return "JSON";
  return String(value);
}

function FieldInput({ field, value, onChange }) {
  if (field.readOnly) {
    return <Input value={value ?? ""} disabled />;
  }
  switch (field.type) {
    case "enum":
      return (
        <Select value={value || ""} onValueChange={onChange}>
          <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "boolean":
      return <Switch checked={!!value} onCheckedChange={onChange} />;
    case "number":
      return (
        <Input
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      );
    case "textarea":
      return <Textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={3} />;
    case "list":
      return (
        <Textarea
          value={Array.isArray(value) ? value.join("\n") : (value ?? "")}
          onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          rows={4}
          placeholder="Una URL por línea"
        />
      );
    case "object":
      return (
        <Textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          placeholder='{"provincia": "Madrid"}'
        />
      );
    default:
      return <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
}

export default function RecordDetailDialog({
  open, onOpenChange, entityName, record, fields, note, onUpdate, onDelete,
}) {
  const [mode, setMode] = useState("view"); // "view" | "edit"
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (record) {
      const initial = { ...record };
      fields.forEach((f) => {
        if (f.type === "object") {
          initial[f.key] = record[f.key] != null ? JSON.stringify(record[f.key], null, 2) : "";
        }
      });
      setFormData(initial);
      setMode("view");
      setConfirmDelete(false);
    }
  }, [record, fields]);

  if (!record) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      // Solo enviar campos editables (no readOnly ni built-ins).
      const payload = {};
      let hasError = false;
      fields.forEach((f) => {
        if (f.readOnly) return;
        if (f.type === "object") {
          try {
            payload[f.key] = formData[f.key] ? JSON.parse(formData[f.key]) : {};
          } catch {
            toast({ title: `JSON inválido en "${f.label}"`, variant: "destructive" });
            hasError = true;
          }
          return;
        }
        payload[f.key] = formData[f.key];
      });
      if (hasError) {
        setSaving(false);
        return;
      }
      await onUpdate(record.id, payload);
      toast({ title: "Registro actualizado" });
      setMode("view");
    } catch (err) {
      toast({ title: "Error al guardar", description: err?.message || "Inténtalo de nuevo.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await onDelete(record.id);
      toast({ title: "Registro eliminado" });
      onOpenChange(false);
    } catch (err) {
      toast({ title: "Error al eliminar", description: err?.message || "Inténtalo de nuevo.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2">
            <span>{entityName} · {mode === "view" ? "Detalle" : "Editar"}</span>
            <Badge variant="outline" className="text-xs">ID: {record.id?.slice(0, 8)}…</Badge>
          </DialogTitle>
        </DialogHeader>

        {note && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 text-primary text-xs p-3">
            {note}
          </div>
        )}

        <div className="space-y-4 py-2">
          {/* Built-in meta */}
 <div className="grid grid-cols-2 gap-3 text-sm">
   <div>
     <span className="text-muted-foreground">Creado:</span>{" "}
     <span className="font-medium">{record.created_date ? new Date(record.created_date).toLocaleString() : "—"}</span>
   </div>
   <div>
     <span className="text-muted-foreground">Actualizado:</span>{" "}
     <span className="font-medium">{record.updated_date ? new Date(record.updated_date).toLocaleString() : "—"}</span>
   </div>
 </div>
          <Separator />
          {/* Editable fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {field.label}
                </Label>
                {mode === "view" ? (
                  <div className="text-sm text-foreground min-h-9 flex items-center">
                    {formatValue(record[field.key])}
                  </div>
                ) : (
                  <FieldInput
                    field={field}
                    value={formData[field.key]}
                    onChange={(v) => setFormData((prev) => ({ ...prev, [field.key]: v }))}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-destructive">¿Confirmar borrado?</span>
                <Button size="sm" variant="destructive" onClick={handleDelete} disabled={saving}>
                  Sí, borrar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)} disabled={saving}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="w-4 h-4 mr-2" /> Eliminar
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {mode === "view" ? (
              <>
                <Button variant="ghost" onClick={() => onOpenChange(false)}><X className="w-4 h-4 mr-2" /> Cerrar</Button>
                <Button onClick={() => setMode("edit")}><Pencil className="w-4 h-4 mr-2" /> Editar</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setMode("view")} disabled={saving}>Cancelar</Button>
                <Button onClick={handleSave} disabled={saving}><Save className="w-4 h-4 mr-2" /> {saving ? "Guardando…" : "Guardar"}</Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
