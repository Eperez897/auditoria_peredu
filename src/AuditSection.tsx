import { Shield, AlertTriangle, ChevronDown, ChevronUp, ExternalLink, Code, Terminal } from 'lucide-react'
import { useState } from 'react'

import sqli1 from '../docs_peredu/img_peredu/sqli_peredu_1.png'
import sqli2 from '../docs_peredu/img_peredu/sqli_peredu_2.png'
import sqli3 from '../docs_peredu/img_peredu/sqli_peredu_3.png'
import sqli4 from '../docs_peredu/img_peredu/sqli_peredu_4.png'
import xssImg from '../docs_peredu/img_peredu/xss_peredu.png'
import cmdImg from '../docs_peredu/img_peredu/comandos_peredu.png'

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
  },
]

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
          <p>Notificar a clientes afectados según Ley 19.628. Informar al Ministerio de Justicia dentro de 72 horas del incidente.</p>
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

export default function AuditSection() {
  return (
    <div className="audit-root">
      <AuditHero />
      <div className="audit-content">
        <h2 className="audit-section-title audit-section-title--lg">
          Vulnerabilidades Encontradas
        </h2>
        <p className="audit-intro">
          Los siguientes ataques fueron ejecutados sobre el entorno DVWA (Damn Vulnerable Web Application) provisto por el docente, con nivel de seguridad <strong>Low</strong>. Haz clic en cada vulnerabilidad para expandir la evidencia y análisis completo.
        </p>
        {vulns.map(v => <VulnCard key={v.id} v={v} />)}
        <CvssTable />
        <RiskMatrix />
        <RecoveryPlan />
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
