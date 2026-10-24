import {
  Home, MessageSquare, Radar, Users
} from "lucide-react";

// Configuración por entidad para el panel de administración.
// `columns` son las columnas que se muestran en la tabla.
// `fields` cubre el 100% de los campos del schema de cada entidad,
// con el tipo de control correcto (text, textarea, number, boolean, enum, list, object).
export const adminEntities = {
  Listing: {
    label: "Anuncios",
    icon: Home,
    table: "listings",
    columns: [
      { key: "title", label: "Título" },
      { key: "listing_type", label: "Tipo" },
      { key: "provincia", label: "Provincia" },
      { key: "precio_mensual", label: "€/mes" },
      { key: "status", label: "Estado" },
    ],
    fields: [
      // Identidad del anuncio
      { key: "title", label: "Título", type: "text" },
      { key: "listing_type", label: "Tipo de oferta", type: "enum", options: ["casa_completa", "plaza_alojamiento", "companero_piso", "grupo_alquiler"] },
      { key: "status", label: "Estado", type: "enum", options: ["active", "paused", "rented"] },
      { key: "description", label: "Descripción", type: "textarea" },
      { key: "images", label: "Imágenes (una URL por línea)", type: "list" },
      // Ubicación
      { key: "provincia", label: "Provincia", type: "text" },
      { key: "localidad", label: "Localidad", type: "text" },
      { key: "codigo_postal", label: "Código postal", type: "text" },
      { key: "direccion", label: "Dirección", type: "text" },
      { key: "tipo_vivienda", label: "Tipo de vivienda", type: "enum", options: ["casa_ciudad", "casa_rustica", "piso_ciudad", "piso_rustico"] },
      // Económico y plazos
      { key: "precio_mensual", label: "Precio €/mes", type: "number" },
      { key: "fianza_meses", label: "Fianza (meses)", type: "number" },
      { key: "plazo_alquiler", label: "Plazo de alquiler", type: "enum", options: ["indefinido", "anual", "curso_academico", "otro"] },
      { key: "plazo_meses", label: "Plazo (meses, si 'otro')", type: "number" },
      { key: "gastos_incluidos", label: "Gastos incluidos", type: "boolean" },
      { key: "gastos_agua", label: "Agua incluida", type: "boolean" },
      { key: "gastos_luz", label: "Luz incluida", type: "boolean" },
      { key: "gastos_internet", label: "Internet incluido", type: "boolean" },
      // Capacidad
      { key: "num_dormitorios", label: "Dormitorios", type: "number" },
      { key: "num_dormitorios_individuales", label: "Dormitorios individuales", type: "number" },
      { key: "num_dormitorios_compartidos", label: "Dormitorios compartidos", type: "number" },
      { key: "num_banos", label: "Baños", type: "number" },
      { key: "num_plazas", label: "Plazas totales", type: "number" },
      { key: "plazas_habitacion", label: "Plazas en la habitación", type: "number" },
      { key: "uso_habitacion", label: "Uso de habitación", type: "enum", options: ["individual", "compartida"] },
      { key: "bano_propio", label: "Baño propio", type: "boolean" },
      // Comodidades
      { key: "calefaccion", label: "Calefacción", type: "boolean" },
      { key: "aire_acondicionado", label: "Aire acondicionado", type: "boolean" },
      { key: "parking", label: "Parking", type: "boolean" },
      { key: "parking_plazas", label: "Plazas de parking", type: "number" },
      // Convivencia
      { key: "sexo_permitido", label: "Sexo permitido", type: "enum", options: ["solo_hombres", "solo_mujeres", "indiferente"] },
      { key: "actividad_permitida", label: "Actividad permitida", type: "enum", options: ["solo_estudiantes", "solo_trabajo", "indiferente"] },
      { key: "mascotas", label: "Mascotas", type: "boolean" },
      { key: "fumar", label: "Fumar", type: "boolean" },
      // Transporte
      { key: "dist_autobus", label: "Dist. autobús (m)", type: "number" },
      { key: "dist_metro", label: "Dist. metro (m)", type: "number" },
      { key: "dist_ferrocarril", label: "Dist. ferrocarril (m)", type: "number" },
      { key: "dist_tranvia", label: "Dist. tranvía (m)", type: "number" },
      // Contacto / compañero
      { key: "contacto_nombre", label: "Contacto: nombre", type: "text" },
      { key: "contacto_edad", label: "Contacto: edad", type: "number" },
      { key: "contacto_sexo", label: "Contacto: sexo", type: "enum", options: ["hombre", "mujer"] },
      { key: "contacto_actividad", label: "Contacto: actividad", type: "enum", options: ["estudiante", "trabajo", "otro"] },
      { key: "contacto_email", label: "Contacto: email", type: "text" },
      { key: "contacto_telefono", label: "Contacto: teléfono", type: "text" },
    ],
  },
  ContactRequest: {
    label: "Solicitudes",
    icon: MessageSquare,
    table: "contact_requests",
    columns: [
      { key: "requester_name", label: "Solicitante" },
      { key: "listing_id", label: "Anuncio" },
      { key: "status", label: "Estado" },
      { key: "created_date", label: "Fecha" },
    ],
    fields: [
      { key: "listing_id", label: "ID del anuncio", type: "text" },
      { key: "requester_id", label: "ID del solicitante", type: "text" },
      { key: "requester_name", label: "Nombre del solicitante", type: "text" },
      { key: "requester_message", label: "Mensaje", type: "textarea" },
      { key: "requester_edad", label: "Edad", type: "number" },
      { key: "requester_sexo", label: "Sexo", type: "enum", options: ["hombre", "mujer"] },
      { key: "requester_actividad", label: "Actividad", type: "enum", options: ["estudiante", "trabajo", "otro"] },
      { key: "owner_id", label: "ID del propietario", type: "text" },
      { key: "status", label: "Estado", type: "enum", options: ["pending", "accepted", "rejected"] },
    ],
  },
  SavedSearch: {
    label: "Búsquedas guardadas",
    icon: Radar,
    table: "saved_searches",
    columns: [
      { key: "name", label: "Nombre" },
      { key: "search_type", label: "Tipo" },
      { key: "notify", label: "Notificar" },
      { key: "new_matches_count", label: "Nuevos" },
    ],
    fields: [
      { key: "name", label: "Nombre", type: "text" },
      { key: "search_type", label: "Tipo de búsqueda", type: "enum", options: ["casa_completa", "plaza_alojamiento", "companero_piso", "grupo_alquiler"] },
      { key: "filters", label: "Filtros (JSON)", type: "object" },
      { key: "notify", label: "Notificar", type: "boolean" },
      { key: "new_matches_count", label: "Nuevos matches", type: "number" },
    ],
  },
  User: {
    label: "Usuarios",
    icon: Users,
    table: "profiles",
    note: "Los campos integrados del usuario (nombre, email, fechas) los gestiona el backend y no son editables — solo el rol puede modificarse.",
    columns: [
      { key: "full_name", label: "Nombre" },
      { key: "email", label: "Email" },
      { key: "role", label: "Rol" },
      { key: "created_date", label: "Alta" },
    ],
    fields: [
      { key: "full_name", label: "Nombre (no editable)", type: "text", readOnly: true },
      { key: "email", label: "Email (no editable)", type: "text", readOnly: true },
      { key: "role", label: "Rol", type: "enum", options: ["admin", "user"] },
    ],
  },
};
