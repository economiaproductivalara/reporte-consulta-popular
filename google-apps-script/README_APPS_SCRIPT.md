# Despliegue de Backend en Google Apps Script (Web App)

Este módulo conecta la aplicación web con la Hoja de Cálculo de Google Sheets oficial:
- **ID de la Hoja:** `1NjErQyP-4q6uY495uG82PF73j7Q2rAviXYmFsodi-WY`
- **Pestaña de Origen y Metas:** `Personal MPPAPT Lara`
- **Pestaña de Control de Reportes:** `Control de Reportes` *(Generada automáticamente por el script si no existe)*

---

## 📋 Arquitectura de Datos de las Pestañas

1. **Pestaña `Personal MPPAPT Lara` (Metas y Padrón Base):**
   - Contiene la nómina de los trabajadores y fija las metas electorales por institución y municipio.
   - Si faltaban datos de `ESTADO`, `MUNICIPIO` o `TELÉFONO`, el sistema los completa automáticamente al registrarse el voto.

2. **Pestaña `Control de Reportes` (Registro Cronológico Oficial de Votos):**
   - Registra cada **PARTICIPACIÓN EFECTIVA** con las siguientes columnas:
     * `FECHA Y HORA REPORTE` (Timestamp oficial de Venezuela `America/Caracas`)
     * `NACIONALIDAD` (V/E)
     * `CÉDULA`
     * `APELLIDOS Y NOMBRES`
     * `INSTITUCIÓN`
     * `ESTADO`
     * `MUNICIPIO`
     * `TELÉFONO`
     * `ES_FORÁNEO` (SÍ / NO)
     * `ESTATUS` (`PARTICIPACIÓN EFECTIVA`)

---

## 🚀 Pasos para Despliegue en 2 Minutos

1. Abre la hoja de cálculo en [Google Sheets](https://docs.google.com/spreadsheets/d/1NjErQyP-4q6uY495uG82PF73j7Q2rAviXYmFsodi-WY/edit).
2. En el menú superior, haz clic en **Extensiones** > **Apps Script**.
3. Pega el código completo de [`Code.gs`](./Code.gs).
4. Guarda el proyecto (`Ctrl + S`).
5. Haz clic en **Implementar** (botón azul superior) > **Nueva implementación**.
6. En el tipo de implementación selecciona **Aplicación web**.
7. Configura:
   - **Descripción:** `API MPPAPT Lara - Control de Reportes 2026`
   - **Ejecutar como:** `Yo (tu cuenta de Google)`
   - **Quién tiene acceso:** `Cualquier usuario (Anyone)` *(Indispensable para permitir consultas y reportes sin login de Google)*.
8. Haz clic en **Implementar**, concede los permisos requeridos por Google y copia la URL terminada en `/exec`.
9. Pega esa URL en el modal de configuración de la plataforma web o en la variable de entorno `VITE_APPS_SCRIPT_URL`.
