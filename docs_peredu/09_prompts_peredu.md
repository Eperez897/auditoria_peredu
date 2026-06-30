# Bitácora de Uso de IA

> ⚠️ **Importante:** esta bitácora debe completarse con los prompts que el estudiante efectivamente utilizó durante el desarrollo del trabajo (en ChatGPT, Claude u otra herramienta), no con prompts genéricos. La rúbrica exige prompts que mencionen explícitamente la vulnerabilidad o la empresa, y un registro real de qué se aceptó y qué se corrigió. A continuación se deja una plantilla con ejemplos de la estructura esperada; reemplazar el contenido de ejemplo por los prompts reales usados.

## Registro de prompts

### Prompt 1 — Investigación técnica de SQL Injection

**Herramienta:** [completar: ChatGPT / Claude / otra]
**Prompt utilizado:**
> "Explícame por qué el payload `1' OR '1'='1' #` funciona contra el módulo SQL Injection de DVWA en nivel Low, y qué configuración del código PHP lo hace posible."

**Qué se aceptó:** la explicación del mecanismo de comentado SQL con `#` y el rol del operador `OR` para anular el `WHERE`.
**Qué se corrigió/ajustó:** se adaptó la explicación al caso específico de la Notaría Central Digital, agregando el impacto sobre contratos y escrituras públicas, que la respuesta original no mencionaba por no conocer el contexto del negocio.

### Prompt 2 — Cálculo de CVSS v3.1

**Herramienta:** [completar]
**Prompt utilizado:**
> "Tengo una vulnerabilidad de Command Injection en un formulario de ping sin autenticación, explotable de forma remota sin interacción del usuario, que permite ejecutar comandos arbitrarios en el servidor. ¿Qué vector CVSS v3.1 le corresponde y por qué?"

**Qué se aceptó:** la propuesta de vector `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`.
**Qué se corrigió/ajustó:** se verificó manualmente cada métrica contra la calculadora oficial first.org/cvss/calculator/3.1 antes de incorporarla al informe, confirmando el puntaje 9.8.

### Prompt 3 — Redacción de controles de mitigación

**Herramienta:** [completar]
**Prompt utilizado:**
> "Para una notaría digital con vulnerabilidad de XSS reflejado en un campo de nombre, dame controles de mitigación basados en OWASP o CIS, distintos a las medidas de prevención de causa raíz."

**Qué se aceptó:** la sugerencia de headers CSP, escaneo periódico con OWASP ZAP y cookies `HttpOnly`/`Secure`.
**Qué se corrigió/ajustó:** se descartó una sugerencia genérica de "mantener el software actualizado" por no estar vinculada directamente al hallazgo de XSS, reemplazándola por el control de cookies de sesión, más específico al riesgo identificado (robo de sesión).

## Reflexión final sobre el uso de la herramienta de IA

El uso de IA resultó útil principalmente para acelerar la investigación técnica (mecanismos de explotación, vectores CVSS) y para estructurar la redacción de controles alineados a marcos como OWASP y CIS. Sin embargo, fue necesario verificar cada cálculo de CVSS contra la calculadora oficial, contextualizar las respuestas genéricas al caso específico de la Notaría Central Digital (vinculando cada hallazgo a los activos reales del negocio: contratos, escrituras, credenciales), y descartar recomendaciones demasiado genéricas que no atacaban la causa raíz de cada vulnerabilidad. La IA funcionó como apoyo de investigación y redacción, no como reemplazo del análisis crítico ni de la verificación manual de cada dato técnico incluido en el informe.
