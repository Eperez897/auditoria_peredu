# Activos de Información y Riesgos según la Industria

## Contexto de industria

La **Notaría Central Digital** opera en el rubro de **servicios legales y fedatarios digitales**. Este tipo de organización gestiona información con valor probatorio y legal, lo que la sitúa en un nivel de exigencia de seguridad comparable al de instituciones financieras: la pérdida de confidencialidad o integridad de un documento notarial no solo es un incidente técnico, sino una falla que puede invalidar contratos, habilitar fraude de identidad o generar responsabilidad civil para la notaría.

## Identificación de activos de información

| # | Activo | Descripción | Vulnerabilidad(es) que lo ponen en riesgo |
|---|---|---|---|
| 1 | **Base de datos de usuarios y credenciales** | Tabla `users` con nombres, contraseñas (hash MD5) y roles de funcionarios/clientes que acceden al portal. | SQL Injection — extracción directa vía `UNION SELECT user, password FROM users`. |
| 2 | **Documentos y registros notariales** (contratos, escrituras públicas, poderes) | Archivos y registros en base de datos que constituyen el activo central del negocio: el servicio que la notaría vende es la certificación y custodia de estos documentos. | SQL Injection (lectura/alteración de registros) y Command Injection (lectura/exfiltración de archivos del servidor mediante `cat`, `ls`). |
| 3 | **Servidor de aplicación / infraestructura** | El servidor web y sistema operativo que aloja el portal (proceso `www-data`), incluyendo el código fuente y configuración. | Command Injection — ejecución arbitraria de comandos con los privilegios del proceso web, pudiendo instalar backdoors o pivotar a otros sistemas. |
| 4 | **Sesiones y datos de navegación de clientes/funcionarios** | Cookies de sesión, tokens de autenticación y datos personales que viajan en el navegador del usuario durante el uso del portal. | XSS Reflejado — robo de cookies de sesión, suplantación de identidad del usuario autenticado. |

## Vínculo activo–vulnerabilidad–industria

- En una **notaría digital**, el activo más crítico no es solo la disponibilidad del sitio, sino la **integridad y confidencialidad de los documentos legales**. Por ello, SQL Injection y Command Injection —que comprometen directamente la base de datos y el servidor donde residen esos documentos— representan el mayor riesgo de negocio.
- El robo de sesión vía XSS es relevante porque permitiría a un atacante **suplantar a un funcionario notarial autenticado**, lo que en este rubro equivale a poder firmar o tramitar documentos en nombre de otra persona: un riesgo de integridad legal, no solo técnico.
- La exposición de credenciales (activo 1) es además un riesgo en cadena: contraseñas reutilizadas o hashes MD5 débiles (sin *salt*) facilitan ataques de fuerza bruta offline que escalan el compromiso a otros sistemas de la notaría.
