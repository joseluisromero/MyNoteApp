# MyNoteApp - Gestor de Notas Seguro 🔐

Este proyecto es una aplicación móvil desarrollada con **Ionic** y **Angular** diseñada para gestionar notas personales con un enfoque prioritario en la seguridad y la privacidad de los datos.

## 🚀 Tecnologías Utilizadas

- **Core**: [Ionic Framework](https://ionicframework.org/) v7+ & [Angular](https://angular.io/) v17+ (Standalone Components).
- **Plataforma**: [Capacitor](https://capacitorjs.com/) para despliegue nativo en Android.
- **Diseño**: Ionic UI Components con estética moderna y animaciones personalizadas.
- **Seguridad**: [CryptoJS](https://cryptojs.gitbook.io/docs/) para algoritmos de cifrado y hashing.
- **Almacenamiento**: [@ionic/storage-angular](https://github.com/ionic-team/ionic-storage) para persistencia de datos local y robusta.

## 💾 Almacenamiento de Información

La aplicación utiliza un sistema de **Almacenamiento Híbrido** gestionado por el `NoteService`:

1.  **Almacenamiento Local (Por defecto)**: 
    - Utiliza **Ionic Storage**, que en dispositivos Android se traduce automáticamente a una base de datos **SQLite** (mucho más segura y rápida que el almacenamiento tradicional del navegador).
    - Los datos persisten incluso si se cierra la aplicación o se reinicia el teléfono.
2.  **Sincronización Externa (Opcional)**:
    - El código está preparado para comunicarse con una API REST externa (`http://192.168.1.3:8080`) si se desactiva la bandera `useLocalStorage`.

## 🛡️ Seguridad Implementada

La seguridad es el pilar de **MyNoteApp**. Se han implementado las siguientes medidas:

### 1. Sistema de Clave Maestra
- **Configuración Inicial**: Al abrir la app por primera vez, el usuario debe elegir una contraseña maestra.
- **Hashing**: La contraseña **nunca se guarda en texto plano**. Se genera un **Hash SHA-256** único que se almacena localmente para validar futuros ingresos.
- **Pantalla de Bloqueo Dedicada**: Se utiliza una página de autenticación real (`/security-auth`) que impide el acceso a cualquier función de la app (crear, listar o editar) si el usuario no se ha identificado.

### 2. Cifrado de Datos de Extremo a Extremo (E2EE)
- **Cifrado AES**: Todas las notas se cifran utilizando el estándar **AES (Advanced Encryption Standard)** antes de guardarse en el almacenamiento del teléfono.
- **Privacidad Local**: Incluso si alguien lograra extraer la base de datos del teléfono, las notas serían ilegibles sin la clave maestra, ya que solo se descifran en memoria RAM mientras la aplicación está en uso.

### 3. Interfaz Robusta en Android
- **Prevención de Errores de UI**: Se han optimizado los flujos de navegación para dispositivos Xiaomi y otros con capas de personalización agresivas, evitando diálogos flotantes que puedan fallar en renderizado.
- **Interfaz de Usuario Limpia**: Los campos se resetean automáticamente al crear nuevas notas para evitar fugas de información entre sesiones.

## 📱 Dónde se guardan las Notas
Las notas se encuentran localizadas en:
- **Android**: En la partición de datos privados de la aplicación (`data/data/com.jlromero.mynoteapp/databases`), dentro de un archivo de base de datos cifrado.
- **Desarrollo**: Si se prueba en navegador, se almacenan en el `IndexedDB` local bajo el nombre de la aplicación.

---
*Desarrollado con enfoque en la privacidad por Jose Luis Romero.*
