# Políticas de Prevención y Controles de Mitigación

## 1. SQL Injection — Riesgo Crítico (25 / CVSS 9.8)

### Políticas de prevención (causa raíz)

- **Consultas parametrizadas (Prepared Statements)** con PDO o MySQLi en lugar de concatenación de strings; el motor de base de datos trata el dato del usuario siempre como valor, nunca como código SQL ejecutable.
- **Uso de un ORM** (Doctrine, Eloquent) que abstrae la construcción de consultas y reduce el riesgo de error humano al escribir SQL manual.
- **Validación estricta de tipos de entrada**: campos como `id` deben rechazar cualquier carácter que no sea numérico antes de llegar a la capa de base de datos.
- **Principio de mínimo privilegio en la base de datos**: el usuario de conexión de la aplicación no debe tener permisos `DROP`, `ALTER` ni acceso a tablas fuera de su dominio funcional.

### Controles de mitigación (defensa en profundidad)

- **WAF (Web Application Firewall)** con el set de reglas OWASP Core Rule Set (CRS), que bloquea patrones típicos de SQLi (`UNION SELECT`, comillas no escapadas, comentarios `#`/`--`) antes de que lleguen a la aplicación.
- **Monitoreo y alertas** sobre consultas SQL anómalas (volumen inusual de filas devueltas, uso de `UNION`, errores de sintaxis SQL repetidos desde una misma IP).
- **Cifrado en reposo (AES-256)** de campos sensibles en la base de datos (contraseñas con hash + salt fuerte como bcrypt/Argon2, no MD5; datos de identidad de clientes), de modo que una exfiltración no exponga datos en texto legible.
- **Marco de referencia:** OWASP A03:2021 — Injection · CIS Controls v8, Control 13 (Network/Data Protection).

## 2. Command Injection — Riesgo Crítico (20 / CVSS 9.8)

### Políticas de prevención (causa raíz)

- **Validación estricta de la entrada** con `filter_var($ip, FILTER_VALIDATE_IP)` antes de usarla en cualquier llamada al sistema.
- **Evitar funciones de shell** (`shell_exec`, `system`, `exec`) siempre que exista una alternativa nativa del lenguaje (p. ej. librerías de red en lugar de invocar `ping` por shell).
- Si es inevitable invocar el shell, usar `escapeshellarg()` y `escapeshellcmd()` para neutralizar metacaracteres (`|`, `;`, `&&`).
- **Listas blancas (whitelisting)**: aceptar únicamente patrones conocidos y válidos (formato IPv4/IPv6 estricto), rechazando cualquier otro carácter.

### Controles de mitigación (defensa en profundidad)

- **Contenedorización con privilegios mínimos (Docker)**: el proceso del servidor web corre con un usuario sin privilegios y con el sistema de archivos en modo de solo lectura donde sea posible, limitando el daño aunque se logre ejecutar un comando.
- **IDS/IPS** (Sistema de Detección/Prevención de Intrusiones) que detecte patrones de inyección de comandos en el tráfico HTTP entrante.
- **Auditoría de logs del sistema operativo** con alertas en tiempo real ante ejecución de binarios sospechosos (`whoami`, `cat /etc/passwd`, `nc`, `wget`) desde el proceso del servidor web.
- **Marco de referencia:** OWASP A03:2021 — Injection · CIS Controls v8, Control 4 (Secure Configuration of Enterprise Assets).

## 3. XSS Reflejado — Riesgo Alto (12 / CVSS 6.1)

### Políticas de prevención (causa raíz)

- **Escape de salida** con `htmlspecialchars($valor, ENT_QUOTES, 'UTF-8')` en PHP, o el escapado automático que ofrecen frameworks modernos (React, Vue), antes de insertar cualquier dato del usuario en el HTML de respuesta.
- **Content Security Policy (CSP)** restrictiva, p. ej. `Content-Security-Policy: default-src 'self'`, que impide la ejecución de scripts inyectados desde fuentes no autorizadas.
- **Validar y sanitizar toda entrada en el backend**, nunca confiar únicamente en validación del lado del cliente (JavaScript), que es trivialmente evitable.

### Controles de mitigación (defensa en profundidad)

- **Headers CSP estrictos** configurados a nivel de servidor web (Apache/Nginx), aplicados de forma global a todas las respuestas.
- **Escaneo periódico** con herramientas como OWASP ZAP o Burp Suite para detectar nuevos puntos de reflexión no sanitizados antes de que lleguen a producción.
- **Cookies de sesión con flags `HttpOnly` y `Secure`**, de modo que aunque un script malicioso se ejecute, no pueda leer la cookie de sesión vía `document.cookie`.
- **Marco de referencia:** OWASP A03:2021 — Injection (XSS está clasificado dentro de esta categoría en OWASP Top 10 2021) · CIS Controls v8, Control 16 (Application Software Security).

## Resumen de priorización de implementación

| Orden | Control | Justificación de la prioridad |
|---|---|---|
| 1 | Consultas parametrizadas + WAF (SQLi) | Mitiga el riesgo crítico de mayor probabilidad e impacto combinado; protege el activo central (base de datos notarial). |
| 2 | Validación de entrada + contenedorización (Command Injection) | Mitiga el riesgo crítico de mayor alcance técnico (compromiso del servidor completo). |
| 3 | Escape de salida + CSP (XSS) | Riesgo alto pero de impacto acotado a sesiones individuales; se aborda tras cerrar los dos riesgos críticos. |
