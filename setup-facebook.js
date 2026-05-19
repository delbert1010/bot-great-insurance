// Script para configurar acceso a Facebook/Instagram
// Este script ayuda a obtener los tokens necesarios

const axios = require('axios');

const FACEBOOK_APP_ID = 'TU_APP_ID_AQUI'; // Necesitamos crear app de Facebook
const FACEBOOK_APP_SECRET = 'TU_APP_SECRET_AQUI';

// Credenciales de Great Insurance Team
const FACEBOOK_USER = 'grat insurance team';
const FACEBOOK_PASS = 'mafer1042';
const INSTAGRAM_USER = '@lilianavera327';
const INSTAGRAM_PASS = 'Seguros1042';

console.log('='.repeat(60));
console.log('CONFIGURACIÓN DE FACEBOOK/INSTAGRAM API');
console.log('Great Insurance Team & Tax Service');
console.log('='.repeat(60));
console.log('');

console.log('PASOS NECESARIOS:');
console.log('');
console.log('1. Crear Facebook App en developers.facebook.com');
console.log('   - Ve a: https://developers.facebook.com/apps/create/');
console.log('   - Tipo: Business');
console.log('   - Nombre: Great Insurance Content Bot');
console.log('');
console.log('2. Agregar productos a la app:');
console.log('   - Facebook Login');
console.log('   - Instagram Basic Display');
console.log('');
console.log('3. Obtener Page Access Token:');
console.log('   - Graph API Explorer');
console.log('   - Seleccionar página de Great Insurance Team');
console.log('   - Permisos: pages_manage_posts, pages_read_engagement');
console.log('');
console.log('4. Convertir a Long-Lived Token:');
console.log('   - Usar Access Token Debugger');
console.log('   - Extender token a 60 días');
console.log('');

console.log('='.repeat(60));
console.log('INFORMACIÓN DE CUENTAS:');
console.log('='.repeat(60));
console.log(`Facebook Usuario: ${FACEBOOK_USER}`);
console.log(`Instagram Usuario: ${INSTAGRAM_USER}`);
console.log('');
console.log('⚠️  IMPORTANTE: Por seguridad, completa estos pasos manualmente');
console.log('o contacta a Claude para asistencia en configuración.');
console.log('');

// Función helper para obtener User Access Token (requiere intervención manual)
async function obtenerUserAccessToken() {
  console.log('Para obtener User Access Token:');
  console.log('');
  console.log('1. Ve a:');
  console.log(`   https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=https://localhost&scope=pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish`);
  console.log('');
  console.log('2. Inicia sesión con las credenciales de Facebook');
  console.log('3. Autoriza los permisos');
  console.log('4. Copia el código de la URL de redirección');
  console.log('5. Intercambia el código por access token en:');
  console.log(`   https://graph.facebook.com/v18.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&redirect_uri=https://localhost&client_secret=${FACEBOOK_APP_SECRET}&code=TU_CODIGO_AQUI`);
}

module.exports = {
  obtenerUserAccessToken
};
