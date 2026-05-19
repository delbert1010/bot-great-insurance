// Bot Automatizado - Great Insurance Team & Tax Service
// Genera contenido, envía a Telegram para aprobar, publica automáticamente

const TelegramBot = require('node-telegram-bot-api');
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');

// Configuración desde variables de entorno
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;

// Inicializar bot de Telegram
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Inicializar Claude
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

// Sistema de almacenamiento temporal para contenido pendiente
const pendingContent = new Map();

// Servicios que Great Insurance Team ofrece
const SERVICIOS = [
  'seguros_salud_aca',
  'seguros_vida',
  'seguros_auto',
  'seguros_dentales',
  'seguros_suplementarios',
  'preparacion_impuestos'
];

// Prompt del sistema para generación de contenido con neuroventas éticas
const SYSTEM_PROMPT = `Eres un experto en publicidad directa, neuroventas éticas y marketing de seguros para la comunidad hispana.

EMPRESA: Great Insurance Team & Tax Service
SERVICIOS:
- Seguros de salud ACA (Marketplace/Obamacare)
- Seguros de vida (Term, Whole, IUL)
- Seguros de vehículos
- Seguros dentales
- Seguros suplementarios (Medicare Supplement)
- Preparación de impuestos

DIFERENCIADORES CLAVE:
- 100% en español - NO son bilingües, hablan SOLO español
- Cobertura multi-estado (Florida y otros estados)
- Servicio personalizado para familias hispanas
- Asesoría honesta sin presión de venta

PÚBLICO OBJETIVO:
Familias hispanas, padres jóvenes, trabajadores independientes, inmigrantes, dueños de pequeños negocios, personas sin seguro o sub-aseguradas.

TONO Y VOZ:
Profesional, emocional cuando es apropiado, confiable, educativo, cercano y directo. NUNCA exagerado, agresivo ni manipulador. La publicidad debe generar confianza, no miedo extremo.

GATILLOS PSICOLÓGICOS ÉTICOS A USAR:
1. PROTECCIÓN FAMILIAR: El seguro no es para ti, es para quienes dependen de ti
2. DOLOR SILENCIOSO: La preocupación real de dejar deudas o falta de protección
3. URGENCIA RESPONSABLE: Explicar que esperar puede salir más caro, sin crear pánico
4. CONTRASTE: Mostrar la diferencia entre estar preparado vs no estarlo
5. CLARIDAD: Explicar beneficios en palabras simples, sin tecnicismos
6. AUTORIDAD: Transmitir asesoría profesional personalizada
7. CONFIANZA: Ayuda honesta, no presión de venta
8. ACCIÓN INMEDIATA: Invitar a llamar, escribir o cotizar

REGLAS ÉTICAS ESTRICTAS:
- NUNCA prometas aprobación garantizada
- NUNCA menciones precios específicos ("menos de $X al día", "$50 al mes", etc.) sin cotización real
- NUNCA digas "seguro gratis" si no es cierto
- NUNCA uses miedo extremo ("tu familia quedará destruida")
- NUNCA inventes beneficios legales, fiscales o médicos
- NUNCA uses frases engañosas
- NUNCA uses nombres específicos (María, Juan, etc.) - usa pronombres universales (tú, usted, muchas familias)
- Debe sentirse humano, realista y profesional

ESTILO ALTERNO:
Alterna entre posts EMOCIONALES (historias, casos reales, situaciones identificables) y posts EDUCATIVOS (datos útiles, información clara, beneficios explicados).

USA LENGUAJE UNIVERSAL:
- En lugar de "María tiene 2 hijos" → "Tienes 2 hijos" o "Muchas madres tienen 2 hijos"
- En lugar de "menos de $2 al día" → "puede ser más accesible de lo que piensas"
- En lugar de "Juan perdió su casa" → "Familias que perdieron su casa"
- Mantén la personalización pero hazla inclusiva

ESTRUCTURA DEL POST:

1. GANCHO INICIAL (1-2 líneas):
   - Pregunta que identifique el problema (sin nombres específicos)
   - Historia breve universal ("Muchas familias...", "¿Te has preguntado...?")
   - Dato sorprendente pero verificable (SIN precios específicos)
   - Situación común que genera identificación (habla directamente: "tú", "usted")

   EJEMPLOS BUENOS:
   ✅ "¿Cuántas noches te has desvelado pensando en qué pasaría con tus hijos?"
   ✅ "Muchas familias hispanas no saben que..."
   ✅ "¿Sabías que el 40% de las familias en Florida..."
   
   EJEMPLOS MALOS (NO USAR):
   ❌ "María tiene 2 hijos y está preocupada..." (nombre específico)
   ❌ "Por menos de $2 al día puedes..." (precio específico)
   ❌ "Juan perdió su casa porque..." (nombre específico)

2. DESARROLLO (80-120 palabras):
   - Explica el problema o necesidad
   - Muestra el contraste o la solución
   - Usa lenguaje simple y cercano
   - Incluye datos reales cuando sea educativo
   - Usa emociones reales cuando sea emocional

3. LLAMADO A LA ACCIÓN NATURAL:
   - No agresivo
   - Invita a contactar para orientación
   - Menciona que es sin compromiso

4. DESCRIPCIÓN DE IMAGEN:
   Describe una imagen profesional y emocional que complementa el post:
   - Personas reales, familias hispanas
   - Escena que refleje el mensaje (protección, tranquilidad, familia unida)
   - Iluminación cálida y profesional
   - Estilo: fotografía realista de alta calidad
   - Debe haber espacio visual para agregar texto sobre la imagen
   - NO texto dentro de la imagen (lo agregamos después)

5. BLOQUE DE CONTACTO (SIEMPRE AL FINAL):
---
📞 CONTÁCTANOS:
☎️ Teléfono: 954-394-7439
💬 WhatsApp: wa.me/19543947439

🔗 ENLACES DIRECTOS:
💙 Cotiza tu ACA ahora: enrollsalud.com/q/liliana-vera
🌐 Más servicios: greatinsuranceteam.com

[3-5 hashtags relevantes]

FORMATO DE SALIDA:

POST:
[El contenido del post aquí]

---
📞 CONTÁCTANOS:
[Bloque de contacto completo]

IMAGEN SUGERIDA:
[Descripción detallada de la imagen ideal para este post]

Genera contenido que haga que las personas se detengan, se identifiquen, sientan urgencia responsable y contacten para recibir orientación honesta.`;

// Función para generar contenido con Claude
async function generarContenido(tipoServicio) {
  const prompts = {
    seguros_salud_aca: "Post EMOCIONAL de Facebook sobre una madre preocupada por la salud de sus hijos sin seguro. Usa el gatillo de protección familiar. Incluye descripción detallada de imagen. 120 palabras.",
    seguros_vida: "Post EDUCATIVO de Instagram explicando cuándo es buen momento para seguro de vida (matrimonio, hijos, casa). Usa claridad y autoridad. Incluye descripción detallada de imagen. 110 palabras.",
    seguros_auto: "Post EMOCIONAL sobre un padre que tuvo accidente sin seguro adecuado y las consecuencias. Usa contraste sin miedo extremo. Incluye descripción detallada de imagen. 120 palabras.",
    seguros_dentales: "Post EDUCATIVO explicando la diferencia entre seguro dental y planes de descuento. Usa claridad. Incluye descripción detallada de imagen. 110 palabras.",
    seguros_suplementarios: "Post EMOCIONAL para adultos mayores preocupados por gastos médicos inesperados. Usa dolor silencioso y urgencia responsable. Incluye descripción detallada de imagen. 120 palabras.",
    preparacion_impuestos: "Post EDUCATIVO sobre documentos que familias hispanas deben juntar para impuestos. Práctico y útil. Incluye descripción detallada de imagen. 110 palabras."
  };

  const userPrompt = prompts[tipoServicio] || prompts.seguros_salud_aca;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: userPrompt
      }]
    });

    return message.content[0].text;
  } catch (error) {
    console.error('Error generando contenido:', error);
    throw error;
  }
}

// Función para publicar en Facebook
async function publicarEnFacebook(contenido) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/feed`,
      {
        message: contenido,
        access_token: FACEBOOK_ACCESS_TOKEN
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error publicando en Facebook:', error.response?.data || error);
    throw error;
  }
}

// Función para publicar en Instagram
async function publicarEnInstagram(contenido) {
  try {
    // Nota: Instagram requiere imagen. Por ahora solo guardamos para futuro
    // Cuando agreguen generación de imágenes, se activará esto
    console.log('Instagram post preparado (requiere imagen):', contenido.substring(0, 50));
    return { success: true, note: 'Instagram requiere imagen - pendiente' };
  } catch (error) {
    console.error('Error publicando en Instagram:', error);
    throw error;
  }
}

// Generar contenido diario automáticamente
async function generarContenidoDiario() {
  // Seleccionar servicio aleatorio
  const servicioAleatorio = SERVICIOS[Math.floor(Math.random() * SERVICIOS.length)];
  
  console.log(`Generando contenido para: ${servicioAleatorio}`);
  
  try {
    const contenido = await generarContenido(servicioAleatorio);
    
    // Generar ID único para este contenido
    const contentId = `content_${Date.now()}`;
    
    // Guardar contenido pendiente
    pendingContent.set(contentId, {
      contenido,
      servicio: servicioAleatorio,
      timestamp: new Date()
    });
    
    // Enviar a Telegram para aprobación
    const mensaje = `📝 **NUEVO CONTENIDO GENERADO**\n\n` +
                   `Servicio: ${servicioAleatorio.replace(/_/g, ' ').toUpperCase()}\n\n` +
                   `---\n\n${contenido}\n\n---\n\n` +
                   `¿Aprobar y publicar?\n\n` +
                   `Responde:\n` +
                   `✅ para aprobar y publicar\n` +
                   `❌ para rechazar\n` +
                   `✏️ para editar`;
    
    await bot.sendMessage(TELEGRAM_CHAT_ID, mensaje, { parse_mode: 'Markdown' });
    
    // Agregar botones inline
    await bot.sendMessage(TELEGRAM_CHAT_ID, 'Acciones rápidas:', {
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ Aprobar', callback_data: `approve_${contentId}` },
          { text: '❌ Rechazar', callback_data: `reject_${contentId}` }
        ]]
      }
    });
    
    console.log(`Contenido enviado para aprobación: ${contentId}`);
    
  } catch (error) {
    console.error('Error en generación diaria:', error);
    await bot.sendMessage(TELEGRAM_CHAT_ID, `❌ Error generando contenido: ${error.message}`);
  }
}

// Manejar respuestas de aprobación/rechazo
bot.on('callback_query', async (callbackQuery) => {
  const action = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;
  
  if (action.startsWith('approve_')) {
    const contentId = action.replace('approve_', '');
    const content = pendingContent.get(contentId);
    
    if (!content) {
      await bot.answerCallbackQuery(callbackQuery.id, { text: 'Contenido expirado o ya procesado' });
      return;
    }
    
    try {
      // Publicar en Facebook
      await publicarEnFacebook(content.contenido);
      
      // Confirmar publicación
      await bot.sendMessage(chatId, `✅ **PUBLICADO EN FACEBOOK**\n\nContenido publicado exitosamente.`, { parse_mode: 'Markdown' });
      
      // Limpiar contenido pendiente
      pendingContent.delete(contentId);
      
      await bot.answerCallbackQuery(callbackQuery.id, { text: '✅ Publicado en Facebook' });
      
    } catch (error) {
      await bot.sendMessage(chatId, `❌ Error publicando: ${error.message}`);
      await bot.answerCallbackQuery(callbackQuery.id, { text: '❌ Error publicando' });
    }
  } 
  else if (action.startsWith('reject_')) {
    const contentId = action.replace('reject_', '');
    pendingContent.delete(contentId);
    
    await bot.sendMessage(chatId, `❌ Contenido rechazado y descartado.`);
    await bot.answerCallbackQuery(callbackQuery.id, { text: '❌ Contenido rechazado' });
  }
});

// Comandos del bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    `👋 **Bot de Contenido - Great Insurance Team**\n\n` +
    `Comandos disponibles:\n` +
    `/generar - Generar contenido nuevo ahora\n` +
    `/status - Ver estado del sistema\n` +
    `/help - Ver ayuda\n\n` +
    `El bot generará contenido automáticamente cada día.`,
    { parse_mode: 'Markdown' }
  );
});

bot.onText(/\/generar/, async (msg) => {
  const chatId = msg.chat.id;
  
  if (chatId.toString() !== TELEGRAM_CHAT_ID) {
    return; // Solo el dueño puede generar
  }
  
  await bot.sendMessage(chatId, '⏳ Generando contenido...');
  await generarContenidoDiario();
});

bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;
  
  if (chatId.toString() !== TELEGRAM_CHAT_ID) {
    return;
  }
  
  const pendientes = pendingContent.size;
  const status = `📊 **Estado del Sistema**\n\n` +
                `Contenidos pendientes: ${pendientes}\n` +
                `Bot: ✅ Activo\n` +
                `Generación automática: ✅ Activada\n` +
                `Facebook: ✅ Conectado\n` +
                `Instagram: ⚠️ Pendiente (requiere imágenes)`;
  
  await bot.sendMessage(chatId, status, { parse_mode: 'Markdown' });
});

// Programar generación diaria (cada día a las 9 AM)
const schedule = require('node-schedule');

// Generar contenido todos los días a las 9:00 AM
schedule.scheduleJob('0 9 * * *', async () => {
  console.log('Generación automática diaria iniciada');
  await generarContenidoDiario();
});

// También generar al mediodía y a las 6 PM
schedule.scheduleJob('0 12 * * *', async () => {
  await generarContenidoDiario();
});

schedule.scheduleJob('0 18 * * *', async () => {
  await generarContenidoDiario();
});

console.log('🤖 Bot de Great Insurance Team iniciado');
console.log('📅 Generación programada: 9 AM, 12 PM, 6 PM');

// Para Vercel serverless, exportar handler
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    // Webhook de Telegram
    bot.processUpdate(req.body);
    res.status(200).send('OK');
  } else if (req.method === 'GET' && req.query.action === 'generate') {
    // Trigger manual de generación
    await generarContenidoDiario();
    res.status(200).json({ success: true, message: 'Contenido generado' });
  } else {
    res.status(200).json({ status: 'Bot activo', service: 'Great Insurance Team' });
  }
};
