import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  MapPin, Euro, Bus, Train, Thermometer, Car, Bath,
  Users, BedDouble, Home, Building2, ImageOff
} from "lucide-react";
import {
  LISTING_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  GENDER_LABELS,
  ACTIVITY_LABELS,
} from "@/lib/constants";

const typeIcons = {
  casa_completa: Home,
  plaza_alojamiento: BedDouble,
  companero_piso: Users,
  grupo_alquiler: Users,
};

const typeColors = {
  casa_completa: "bg-primary/10 text-primary border-primary/20",
  plaza_alojamiento: "bg-secondary/10 text-secondary border-secondary/20",
  companero_piso: "bg-accent/10 text-accent border-accent/20",
  grupo_alquiler: "bg-chart-4/10 text-chart-4 border-chart-4/20",
};

export default function ListingCard({ listing }) {
  const TypeIcon = typeIcons[listing.listing_type] || Home;
  const imgUrl = listing.images?.[0];

  return (
    <Link to={`/listing/${listing.id}`}>
      <Card className="group overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-muted">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted/60">
              <ImageOff className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <span className="text-xs text-muted-foreground">Sin fotos</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={`${typeColors[listing.listing_type]} border text-xs font-semibold`}>
              <TypeIcon className="w-3 h-3 mr-1" />
              {LISTING_TYPE_LABELS[listing.listing_type]}
            </Badge>
          </div>
          <div className="absolute bottom-3 right-3">
            <div className="bg-foreground/80 text-background px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <span className="text-lg font-bold">{listing.precio_mensual || 0}€</span>
              <span className="text-xs opacity-80">/mes</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title || "Sin título"}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">
              {listing.localidad}{listing.provincia ? `, ${listing.provincia}` : ""}
            </span>
          </div>

          {/* Property info row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {listing.tipo_vivienda && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {PROPERTY_TYPE_LABELS[listing.tipo_vivienda]}
              </span>
            )}
            {listing.num_dormitorios > 0 && (
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" />
                {listing.num_dormitorios} hab.
              </span>
            )}
            {listing.num_banos > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" />
                {listing.num_banos} baños
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {listing.bano_propio && (
              <Badge variant="outline" className="text-xs bg-accent/5 text-accent border-accent/20">
                <Bath className="w-3 h-3 mr-1" /> Baño propio
              </Badge>
            )}
            {listing.sexo_permitido && listing.sexo_permitido !== "indiferente" && (
              <Badge variant="outline" className="text-xs">
                {GENDER_LABELS[listing.sexo_permitido]}
              </Badge>
            )}
            {listing.actividad_permitida && listing.actividad_permitida !== "indiferente" && (
              <Badge variant="outline" className="text-xs">
                {ACTIVITY_LABELS[listing.actividad_permitida]}
              </Badge>
            )}
            {listing.parking && (
              <Badge variant="outline" className="text-xs">
                <Car className="w-3 h-3 mr-1" /> Parking
              </Badge>
            )}
          </div>

          {/* Transport mini-row */}
          {(listing.dist_autobus || listing.dist_metro || listing.dist_ferrocarril) && (
            <div className="flex items-center gap-3 pt-2 border-t border-border text-xs text-muted-foreground">
              {listing.dist_autobus && (
                <span className="flex items-center gap-1">
                  <Bus className="w-3.5 h-3.5" /> {listing.dist_autobus}m
                </span>
              )}
              {listing.dist_metro && (
                <span className="flex items-center gap-1">
                  <Train className="w-3.5 h-3.5" /> {listing.dist_metro}m
                </span>
              )}
              {listing.dist_ferrocarril && (
                <span className="flex items-center gap-1">
                  <Train className="w-3.5 h-3.5" /> {listing.dist_ferrocarril}m
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
