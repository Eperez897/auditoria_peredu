Módulo DVWA: Command Injection (Security Level: Low)

Descripción del ataque:

La inyección de comandos ocurre cuando una aplicación pasa entrada del usuario directamente a una función del sistema operativo (como shell_exec(), system() o exec() en PHP) sin validación. El atacante puede encadenar comandos adicionales usando operadores del shell como |, && o ;.

Dato ingresado:

127.0.0.1 | whoami

Resultado obtenido:

![Comandos](./img_peredu/comandos_peredu.png)

El servidor ejecutó el comando whoami y retornó el nombre del usuario del sistema operativo bajo el cual corre el servidor web (por ejemplo: www-data o apache).

¿Por qué funciona?

El código PHP vulnerable usa shell_exec("ping " . $_GET['ip']) sin validar la entrada. El operador | (pipe) en sistemas Unix encadena el resultado del primer comando como entrada del segundo, o simplemente ejecuta ambos. Así, whoami se ejecuta con los privilegios del proceso del servidor web.

Impacto en Notaría Central Digital:

Un atacante podría ejecutar comandos arbitrarios en el servidor: listar y leer archivos privados (ls, cat), exfiltrar documentos notariales, instalar malware o backdoors, o comprometer completamente el servidor y toda la infraestructura conectada.