# Resumen Ejecutivo

El presente informe documenta el análisis de vulnerabilidades web realizado sobre el portal de la **Notaría Central Digital** (https://auditoria-peredu.vercel.app/), en el contexto de la asignatura TI3034 — Fundamentos de Seguridad de la Información. El objetivo es identificar, demostrar y clasificar vulnerabilidades presentes en aplicaciones web, utilizando como entorno controlado la plataforma **DVWA (Damn Vulnerable Web Application)**, y proponer medidas de prevención y mitigación aplicables al contexto de una notaría virtual.

## Contexto de la empresa

Una notaría digital maneja activos de información de alto valor: contratos, escrituras públicas, datos de identidad de clientes, poderes notariales y registros legales con validez jurídica. Por su naturaleza, este tipo de organización está sujeta a estándares de confidencialidad equivalentes a los de servicios financieros o de salud, ya que un incidente de seguridad no solo implica pérdida de datos, sino también la invalidación o falsificación de documentos con efectos legales.

Por ello, las vulnerabilidades encontradas en el ambiente de pruebas (DVWA, nivel de seguridad *Low*) tienen un impacto crítico al ser trasladadas conceptualmente al portal real: comprometen la confidencialidad, integridad y disponibilidad de la información notarial.

## Metodología

El análisis se realizó en un ambiente controlado (DVWA desplegado en Render) replicando tres clases de vulnerabilidades de la familia **OWASP Top 10 — A03:2021 Injection**:

| # | Vulnerabilidad | Módulo DVWA | Severidad CVSS v3.1 |
|---|---|---|---|
| 1 | Inyección SQL (SQLi) | SQL Injection | 9.8 — Crítica |
| 2 | Cross-Site Scripting Reflejado (XSS) | XSS (Reflected) | 6.1 — Media |
| 3 | Inyección de Comandos OS | Command Injection | 9.8 — Crítica |

Para cada vulnerabilidad se documentó: el dato ingresado, la evidencia visual del resultado, la explicación técnica de la causa raíz, el puntaje CVSS v3.1 (calculado con la calculadora oficial [first.org/cvss/calculator/3.1](https://www.first.org/cvss/calculator/3.1)), y las medidas de prevención y mitigación asociadas, referenciadas a marcos de la industria (OWASP, CIS Controls).

## Estructura del informe

- **Informe A — Análisis de Vulnerabilidades**: detalle técnico de los tres ataques (SQLi, XSS, Command Injection), evidencia, clasificación CVSS, prevención y mitigación.
- **Informe B — Matriz de Riesgo y Medidas de Tratamiento**: identificación de activos de información, matriz de riesgo (probabilidad × impacto) con mapa de calor, priorización de vulnerabilidades, políticas de prevención, controles de mitigación y plan de recuperación ante desastres (DR).
