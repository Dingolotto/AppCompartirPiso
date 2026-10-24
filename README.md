# ComparteTuPiso.es

Plataforma de matchmaking inmobiliario: conecta propietarios, buscadores de habitación y compañeros de piso con filtros de convivencia, transporte y actividad.

## Estado del proyecto

- **Prototipado**: Figma → ver [`docs/figma/`](docs/figma/)
- **Modelo de datos y parámetros**: [`docs/parametros.xlsx`](docs/parametros.xlsx)
- **App funcional**: construida en Base44 (low-code + IA), con funcionalidades propias añadidas por código.
  - Demo: <link al editor/preview o URL publicada>
  - El código fuente completo se sincronizará aquí cuando se exporte desde Base44 (requiere plan Builder).

## Funcionalidades

- Búsqueda y filtrado de anuncios (piso completo, plaza, compañero de piso, grupo de alquiler)
- Publicación de anuncios con gestión de imágenes
- Sistema de solicitudes de contacto entre usuarios
- Búsquedas guardadas ("Mi Radar")
- Panel de administración con gestión completa de las 4 entidades

## Stack

- Base44 (frontend React + backend gestionado)
- Entidades: `Listing`, `ContactRequest`, `SavedSearch`, `User`

## Estructura del repositorio

```
comparte-tu-piso/
├── docs/
│   ├── parametros.xlsx       # parámetros de cada punto del proyecto
│   ├── figma/                # link al prototipo + capturas exportadas
│   └── capturas/              # capturas de la app funcionando
└── codigo-manual/             # código propio añadido fuera del builder de Base44
```

## Ramas

- `main` — versión estable
- `docs` — documentación (Excel, Figma, capturas)
- `codigo-manual` — desarrollo de funcionalidades propias en código
