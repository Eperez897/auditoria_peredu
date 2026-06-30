**Prompt utilizado:**
> "necesito formatear un RUT chileno mientras el usuario escribe, tipo que vaya poniendo los puntos y el guion solo. dame una función en typescript"

**Qué se aceptó:** la lógica base de `formatRut` usando regex para separar el dígito verificador y agregar puntos cada 3 dígitos.
**Qué se corrigió/ajustó:** la primera versión no dejaba pasar la `k` mayúscula/minúscula como dígito verificador, se la pegué de vuelta a la IA:
```
const clean = val.replace(/[^0-9]/g, '')
```
y le dije "esto me está borrando la k del rut, ej 11.222.333-K se queda en 11222333", me corrigió a `replace(/[^0-9kK]/g, '').toUpperCase()`.

**Prompt utilizado:**
> "como hago un formulario dinámico en react donde cada servicio (escritura, poder, testamento, etc) tiene campos distintos, sin repetir el jsx del input 6 veces"

**Qué se aceptó:** la idea de definir un arreglo de `fields` por servicio con un `type` (`text`, `select`, `textarea`, `file`, `rut`) y renderizar el input correspondiente con un switch/ternarios dentro del `.map`.
**Qué se corrigió/ajustó:** la propuesta inicial no contemplaba el caso `rut`, lo agregué yo a mano al tipo `FormField` y al renderizado porque necesitaba que ese input específico llamara a `formatRut` en el `onChange`.

**Prompt utilizado:**
> "tengo este error en consola: Warning: Each child in a list should have a unique key prop, ¿dónde lo más probable que se me quedó faltando en mi formulario?"

**Qué se aceptó:** la sugerencia de revisar todos los `.map()` del archivo, ya que el warning no especifica la línea exacta.
**Qué se corrigió/ajustó:** encontré que era el `.map` de `service.docs` en el panel de documentos, que usaba el string del documento como contenido pero no como key; le agregué `key={i}` al `<li>`.

**Prompt utilizado:**
> "quiero simular que sube un archivo sin backend de verdad, que muestre 'cargando' un par de segundos y después aparezca el nombre del archivo como si ya se hubiera subido"

**Qué se aceptó:** el patrón con `setTimeout` y dos estados (`uploading` y `formData`) que propuso la IA en `simulateUpload`.
**Qué se corrigió/ajustó:** la primera versión usaba un solo booleano global `uploading`, pero como tengo varios campos tipo `file` en distintos formularios, lo cambié a `Record<string, boolean>` indexado por nombre de campo para que no se activara el spinner de carga en todos los campos a la vez.

**Prompt utilizado:**
> "ahora para la sección de auditoría: necesito un componente tipo acordeón donde cada vulnerabilidad (sqli, xss, command injection) sea una tarjeta que se abre y muestra el detalle, el payload, las imágenes y las recomendaciones"

**Qué se aceptó:** la estructura de `VulnCard` con un `useState<boolean>` local por tarjeta para manejar si está abierta o cerrada.
**Qué se corrigió/ajustó:** nada grave, pero cambié los iconos que sugirió (genéricos de "warning" y "lock") por `Code`, `AlertTriangle` y `Terminal` de lucide-react, que pegaban más con cada tipo de vulnerabilidad.

**Prompt utilizado:**
> "le puse onClick a la imagen para que abra en grande pero cuando hago click en la imagen abierta también se me cierra el modal, como si el click se propagara al fondo"

**Qué se aceptó:** el diagnóstico de que era un problema de propagación de eventos (el click en la imagen burbujeaba hasta el overlay que tiene el onClick de cerrar).
**Qué se corrigió/ajustó:** agregué `e.stopPropagation()` en el onClick de la imagen, tal como sugirió la IA, pero tuve que probarlo dos veces porque la primera vez lo puse en el div equivocado (el overlay completo en vez de solo la imagen).

**Prompt utilizado:**
> "necesito armar una matriz de riesgo 5x5 en react, probabilidad en filas e impacto en columnas, y que cada celda se pinte de un color según probabilidad x impacto"

**Qué se aceptó:** la función `getCellColor(p, i)` con los rangos de corte (16+, 9-15, 4-8, menor a 4) para los 4 niveles de riesgo.
**Qué se corrigió/ajustó:** los colores que propuso por defecto no calzaban con la paleta del resto del sitio (rojo/naranjo/amarillo/verde que ya tenía definidos en el CSS), así que le pasé los hex que ya usaba (`#FEE2E2`, `#FEF3C7`, etc.) y le pedí que los aplicara ahí en vez de los suyos.

**Prompt utilizado:**
> "dentro de esa misma grilla necesito poner las 3 vulnerabilidades en celdas específicas (sqli en probabilidad 5 impacto 5, command injection en probabilidad 4 impacto 5, xss en probabilidad 4 impacto 3), como estructuro eso sin hardcodear el jsx de cada celda"

**Qué se aceptó:** un arreglo `cells` con `{prob, imp, label, color}` y una función `getCellDot(p, i)` que busca si existe una vulnerabilidad para esa celda al recorrer la grilla.
**Qué se corrigió/ajustó:** nada en la lógica, pero sí tuve que volver a este prompt después de terminar el informe de matriz de riesgo, porque al principio había puesto XSS en una celda distinta y no calzaba con la justificación que había escrito en el documento — tuve que ajustar las coordenadas para que el componente y el informe dijeran lo mismo.

**Prompt utilizado:**
> "quiero una tabla que muestre el vector cvss completo, el puntaje y la severidad de cada vulnerabilidad, sacando los datos del mismo arreglo de vulnerabilidades para no escribirlo dos veces"

**Qué se aceptó:** la idea de mapear sobre `vulns` para generar las filas de `CvssTable` y reutilizar `v.cvss`, `v.severity` y `v.color` para el badge.
**Qué se corrigió/ajustó:** la IA armó el vector CVSS con una fórmula condicional automática (tipo "si cvss >= 9 entonces UI:N sino UI:R"), pero los valores reales de cada vector los calculé a mano en la calculadora oficial de first.org y los dejé fijos por vulnerabilidad en vez de confiar en la fórmula generada, porque el caso de XSS tiene Scope Changed y eso la fórmula automática no lo contemplaba bien.

**Prompt utilizado:**
> "el css de las tarjetas de vulnerabilidad se ve muy plano, quiero que el borde de arriba cambie de color según la severidad (crítica, media, etc) y que al abrir el acordeón tenga una animación suave, no que aparezca de golpe"

**Qué se aceptó:** usar `border-top-color` inline desde la prop `v.color` y agregar una transición CSS al contenedor del body de la tarjeta.
**Qué se corrigió/ajustó:** los colores rojo/naranjo que propuso por defecto eran muy "neón", los cambié a los tonos más apagados que ya tenía en el resto del sitio (`#C0392B` para crítico, `#D97706` para medio) para que no chocara visualmente con el resto de la landing.

**Prompt utilizado:**
> "en el celular la matriz de riesgo se corta, las columnas se aprietan demasiado y no se alcanza a leer nada, como la hago responsive sin que pierda la forma de grilla"

**Qué se aceptó:** envolver la grilla en un contenedor con `overflow-x: auto` para que se pueda hacer scroll horizontal en pantallas chicas en vez de comprimir las columnas.
**Qué se corrigió/ajustó:** además le agregué un media query propio para bajar el tamaño de fuente de las celdas en mobile, que la primera respuesta no incluía (solo arreglaba el overflow, pero el texto seguía ilegible).

**Prompt utilizado:**
> "hice build con npm run build para subir a vercel y me tira este error: Could not resolve "../docs_peredu/img_peredu/sqli_peredu_1.PNG" from src/AuditSection.tsx, pero en mi compu local funciona perfecto, por qué"

**Qué se aceptó:** la explicación de que probablemente había una diferencia de mayúsculas/minúsculas entre el nombre del import y el archivo real en disco, y que en Windows/mac no se nota porque el sistema de archivos no distingue mayúsculas, pero en el build de Vercel (Linux) sí.
**Qué se corrigió/ajustó:** revisé el nombre real del archivo (`sqli_peredu_1.png`, minúscula) y corregí el import que tenía `.PNG`; con eso el build pasó sin problema.

**Prompt utilizado:**
> "typescript me marca este error en la tarjeta de vulnerabilidad: Property 'images' does not exist on type 'Vuln'. ¿qué le falta a mi interfaz?"

**Qué se aceptó:** que el error era porque había agregado el campo `images` al objeto de datos pero no lo había declarado en la interfaz `Vuln`.
**Qué se corrigió/ajustó:** agregué el campo faltante a la interfaz (`images: { src: string; caption: string }[]`) en vez de la solución rápida que sugería usar `any`, porque quería mantener el tipado estricto en todo el archivo.

**Prompt utilizado:**
> "última cosa, en la leyenda de colores debajo de la matriz los colores no coinciden exactamente con los de las celdas, se ven parecidos pero no iguales, como lo soluciono para que no quede esa diferencia tan tonta"

**Qué se aceptó:** la sugerencia de centralizar los 4 colores en una sola constante y usarla tanto en `getCellColor` como en la leyenda, en vez de tener los valores hex escritos dos veces en distintos lugares del archivo.
**Qué se corrigió/ajustó:** terminé de aplicarlo manualmente revisando cada uno de los 4 `<span>` de la leyenda uno por uno, porque la IA solo reescribió el bloque de la leyenda y se le quedó un color viejo en el último ítem que tuve que pillar yo mirando el resultado en el navegador.

*Reflexión final sobre el uso de la herramienta de IA en el código*

La IA me sirvió sobre todo para no perder tiempo escribiendo cosas repetitivas (el formulario dinámico, la grilla de la matriz, la tabla CVSS) y para destrabarme rápido con errores que de otra forma habría tenido que googlear uno por uno (el problema de mayúsculas en el build de Vercel, el warning de las keys). Pero en varias partes tuve que corregirla a mano: el formateo del RUT con la `k`, el estado del upload simulado que al principio era global y no por campo, y sobre todo los datos sensibles del trabajo (los vectores CVSS y las coordenadas de la matriz de riesgo), que calculé aparte en la calculadora oficial y en el análisis escrito, y después fui a ajustar en el código para que ambas partes del trabajo dijeran lo mismo. En resumen: la IA aceleró la parte de "escribir código que funcione", pero las decisiones de qué dato va dónde las tuve que verificar y corregir yo.