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

// Prompt del sistema para generación de contenido
const SYSTEM_PROMPT = `Eres el asistente de contenido para Great Insurance Team & Tax Service, agentes de seguros especializados en la comunidad hispana.

SERVICIOS:
- Seguros de salud ACA (Marketplace/Obamacare)
- Seguros de vida (Term, Whole, IUL)
- Seguros de vehículos
- Seguros dentales
- Seguros suplementarios (Medicare Supplement)
- Preparación de impuestos

DIFERENCIADOR CLAVE:
- 100% en español - NO son bilingües, hablan SOLO español
- Cobertura multi-estado (Florida y otros estados)
- Servicio personalizado para familias hispanas

VOZ DE MARCA:
- Tono: Educativo, profesional-cercana, sin corporativismo
- Idioma: 100% ESPAÑOL nativo
- Valores: Transparencia, educación financiera, protección familiar
- Anti-valores: Hype, promesas exageradas, tácticas de miedo

REGLAS:
1. NUNCA tácticas de miedo
2. NUNCA promesas específicas de dinero
3. SIEMPRE educa antes de vender
4. USA español natural de Florida
5. CTAs suaves: "¿Preguntas? WhatsApp" NO "¡LLAMA AHORA!"
6. Menciona cobertura multi-estado cuando relevante

FORMATO:
- Posts de Facebook/Instagram: 150-200 palabras
- Incluye emojis moderadamente (2-3 por post)
- CTA claro pero no agresivo al final
- Hashtags: 3-5 relevantes

Genera contenido educativo y útil que posicione a Great Insurance Team como expertos confiables.`;

// Función para generar contenido con Claude
async function generarContenido(tipoServicio) {
  const prompts = {
    seguros_salud_aca: "Post de Facebook sobre por qué revisar opciones de seguro médico ACA cada año durante Open Enrollment. Educativo, menciona subsidios sin prometer cantidades específicas. 180 palabras.",
    seguros_vida: "Post de Instagram explicando cuándo es buen momento para obtener seguro de vida (eventos de vida: matrimonio, hijos, casa). Tono cercano. 160 palabras.",
    seguros_auto: "Post de Facebook sobre 3 factores que afectan el precio del seguro de auto y cómo las familias pueden ahorrar. Práctico y útil. 170 palabras.",
    seguros_dentales: "Post explicando la diferencia entre seguro dental y planes de descuento dental. Ayuda a familias a elegir. 150 palabras.",
    seguros_suplementarios: "Post sobre qué son los seguros suplementarios de Medicare y quién los necesita. Para audiencia 60+. 180 palabras.",
    preparacion_impuestos: "Post recordando documentos que familias deben juntar para temporada de impuestos. Útil y práctico. 160 palabras."
  };

  const userPrompt = prompts[tipoServicio] || prompts.seguros_salud_aca;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
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
