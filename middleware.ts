import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Lista de extensiones de archivos estáticos
  const staticFileExtensions = [
    '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'
  ];

  // Verificar si la solicitud es para un archivo estático
  if (staticFileExtensions.some(ext => pathname.endsWith(ext))) {
    return NextResponse.next();
  }

  // Obtener el host (subdominio y dominio)
  const host = req.headers.get('host') || '';
  const subdomain = host.split('.')[0]; // Extraer el subdominio antes del primer punto

  // Si no hay subdominio o es 'www' o el dominio principal, continúa normalmente
  if (subdomain === 'www' || subdomain === 'upvisor' || !subdomain) {
    return NextResponse.next();
  }

  // Reescribir la URL para que se incluya el subdominio dinámicamente
  const url = req.nextUrl.clone();

  // Reescribir la ruta: eliminamos la parte `/subdomain/` y lo mantenemos dinámico
  // Comprobamos si la ruta tiene la parte `/subdomain/` al inicio
  if (pathname.startsWith('/subdomain')) {
    // Extraemos el pathname después de /subdomain
    url.pathname = pathname.replace('/subdomain', '');
  }

  // Redirigir la solicitud reescrita
  return NextResponse.rewrite(url);
}