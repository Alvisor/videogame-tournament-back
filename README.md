# Repositorio del Sistema de Gestión de Torneos de Videojuegos

Este repositorio contiene todos los componentes del software necesarios para desplegar y mantener la plataforma de gestión de torneos de videojuegos. La plataforma permite a los organizadores crear y gestionar eventos de torneos, incluyendo la venta de entradas y la transmisión en vivo a través de plataformas como Twitch, YouTube, entre otras.

## Funcionalidades Principales:

- Creación y Gestión de Torneos: Se exponen servicios para que los usuarios pueden crear torneos, establecer categorías, definir fechas y gestionar la participación.
- Venta de Entradas: El sistema expone servicios que permiten la venta de entradas para los eventos, incluyendo la generación de códigos QR o códigos únicos para el acceso.
- Administración: Servicios expuestos para monitorear eventos en tiempo real y gestionar participantes.
- Reportes: Sistema de reportería para obtener datos e informes sobre eventos y usuarios.

## Tecnologías Utilizadas:
- Backend: AWS Lambda escritas en Typescript, Amazon DynamoDB.
- APIs: AWS API Gateway para la gestión de microservicios.
- Seguridad: Amazon Cognito para la autenticación en servicios y AWS IAM para la gestión de permisos.
- DevOps: AWS CodePipeline y AWS CodeBuild para CI/CD.

## Arquitectura:
La plataforma está construida siguiendo una arquitectura de microservicios, lo que permite una escalabilidad eficiente y facilita la mantenibilidad y extensibilidad del sistema.

Cómo Contribuir:
Para contribuir al proyecto, por favor revise nuestro archivo CONTRIBUTING.md para más detalles sobre cómo enviar pull requests, el estilo de código esperado y las políticas de pruebas.
