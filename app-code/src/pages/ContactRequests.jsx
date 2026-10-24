import { supabase } from "@/lib/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  MessageSquare, CheckCircle2, XCircle, Clock, User,
  Mail, Send, Inbox
} from "lucide-react";

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  accepted: { label: "Aceptada", color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
  rejected: { label: "Rechazada", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

// Hook to fetch a profile by id (used to reveal name/email of the other party)
function useUser(userId) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export default function ContactRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: received = [], isLoading: loadingReceived } = useQuery({
    queryKey: ["contacts-received"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_requests")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: sent = [], isLoading: loadingSent } = useQuery({
    queryKey: ["contacts-sent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_requests")
        .select("*")
        .eq("requester_id", user.id)
        .order("created_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase.from("contact_requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["contacts-received"] });
      toast({ title: status === "accepted" ? "Solicitud aceptada — contacto revelado" : "Solicitud rechazada" });
    },
  });

  const pendingCount = received.filter(r => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" />
          Solicitudes de contacto
        </h1>
        <p className="text-muted-foreground mt-1">
          {pendingCount > 0 ? `${pendingCount} solicitud${pendingCount > 1 ? "es" : ""} pendiente${pendingCount > 1 ? "s" : ""}` : "Sin solicitudes pendientes"}
        </p>
      </div>

      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received" className="gap-2">
            <Inbox className="w-4 h-4" /> Recibidas
            {pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-2">
            <Send className="w-4 h-4" /> Enviadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4 mt-4">
          {loadingReceived ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
          ) : received.length === 0 ? (
            <EmptyState text="No has recibido solicitudes aún" />
          ) : (
            received.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                type="received"
                onAccept={() => updateStatus.mutate({ id: req.id, status: "accepted" })}
                onReject={() => updateStatus.mutate({ id: req.id, status: "rejected" })}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4 mt-4">
          {loadingSent ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
          ) : sent.length === 0 ? (
            <EmptyState text="No has enviado solicitudes aún" />
          ) : (
            sent.map((req) => (
              <RequestCard key={req.id} request={req} type="sent" />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RequestCard({ request, type, onAccept, onReject }) {
  const config = statusConfig[request.status || "pending"];
  const StatusIcon = config.icon;
  const otherUserId = type === "received" ? request.requester_id : request.owner_id;
  const { data: otherUser, isLoading: loadingUser } = useUser(otherUserId);

  const displayName =
    type === "received"
      ? (request.requester_name || otherUser?.full_name || otherUser?.email || "Solicitante")
      : (otherUser?.full_name || otherUser?.email || "Propietario");
  const displayEmail = otherUser?.email;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground">
                  {loadingUser ? "Cargando…" : displayName}
                </span>
                <Badge className={`${config.color} border text-xs`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
              {type === "received" && (
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                  {request.requester_edad && <span>Edad: {request.requester_edad}</span>}
                  {request.requester_sexo && <span className="capitalize">Sexo: {request.requester_sexo}</span>}
                  {request.requester_actividad && <span className="capitalize">Actividad: {request.requester_actividad}</span>}
                </div>
              )}
              {request.requester_message && (
                <p className="mt-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  "{request.requester_message}"
                </p>
              )}
              {/* Show contact info when accepted */}
              {request.status === "accepted" && (
                <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200 space-y-1">
                  <p className="text-sm font-medium text-green-800 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {type === "sent" ? "Contacto revelado" : "Contacto revelado al solicitante"}
                  </p>
                  {displayEmail && (
                    <p className="text-sm flex items-center gap-1"><Mail className="w-3 h-3" /> {displayEmail}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          {type === "received" && request.status === "pending" && (
            <div className="flex gap-2 flex-shrink-0">
              <Button size="sm" onClick={onAccept} className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Aceptar
              </Button>
              <Button size="sm" variant="outline" onClick={onReject}>
                <XCircle className="w-4 h-4 mr-1" /> Rechazar
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-center py-16">
      <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
