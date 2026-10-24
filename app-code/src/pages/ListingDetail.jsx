import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import {
  ArrowLeft, MapPin, BedDouble, Bath, Car, Bus, Train,
  Thermometer, Wind, PawPrint, Cigarette, Users, Home, Building2,
  Calendar, Shield, Send, UserCircle, ChevronLeft, ChevronRight, ImageOff
} from "lucide-react";
import {
  LISTING_TYPE_LABELS, PROPERTY_TYPE_LABELS, LEASE_LABELS,
  GENDER_LABELS, ACTIVITY_LABELS, ROOM_USE_LABELS
} from "@/lib/constants";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contactDialog, setContactDialog] = useState(false);
  const [contactForm, setContactForm] = useState({ message: "", edad: "", sexo: "", actividad: "" });
  const [currentImg, setCurrentImg] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const sendContact = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("contact_requests").insert({
        listing_id: id,
        requester_id: user.id,
        requester_name: user.full_name,
        requester_message: contactForm.message,
        requester_edad: Number(contactForm.edad),
        requester_sexo: contactForm.sexo,
        requester_actividad: contactForm.actividad,
        owner_id: listing.created_by_id,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Solicitud enviada", description: "El propietario revisará tu perfil y decidirá." });
      setContactDialog(false);
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Anuncio no encontrado</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/search")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al buscador
        </Button>
      </div>
    );
  }

  const images = listing.images || [];
  const isOwner = listing.created_by_id === user?.id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
      </Button>

      {/* Image Gallery */}
      <div className="space-y-2">
        {images.length === 0 ? (
          <div className="rounded-2xl h-64 sm:h-80 bg-muted/60 flex flex-col items-center justify-center">
            <ImageOff className="w-10 h-10 text-muted-foreground/40 mb-2" />
            <span className="text-sm text-muted-foreground">Sin fotos disponibles</span>
          </div>
        ) : (
          <>
            <div className="rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-96 relative group">
              <img src={images[currentImg]} alt="" className="w-full h-full object-cover transition-opacity duration-300" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                  {LISTING_TYPE_LABELS[listing.listing_type]}
                </Badge>
              </div>
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImg(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImg(i => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setCurrentImg(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? "bg-white scale-125" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImg(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === currentImg ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{listing.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {isOwner ? (
                <span>{listing.direccion && `${listing.direccion}, `}{listing.localidad}, {listing.provincia} {listing.codigo_postal}</span>
              ) : (
                <span>{listing.localidad}, {listing.provincia} {listing.codigo_postal} <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Dirección exacta privada</span></span>
              )}
            </div>
          </div>

          {listing.description && (
            <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
          )}

          {/* Property details */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><Home className="w-4 h-4 text-primary" /> Características</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {listing.tipo_vivienda && <InfoItem icon={Building2} label="Tipo" value={PROPERTY_TYPE_LABELS[listing.tipo_vivienda]} />}
                {listing.num_dormitorios > 0 && <InfoItem icon={BedDouble} label="Dormitorios" value={listing.num_dormitorios} />}
                {listing.num_banos > 0 && <InfoItem icon={Bath} label="Baños" value={listing.num_banos} />}
                {listing.num_plazas > 0 && <InfoItem icon={Users} label="Plazas" value={listing.num_plazas} />}
                {listing.plazo_alquiler && <InfoItem icon={Calendar} label="Plazo" value={LEASE_LABELS[listing.plazo_alquiler]} />}
                {listing.uso_habitacion && <InfoItem icon={BedDouble} label="Habitación" value={ROOM_USE_LABELS[listing.uso_habitacion]} />}
              </div>
              {listing.bano_propio !== undefined && (
                <Badge className={listing.bano_propio ? "bg-accent/10 text-accent border-accent/20" : "bg-muted text-muted-foreground"}>
                  <Bath className="w-3 h-3 mr-1" /> {listing.bano_propio ? "Baño propio ✓" : "Baño compartido"}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Cohabitation */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Convivencia y normas</h3>
              <div className="grid grid-cols-2 gap-3">
                {listing.sexo_permitido && (
                  <Badge variant="outline" className="justify-center py-2">{GENDER_LABELS[listing.sexo_permitido]}</Badge>
                )}
                {listing.actividad_permitida && (
                  <Badge variant="outline" className="justify-center py-2">{ACTIVITY_LABELS[listing.actividad_permitida]}</Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><PawPrint className="w-4 h-4" /> Mascotas: {listing.mascotas ? "Sí" : "No"}</span>
                <span className="flex items-center gap-1"><Cigarette className="w-4 h-4" /> Fumar: {listing.fumar ? "Sí" : "No"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Amenities & Transport */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><Thermometer className="w-4 h-4 text-primary" /> Comodidades y transporte</h3>
              <div className="flex flex-wrap gap-2">
                {listing.calefaccion && <Badge variant="outline"><Thermometer className="w-3 h-3 mr-1" /> Calefacción</Badge>}
                {listing.aire_acondicionado && <Badge variant="outline"><Wind className="w-3 h-3 mr-1" /> Aire acond.</Badge>}
                {listing.parking && <Badge variant="outline"><Car className="w-3 h-3 mr-1" /> Parking ({listing.parking_plazas || 1} plaza{(listing.parking_plazas || 1) > 1 ? "s" : ""})</Badge>}
                {listing.gastos_agua && <Badge variant="outline">Agua incl.</Badge>}
                {listing.gastos_luz && <Badge variant="outline">Luz incl.</Badge>}
                {listing.gastos_internet && <Badge variant="outline">Internet incl.</Badge>}
              </div>
              {(listing.dist_autobus || listing.dist_metro || listing.dist_ferrocarril || listing.dist_tranvia) && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    {listing.dist_autobus && <TransportItem icon={Bus} label="Autobús" dist={listing.dist_autobus} />}
                    {listing.dist_metro && <TransportItem icon={Train} label="Metro" dist={listing.dist_metro} />}
                    {listing.dist_ferrocarril && <TransportItem icon={Train} label="Ferrocarril" dist={listing.dist_ferrocarril} />}
                    {listing.dist_tranvia && <TransportItem icon={Train} label="Tranvía" dist={listing.dist_tranvia} />}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Companion profile */}
          {listing.listing_type === "companero_piso" && listing.contacto_nombre && (
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold flex items-center gap-2"><UserCircle className="w-4 h-4 text-primary" /> Perfil del compañero</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Nombre:</span> <span className="font-medium">{listing.contacto_nombre?.split(" ")[0]}</span></div>
                  {listing.contacto_edad && <div><span className="text-muted-foreground">Edad:</span> <span className="font-medium">{listing.contacto_edad} años</span></div>}
                  {listing.contacto_sexo && <div><span className="text-muted-foreground">Sexo:</span> <span className="font-medium capitalize">{listing.contacto_sexo}</span></div>}
                  {listing.contacto_actividad && <div><span className="text-muted-foreground">Actividad:</span> <span className="font-medium capitalize">{listing.contacto_actividad}</span></div>}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-24">
            <CardContent className="p-5 space-y-4">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-foreground">{listing.precio_mensual || 0}€</div>
                <span className="text-muted-foreground text-sm">/mes</span>
                {listing.fianza_meses && (
                  <p className="text-xs text-muted-foreground mt-1">Fianza: {listing.fianza_meses} mes{listing.fianza_meses > 1 ? "es" : ""}</p>
                )}
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>Contacto protegido — tus datos solo se revelan tras aceptación</span>
              </div>
              {!isOwner && (
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-lg" size="lg" onClick={() => setContactDialog(true)}>
                  <Send className="w-5 h-5 mr-2" />
                  ¡Me interesa! Contactar
                </Button>
              )}
              {isOwner && (
                <p className="text-center text-sm text-muted-foreground">Este es tu anuncio</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating CTA for mobile */}
      {!isOwner && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border lg:hidden z-40 flex items-center gap-3">
          <div className="flex-1">
            <span className="font-bold text-xl">{listing.precio_mensual || 0}€</span>
            <span className="text-muted-foreground text-sm">/mes</span>
          </div>
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-lg" size="lg" onClick={() => setContactDialog(true)}>
            <Send className="w-4 h-4 mr-2" />
            ¡Me interesa!
          </Button>
        </div>
      )}

      {/* Contact Dialog */}
      <Dialog open={contactDialog} onOpenChange={setContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar contacto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              El propietario verá tu perfil antes de aceptar. Rellena tus datos para mejorar tus posibilidades.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tu edad</Label>
                <Input type="number" value={contactForm.edad} onChange={(e) => setContactForm(p => ({ ...p, edad: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Tu sexo</Label>
                <Select value={contactForm.sexo} onValueChange={(v) => setContactForm(p => ({ ...p, sexo: v }))}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hombre">Hombre</SelectItem>
                    <SelectItem value="mujer">Mujer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Tu actividad</Label>
              <Select value={contactForm.actividad} onValueChange={(v) => setContactForm(p => ({ ...p, actividad: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="estudiante">Estudiante</SelectItem>
                  <SelectItem value="trabajo">Trabajador/a</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Mensaje</Label>
              <Textarea value={contactForm.message} onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))} placeholder="Preséntate brevemente..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialog(false)}>Cancelar</Button>
            <Button onClick={() => sendContact.mutate()} disabled={sendContact.isPending}>
              <Send className="w-4 h-4 mr-2" /> Enviar solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function TransportItem({ icon: Icon, label, dist }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
      <Icon className="w-4 h-4 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-sm">{dist}m</p>
      </div>
    </div>
  );
}
