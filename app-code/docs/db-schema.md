# Esquema de base de datos — ComparteTuPiso.es

Este documento describe la estructura real de las 4 entidades que usa la
aplicación, extraída directamente del código fuente (`admin-config.jsx`,
los componentes de formulario en `src/components/forms/`, `SearchFilters.jsx`
y `constants.js`). No contiene datos de ejemplo: es solo la estructura,
pensada para poder recrearla en una base de datos externa (PostgreSQL,
Supabase, etc.) cuando se migre fuera de Base44.

Todas las entidades, además de los campos listados, tienen estos campos
incorporados por la plataforma (y que cualquier BD externa debe replicar):

- `id` (identificador único)
- `created_by_id` (id del usuario que creó el registro) — en `Listing` y
  `SavedSearch`; en `ContactRequest` el equivalente son `owner_id` /
  `requester_id`
- `created_date`
- `updated_date`

---

## 1. `Listing` (anuncios)

| Campo | Tipo | Valores / notas |
|---|---|---|
| `title` | texto | título del anuncio |
| `listing_type` | enum | `casa_completa`, `plaza_alojamiento`, `companero_piso`, `grupo_alquiler` |
| `status` | enum | `active`, `paused`, `rented` |
| `description` | texto largo | |
| `images` | lista de URLs | subidas vía `UploadPublicFile` |
| `provincia` | texto | una de las 49 provincias de España (ver `PROVINCIAS_ESPANA` en `constants.js`) |
| `localidad` | texto | |
| `codigo_postal` | texto | |
| `direccion` | texto | solo visible al propietario / tras aceptar contacto |
| `tipo_vivienda` | enum | `casa_ciudad`, `casa_rustica`, `piso_ciudad`, `piso_rustico` |
| `precio_mensual` | número | € / mes |
| `fianza_meses` | número | |
| `plazo_alquiler` | enum | `indefinido`, `anual`, `curso_academico`, `otro` |
| `plazo_meses` | número | solo si `plazo_alquiler = otro` |
| `gastos_agua` | booleano | |
| `gastos_luz` | booleano | |
| `gastos_internet` | booleano | |
| `num_dormitorios` | número | |
| `num_dormitorios_individuales` | número | solo relevante en `casa_completa` |
| `num_dormitorios_compartidos` | número | solo relevante en `casa_completa` |
| `num_banos` | número | |
| `num_plazas` | número | plazas totales |
| `plazas_habitacion` | número | solo si `uso_habitacion = compartida` |
| `uso_habitacion` | enum | `individual`, `compartida` (solo `plaza_alojamiento` / `companero_piso`) |
| `bano_propio` | booleano | |
| `calefaccion` | booleano | |
| `aire_acondicionado` | booleano | |
| `parking` | booleano | |
| `parking_plazas` | número | solo si `parking = true` |
| `sexo_permitido` | enum | `solo_hombres`, `solo_mujeres`, `indiferente` |
| `actividad_permitida` | enum | `solo_estudiantes`, `solo_trabajo`, `indiferente` |
| `mascotas` | booleano | |
| `fumar` | booleano | |
| `dist_autobus` | número | metros a la parada más cercana |
| `dist_metro` | número | metros |
| `dist_ferrocarril` | número | metros |
| `dist_tranvia` | número | metros |
| `contacto_nombre` | texto | perfil del compañero (`companero_piso` / `grupo_alquiler`) |
| `contacto_edad` | número | |
| `contacto_sexo` | enum | `hombre`, `mujer` |
| `contacto_actividad` | enum | `estudiante`, `trabajo`, `otro` |
| `contacto_email` | texto | privado |
| `contacto_telefono` | texto | privado |

## 2. `ContactRequest` (solicitudes de contacto)

| Campo | Tipo | Notas |
|---|---|---|
| `listing_id` | referencia | id del `Listing` |
| `requester_id` | referencia | id del usuario que solicita contacto |
| `requester_name` | texto | |
| `requester_message` | texto largo | |
| `requester_edad` | número | |
| `requester_sexo` | enum | `hombre`, `mujer` |
| `requester_actividad` | enum | `estudiante`, `trabajo`, `otro` |
| `owner_id` | referencia | id del propietario del anuncio |
| `status` | enum | `pending`, `accepted`, `rejected` |

## 3. `SavedSearch` (Mi Radar — búsquedas guardadas)

| Campo | Tipo | Notas |
|---|---|---|
| `name` | texto | nombre de la alerta |
| `search_type` | enum | mismo set que `listing_type` |
| `filters` | objeto JSON | copia exacta del estado de filtros de `SearchListings.jsx` |
| `notify` | booleano | |
| `new_matches_count` | número | |

## 4. `User` (usuarios)

Gestionado por el sistema de autenticación de la plataforma (nombre, email,
fechas no editables manualmente). El único campo de negocio es:

| Campo | Tipo | Notas |
|---|---|---|
| `role` | enum | `admin`, `user` |

---

## Notas para la migración a una BD externa

- Ningún dato de ejemplo debe copiarse: solo la estructura de arriba.
- Al montar la BD externa, los anuncios, solicitudes y búsquedas deben
  nacer siempre de una acción real (un usuario publicando, contactando o
  guardando una búsqueda), nunca de un seed/script de datos de prueba.
- `images` como lista de URLs asume un storage de ficheros aparte (hoy
  `UploadPublicFile` de Base44); al migrar habrá que decidir dónde se
  alojan las imágenes.
