Se utiliza una matriz **Probabilidad × Impacto** en escala de 1 a 5 para cada eje. El riesgo se calcula como `Riesgo = Probabilidad × Impacto` (rango 1–25) y se clasifica según el siguiente mapa de calor:

| Rango de puntaje | Nivel de riesgo | Color |
|---|---|---|
| 16 – 25 | Crítico | Rojo |
| 9 – 15 | Alto | Naranjo |
| 4 – 8 | Medio | Amarillo |
| 1 – 3 | Bajo | Verde |

## Mapa de calor (Probabilidad × Impacto)

| Probabilidad ↓ / Impacto → | 1 Insignificante | 2 Menor | 3 Moderado | 4 Mayor | 5 Catastrófico |
|---|---|---|---|---|---|
| **5 Muy alta** | 5  | 10  | 15  | 20  | **25  SQLi** |
| **4 Alta** | 4  | 8  | 12  **XSS** | 16  | **20  Cmd Injection** |
| **3 Media** | 3  | 6  | 9  | 12  | 15  |
| **2 Baja** | 2  | 4  | 6  | 8  | 10  |
| **1 Muy baja** | 1  | 2  | 3  | 4  | 5  |

- **Probabilidad:** Muy alta. El formulario es público, no requiere autenticación previa, y el payload (`' OR '1'='1' #`) es de los más documentados y automatizables (sqlmap, listas de payloads públicas). Cualquier escáner básico lo detecta en minutos.
- **Impacto:** Catastrófico. Compromete la totalidad de la base de datos: credenciales de funcionarios y clientes, y potencialmente los registros de contratos/escrituras si están en la misma base. En una notaría, esto equivale a una filtración masiva de datos legales protegidos, con consecuencias regulatorias y reputacionales severas.


- **Probabilidad:** Alta. Requiere identificar el campo "Ping a device", pero una vez localizado, el operador `|` es trivial de explotar y no necesita herramientas sofisticadas. Es ligeramente menos "muy alta" que SQLi porque suele estar en una sección menos expuesta/indexada del sitio.
- **Impacto:** Catastrófico. Otorga ejecución de comandos en el servidor, lo que permite leer archivos del sistema, instalar backdoors persistentes y comprometer la infraestructura completa, no solo la base de datos. Es el riesgo de mayor alcance técnico.

- **Probabilidad:** Alta. El payload es simple (`<script>alert()</script>`), pero a diferencia de SQLi/Cmd Injection requiere que la víctima haga clic en un enlace manipulado (ingeniería social), lo que introduce una variable humana que reduce levemente la probabilidad de éxito masivo.
- **Impacto:** Moderado. Permite robo de sesión y phishing dirigido a un usuario específico, pero no compromete directamente el servidor ni la base de datos completa; el daño está acotado a las sesiones que el atacante logre capturar.

| Orden | Vulnerabilidad | Riesgo (P×I) | CVSS v3.1 | Severidad combinada |
|---|---|---|---|---|
| 1 | SQL Injection | 25 — Crítico | 9.8 | Atención inmediata |
| 2 | Command Injection | 20 — Crítico | 9.8 | Atención inmediata |
| 3 | XSS Reflejado | 12 — Alto | 6.1 | Atención en el corto plazo |

La priorización de la matriz de riesgo es coherente con la clasificación CVSS del Informe A: las dos vulnerabilidades con puntaje CVSS 9.8 (Crítica) ocupan también las celdas rojas de la matriz, mientras que XSS, con CVSS 6.1 (Media), se ubica en una celda naranja de riesgo alto pero no crítico. SQL Injection se posiciona primera en ambos esquemas por combinar la máxima probabilidad de explotación con el mayor impacto sobre el activo más sensible del negocio (la base de datos notarial completa).
