/**
 * Genera un nuevo GOOGLE_REFRESH_TOKEN para la integración de Google Drive.
 *
 * Uso:
 *   cd api && node scripts/get-refresh-token.cjs
 *
 * Requisitos previos (en Google Cloud Console, mismo proyecto del CLIENT_ID):
 *   1) OAuth consent screen PUBLICADO ("In production"), no en "Testing"
 *      (en Testing el refresh token caduca a los 7 días).
 *   2) En el OAuth Client (tipo "Web application") debe estar registrada la
 *      Authorized redirect URI:  http://localhost:53682/oauth2callback
 *
 * El script abre/imprime la URL de consentimiento, captura el código en un
 * servidor local y te imprime el refresh_token para pegarlo en:
 *   - api/.env  (GOOGLE_REFRESH_TOKEN=...)
 *   - Railway → servicio API → variable GOOGLE_REFRESH_TOKEN
 */
require('dotenv/config')
const http = require('node:http')
const { google } = require('googleapis')

const PORT = 53682
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`
const SCOPES = ['https://www.googleapis.com/auth/drive.file']

const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.error('Faltan GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET en api/.env')
  process.exit(1)
}

const oauth2 = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI)

const authUrl = oauth2.generateAuthUrl({
  access_type: 'offline', // pide refresh_token
  prompt: 'consent', // fuerza que devuelva refresh_token aunque ya hubieras autorizado
  scope: SCOPES,
})

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.url.startsWith('/oauth2callback')) {
    res.writeHead(404).end('No encontrado')
    return
  }
  const url = new URL(req.url, REDIRECT_URI)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(`<h2>Error de autorizacion: ${error}</h2>`)
    console.error('Autorizacion rechazada:', error)
    server.close()
    process.exit(1)
  }
  if (!code) {
    res.writeHead(400).end('Falta el parametro code')
    return
  }

  try {
    const { tokens } = await oauth2.getToken(code)
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end('<h2>Listo. Ya puedes cerrar esta pestana y volver a la consola.</h2>')

    console.log('\n==================== REFRESH TOKEN ====================\n')
    if (tokens.refresh_token) {
      console.log(tokens.refresh_token)
      console.log('\n=======================================================')
      console.log('Pegalo en:')
      console.log('  - api/.env            -> GOOGLE_REFRESH_TOKEN=<valor>')
      console.log('  - Railway (servicio API) -> variable GOOGLE_REFRESH_TOKEN')
    } else {
      console.log('NO se recibio refresh_token. Causa habitual: ya habias dado consentimiento antes.')
      console.log('Solucion: revoca el acceso de la app en https://myaccount.google.com/permissions')
      console.log('y vuelve a correr el script (usa prompt=consent, deberia devolverlo).')
    }
  } catch (e) {
    res.writeHead(500).end('Error intercambiando el code')
    console.error('Error al intercambiar el code por tokens:', e?.response?.data || e?.message || e)
  } finally {
    server.close()
    setTimeout(() => process.exit(0), 200)
  }
})

server.listen(PORT, () => {
  console.log('1) Abre esta URL en tu navegador (logueado con la cuenta de Google de la app):\n')
  console.log(authUrl)
  console.log(`\n2) Autoriza. Google te redirige a ${REDIRECT_URI} y el token aparece aqui en la consola.\n`)
  console.log('Esperando la autorizacion...')
})
