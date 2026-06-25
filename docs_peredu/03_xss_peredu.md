Módulo DVWA: XSS (Reflected) (Security Level: Low)

Descripción del ataque:

El XSS reflejado ocurre cuando una aplicación web recibe datos del usuario y los incluye directamente en la respuesta HTML sin escapar caracteres especiales. El navegador interpreta y ejecuta el código JavaScript inyectado.

Dato ingresado:

html<script>alert('XSS - Notaria Central')</script>

URL resultante:

/vulnerabilities/xss_r/?name=<script>alert('XSS - Notaria Central')</script>

Resultado obtenido:

![XSS](./img_peredu/xss_peredu.png)

El navegador ejecutó el script y mostró un cuadro de diálogo de alerta con el texto "XSS - Notaria Central", confirmando que el código JavaScript fue interpretado por el navegador de la víctima.

¿Por qué funciona?

La aplicación refleja la entrada del usuario directamente en el HTML de la respuesta sin aplicar funciones de escape como htmlspecialchars() en PHP. El navegador recibe la etiqueta <script> como parte del DOM y la ejecuta.

Impacto en Notaría Central Digital:

Un atacante podría usar XSS para robar cookies de sesión de clientes o funcionarios de la notaría, redirigir a usuarios a sitios de phishing, modificar visualmente el contenido del portal para engañar a usuarios, o realizar acciones en nombre del usuario autenticado (robo de sesión).