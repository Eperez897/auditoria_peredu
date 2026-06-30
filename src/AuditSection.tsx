import { Shield, AlertTriangle, ChevronDown, ChevronUp, ExternalLink, Code, Terminal, Bot, Check, Wrench } from 'lucide-react'
import { useState } from 'react'

import sqli1 from '../docs_peredu/img_peredu/sqli_peredu_1.png'
import sqli2 from '../docs_peredu/img_peredu/sqli_peredu_2.png'
import sqli3 from '../docs_peredu/img_peredu/sqli_peredu_3.png'
import sqli4 from '../docs_peredu/img_peredu/sqli_peredu_4.png'
import xssImg from '../docs_peredu/img_peredu/xss_peredu.png'
import cmdImg from '../docs_peredu/img_peredu/comandos_peredu.png'

interface CvssMetric {
  metric: string
  value: string
  justification: string
}

interface Vuln {
  id: string
  icon: React.ReactNode
  label: string
  title: string
  cvss: number
  severity: 'Crítica' | 'Alta' | 'Media' | 'Baja'
  color: string
  bg: string
  summary: string
  how: string
  payload: string
  images: { src: string; caption: string }[]
  prevention: string[]
  mitigation: string[]
  impact: string
  cvssDetail: CvssMetric[]
  riskProb: string
  riskImp: string
}

const vulns: Vuln[] = [
  {
    id: 'sqli',
    icon: <Code size={22} />,
    label: 'OWASP A03:2021',
    title: 'SQL Injection',
    cvss: 9.8,
    severity: 'Crítica',
    color: '#C0392B',
    bg: '#FEF2F2',
    summary: 'Manipulación de consultas SQL mediante entrada no sanitizada, permitiendo extracción de toda la base de datos.',
    how: 'El portal conecta directamente la entrada del usuario a la consulta SQL sin validación. Al ingresar una comilla simple ( \' ) se rompe la sintaxis y el operador OR \'1\'=\'1\' # anula la cláusula WHERE, retornando todos los registros. Con UNION SELECT se pueden extraer usuarios y contraseñas MD5.',
    payload: "1' OR '1'='1' #\n1' UNION SELECT user, password FROM users #",
    images: [
      { src: sqli1, caption: 'Error SQL al ingresar comilla simple — confirma vulnerabilidad' },
      { src: sqli2, caption: 'Payload OR \'1\'=\'1\' retorna todos los usuarios de la tabla' },
      { src: sqli3, caption: 'UNION SELECT extrae credenciales con hashes MD5' },
      { src: sqli4, caption: 'Resultado completo: usuarios y contraseñas expuestos' },
    ],
    prevention: [
      'Consultas parametrizadas (Prepared Statements) con PDO o MySQLi',
      'ORM que abstrae el SQL directo (Doctrine, Eloquent)',
      'Validar tipo de datos: campos numéricos solo aceptan enteros',
      'Principio de mínimo privilegio: usuario DB sin acceso a tablas sensibles',
    ],
    mitigation: [
      'WAF (Web Application Firewall) con reglas para payloads SQL — OWASP CRS',
      'Monitoreo y alertas de consultas SQL anómalas en logs',
      'Cifrado AES-256 de datos sensibles en la base de datos',
      'Marco de referencia: OWASP A03:2021 · CIS Control 13',
    ],
    impact: 'Un atacante podría extraer datos de clientes, contratos, escrituras públicas, credenciales de acceso y cualquier otro dato almacenado en la base de datos. En el contexto notarial, esto constituye una violación grave de la confidencialidad de información legalmente protegida.',
    cvssDetail: [
      { metric: 'Attack Vector (AV)', value: 'Network (N)', justification: 'El formulario es explotable de forma remota, vía HTTP.' },
      { metric: 'Attack Complexity (AC)', value: 'Low (L)', justification: 'No requiere condiciones especiales; el payload funciona al primer intento.' },
      { metric: 'Privileges Required (PR)', value: 'None (N)', justification: 'No se requiere ningún privilegio adicional al de un usuario normal del formulario.' },
      { metric: 'User Interaction (UI)', value: 'None (N)', justification: 'El atacante ejecuta el ataque directamente, sin intervención de un tercero.' },
      { metric: 'Scope (S)', value: 'Unchanged (U)', justification: 'El ataque no escapa del componente vulnerable hacia otros componentes con distinto control de autorización.' },
      { metric: 'Confidentiality (C)', value: 'High (H)', justification: 'Permite extraer la totalidad de la base de datos (usuarios, contraseñas, datos notariales).' },
      { metric: 'Integrity (I)', value: 'High (H)', justification: 'Con UNION/INSERT/UPDATE el atacante podría alterar registros (contratos, escrituras).' },
      { metric: 'Availability (A)', value: 'High (H)', justification: 'Consultas pesadas o DROP TABLE pueden dejar el servicio fuera de línea.' },
    ],
    riskProb: 'Muy alta. El formulario es público, no requiere autenticación previa, y el payload (\' OR \'1\'=\'1\' #) es de los más documentados y automatizables (sqlmap, listas de payloads públicas). Cualquier escáner básico lo detecta en minutos.',
    riskImp: 'Catastrófico. Compromete la totalidad de la base de datos: credenciales de funcionarios y clientes, y potencialmente los registros de contratos/escrituras si están en la misma base. En una notaría, esto equivale a una filtración masiva de datos legales protegidos, con consecuencias regulatorias y reputacionales severas.',
  },
  {
    id: 'xss',
    icon: <AlertTriangle size={22} />,
    label: 'OWASP A03:2021',
    title: 'XSS Reflejado',
    cvss: 6.1,
    severity: 'Media',
    color: '#D97706',
    bg: '#FFFBEB',
    summary: 'El servidor refleja la entrada del usuario sin escapar, permitiendo ejecución de JavaScript arbitrario en el navegador de la víctima.',
    how: 'La aplicación inserta la entrada del campo "nombre" directamente en el HTML de respuesta sin aplicar htmlspecialchars(). El navegador interpreta la etiqueta <script> como código y lo ejecuta. Un atacante puede robar cookies de sesión o redirigir usuarios a sitios de phishing mediante un enlace manipulado.',
    payload: '<script>alert(\'XSS - Notaria Central\')</script>',
    images: [
      { src: xssImg, caption: 'Popup de JavaScript ejecutado — confirmación de XSS Reflejado en DVWA' },
    ],
    prevention: [
      'Escapar salida con htmlspecialchars($val, ENT_QUOTES, \'UTF-8\') en PHP',
      'Content Security Policy (CSP): Content-Security-Policy: default-src \'self\'',
      'Frameworks modernos (React, Vue) que escapan el output automáticamente',
      'Validar y sanitizar toda entrada en el backend, nunca solo en el cliente',
    ],
    mitigation: [
      'Implementar headers CSP estrictos en el servidor web (Apache/Nginx)',
      'Escaneo periódico con OWASP ZAP o Burp Suite',
      'Cookies con flag HttpOnly y Secure para proteger sesiones',
      'Marco de referencia: OWASP A03:2021 · CIS Control 16',
    ],
    impact: 'Un atacante podría usar XSS para robar cookies de sesión de clientes o funcionarios de la notaría, redirigir a usuarios a sitios de phishing, modificar visualmente el contenido del portal para engañar a usuarios, o realizar acciones en nombre del usuario autenticado (robo de sesión).',
    cvssDetail: [
      { metric: 'Attack Vector (AV)', value: 'Network (N)', justification: 'El payload se entrega mediante una URL accesible remotamente (parámetro name).' },
      { metric: 'Attack Complexity (AC)', value: 'Low (L)', justification: 'Basta con que la víctima abra el enlace manipulado.' },
      { metric: 'Privileges Required (PR)', value: 'None (N)', justification: 'El atacante no necesita autenticarse para construir el enlace malicioso.' },
      { metric: 'User Interaction (UI)', value: 'Required (R)', justification: 'A diferencia de SQLi, el ataque depende de que la víctima haga clic en el enlace con el payload reflejado.' },
      { metric: 'Scope (S)', value: 'Changed (C)', justification: 'El script se ejecuta en el contexto del navegador de la víctima, fuera del componente servidor que originó la falla, pudiendo afectar otras sesiones/orígenes de confianza (robo de cookies).' },
      { metric: 'Confidentiality (C)', value: 'Low (L)', justification: 'Permite robo de cookies de sesión, pero no acceso directo a la base de datos.' },
      { metric: 'Integrity (I)', value: 'Low (L)', justification: 'Permite alterar el contenido visual percibido por la víctima (defacement parcial, phishing).' },
      { metric: 'Availability (A)', value: 'None (N)', justification: 'No provoca caída del servicio.' },
    ],
    riskProb: 'Alta. El payload es simple (<script>alert()</script>), pero a diferencia de SQLi/Cmd Injection requiere que la víctima haga clic en un enlace manipulado (ingeniería social), lo que introduce una variable humana que reduce levemente la probabilidad de éxito masivo.',
    riskImp: 'Moderado. Permite robo de sesión y phishing dirigido a un usuario específico, pero no compromete directamente el servidor ni la base de datos completa; el daño está acotado a las sesiones que el atacante logre capturar.',
  },
  {
    id: 'cmd',
    icon: <Terminal size={22} />,
    label: 'OWASP A03:2021',
    title: 'Command Injection',
    cvss: 9.8,
    severity: 'Crítica',
    color: '#C0392B',
    bg: '#FEF2F2',
    summary: 'Ejecución de comandos arbitrarios del sistema operativo al inyectar operadores shell en campos que invocan funciones del sistema.',
    how: 'La aplicación pasa la entrada del usuario directamente a shell_exec("ping " . $ip) sin validación. El operador pipe | encadena un segundo comando al ping legítimo. Al ejecutar whoami el servidor retorna el usuario del SO con el que corre el proceso web. Un atacante puede listar archivos, leer documentos, instalar backdoors o comprometer completamente el servidor.',
    payload: '127.0.0.1 | whoami\n127.0.0.1 | ls\n127.0.0.1 | cat /etc/passwd',
    images: [
      { src: cmdImg, caption: 'Comando whoami ejecutado en el servidor — expone usuario del sistema operativo' },
    ],
    prevention: [
      'Validar IP con filter_var($ip, FILTER_VALIDATE_IP) antes de procesar',
      'Usar escapeshellarg() si inevitablemente se debe invocar el shell',
      'Reemplazar shell_exec() por funciones nativas del lenguaje sin shell',
      'Lista blanca: solo permitir valores conocidos y válidos',
    ],
    mitigation: [
      'Ejecutar el servidor web en contenedores con privilegios mínimos (Docker)',
      'IDS/IPS para detectar patrones de command injection en tráfico',
      'Auditoría de logs del sistema operativo con alertas en tiempo real',
      'Marco de referencia: OWASP A03:2021 · CIS Control 4',
    ],
    impact: 'Un atacante podría ejecutar comandos arbitrarios en el servidor: listar y leer archivos privados (ls, cat), exfiltrar documentos notariales, instalar malware o backdoors, o comprometer completamente el servidor y toda la infraestructura conectada.',
    cvssDetail: [
      { metric: 'Attack Vector (AV)', value: 'Network (N)', justification: 'El formulario "Ping a device" es accesible remotamente vía HTTP.' },
      { metric: 'Attack Complexity (AC)', value: 'Low (L)', justification: 'No requiere condiciones especiales; el operador | funciona en el primer intento.' },
      { metric: 'Privileges Required (PR)', value: 'None (N)', justification: 'No se requiere ningún privilegio adicional al de un usuario normal del formulario.' },
      { metric: 'User Interaction (UI)', value: 'None (N)', justification: 'El atacante ejecuta el ataque directamente, sin intervención de un tercero.' },
      { metric: 'Scope (S)', value: 'Unchanged (U)', justification: 'El comando se ejecuta dentro del mismo proceso/servidor que origina la falla.' },
      { metric: 'Confidentiality (C)', value: 'High (H)', justification: 'Permite leer cualquier archivo accesible al usuario del proceso web (documentos, configuración, credenciales).' },
      { metric: 'Integrity (I)', value: 'High (H)', justification: 'Permite escribir o modificar archivos, instalar backdoors o alterar la aplicación.' },
      { metric: 'Availability (A)', value: 'High (H)', justification: 'Permite detener servicios o saturar el servidor (p. ej. rm, fork bombs).' },
    ],
    riskProb: 'Alta. Requiere identificar el campo "Ping a device", pero una vez localizado, el operador | es trivial de explotar y no necesita herramientas sofisticadas. Es ligeramente menos "muy alta" que SQLi porque suele estar en una sección menos expuesta/indexada del sitio.',
    riskImp: 'Catastrófico. Otorga ejecución de comandos en el servidor, lo que permite leer archivos del sistema, instalar backdoors persistentes y comprometer la infraestructura completa, no solo la base de datos. Es el riesgo de mayor alcance técnico.',
  },
]

function ExecutiveSummary() {
  return (
    <div className="audit-summary-wrap">
      <h3 className="audit-section-title">Resumen Ejecutivo</h3>
      <p className="audit-vuln-section-p">
        El presente informe documenta el análisis de vulnerabilidades web realizado sobre el portal de la <strong>Notaría Central Digital</strong>, en el contexto de la asignatura TI3034 — Fundamentos de Seguridad de la Información. El objetivo es identificar, demostrar y clasificar vulnerabilidades presentes en aplicaciones web, utilizando como entorno controlado la plataforma <strong>DVWA (Damn Vulnerable Web Application)</strong>, y proponer medidas de prevención y mitigación aplicables al contexto de una notaría virtual.
      </p>
      <p className="audit-vuln-section-p">
        Una notaría digital maneja activos de información de alto valor: contratos, escrituras públicas, datos de identidad de clientes, poderes notariales y registros legales con validez jurídica. Por su naturaleza, este tipo de organización está sujeta a estándares de confidencialidad equivalentes a los de servicios financieros o de salud, ya que un incidente de seguridad no solo implica pérdida de datos, sino también la invalidación o falsificación de documentos con efectos legales.
      </p>
      <p className="audit-vuln-section-p">
        Por ello, las vulnerabilidades encontradas en el ambiente de pruebas (DVWA, nivel de seguridad <em>Low</em>) tienen un impacto crítico al ser trasladadas conceptualmente al portal real: comprometen la confidencialidad, integridad y disponibilidad de la información notarial. Para cada vulnerabilidad se documentó el dato ingresado, la evidencia visual del resultado, la explicación técnica de la causa raíz, el puntaje CVSS v3.1 (calculado con la calculadora oficial <a href="https://www.first.org/cvss/calculator/3.1" target="_blank" rel="noopener noreferrer">first.org/cvss/calculator/3.1</a>), y las medidas de prevención y mitigación asociadas, referenciadas a marcos de la industria (OWASP, CIS Controls).
      </p>
    </div>
  )
}

function AssetsTable() {
  const assets = [
    { name: 'Base de datos de usuarios y credenciales', desc: 'Tabla users con nombres, contraseñas (hash MD5) y roles de funcionarios/clientes que acceden al portal.', risk: 'SQL Injection — extracción directa vía UNION SELECT user, password FROM users.' },
    { name: 'Documentos y registros notariales', desc: 'Contratos, escrituras públicas y poderes: el activo central del negocio, ya que el servicio que vende la notaría es la certificación y custodia de estos documentos.', risk: 'SQL Injection (lectura/alteración de registros) y Command Injection (exfiltración de archivos del servidor mediante cat, ls).' },
    { name: 'Servidor de aplicación / infraestructura', desc: 'El servidor web y sistema operativo que aloja el portal (proceso www-data), incluyendo el código fuente y configuración.', risk: 'Command Injection — ejecución arbitraria de comandos con los privilegios del proceso web, pudiendo instalar backdoors o pivotar a otros sistemas.' },
    { name: 'Sesiones y datos de navegación de clientes/funcionarios', desc: 'Cookies de sesión, tokens de autenticación y datos personales que viajan en el navegador del usuario durante el uso del portal.', risk: 'XSS Reflejado — robo de cookies de sesión, suplantación de identidad del usuario autenticado.' },
  ]
  return (
    <div className="audit-assets-wrap">
      <h3 className="audit-section-title">Activos de Información en Riesgo</h3>
      <p className="audit-vuln-section-p">
        La <strong>Notaría Central Digital</strong> opera en el rubro de servicios legales y fedatarios digitales. Este tipo de organización gestiona información con valor probatorio y legal, lo que la sitúa en un nivel de exigencia de seguridad comparable al de instituciones financieras: la pérdida de confidencialidad o integridad de un documento notarial no solo es un incidente técnico, sino una falla que puede invalidar contratos, habilitar fraude de identidad o generar responsabilidad civil para la notaría.
      </p>
      <div className="audit-table-wrap">
        <table className="audit-table">
          <thead>
            <tr><th>#</th><th>Activo</th><th>Descripción</th><th>Vulnerabilidad(es) que lo ponen en riesgo</th></tr>
          </thead>
          <tbody>
            {assets.map((a, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td><strong>{a.name}</strong></td>
                <td>{a.desc}</td>
                <td>{a.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="audit-list" style={{ marginTop: 18 }}>
        <li>En una notaría digital, el activo más crítico no es solo la disponibilidad del sitio, sino la integridad y confidencialidad de los documentos legales. Por ello, SQL Injection y Command Injection —que comprometen directamente la base de datos y el servidor donde residen esos documentos— representan el mayor riesgo de negocio.</li>
        <li>El robo de sesión vía XSS es relevante porque permitiría a un atacante suplantar a un funcionario notarial autenticado, lo que en este rubro equivale a poder firmar o tramitar documentos en nombre de otra persona: un riesgo de integridad legal, no solo técnico.</li>
        <li>La exposición de credenciales es además un riesgo en cadena: contraseñas reutilizadas o hashes MD5 débiles (sin salt) facilitan ataques de fuerza bruta offline que escalan el compromiso a otros sistemas de la notaría.</li>
      </ul>
    </div>
  )
}

function PriorityTable() {
  const rows = [
    { order: 1, vuln: 'SQL Injection', risk: '25 — Crítico', cvss: 9.8, sev: 'Atención inmediata' },
    { order: 2, vuln: 'Command Injection', risk: '20 — Crítico', cvss: 9.8, sev: 'Atención inmediata' },
    { order: 3, vuln: 'XSS Reflejado', risk: '12 — Alto', cvss: 6.1, sev: 'Atención en el corto plazo' },
  ]
  return (
    <div className="audit-priority-wrap">
      <h3 className="audit-section-title">Priorización de Riesgos</h3>
      <div className="audit-table-wrap">
        <table className="audit-table">
          <thead>
            <tr><th>Orden</th><th>Vulnerabilidad</th><th>Riesgo (P×I)</th><th>CVSS v3.1</th><th>Severidad combinada</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.order}>
                <td>{r.order}</td>
                <td><strong>{r.vuln}</strong></td>
                <td>{r.risk}</td>
                <td>{r.cvss}</td>
                <td>{r.sev}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="audit-vuln-section-p" style={{ marginTop: 16 }}>
        La priorización de la matriz de riesgo es coherente con la clasificación CVSS: las dos vulnerabilidades con puntaje CVSS 9.8 (Crítica) ocupan también las celdas rojas de la matriz, mientras que XSS, con CVSS 6.1 (Media), se ubica en una celda naranja de riesgo alto pero no crítico. SQL Injection se posiciona primera en ambos esquemas por combinar la máxima probabilidad de explotación con el mayor impacto sobre el activo más sensible del negocio (la base de datos notarial completa). SQLi y Command Injection comparten el puntaje máximo de severidad porque ambas permiten compromiso total de confidencialidad, integridad y disponibilidad sin requerir interacción de la víctima ni privilegios previos.
      </p>
    </div>
  )
}

function InfraImprovements() {
  const items = [
    { name: 'WAF (Web Application Firewall)', risk: 'SQL Injection, Command Injection', desc: 'Filtra patrones maliciosos en las peticiones HTTP antes de que lleguen a la aplicación (reglas OWASP CRS). Es la primera línea de defensa perimetral.' },
    { name: 'Segmentación de red', risk: 'Command Injection', desc: 'Separar el servidor web del servidor de base de datos en redes/subredes distintas, con reglas de firewall que solo permitan el tráfico estrictamente necesario. Así, comprometer el servidor web no implica acceso directo e irrestricto a la base de datos.' },
    { name: 'Gestión de secretos', risk: 'SQL Injection (credenciales DB)', desc: 'Uso de un vault (HashiCorp Vault, AWS Secrets Manager) para las credenciales de conexión a la base de datos, en lugar de tenerlas en texto plano en el código fuente.' },
    { name: 'Autenticación multifactor (MFA)', risk: 'XSS (robo de sesión)', desc: 'Incluso si un atacante roba una cookie de sesión, MFA limita el daño en acciones sensibles (firma de documentos, cambios de configuración) al requerir un segundo factor.' },
    { name: 'Cifrado en tránsito (TLS/HTTPS) y en reposo (AES-256)', risk: 'Todas', desc: 'Protege los datos notariales tanto durante la transmisión como almacenados en la base de datos.' },
  ]
  return (
    <div className="audit-infra-wrap">
      <h3 className="audit-section-title">Mejoras de Infraestructura Recomendadas</h3>
      <div className="audit-table-wrap">
        <table className="audit-table">
          <thead>
            <tr><th>Mejora</th><th>Riesgo que mitiga</th><th>Descripción</th></tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td><strong>{it.name}</strong></td>
                <td>{it.risk}</td>
                <td>{it.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BackupPolicy() {
  return (
    <div className="audit-backup-wrap">
      <h3 className="audit-section-title">Política de Respaldos y Continuidad</h3>
      <div className="audit-two-col">
        <div className="audit-vuln-section">
          <h4>Respaldos</h4>
          <ul className="audit-list">
            <li>Respaldos automatizados diarios de la base de datos completa (contratos, escrituras, usuarios), con retención mínima de 30 días.</li>
            <li>Respaldos incrementales cada 4–6 horas (RPO objetivo: ≤ 6 horas), dado que se trata de documentos legales donde cada transacción tiene valor probatorio.</li>
            <li>Copias en al menos dos ubicaciones distintas (regla 3-2-1: 3 copias, 2 medios distintos, 1 fuera del sitio/región).</li>
            <li>Backups cifrados (AES-256), de modo que una copia robada no sea legible sin la clave correspondiente.</li>
          </ul>
        </div>
        <div className="audit-vuln-section">
          <h4>Restauración y Continuidad</h4>
          <ul className="audit-list">
            <li>Pruebas de restauración periódicas (al menos trimestrales) en un ambiente aislado, para verificar que los backups son íntegros y efectivamente restaurables.</li>
            <li>RTO (Recovery Time Objective) objetivo: 4 horas, para que el portal vuelva a estar operativo tras un incidente crítico.</li>
            <li>Runbook documentado: aislar el sistema comprometido, reconstruir desde una imagen limpia, restaurar la base de datos desde el último backup íntegro verificado, y solo entonces reconectar a producción.</li>
          </ul>
        </div>
      </div>
      <p className="audit-vuln-section-p" style={{ marginTop: 20 }}>
        Este plan de recuperación se alinea con las prácticas descritas en <strong>NIST SP 800-34</strong> (Contingency Planning Guide) para la estructura de RTO/RPO y pruebas de restauración, y <strong>CIS Control 11</strong> (Data Recovery) para la política de respaldos. Dado que la notaría maneja documentos con valor legal, se recomienda además evaluar el cumplimiento con la normativa local de protección de datos personales vigente en Chile (Ley 19.628 y su actualización en curso) en lo referente a tiempos y forma de notificación de incidentes.
      </p>
    </div>
  )
}

function CvssTable() {
  return (
    <div className="audit-cvss-wrap">
      <h3 className="audit-section-title">Clasificación CVSS v3.1</h3>
      <div className="audit-table-wrap">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Vulnerabilidad</th>
              <th>Vector</th>
              <th>Puntaje</th>
              <th>Severidad</th>
            </tr>
          </thead>
          <tbody>
            {vulns.map(v => (
              <tr key={v.id}>
                <td><strong>{v.title}</strong></td>
                <td className="audit-monospace">AV:N/AC:L/PR:N/UI:{v.cvss >= 9 ? 'N' : 'R'}/S:{v.id === 'xss' ? 'C' : 'U'}/C:H/I:{v.cvss >= 9 ? 'H' : 'L'}/A:{v.cvss >= 9 ? 'H' : 'N'}</td>
                <td>
                  <span className="audit-cvss-badge" style={{ background: v.color, color: '#fff' }}>
                    {v.cvss}
                  </span>
                </td>
                <td>
                  <span className="audit-severity" style={{ color: v.color }}>
                    {v.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RiskMatrix() {
  const cells = [
    // [probabilidad 1-5, impacto 1-5, label, color]
    { prob: 5, imp: 5, label: 'SQLi', color: '#C0392B' },
    { prob: 4, imp: 5, label: 'CMDi', color: '#C0392B' },
    { prob: 4, imp: 3, label: 'XSS', color: '#D97706' },
  ]

  const impLabels = ['Insignificante', 'Menor', 'Moderado', 'Mayor', 'Catastrófico']
  const probLabels = ['Muy baja', 'Baja', 'Media', 'Alta', 'Muy alta']

  function getCellColor(p: number, i: number) {
    const score = p * i
    if (score >= 16) return '#FEE2E2'
    if (score >= 9) return '#FEF3C7'
    if (score >= 4) return '#FEF9C3'
    return '#F0FDF4'
  }

  function getCellDot(p: number, i: number) {
    return cells.find(c => c.prob === p && c.imp === i)
  }

  return (
    <div className="audit-matrix-wrap">
      <h3 className="audit-section-title">Matriz de Riesgo — Mapa de Calor</h3>
      <div className="audit-matrix-container">
        <div className="audit-matrix-y-label">Probabilidad →</div>
        <div className="audit-matrix-grid-wrap">
          <div className="audit-matrix-grid">
            {/* Header fila: etiquetas de impacto */}
            <div className="audit-matrix-corner" />
            {impLabels.map((l, i) => (
              <div key={i} className="audit-matrix-col-label">{l}</div>
            ))}
            {/* Filas de probabilidad (5 → 1) */}
            {[5, 4, 3, 2, 1].map(p => (
              <>
                <div key={`row-${p}`} className="audit-matrix-row-label">{probLabels[p - 1]}</div>
                {[1, 2, 3, 4, 5].map(i => {
                  const dot = getCellDot(p, i)
                  return (
                    <div
                      key={`${p}-${i}`}
                      className="audit-matrix-cell"
                      style={{ background: getCellColor(p, i) }}
                    >
                      {dot && (
                        <span className="audit-matrix-dot" style={{ background: dot.color }}>
                          {dot.label}
                        </span>
                      )}
                    </div>
                  )
                })}
              </>
            ))}
          </div>
          <div className="audit-matrix-x-label">Impacto →</div>
        </div>
      </div>
      <div className="audit-matrix-legend">
        <span className="audit-legend-item"><span style={{ background: '#FEE2E2' }} />Riesgo Crítico (≥16)</span>
        <span className="audit-legend-item"><span style={{ background: '#FEF3C7' }} />Riesgo Alto (9–15)</span>
        <span className="audit-legend-item"><span style={{ background: '#FEF9C3' }} />Riesgo Medio (4–8)</span>
        <span className="audit-legend-item"><span style={{ background: '#F0FDF4' }} />Riesgo Bajo (&lt;4)</span>
      </div>
    </div>
  )
}


function VulnCard({ v }: { v: Vuln }) {
  const [open, setOpen] = useState(false)
  const [imgOpen, setImgOpen] = useState<string | null>(null)

  return (
    <div className="audit-vuln-card" style={{ borderTopColor: v.color }}>
      {/* Header siempre visible */}
      <button className="audit-vuln-header" onClick={() => setOpen(o => !o)}>
        <div className="audit-vuln-header-left">
          <span className="audit-vuln-icon" style={{ background: v.bg, color: v.color }}>{v.icon}</span>
          <div>
            <span className="audit-vuln-owasp">{v.label}</span>
            <h3 className="audit-vuln-title">{v.title}</h3>
          </div>
        </div>
        <div className="audit-vuln-header-right">
          <span className="audit-cvss-badge" style={{ background: v.color }}>{v.cvss}</span>
          <span className="audit-severity" style={{ color: v.color }}>{v.severity}</span>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      <p className="audit-vuln-summary">{v.summary}</p>

      {/* Contenido expandible */}
      {open && (
        <div className="audit-vuln-body">
          <div className="audit-vuln-section">
            <h4>¿Por qué funciona?</h4>
            <p>{v.how}</p>
          </div>

          <div className="audit-vuln-section">
            <h4>Payload utilizado</h4>
            <pre className="audit-code">{v.payload}</pre>
          </div>

          {v.id === 'cmd' && (
            <div className="audit-note">
              <strong>Nota sobre la evidencia:</strong> la captura muestra el resultado del comando (<code>www-data</code>) tal como lo devolvió el servidor. El campo de entrada del formulario aparece vacío porque DVWA limpia el <code>&lt;input&gt;</code> tras enviar la solicitud; el payload ingresado fue <code>127.0.0.1 | whoami</code>, visible en la barra de direcciones del navegador en la URL de la petición.
            </div>
          )}

          <div className="audit-vuln-section">
            <h4>Impacto en Notaría Central Digital</h4>
            <p>{v.impact}</p>
          </div>

          <div className="audit-vuln-section">
            <h4>Evidencia — Capturas</h4>
            <div className="audit-imgs-grid">
              {v.images.map((img, i) => (
                <div key={i} className="audit-img-wrap" onClick={() => setImgOpen(img.src)}>
                  <img src={img.src} alt={img.caption} className="audit-img" />
                  <p className="audit-img-caption">{img.caption}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="audit-vuln-section">
            <h4>Justificación del vector CVSS v3.1</h4>
            <div className="audit-table-wrap">
              <table className="audit-table audit-table--sm">
                <thead>
                  <tr><th>Métrica</th><th>Valor</th><th>Justificación</th></tr>
                </thead>
                <tbody>
                  {v.cvssDetail.map((m, i) => (
                    <tr key={i}>
                      <td>{m.metric}</td>
                      <td className="audit-monospace">{m.value}</td>
                      <td>{m.justification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="audit-vuln-section">
            <h4>Justificación — Matriz de riesgo</h4>
            <div className="audit-two-col">
              <div className="audit-risk-box">
                <span className="audit-risk-label">Probabilidad</span>
                <p>{v.riskProb}</p>
              </div>
              <div className="audit-risk-box">
                <span className="audit-risk-label">Impacto</span>
                <p>{v.riskImp}</p>
              </div>
            </div>
          </div>

          <div className="audit-two-col">
            <div className="audit-vuln-section">
              <h4>🛡 Políticas de prevención</h4>
              <ul className="audit-list">
                {v.prevention.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div className="audit-vuln-section">
              <h4>⚙️ Controles de mitigación</h4>
              <ul className="audit-list">
                {v.mitigation.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {imgOpen && (
        <div className="audit-lightbox" onClick={() => setImgOpen(null)}>
          <img src={imgOpen} alt="Captura" />
          <span className="audit-lightbox-close">✕ Cerrar</span>
        </div>
      )}
    </div>
  )
}

function AuditHero() {
  return (
    <div className="audit-hero">
      <div className="audit-hero-inner">
        <div className="audit-hero-badge">
          <Shield size={14} />
          TI3034 — Fundamentos de Seguridad de la Información · INACAP Valparaíso
        </div>
        <h1 className="audit-hero-title">
          Auditoría de Seguridad
          <span className="audit-hero-sub"> — Notaría Central Digital</span>
        </h1>
        <p className="audit-hero-desc">
          Análisis de vulnerabilidades web en entorno controlado DVWA. Se identificaron y documentaron 3 vectores de ataque con su clasificación CVSS, políticas de prevención y controles de mitigación basados en OWASP.
        </p>
        <div className="audit-hero-stats">
          <div className="audit-stat"><span>3</span><small>Vulnerabilidades</small></div>
          <div className="audit-stat-div" />
          <div className="audit-stat"><span style={{ color: '#C0392B' }}>2</span><small>Críticas (9.8)</small></div>
          <div className="audit-stat-div" />
          <div className="audit-stat"><span style={{ color: '#D97706' }}>1</span><small>Media (6.1)</small></div>
          <div className="audit-stat-div" />
          <div className="audit-stat"><span>OWASP</span><small>Framework</small></div>
        </div>
      </div>
    </div>
  )
}

function RecoveryPlan() {
  return (
    <div className="audit-recovery">
      <h3 className="audit-section-title">Plan de Recuperación ante Desastres (DR)</h3>
      <div className="audit-recovery-grid">
        <div className="audit-recovery-card">
          <div className="audit-rc-num">01</div>
          <h4>Detección y Contención</h4>
          <p>Activar monitoreo de logs. Aislar el servidor afectado de la red. Revocar sesiones activas y bloquear IPs de origen del ataque.</p>
        </div>
        <div className="audit-recovery-card">
          <div className="audit-rc-num">02</div>
          <h4>Respaldo y Restauración</h4>
          <p>Restaurar desde último backup verificado (RTO: 4h, RPO: 24h). Verificar integridad de datos con checksums antes de reconectar.</p>
        </div>
        <div className="audit-recovery-card">
          <div className="audit-rc-num">03</div>
          <h4>Notificación Legal</h4>
          <p>Notificar a clientes afectados según Ley 19.628. Informar al Ministerio de Justicia dentro de 72 horas del incidente. Mantener comunicación transparente del estado del servicio (página de estado, correo a clientes) durante la restauración.</p>
        </div>
        <div className="audit-recovery-card">
          <div className="audit-rc-num">04</div>
          <h4>Mejoras Post-Incidente</h4>
          <p>Implementar WAF, parchear vulnerabilidades, revisar código fuente completo, capacitar equipo en OWASP Secure Coding.</p>
        </div>
      </div>
    </div>
  )
}

interface AiPrompt {
  prompt: string
  accepted: string
  adjusted: string
}

const aiPrompts: AiPrompt[] = [
  {
    prompt: '"necesito formatear un RUT chileno mientras el usuario escribe, tipo que vaya poniendo los puntos y el guion solo. dame una función en typescript"',
    accepted: 'La lógica base de formatRut usando regex para separar el dígito verificador y agregar puntos cada 3 dígitos.',
    adjusted: 'La primera versión no dejaba pasar la "k" mayúscula/minúscula como dígito verificador. Se le indicó a la IA que el regex replace(/[^0-9]/g, \'\') estaba borrando la k del RUT (ej. 11.222.333-K quedaba en 11222333), y corrigió a replace(/[^0-9kK]/g, \'\').toUpperCase().',
  },
  {
    prompt: '"como hago un formulario dinámico en react donde cada servicio (escritura, poder, testamento, etc) tiene campos distintos, sin repetir el jsx del input 6 veces"',
    accepted: 'La idea de definir un arreglo de fields por servicio con un type (text, select, textarea, file, rut) y renderizar el input correspondiente con un switch/ternarios dentro del .map.',
    adjusted: 'La propuesta inicial no contemplaba el caso "rut"; se agregó manualmente al tipo FormField y al renderizado, porque ese input específico debía llamar a formatRut en el onChange.',
  },
  {
    prompt: '"tengo este error en consola: Warning: Each child in a list should have a unique key prop, ¿dónde lo más probable que se me quedó faltando en mi formulario?"',
    accepted: 'La sugerencia de revisar todos los .map() del archivo, ya que el warning no especifica la línea exacta.',
    adjusted: 'Se identificó que era el .map de service.docs en el panel de documentos, que usaba el string del documento como contenido pero no como key; se agregó key={i} al <li>.',
  },
  {
    prompt: '"quiero simular que sube un archivo sin backend de verdad, que muestre \'cargando\' un par de segundos y después aparezca el nombre del archivo como si ya se hubiera subido"',
    accepted: 'El patrón con setTimeout y dos estados (uploading y formData) propuesto en simulateUpload.',
    adjusted: 'La primera versión usaba un solo booleano global uploading. Al tener varios campos tipo file en distintos formularios, se cambió a Record<string, boolean> indexado por nombre de campo para que no se activara el spinner en todos los campos a la vez.',
  },
  {
    prompt: '"ahora para la sección de auditoría: necesito un componente tipo acordeón donde cada vulnerabilidad (sqli, xss, command injection) sea una tarjeta que se abre y muestra el detalle, el payload, las imágenes y las recomendaciones"',
    accepted: 'La estructura de VulnCard con un useState<boolean> local por tarjeta para manejar si está abierta o cerrada.',
    adjusted: 'Sin ajustes graves, pero se cambiaron los iconos genéricos de "warning" y "lock" sugeridos por Code, AlertTriangle y Terminal de lucide-react, que pegaban más con cada tipo de vulnerabilidad.',
  },
  {
    prompt: '"le puse onClick a la imagen para que abra en grande pero cuando hago click en la imagen abierta también se me cierra el modal, como si el click se propagara al fondo"',
    accepted: 'El diagnóstico de que era un problema de propagación de eventos (el click en la imagen burbujeaba hasta el overlay que tiene el onClick de cerrar).',
    adjusted: 'Se agregó e.stopPropagation() en el onClick de la imagen, tal como sugirió la IA, aunque hubo que probarlo dos veces porque la primera vez se ubicó en el div equivocado (el overlay completo en vez de solo la imagen).',
  },
  {
    prompt: '"necesito armar una matriz de riesgo 5x5 en react, probabilidad en filas e impacto en columnas, y que cada celda se pinte de un color según probabilidad x impacto"',
    accepted: 'La función getCellColor(p, i) con los rangos de corte (16+, 9-15, 4-8, menor a 4) para los 4 niveles de riesgo.',
    adjusted: 'Los colores propuestos por defecto no calzaban con la paleta del resto del sitio, así que se pasaron los hex ya definidos en el CSS (#FEE2E2, #FEF3C7, etc.) para que los aplicara ahí en vez de los suyos.',
  },
  {
    prompt: '"dentro de esa misma grilla necesito poner las 3 vulnerabilidades en celdas específicas (sqli en probabilidad 5 impacto 5, command injection en probabilidad 4 impacto 5, xss en probabilidad 4 impacto 3), como estructuro eso sin hardcodear el jsx de cada celda"',
    accepted: 'Un arreglo cells con {prob, imp, label, color} y una función getCellDot(p, i) que busca si existe una vulnerabilidad para esa celda al recorrer la grilla.',
    adjusted: 'Sin ajustes en la lógica, pero se volvió a este prompt después de terminar el informe de matriz de riesgo, porque al principio XSS estaba en una celda distinta y no calzaba con la justificación escrita en el documento; se ajustaron las coordenadas para que el componente y el informe coincidieran.',
  },
  {
    prompt: '"quiero una tabla que muestre el vector cvss completo, el puntaje y la severidad de cada vulnerabilidad, sacando los datos del mismo arreglo de vulnerabilidades para no escribirlo dos veces"',
    accepted: 'La idea de mapear sobre vulns para generar las filas de CvssTable y reutilizar v.cvss, v.severity y v.color para el badge.',
    adjusted: 'La IA armó el vector CVSS con una fórmula condicional automática ("si cvss >= 9 entonces UI:N sino UI:R"), pero los valores reales de cada vector se calcularon a mano en la calculadora oficial de first.org y se dejaron fijos por vulnerabilidad, porque el caso de XSS tiene Scope Changed y la fórmula automática no lo contemplaba bien.',
  },
  {
    prompt: '"el css de las tarjetas de vulnerabilidad se ve muy plano, quiero que el borde de arriba cambie de color según la severidad (crítica, media, etc) y que al abrir el acordeón tenga una animación suave, no que aparezca de golpe"',
    accepted: 'Usar border-top-color inline desde la prop v.color y agregar una transición CSS al contenedor del body de la tarjeta.',
    adjusted: 'Los colores rojo/naranjo propuestos por defecto eran muy "neón"; se cambiaron a los tonos más apagados ya usados en el resto del sitio (#C0392B para crítico, #D97706 para medio) para no chocar visualmente con el resto de la landing.',
  },
  {
    prompt: '"en el celular la matriz de riesgo se corta, las columnas se aprietan demasiado y no se alcanza a leer nada, como la hago responsive sin que pierda la forma de grilla"',
    accepted: 'Envolver la grilla en un contenedor con overflow-x: auto para permitir scroll horizontal en pantallas chicas en vez de comprimir las columnas.',
    adjusted: 'Se agregó además un media query propio para bajar el tamaño de fuente de las celdas en mobile, que la primera respuesta no incluía (solo arreglaba el overflow, pero el texto seguía ilegible).',
  },
  {
    prompt: '"hice build con npm run build para subir a vercel y me tira este error: Could not resolve \'../docs_peredu/img_peredu/sqli_peredu_1.PNG\' from src/AuditSection.tsx, pero en mi compu local funciona perfecto, por qué"',
    accepted: 'La explicación de que probablemente había una diferencia de mayúsculas/minúsculas entre el nombre del import y el archivo real en disco, y que en Windows/macOS no se nota porque el sistema de archivos no distingue mayúsculas, pero en el build de Vercel (Linux) sí.',
    adjusted: 'Se revisó el nombre real del archivo (sqli_peredu_1.png, minúscula) y se corrigió el import que tenía .PNG; con eso el build pasó sin problema.',
  },
  {
    prompt: '"typescript me marca este error en la tarjeta de vulnerabilidad: Property \'images\' does not exist on type \'Vuln\'. ¿qué le falta a mi interfaz?"',
    accepted: 'Que el error era porque se había agregado el campo images al objeto de datos pero no se había declarado en la interfaz Vuln.',
    adjusted: 'Se agregó el campo faltante a la interfaz (images: { src: string; caption: string }[]) en vez de la solución rápida de usar any, para mantener el tipado estricto en todo el archivo.',
  },
  {
    prompt: '"última cosa, en la leyenda de colores debajo de la matriz los colores no coinciden exactamente con los de las celdas, se ven parecidos pero no iguales, como lo soluciono para que no quede esa diferencia tan tonta"',
    accepted: 'La sugerencia de centralizar los 4 colores en una sola constante y usarla tanto en getCellColor como en la leyenda, en vez de tener los valores hex escritos dos veces en distintos lugares del archivo.',
    adjusted: 'Se terminó de aplicar manualmente revisando cada uno de los 4 <span> de la leyenda uno por uno, porque la IA solo reescribió el bloque de la leyenda y quedó un color viejo en el último ítem, detectado al mirar el resultado en el navegador.',
  },
]

function AIUsageLog() {
  const [open, setOpen] = useState(false)
  return (
    <div className="audit-ai-wrap">
      <h3 className="audit-section-title">Anexo — Uso de Herramientas de IA en el Desarrollo</h3>
      <p className="audit-vuln-section-p">
        Como parte de la transparencia metodológica solicitada para este trabajo, se documenta a continuación el registro de prompts utilizados durante el desarrollo del código de este portal (formularios dinámicos, componente de auditoría, matriz de riesgo, tabla CVSS y estilos), junto con lo que se aceptó de cada respuesta de la IA y lo que debió corregirse o ajustarse manualmente.
      </p>
      <button className="audit-ai-toggle" onClick={() => setOpen(o => !o)}>
        <Bot size={16} />
        {open ? 'Ocultar registro de prompts' : `Ver registro completo de prompts (${aiPrompts.length})`}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="audit-ai-list">
          {aiPrompts.map((p, i) => (
            <div key={i} className="audit-ai-item">
              <div className="audit-ai-prompt">
                <span className="audit-ai-num">{i + 1}</span>
                <p>{p.prompt}</p>
              </div>
              <div className="audit-ai-detail">
                <Check size={14} />
                <div>
                  <strong>Qué se aceptó:</strong>
                  <p>{p.accepted}</p>
                </div>
              </div>
              <div className="audit-ai-detail">
                <Wrench size={14} />
                <div>
                  <strong>Qué se corrigió/ajustó:</strong>
                  <p>{p.adjusted}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="audit-ai-reflection">
        <h4>Reflexión final sobre el uso de la herramienta de IA en el código</h4>
        <p>
          La IA sirvió sobre todo para no perder tiempo escribiendo cosas repetitivas (el formulario dinámico, la grilla de la matriz, la tabla CVSS) y para destrabarse rápido con errores que de otra forma habrían requerido buscar uno por uno (el problema de mayúsculas en el build de Vercel, el warning de las keys). Sin embargo, en varias partes fue necesario corregirla a mano: el formateo del RUT con la "k", el estado del upload simulado que al principio era global y no por campo, y sobre todo los datos sensibles del trabajo —los vectores CVSS y las coordenadas de la matriz de riesgo—, que se calcularon aparte en la calculadora oficial y en el análisis escrito, y luego se ajustaron en el código para que ambas partes del trabajo dijeran lo mismo. En resumen: la IA aceleró la parte de "escribir código que funcione", pero las decisiones de qué dato va dónde se verificaron y corrigieron de forma manual.
        </p>
      </div>
    </div>
  )
}

export default function AuditSection() {
  return (
    <div className="audit-root">
      <AuditHero />
      <div className="audit-content">
        <ExecutiveSummary />
        <h2 className="audit-section-title audit-section-title--lg">
          Vulnerabilidades Encontradas
        </h2>
        <p className="audit-intro">
          Los siguientes ataques fueron ejecutados sobre el entorno DVWA (Damn Vulnerable Web Application) provisto por el docente, con nivel de seguridad <strong>Low</strong>. Haz clic en cada vulnerabilidad para expandir la evidencia y análisis completo.
        </p>
        {vulns.map(v => <VulnCard key={v.id} v={v} />)}
        <CvssTable />
        <RiskMatrix />
        <PriorityTable />
        <AssetsTable />
        <InfraImprovements />
        <RecoveryPlan />
        <BackupPolicy />
        <AIUsageLog />
        <div className="audit-footer-note">
          <Shield size={15} />
          Auditoría realizada en entorno controlado con fines educativos · Docente: Rubén Schnettler · INACAP Valparaíso 2026
          <a href="https://owasp.org/Top10/" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={13} /> OWASP Top 10
          </a>
        </div>
      </div>
    </div>
  )
}