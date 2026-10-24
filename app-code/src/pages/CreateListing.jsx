import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Home, BedDouble, Users, ArrowLeft, ArrowRight, Check, Upload, ImagePlus
} from "lucide-react";
import { LISTING_TYPE_LABELS } from "@/lib/constants";
import LocationFields from "@/components/forms/LocationFields";
import PropertyFields from "@/components/forms/PropertyFields";
import AmenitiesFields from "@/components/forms/AmenitiesFields";
import EconomicFields from "@/components/forms/EconomicFields";
import CohabitationFields from "@/components/forms/CohabitationFields";
import CompaneroFields from "@/components/forms/CompaneroFields";

const typeOptions = [
  { id: "casa_completa", icon: Home, label: "Casa Completa", desc: "Alquiler íntegro de vivienda" },
  { id: "plaza_alojamiento", icon: BedDouble, label: "Habitación", desc: "Una habitación en piso compartido" },
  { id: "companero_piso", icon: Users, label: "Compañero de Piso", desc: "Buscas alguien para tu piso" },
  { id: "grupo_alquiler", icon: Users, label: "Busco Compañeros para Alquilar una Casa", desc: "Buscas compañeros para alquilar una vivienda juntos" },
];

export default function CreateListing() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialType = urlParams.get("type") || "";

  const [step, setStep] = useState(initialType ? 1 : 0);
  const [formData, setFormData] = useState({ listing_type: initialType, status: "active" });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const onChange = (newData) => setFormData(newData);
  const type = formData.listing_type;

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      urls.push(file_url);
    }
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...urls] }));
  };

  const handleSubmit = async () => {
    if (!formData.listing_type) {
      toast({ title: "Falta el tipo de anuncio", description: "Selecciona qué ofreces.", variant: "destructive" });
      return;
    }
    if (!formData.title || !formData.title.trim()) {
      toast({ title: "Falta el título", description: "Añade un título a tu anuncio.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await base44.entities.Listing.create(formData);
      toast({ title: "¡Anuncio publicado!", description: "Tu anuncio ya está visible." });
      navigate("/my-listings");
    } catch (err) {
      toast({ title: "Error al publicar", description: err?.message || "Inténtalo de nuevo.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Step 0: Choose type
  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Publicar anuncio</h1>
          <p className="text-muted-foreground mt-1">¿Qué tipo de oferta quieres publicar?</p>
        </div>
        <div className="space-y-4">
          {typeOptions.map((opt) => (
            <Card
              key={opt.id}
              className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                type === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}
              onClick={() => setFormData(prev => ({ ...prev, listing_type: opt.id }))}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <opt.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{opt.label}</h3>
                  <p className="text-sm text-muted-foreground">{opt.desc}</p>
                </div>
                {type === opt.id && (
                  <div className="ml-auto w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={() => setStep(1)} disabled={!type} className="w-full" size="lg">
          Continuar <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // Step 1: Form
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => setStep(0)} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> Cambiar tipo
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {LISTING_TYPE_LABELS[type]}
          </h1>
          <p className="text-muted-foreground mt-1">Rellena los datos de tu anuncio</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-8">
          {/* Title & Description */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Título del anuncio *</Label>
              <Input
                value={formData.title || ""}
                onChange={(e) => onChange({ ...formData, title: e.target.value })}
                placeholder="Ej: Habitación luminosa en el centro"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => onChange({ ...formData, description: e.target.value })}
                placeholder="Describe tu oferta con detalle..."
                rows={4}
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-3">
            <Label>Fotografías</Label>
            <div className="flex flex-wrap gap-3">
              {(formData.images || []).map((url, i) => (
                <div key={i} className="w-24 h-24 rounded-xl overflow-hidden border border-border">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors">
                <ImagePlus className="w-6 h-6 text-muted-foreground" />
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <Separator />

          {/* Companero profile fields */}
          {(type === "companero_piso" || type === "grupo_alquiler") && (
            <>
              <CompaneroFields data={formData} onChange={onChange} />
              <Separator />
            </>
          )}

          <LocationFields data={formData} onChange={onChange} grouped={type === "grupo_alquiler"} />

          {type !== "grupo_alquiler" && (
            <>
              <Separator />
              <PropertyFields data={formData} onChange={onChange} listingType={type} />
              <Separator />
              <EconomicFields data={formData} onChange={onChange} />
              <Separator />
              <CohabitationFields data={formData} onChange={onChange} />
              <Separator />
              <AmenitiesFields data={formData} onChange={onChange} />
            </>
          )}

          <div className="pt-4">
            <Button onClick={handleSubmit} disabled={saving} className="w-full" size="lg">
              {saving ? "Publicando..." : "Publicar anuncio"}
              {!saving && <Check className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
