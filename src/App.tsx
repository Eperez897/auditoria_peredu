import {
  Scale, FileText, Home, Users, Shield,
  Phone, Mail, MapPin, Clock, CheckCircle,
  User, Upload, AlertCircle,
  Stamp, Building2, BookOpen, FileSignature, Star
} from 'lucide-react'
import './App.css'

type View = 'home' | 'services' | 'tramite' | 'confirmation' | 'login'
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

export default function App() {
  return <div className="app" />
}