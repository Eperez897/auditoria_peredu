import { useState } from 'react'
import {
  Scale, FileText, Home, Users, Shield, ChevronRight,
  Phone, Mail, MapPin, Clock, CheckCircle, ArrowLeft,
  User, Upload, AlertCircle,
  Stamp, Building2, BookOpen, FileSignature, Star
} from 'lucide-react'
import './App.css'
import AuditSection from './AuditSection'

type View = 'home' | 'services' | 'tramite' | 'confirmation' | 'login' | 'auditoria'
type ServiceId = 'escritura' | 'poder' | 'testamento' | 'autenticacion' | 'sociedad' | 'herencia'

interface Service {
  id: ServiceId
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  price: string
  days: string
  docs: string[]
  fields: FormField[]
}

interface FormField {
  name: string
  label: string
  type: 'text' | 'date' | 'select' | 'file' | 'textarea' | 'rut'
  placeholder?: string
  options?: string[]
  required?: boolean
}

const services: Service[] = [
  {
    id: 'escritura',
    icon: <Home size={28} />,
    title: 'Escritura de Compraventa',
    subtitle: 'Bienes Raíces',
    description: 'Formalización notarial de compraventa de inmuebles, con revisión de títulos y certificados al día.',
    price: 'Desde $180.000',
    days: '3–5 días hábiles',
    docs: ['Cédula de identidad vigente', 'Certificado de dominio vigente', 'Certificado de hipotecas', 'Avalúo fiscal SII'],
    fields: [
      { name: 'vendedor', label: 'RUT Vendedor', type: 'rut', placeholder: '12.345.678-9', required: true },
      { name: 'comprador', label: 'RUT Comprador', type: 'rut', placeholder: '12.345.678-9', required: true },
      { name: 'direccion', label: 'Dirección del inmueble', type: 'text', placeholder: 'Av. Providencia 1234, Santiago', required: true },
      { name: 'precio', label: 'Precio de compraventa (CLP)', type: 'text', placeholder: '$85.000.000', required: true },
      { name: 'fecha', label: 'Fecha propuesta de firma', type: 'date', required: true },
      { name: 'observaciones', label: 'Observaciones adicionales', type: 'textarea', placeholder: 'Detalles especiales del trámite...' },
    ]
  },
  {
    id: 'poder',
    icon: <FileSignature size={28} />,
    title: 'Poder Notarial',
    subtitle: 'Mandatos y Autorizaciones',
    description: 'Autorización legal para que otra persona actúe en su nombre ante entidades públicas y privadas.',
    price: 'Desde $45.000',
    days: '1–2 días hábiles',
    docs: ['Cédula de identidad del mandante', 'Cédula de identidad del mandatario', 'Descripción del acto a ejecutar'],
    fields: [
      { name: 'mandante', label: 'RUT del Mandante (quien otorga el poder)', type: 'rut', placeholder: '12.345.678-9', required: true },
      { name: 'mandatario', label: 'RUT del Mandatario (quien recibe el poder)', type: 'rut', placeholder: '12.345.678-9', required: true },
      { name: 'tipo_poder', label: 'Tipo de poder', type: 'select', options: ['Poder Especial', 'Poder General', 'Poder Bancario', 'Poder para Vender', 'Poder para Arrendar'], required: true },
      { name: 'descripcion', label: 'Facultades otorgadas', type: 'textarea', placeholder: 'Describa detalladamente las facultades que se otorgan...', required: true },
      { name: 'fecha', label: 'Fecha de inicio de vigencia', type: 'date', required: true },
    ]
  },
  {
    id: 'testamento',
    icon: <BookOpen size={28} />,
    title: 'Testamento Abierto',
    subtitle: 'Sucesiones',
    description: 'Declaración de última voluntad ante notario con presencia de testigos, con plena validez legal.',
    price: 'Desde $120.000',
    days: '2–3 días hábiles',
    docs: ['Cédula de identidad vigente', 'Datos de herederos (nombre y RUT)', 'Descripción de bienes'],
    fields: [
      { name: 'testador', label: 'RUT del Testador', type: 'rut', placeholder: '12.345.678-9', required: true },
      { name: 'nacimiento', label: 'Fecha de nacimiento del testador', type: 'date', required: true },
      { name: 'estado_civil', label: 'Estado civil', type: 'select', options: ['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Conviviente Civil'], required: true },
      { name: 'herederos', label: 'Nombre y RUT de herederos', type: 'textarea', placeholder: 'Ej: Juan Pérez, 11.222.333-4 (hijo)\nMaría Pérez, 11.222.334-5 (hija)', required: true },
      { name: 'bienes', label: 'Descripción de bienes a testar', type: 'textarea', placeholder: 'Descripción de inmuebles, cuentas, vehículos, etc.', required: true },
      { name: 'fecha', label: 'Fecha de cita', type: 'date', required: true },
    ]
  },
  {
    id: 'autenticacion',
    icon: <Stamp size={28} />,
    title: 'Autenticación de Firma',
    subtitle: 'Documentos y Contratos',
    description: 'Certificación notarial de la autenticidad de firmas en documentos privados, contratos y declaraciones.',
    price: 'Desde $15.000',
    days: 'Mismo día',
    docs: ['Cédula de identidad vigente', 'Documento a firmar (2 copias)', 'Concurrir personalmente a la notaría'],
    fields: [
      { name: 'firmante', label: 'RUT del firmante', type: 'rut', placeholder: '12.345.678-9', required: true },
      { name: 'tipo_doc', label: 'Tipo de documento', type: 'select', options: ['Contrato de arrendamiento', 'Declaración jurada', 'Contrato de trabajo', 'Acuerdo privado', 'Autorización', 'Otro'], required: true },
      { name: 'num_firmas', label: 'Número de firmantes', type: 'select', options: ['1 firmante', '2 firmantes', '3 firmantes', '4 o más firmantes'], required: true },
      { name: 'fecha', label: 'Fecha de la cita', type: 'date', required: true },
      { name: 'detalle', label: 'Descripción del documento', type: 'textarea', placeholder: 'Breve descripción del acto que se certifica...' },
    ]
  },
  {
    id: 'sociedad',
    icon: <Building2 size={28} />,
    title: 'Constitución de Sociedad',
    subtitle: 'Empresas y Negocios',
    description: 'Escritura de constitución de SPA, Ltda. u otros tipos societarios con extracto y publicación.',
    price: 'Desde $350.000',
    days: '5–7 días hábiles',
    docs: ['Cédulas de todos los socios', 'Capital inicial acordado', 'Objeto social definido', 'Porcentaje de participación por socio'],
    fields: [
      { name: 'razon_social', label: 'Razón social propuesta', type: 'text', placeholder: 'Ej: Servicios Tecnológicos XYZ SpA', required: true },
      { name: 'tipo_sociedad', label: 'Tipo de sociedad', type: 'select', options: ['SpA (Sociedad por Acciones)', 'Ltda. (Responsabilidad Limitada)', 'S.A. (Sociedad Anónima)', 'EIRL (Empresa Individual)'], required: true },
      { name: 'capital', label: 'Capital inicial (CLP)', type: 'text', placeholder: '$1.000.000', required: true },
      { name: 'objeto', label: 'Objeto o giro social', type: 'textarea', placeholder: 'Describa la actividad principal de la empresa...', required: true },
      { name: 'socios', label: 'Socios (nombre, RUT y % participación)', type: 'textarea', placeholder: 'Ej: Ana Torres, 12.345.678-9, 50%\nCarlos Muñoz, 9.876.543-2, 50%', required: true },
      { name: 'fecha', label: 'Fecha propuesta para escritura', type: 'date', required: true },
    ]
  },
  {
    id: 'herencia',
    icon: <Users size={28} />,
    title: 'Posesión Efectiva',
    subtitle: 'Herencias',
    description: 'Tramitación notarial de posesiones efectivas intestadas y testamentarias para herederos.',
    price: 'Desde $95.000',
    days: '10–15 días hábiles',
    docs: ['Certificado de defunción', 'Cédulas de los herederos', 'Partidas de nacimiento', 'Inventario de bienes del causante'],
    fields: [
      { name: 'causante', label: 'RUT del causante (fallecido)', type: 'rut', placeholder: '12.345.678-9', required: true },
      { name: 'defuncion', label: 'Fecha de defunción', type: 'date', required: true },
      { name: 'solicitante', label: 'RUT del heredero solicitante', type: 'rut', placeholder: '12.345.678-9', required: true },
      { name: 'tipo', label: 'Tipo de posesión efectiva', type: 'select', options: ['Intestada (sin testamento)', 'Testamentaria (con testamento)'], required: true },
      { name: 'herederos', label: 'Todos los herederos (nombre y RUT)', type: 'textarea', placeholder: 'Liste a todos los herederos con sus datos...', required: true },
      { name: 'bienes', label: 'Bienes del causante', type: 'textarea', placeholder: 'Inmuebles, vehículos, cuentas bancarias, etc.', required: true },
    ]
  }
]

function formatRut(val: string): string {
  const clean = val.replace(/[^0-9kK]/g, '').toUpperCase()
  if (clean.length < 2) return clean
  const body = clean.slice(0, -1)
  const dv = clean.slice(-1)
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formatted}-${dv}`
}

export { services, formatRut }
export type { View, Service, FormField }


function Navbar({ view, setView, setSelectedService }: {
  view: View
  setView: (v: View) => void
  setSelectedService: (s: Service | null) => void
}) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="navbar-brand" onClick={() => { setView('home'); setSelectedService(null) }}>
          <div className="brand-emblem">
            <Scale size={20} />
          </div>
          <div>
            <span className="brand-name">Notaría Central</span>
            <span className="brand-tagline">Digital · Valparaíso</span>
          </div>
        </button>
        <div className="navbar-links">
          <button className={`nav-link ${view === 'home' ? 'active' : ''}`} onClick={() => { setView('home'); setSelectedService(null) }}>Inicio</button>
          <button className={`nav-link ${view === 'services' ? 'active' : ''}`} onClick={() => setView('services')}>Servicios</button>
          <a href="#contacto" className="nav-link">Contacto</a>
          <button className={`nav-link audit-nav ${view === 'auditoria' ? 'active' : ''}`} onClick={() => setView('auditoria')}>
            <Shield size={14} />
            Auditoría
          </button>
          <button className="nav-btn-login" onClick={() => setView('login')}>
            <User size={15} />
            Ingresar
          </button>
        </div>
      </div>
    </nav>
  )
}

function HeroSection({ setView }: { setView: (v: View) => void }) {
  return (
    <section className="hero">
      <div className="hero-badge">
        <Shield size={14} />
        Autorizado por el Ministerio de Justicia · Folio Nº 4821
      </div>
      <h1 className="hero-title">
        Trámites notariales<br />
        <span className="hero-accent">sin filas, sin demoras.</span>
      </h1>
      <p className="hero-desc">
        Inicie su trámite en línea las 24 horas. Nuestros notarios certificados le acompañan en cada etapa del proceso con total validez legal.
      </p>
      <div className="hero-cta">
        <button className="btn-primary" onClick={() => setView('services')}>
          Iniciar trámite
          <ChevronRight size={18} />
        </button>
        <button className="btn-ghost">
          <Phone size={16} />
          Consulta gratuita
        </button>
      </div>
      <div className="hero-stats">
        <div className="stat">
          <span className="stat-num">+24.000</span>
          <span className="stat-label">Escrituras firmadas</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">98,6%</span>
          <span className="stat-label">Clientes satisfechos</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">32 años</span>
          <span className="stat-label">De trayectoria</span>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer" id="contacto">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-brand">
            <Scale size={22} />
            <span>Notaría Central Digital</span>
          </div>
          <p className="footer-desc">Servicios notariales con plena validez legal, disponibles las 24 horas.</p>
          <div className="footer-badges">
            <span><Shield size={13} />Ministerio de Justicia</span>
            <span><Star size={13} />ISO 27001</span>
          </div>
        </div>
        <div className="footer-col">
          <h4>Servicios</h4>
          <ul>
            {services.map(s => <li key={s.id}>{s.title}</li>)}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contacto</h4>
          <ul className="contact-list">
            <li><MapPin size={14} />Av. España 2250, Valparaíso</li>
            <li><Phone size={14} />(+56) 9 2345 6789</li>
            <li><Mail size={14} />contactonotaria@notariacentral.cl</li>
            <li><Clock size={14} />Lun–Vie: 9:00–18:00 | Sáb: 9:00–13:00</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Notaría Central Digital · Todos los derechos reservados</span>
        <span>Privacidad · Términos · Accesibilidad</span>
      </div>
    </footer>
  )
}

function ServiceCard({ service, onSelect }: { service: Service; onSelect: () => void }) {
  return (
    <div className="service-card" onClick={onSelect}>
      <div className="service-card-icon">{service.icon}</div>
      <div className="service-card-body">
        <span className="service-card-sub">{service.subtitle}</span>
        <h3 className="service-card-title">{service.title}</h3>
        <p className="service-card-desc">{service.description}</p>
        <div className="service-card-meta">
          <span className="meta-price">{service.price}</span>
          <span className="meta-days">
            <Clock size={13} />
            {service.days}
          </span>
        </div>
      </div>
      <div className="service-card-arrow">
        <ChevronRight size={18} />
      </div>
    </div>
  )
}

function ServicesPage({ onSelect }: { onSelect: (s: Service) => void }) {
  return (
    <div className="page-inner">
      <div className="page-header">
        <h2 className="page-title">Servicios Legales</h2>
        <p className="page-subtitle">Seleccione el trámite que necesita iniciar</p>
      </div>
      <div className="services-grid">
        {services.map(s => (
          <ServiceCard key={s.id} service={s} onSelect={() => onSelect(s)} />
        ))}
      </div>
      <div className="info-banner">
        <AlertCircle size={18} />
        <p>¿No encuentra su trámite? Contáctenos al <strong>(+56) 9 2345 6789</strong> o escríbanos a <strong>contactonotaria@notariacentral.cl</strong></p>
      </div>
    </div>
  )
}

function TramiteForm({ service, onBack, onSubmit }: {
  service: Service
  onBack: () => void
  onSubmit: () => void
}) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState<Record<string, boolean>>({})

  function handleChange(name: string, value: string, type?: string) {
    let final = value
    if (type === 'rut') final = formatRut(value)
    setFormData(p => ({ ...p, [name]: final }))
    if (errors[name]) setErrors(p => { const n = { ...p }; delete n[name]; return n })
  }

  function validate() {
    const errs: Record<string, string> = {}
    service.fields.forEach(f => {
      if (f.required && !formData[f.name]) errs[f.name] = 'Este campo es obligatorio'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit() {
    if (validate()) onSubmit()
  }

  function simulateUpload(name: string) {
    setUploading(p => ({ ...p, [name]: true }))
    setTimeout(() => {
      setUploading(p => ({ ...p, [name]: false }))
      setFormData(p => ({ ...p, [name]: 'documento_cargado.pdf' }))
    }, 1500)
  }

  return (
    <div className="page-inner">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={16} />
        Volver a servicios
      </button>

      <div className="tramite-header">
        <div className="tramite-icon">{service.icon}</div>
        <div>
          <span className="service-card-sub">{service.subtitle}</span>
          <h2 className="page-title" style={{ marginBottom: 4 }}>{service.title}</h2>
          <div className="tramite-meta-row">
            <span className="meta-price">{service.price}</span>
            <span className="meta-days"><Clock size={13} />{service.days}</span>
          </div>
        </div>
      </div>

      <div className="tramite-layout">
        <div className="form-panel">
          <h3 className="panel-title">Datos del trámite</h3>
          <div className="form-fields">
            {service.fields.map(field => (
              <div key={field.name} className={`field-group ${field.type === 'textarea' ? 'full-width' : ''}`}>
                <label className="field-label">
                  {field.label}
                  {field.required && <span className="required-dot">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    className={`field-input ${errors[field.name] ? 'field-error' : ''}`}
                    value={formData[field.name] || ''}
                    onChange={e => handleChange(field.name, e.target.value)}
                  >
                    <option value="">Seleccione una opción...</option>
                    {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    className={`field-textarea ${errors[field.name] ? 'field-error' : ''}`}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={e => handleChange(field.name, e.target.value)}
                    rows={3}
                  />
                ) : field.type === 'file' ? (
                  <div className="file-upload" onClick={() => simulateUpload(field.name)}>
                    {uploading[field.name] ? (
                      <span className="uploading-text">Cargando...</span>
                    ) : formData[field.name] ? (
                      <span className="file-done"><CheckCircle size={15} />{formData[field.name]}</span>
                    ) : (
                      <><Upload size={16} /><span>Seleccionar archivo</span></>
                    )}
                  </div>
                ) : (
                  <input
                    className={`field-input ${errors[field.name] ? 'field-error' : ''}`}
                    type={field.type === 'rut' ? 'text' : field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={e => handleChange(field.name, e.target.value, field.type)}
                    maxLength={field.type === 'rut' ? 12 : undefined}
                  />
                )}
                {errors[field.name] && (
                  <span className="error-msg"><AlertCircle size={13} />{errors[field.name]}</span>
                )}
              </div>
            ))}
          </div>

          <div className="form-footer">
            <p className="disclaimer">
              <Shield size={14} />
              Sus datos están protegidos bajo la Ley 19.628 de Protección de Datos Personales.
            </p>
            <button className="btn-primary btn-submit" onClick={handleSubmit}>
              <FileText size={17} />
              Enviar solicitud
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <aside className="docs-panel">
          <h3 className="panel-title">Documentos requeridos</h3>
          <ul className="docs-list">
            {service.docs.map((doc, i) => (
              <li key={i} className="doc-item">
                <CheckCircle size={15} />
                {doc}
              </li>
            ))}
          </ul>
          <div className="cost-card">
            <div className="cost-row">
              <span>Arancel base</span>
              <span>{service.price}</span>
            </div>
            <div className="cost-row">
              <span>Documentos adicionales</span>
              <span>Variable</span>
            </div>
            <div className="cost-divider" />
            <div className="cost-row cost-total">
              <span>Total estimado</span>
              <span>{service.price}+</span>
            </div>
          </div>
          <div className="contact-aside">
            <p><Phone size={14} />(+56) 9 2345 6789</p>
            <p><Mail size={14} />contactonotaria@notariacentral.cl</p>
            <p><Clock size={14} />Lun–Vie 9:00–18:00 · Sáb 9:00–13:00</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Confirmation({ service, onReset }: { service: Service; onReset: () => void }) {
  const folio = `NC-${Date.now().toString().slice(-6)}`
  return (
    <div className="page-inner confirmation-page">
      <div className="confirm-card">
        <div className="confirm-icon">
          <CheckCircle size={48} />
        </div>
        <h2 className="confirm-title">¡Solicitud enviada con éxito!</h2>
        <p className="confirm-desc">
          Su trámite de <strong>{service.title}</strong> ha sido recibido y está siendo revisado por nuestro equipo.
        </p>
        <div className="confirm-folio">
          <span className="folio-label">Número de folio</span>
          <span className="folio-num">{folio}</span>
        </div>
        <div className="confirm-steps">
          <div className="cstep active"><span>1</span><p>Solicitud recibida</p></div>
          <div className="cstep"><span>2</span><p>Revisión documental</p></div>
          <div className="cstep"><span>3</span><p>Agendamiento de cita</p></div>
          <div className="cstep"><span>4</span><p>Firma y entrega</p></div>
        </div>
        <p className="confirm-note">
          Le enviaremos un correo de confirmación con los detalles de su cita. Tiempo estimado: <strong>{service.days}</strong>.
        </p>
        <button className="btn-primary" onClick={onReset}>
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

function LoginPage({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [rut, setRut] = useState('')
  const [pass, setPass] = useState('')
  const [showMsg, setShowMsg] = useState(false)

  function handleLogin() {
    if (rut && pass) setShowMsg(true)
  }

  return (
    <div className="page-inner login-page">
      <button className="back-btn" onClick={onBack}><ArrowLeft size={16} />Volver</button>
      <div className="login-card">
        <div className="login-logo"><Scale size={32} /></div>
        <h2 className="login-title">Portal de Clientes</h2>
        <p className="login-sub">Acceda a sus trámites, documentos y agenda</p>
        <div className="login-tabs">
          <button className={`login-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Iniciar sesión</button>
          <button className={`login-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Registrarse</button>
        </div>
        {showMsg ? (
          <div className="login-success">
            <CheckCircle size={36} />
            <p>Bienvenido a su portal notarial. En una implementación real, aquí vería su panel de trámites.</p>
            <button className="btn-primary" onClick={() => setShowMsg(false)}>Volver al login</button>
          </div>
        ) : (
          <div className="login-form">
            <div className="field-group">
              <label className="field-label">RUT<span className="required-dot">*</span></label>
              <input className="field-input" type="text" placeholder="12.345.678-9" value={rut} onChange={e => setRut(formatRut(e.target.value))} maxLength={12} />
            </div>
            {tab === 'login' ? (
              <>
                <div className="field-group">
                  <label className="field-label">Contraseña<span className="required-dot">*</span></label>
                  <input className="field-input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
                </div>
                <a href="#" className="forgot-pass">¿Olvidó su contraseña?</a>
                <button className="btn-primary btn-full" onClick={handleLogin}>Ingresar</button>
              </>
            ) : (
              <>
                <div className="field-group">
                  <label className="field-label">Nombre completo</label>
                  <input className="field-input" type="text" placeholder="Juan Pérez González" />
                </div>
                <div className="field-group">
                  <label className="field-label">Correo electrónico</label>
                  <input className="field-input" type="email" placeholder="correo@ejemplo.cl" />
                </div>
                <div className="field-group">
                  <label className="field-label">Nueva contraseña</label>
                  <input className="field-input" type="password" placeholder="Mínimo 8 caracteres" />
                </div>
                <button className="btn-primary btn-full">Crear cuenta</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>('home')
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  function handleSelectService(s: Service) {
    setSelectedService(s)
    setView('tramite')
  }

  return (
    <div className="app">
      <Navbar view={view} setView={setView} setSelectedService={setSelectedService} />
      <main className="main">
        {view === 'home' && (
          <>
            <HeroSection setView={setView} />
            <div className="home-services">
              <div className="page-inner">
                <div className="page-header">
                  <h2 className="page-title">Trámites frecuentes</h2>
                  <p className="page-subtitle">Empiece su proceso en minutos</p>
                </div>
                <div className="services-grid">
                  {services.slice(0, 3).map(s => (
                    <ServiceCard key={s.id} service={s} onSelect={() => handleSelectService(s)} />
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                  <button className="btn-outline" onClick={() => setView('services')}>
                    Ver todos los servicios
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {view === 'services' && <ServicesPage onSelect={handleSelectService} />}
        {view === 'tramite' && selectedService && (
          <TramiteForm
            service={selectedService}
            onBack={() => setView('services')}
            onSubmit={() => setView('confirmation')}
          />
        )}
        {view === 'confirmation' && selectedService && (
          <Confirmation service={selectedService} onReset={() => { setView('home'); setSelectedService(null) }} />
        )}
        {view === 'login' && <LoginPage onBack={() => setView('home')} />}
        {view === 'auditoria' && <AuditSection />}
      </main>
      <Footer />
    </div>
  )
}