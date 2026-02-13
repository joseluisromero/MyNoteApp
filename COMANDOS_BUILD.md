# Comandos para Reconstruir la App desde la Terminal

## Opción 1: Proceso Completo desde la Terminal (RECOMENDADO)

Ejecuta estos comandos en orden desde la carpeta del proyecto:

### 1. Reconstruir la aplicación web
```bash
cd d:\Proyectos\Ionic\MyNoteApp
ng build --configuration production
```

### 2. Sincronizar con Capacitor
```bash
npx cap sync android
```

### 3. Limpiar el proyecto Android (equivalente a "Clean Project")
```bash
cd android
gradlew clean
```

### 4. Reconstruir el proyecto Android (equivalente a "Rebuild Project")
```bash
gradlew assembleDebug
```

### 5. Instalar en el dispositivo conectado
```bash
gradlew installDebug
```

## Opción 2: Todo en un solo comando

Puedes ejecutar todo de una vez:

```bash
cd d:\Proyectos\Ionic\MyNoteApp && ng build --configuration production && npx cap sync android && cd android && gradlew clean assembleDebug installDebug
```

## Opción 3: Si prefieres usar Android Studio

Si prefieres usar la interfaz gráfica de Android Studio:

1. **Abrir Android Studio**
2. **Menú Build** → Clic en **"Clean Project"**
   - Espera a que termine (verás el progreso abajo)
3. **Menú Build** → Clic en **"Rebuild Project"**
   - Espera a que termine
4. **Botón Run** (▶️ verde) o presiona **Shift + F10**

## Verificar que el dispositivo está conectado

Antes de instalar, verifica que tu dispositivo Android está conectado:

```bash
cd android
gradlew tasks --all
```

O si tienes ADB instalado:

```bash
adb devices
```

Deberías ver tu dispositivo listado.

## Notas Importantes

- **gradlew** es el wrapper de Gradle que viene con el proyecto
- **assembleDebug** compila la versión de depuración
- **installDebug** instala la app en el dispositivo conectado
- Si ves errores de permisos, asegúrate de que la depuración USB está habilitada en tu dispositivo Android

## Solución de Problemas

### Si gradlew no funciona:
```bash
# En Windows, usa gradlew.bat en lugar de gradlew
cd android
gradlew.bat clean
gradlew.bat assembleDebug
```

### Si el build falla:
```bash
# Intenta invalidar cachés
cd android
gradlew clean --refresh-dependencies
```
