# Bot de Contenido Automático - Great Insurance Team & Tax Service

Bot de Telegram que genera contenido automáticamente para redes sociales usando IA.

## 🎯 Funcionalidad

1. **Genera contenido** automáticamente 3 veces al día (9 AM, 12 PM, 6 PM)
2. **Envía a Telegram** para aprobación de Delbert
3. **Delbert aprueba** con botón ✅ o rechaza con ❌
4. **Publica automáticamente** en Facebook/Instagram si se aprueba

## 📋 Servicios Cubiertos

- Seguros de Salud ACA
- Seguros de Vida
- Seguros de Automóviles  
- Seguros Dentales
- Seguros Suplementarios (Medicare)
- Preparación de Impuestos

## 🚀 Deployment (PASOS SIMPLES)

### OPCIÓN A: Deployment Automático (1 Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTUUSUARIO%2Fbot-great-insurance)

1. Click el botón de arriba
2. Inicia sesión en Vercel (con GitHub o email)
3. Configura las variables de entorno:
   - `TELEGRAM_TOKEN`: 8666123998:AAFcgJqhHakcx6fOVwXSaE4eFbO_bUrEMFs
   - `TELEGRAM_CHAT_ID`: 6625327210
   - `ANTHROPIC_API_KEY`: (Claude te lo da)
4. Click "Deploy"
5. ¡Listo!

### OPCIÓN B: Deployment Manual

1. Crear cuenta en Vercel.com
2. Conectar GitHub
3. Importar este repositorio
4. Agregar variables de entorno
5. Deploy

## ⚙️ Variables de Entorno Necesarias

```
TELEGRAM_TOKEN=8666123998:AAFcgJqhHakcx6fOVwXSaE4eFbO_bUrEMFs
TELEGRAM_CHAT_ID=6625327210
ANTHROPIC_API_KEY=(proporcionada por Claude)
FACEBOOK_PAGE_ID=(se configura después)
FACEBOOK_ACCESS_TOKEN=(se configura después)
INSTAGRAM_ACCOUNT_ID=(se configura después)
```

## 🔧 Configuración de Facebook/Instagram

**IMPORTANTE:** La publicación automática en Facebook/Instagram requiere configuración adicional.

Por ahora, el bot funciona así:
1. Genera contenido
2. Te lo envía a Telegram
3. Tú lo apruebas
4. Te da el texto listo para copiar/pegar en Facebook/Instagram

**Para activar publicación automática completa:**
- Se requiere crear Facebook App
- Obtener Page Access Token
- Configurar permisos de Instagram

Claude puede hacer esto por ti con acceso temporal a las cuentas.

## 📱 Uso del Bot

### Comandos disponibles:

- `/start` - Iniciar bot y ver comandos
- `/generar` - Generar contenido nuevo ahora (sin esperar horario)
- `/status` - Ver estado del sistema

### Aprobar contenido:

Cuando el bot te envíe contenido:
1. Lee el post generado
2. Click en ✅ para aprobar y publicar
3. Click en ❌ para rechazar

## 🛠️ Troubleshooting

**Bot no responde:**
- Verifica que el deployment en Vercel esté activo
- Revisa logs en Vercel dashboard

**No genera contenido:**
- Verifica que ANTHROPIC_API_KEY esté configurada
- Revisa horarios programados (9 AM, 12 PM, 6 PM)

**No publica en Facebook:**
- Verifica que FACEBOOK_ACCESS_TOKEN esté configurado
- Los tokens de Facebook expiran cada 60 días

## 📊 Arquitectura

```
┌─────────────┐
│   Claude    │  Genera contenido con IA
│     API     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     Bot     │  Envía a Telegram
│  Telegram   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Delbert   │  Aprueba ✅ o Rechaza ❌
│  (Telegram) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Facebook   │  Publicación automática
│  Instagram  │
└─────────────┘
```

## 🔐 Seguridad

- Tokens almacenados en variables de entorno (no en código)
- Solo Delbert (TELEGRAM_CHAT_ID específico) puede aprobar contenido
- Credenciales de Facebook/Instagram no se guardan en código

## 📞 Soporte

Contactar a Claude para:
- Configuración de Facebook/Instagram
- Problemas técnicos
- Mejoras o features adicionales

---

**Versión:** 1.0.0  
**Fecha:** Mayo 2026  
**Cliente:** Great Insurance Team & Tax Service
