# Habilitar Facebook Login

Hace falta una app de Meta (App ID + App Secret). No se pueden inventar desde el código.

1. Entrá a [developers.facebook.com](https://developers.facebook.com) → **My Apps** → **Create App** (tipo Consumer / Allow people to log in).
2. Agregá el producto **Facebook Login** → Settings.
3. En Firebase Console:
   - [Authentication → Sign-in method → Facebook](https://console.firebase.google.com/project/java-inpro-tutorial/authentication/providers)
   - Enable → pegá **App ID** y **App Secret** → Save
   - Copiá el **OAuth redirect URI** que muestra Firebase
4. En Meta → Facebook Login → Settings → **Valid OAuth Redirect URIs** → pegá ese URI → Save
5. En Meta → Settings → Basic → agregá el dominio `java-inpro-tutorial.web.app` (App Domains) si lo pide
6. En Firebase → Authentication → Settings → **Authorized domains** deben incluir:
   - `java-inpro-tutorial.web.app`
   - `java-inpro-tutorial.firebaseapp.com`

Modo desarrollo de Meta: solo usuarios agregados como testers pueden iniciar sesión hasta publicar la app.
