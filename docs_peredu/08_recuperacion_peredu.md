| Mejora | Riesgo que mitiga | Descripción |
|---|---|---|
| **WAF (Web Application Firewall)** | SQL Injection, Command Injection | Filtra patrones maliciosos en las peticiones HTTP antes de que lleguen a la aplicación (reglas OWASP CRS). Es la primera línea de defensa perimetral. |
| **Segmentación de red** | Command Injection | Separar el servidor web del servidor de base de datos en redes/subredes distintas, con reglas de firewall que solo permitan el tráfico estrictamente necesario (puerto de BD desde el servidor de aplicación, nada más). Así, comprometer el servidor web no implica acceso directo e irrestricto a la base de datos. |
| **Gestión de secretos** | SQL Injection (credenciales DB) | Uso de un vault (HashiCorp Vault, AWS Secrets Manager) para las credenciales de conexión a la base de datos, en lugar de tenerlas en texto plano en el código fuente. |
| **Autenticación multifactor (MFA)** | XSS (robo de sesión) | Incluso si un atacante roba una cookie de sesión, MFA limita el daño en acciones sensibles (firma de documentos, cambios de configuración) al requerir un segundo factor. |
| **Cifrado en tránsito (TLS/HTTPS) y en reposo (AES-256)** | Todas | Protege los datos notariales tanto durante la transmisión como almacenados en la base de datos. |

- **Respaldos automatizados diarios** de la base de datos completa (contratos, escrituras, usuarios), con retención mínima de 30 días.
- **Respaldos incrementales cada 4–6 horas** para minimizar la pérdida de datos (RPO — *Recovery Point Objective* objetivo: ≤ 6 horas) dado que se trata de documentos legales donde cada transacción tiene valor probatorio.
- **Copias en al menos dos ubicaciones distintas** (regla 3-2-1: 3 copias, 2 medios distintos, 1 fuera del sitio/región), para sobrevivir a un incidente que afecte la infraestructura principal completa.
- **Backups cifrados** (AES-256), de modo que una copia de respaldo robada no sea legible sin la clave correspondiente.

- **Pruebas de restauración periódicas** (al menos trimestrales) en un ambiente aislado, para verificar que los backups son íntegros y efectivamente restaurables, no solo que "se generaron".
- **Objetivo de tiempo de recuperación (RTO — *Recovery Time Objective*)**: definir un máximo aceptable, por ejemplo 4 horas, para que el portal vuelva a estar operativo tras un incidente crítico (p. ej. tras explotación de Command Injection que comprometa el servidor).
- **Runbook documentado** con los pasos exactos de restauración: aislar el sistema comprometido, reconstruir desde una imagen limpia, restaurar la base de datos desde el último backup íntegro verificado, y solo entonces reconectar a producción.

- **Procedimiento de notificación interna inmediata** ante la detección de un incidente (alertas del WAF/IDS-IPS escalando al equipo técnico responsable).
- **Notificación a clientes y autoridades** conforme a la normativa de protección de datos aplicable, en caso de confirmarse una filtración de datos personales o documentos notariales (dado el carácter de información sensible y legalmente protegida que maneja la notaría).
- **Comunicación transparente del estado del servicio** (página de estado, correo a clientes afectados) durante el proceso de restauración, evitando dejar a los usuarios sin información mientras el portal está fuera de línea.

Este plan de recuperación se alinea con las prácticas descritas en frameworks reconocidos: **NIST SP 800-34** (Contingency Planning Guide) para la estructura de RTO/RPO y pruebas de restauración, y **CIS Control 11** (Data Recovery) para la política de respaldos. Dado que la notaría maneja documentos con valor legal, se recomienda además evaluar el cumplimiento con la normativa local de protección de datos personales vigente en Chile (Ley 19.628 y su actualización en curso) en lo referente a tiempos y forma de notificación de incidentes.
