import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Home as HomeIcon, BedDouble, Users, Search,
  Shield, Zap, MapPin, ArrowRight, Star, PlusCircle
} from "lucide-react";

const offerRoles = [
  {
    id: "casa_completa",
    icon: HomeIcon,
    title: "Ofrezco Casa Completa",
    subtitle: "Soy propietario y alquilo la vivienda entera",
    desc: "Publica tu vivienda para alquiler íntegro con filtros de convivencia",
    color: "bg-primary",
    link: "/create?type=casa_completa",
  },
  {
    id: "plaza_alojamiento",
    icon: BedDouble,
    title: "Ofrezco Habitación",
    subtitle: "Tengo piso y alquilo una o varias habitaciones",
    desc: "Alquila una habitación en tu piso con control total de compatibilidad",
    color: "bg-secondary",
    link: "/create?type=plaza_alojamiento",
  },
  {
    id: "companero_piso",
    icon: Users,
    title: "Busco Compañero de Piso",
    subtitle: "Vivo en un piso y busco a alguien que comparta gastos",
    desc: "Muestra tu perfil y el ambiente de tu casa para encontrar al inquilino ideal",
    color: "bg-accent",
    link: "/create?type=companero_piso",
  },
  {
    id: "grupo_alquiler",
    icon: Users,
    title: "Busco Compañeros para Alquilar una Casa",
    subtitle: "Quiero alquilar una vivienda pero necesito compañeros para firmar",
    desc: "Forma un grupo para buscar y alquilar una vivienda juntos",
    color: "bg-chart-4",
    link: "/create?type=grupo_alquiler",
  },
];

const searchRoles = [
  {
    id: "buscar_casa",
    icon: HomeIcon,
    title: "Busco Casa Completa",
    subtitle: "Quiero alquilar una vivienda entera",
    desc: "Explora viviendas enteras disponibles para alquilar",
    color: "bg-primary",
    link: "/search?type=casa_completa",
  },
  {
    id: "buscar_habitacion",
    icon: BedDouble,
    title: "Busco Habitación",
    subtitle: "Busco una habitación en un piso compartido",
    desc: "Encuentra habitaciones en pisos compartidos con tus filtros",
    color: "bg-secondary",
    link: "/search?type=plaza_alojamiento",
  },
  {
    id: "buscar_companero",
    icon: Users,
    title: "Busco Compañero de Piso",
    subtitle: "Tengo o busco piso y quiero encontrar con quién compartirlo",
    desc: "Conecta con personas que buscan inquilino para su piso",
    color: "bg-accent",
    link: "/search?type=companero_piso",
  },
  {
    id: "buscar_grupo",
    icon: Search,
    title: "Busco Grupo para Alquilar",
    subtitle: "Quiero unirme a otras personas para alquilar una casa juntos",
    desc: "Únete a un grupo que quiere alquilar una vivienda en conjunto",
    color: "bg-chart-4",
    link: "/search?type=grupo_alquiler",
  },
];

const features = [
  {
    icon: Zap,
    title: "Matchmaking Inteligente",
    desc: "Nuestro Radar cruza tus preferencias con las nuevas ofertas automáticamente",
  },
  {
    icon: Shield,
    title: "Contacto Protegido",
    desc: "Tus datos de contacto solo se revelan cuando tú aceptas la solicitud",
  },
  {
    icon: MapPin,
    title: "Filtros de Precisión",
    desc: "Transporte, convivencia, género, actividad — encuentra exactamente lo que buscas",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground p-8 sm:p-12 lg:p-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-white/20 text-white border-white/30 mb-6 text-sm">
            <Star className="w-3 h-3 mr-1" /> Matchmaking inmobiliario
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Tu hogar ideal,
            <br />
            <span className="text-white/80">a un match de distancia</span>
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-lg leading-relaxed">
            Compartetupiso.es conecta ofertantes y buscadores con filtros de alta precisión:
            convivencia, transporte, actividad y mucho más.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/search">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg">
                <Search className="w-5 h-5 mr-2" />
                Buscar alojamiento
              </Button>
            </Link>
            <Link to="/create">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-semibold">
                Publicar anuncio
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Offer Cards */}
      <section>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold px-4 py-1.5 rounded-full text-sm mb-4">
            <PlusCircle className="w-4 h-4" /> Quiero publicar una oferta
          </div>
          <h2 className="text-3xl font-bold text-foreground">¿Qué ofreces?</h2>
          <p className="mt-2 text-muted-foreground text-lg">Publica tu anuncio y conecta con inquilinos compatibles</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offerRoles.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={role.link}>
                <Card className="group p-6 h-full border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className={`w-12 h-12 rounded-2xl ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-1">{role.title}</h3>
                  <p className="text-xs text-muted-foreground italic mb-2">({role.subtitle})</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{role.desc}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-primary">
                    Publicar <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Search Cards */}
      <section>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary font-semibold px-4 py-1.5 rounded-full text-sm mb-4">
            <Search className="w-4 h-4" /> Quiero buscar alojamiento
          </div>
          <h2 className="text-3xl font-bold text-foreground">¿Qué buscas?</h2>
          <p className="mt-2 text-muted-foreground text-lg">Encuentra lo que necesitas con filtros de alta precisión</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {searchRoles.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={role.link}>
                <Card className="group p-6 h-full border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className={`w-12 h-12 rounded-2xl ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-1">{role.title}</h3>
                  <p className="text-xs text-muted-foreground italic mb-2">({role.subtitle})</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{role.desc}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-secondary">
                    Buscar <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="text-center space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <f.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
