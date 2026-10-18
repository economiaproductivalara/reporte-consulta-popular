# Sistema de Seguimiento y Reporte de Participación | MPPAPT Lara
### 2da Consulta Popular Nacional — 18 de Octubre de 2026

Plataforma web modular, ultrarrápida, responsiva y de baja carga cognitiva desarrollada para el **Ministerio del Poder Popular para la Agricultura Productiva y Tierras (MPPAPT - Lara)** y sus entes adscritos (*INTI, INSAI, CIARA, INDER, Banco Agrícola de Venezuela, FONDAS, Agropatria, Corpolara, Pescalba*).

---

## 🏛️ 1. Arquitectura Tecnológica y Despliegue

- **Frontend:** React + Vite + TypeScript, Tailwind CSS v4, Lucide React (iconografía de alta fidelidad), Canvas Confetti (microinteracciones festivas) y síntesis Web Audio API sin dependencias externas pesadas.
- **Despliegue en Producción:** Configurado con `vercel.json` optimizado para Vercel (Edge runtime y Serverless SPA con caché inmutable en assets).
- **Backend & Base de Datos:** Google Apps Script configurado como Web App RESTful JSON (`doGet` y `doPost`) consumiendo directamente la hoja de cálculo de Google Sheets con ID:
  ```text
  1NjErQyP-4q6uY495uG82PF73j7Q2rAviXYmFsodi-WY
  ```
- **Arquitectura Dual Resiliente (Zero Downtime / Offline):** El sistema opera con sincronización optimista. Si no se dispone de conexión a internet o el Web App no ha sido implementado, utiliza un motor local (`localStorage`) precargado con el padrón del estado Lara y sincronizable en cualquier momento.

---

## ⚡ 2. Módulo de Registro / Consulta Rápida (Búsqueda y Reporte)

1. **Entrada de Cédula:**
   - Input centrado, con selector rápido de nacionalidad (V / E), autoenfoque y filtro numérico estricto (`inputMode="numeric"`, regex `^\d+$`).
   - Búsqueda reactiva automática al completar la longitud (7-8 dígitos) o al presionar Enter/Buscar.
2. **Visualización y Edición Condicional:**
   - Despliegue de ficha con: `NACIONALIDAD`, `CÉDULA`, `APELLIDOS Y NOMBRES`, `TELÉFONO`, `INSTITUCIÓN`, `ESTADO` y `MUNICIPIO`.
   - **Regla de edición:** Si los campos `ESTADO` o `MUNICIPIO` están vacíos/nulos, se habilitan selects dinámicos para completarlos antes de permitir el reporte.
   - Si el estado es **LARA**, el selector despliega los 9 municipios oficiales. Si es otro estado del país, se activa automáticamente la categoría de **PARTICIPACIÓN FORÁNEA**.
3. **Botón Principal:**
   - **`PARTICIPACIÓN EFECTIVA`** con microinteracción táctil, chime auditivo de victoria, lluvia de confetti y estado de carga mientras procesa.
4. **Transformación de Datos:**
   - Sanitización estricta de todos los campos a **MAYÚSCULAS** (`UPPERCASE`).

---

## 📊 3. Dashboard Analítico y Mapeo Territorial

1. **KPIs Clave:**
   - Total Meta de Trabajadores / Padrón MPPAPT Lara.
   - Total de Participaciones Efectivas Reportadas.
   - Porcentaje de Cumplimiento de Meta con barra de progreso visual.
   - Distribución comparativa porcentual por entes adscritos.
2. **Filtros Avanzados y Live Search:**
   - Búsqueda en vivo instantánea con autocompletado reactivo por institución, municipio, estado y estatus de voto.
3. **Mapeo Territorial de Lara (9 Municipios):**
   - Mapa interactivo vectorial SVG con la división política exacta y los colores institucionales: *Iribarren, Palavecino, Crespo, Urdaneta, Torres, Jiménez, Morán, Andrés Eloy Blanco y Simón Planas*.
   - Tooltips flotantes interactivos con estadísticas de votos y porcentaje de avance.
   - Clic en cualquier municipio para filtrar el padrón inmediatamente.
4. **Alerta de Participación Foránea:**
   - Componente y badge distintivo **`PARTICIPACIÓN FORÁNEA`** para trabajadores de Lara reportados en comisiones de servicio o residencia en otros estados (Distrito Capital, Yaracuy, Portuguesa, Falcón, etc.).

---

## 🚀 4. Instalación y Ejecución Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build

# 4. Probar build localmente
npm run preview
```

---

## 🌐 5. Despliegue en Vercel

1. Sube este repositorio a GitHub / GitLab.
2. Importa el proyecto en [Vercel](https://vercel.com).
3. Vercel detectará automáticamente la configuración con `vercel.json` y `npm run build`.
4. (Opcional) Configura la variable de entorno `VITE_APPS_SCRIPT_URL` con la URL de tu Web App de Google Apps Script.

---

## 📑 6. Despliegue del Backend en Google Apps Script

Consulta la guía detallada en [`google-apps-script/README_APPS_SCRIPT.md`](./google-apps-script/README_APPS_SCRIPT.md) y el código listo en [`google-apps-script/Code.gs`](./google-apps-script/Code.gs).
