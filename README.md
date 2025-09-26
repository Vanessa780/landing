# React Landing (Vite + Tailwind)

Estructura lista para desplegar sin compilar localmente. Conéctala a **Vercel** y la plataforma hará el build.

## Pasos rápidos (Vercel)
1. Sube este repo a GitHub/GitLab/Bitbucket.
2. Ve a [Vercel](https://vercel.com) → **Add New → Project** → importa tu repo.
3. Vercel detectará **Vite** automáticamente.
   - Build Command: `npm run build`
   - Output: `dist`
4. Deploy → obtendrás una **URL pública**.

## Desarrollo local (opcional)
```bash
npm i
npm run dev
# luego
npm run build
```

## Tailwind
- Configurado en `tailwind.config.js`
- Importado en `src/index.css`
