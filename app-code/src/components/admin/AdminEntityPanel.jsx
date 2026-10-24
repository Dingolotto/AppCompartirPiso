import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil } from "lucide-react";
import RecordDetailDialog from "@/components/admin/RecordDetailDialog";

function formatCell(value) {
  if (value === undefined || value === null) return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "string" && value.length > 50) return value.slice(0, 47) + "...";
  if (Array.isArray(value)) return `${value.length} item(s)`;
  if (typeof value === "object") return "JSON";
  return String(value);
}

export default function AdminEntityPanel({ entityName, config }) {
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["admin", entityName],
    queryFn: () => base44.entities[entityName].list("-created_date", 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities[entityName].update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", entityName] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities[entityName].delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", entityName] }),
  });

  const openRecord = (record) => {
    setSelected(record);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {records.length} registro{records.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : records.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">Sin registros</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {config.columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow
                  key={record.id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => openRecord(record)}
                >
                  {config.columns.map((col) => (
                    <TableCell key={col.key} className="text-sm">
                      {col.key === "status" ? (
                        <Badge variant="outline" className="text-xs">{formatCell(record[col.key])}</Badge>
                      ) : col.key === "notify" ? (
                        <Badge variant={record[col.key] ? "default" : "secondary"} className="text-xs">
                          {record[col.key] ? "On" : "Off"}
                        </Badge>
                      ) : col.key === "role" ? (
                        <Badge variant={record[col.key] === "admin" ? "default" : "secondary"} className="text-xs">
                          {record[col.key] || "user"}
                        </Badge>
                      ) : (
                        formatCell(record[col.key])
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost" size="icon"
                        onClick={(e) => { e.stopPropagation(); openRecord(record); }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(record);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <RecordDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entityName={entityName}
        record={selected}
        fields={config.fields}
        note={config.note}
        onUpdate={updateMutation.mutateAsync}
        onDelete={deleteMutation.mutateAsync}
      />
    </div>
  );
}
