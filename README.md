# Documentación del Proyecto de Torneos de Videojuegos en Línea

## Introducción

Este proyecto se enfoca en el desarrollo de una solución integral para la organización y ejecución de torneos de videojuegos en línea. El objetivo principal es proporcionar una plataforma que simplifique el proceso de creación de torneos, facilite la participación de los jugadores y brinde una experiencia inmersiva para los espectadores. Mediante el uso de tecnologías de vanguardia y la aplicación de las mejores prácticas de desarrollo de software, buscamos ofrecer una solución innovadora que satisfaga las necesidades de la creciente comunidad de jugadores y organizadores de torneos.

A lo largo de este documento, se explicará en detalle cómo se han abordado estos puntos de negocio utilizando una arquitectura basada en Domain-Driven Design (DDD), siguiendo las prácticas de desarrollo guiado por comportamiento (BDD) y desarrollo guiado por pruebas (TDD), y aplicando los principios de Clean Code. Además, se destacara cómo se han aprovechado los servicios y características de la plataforma de Amazon Web Services (AWS) para garantizar la escalabilidad, confiabilidad y eficiencia de esta solución.

Los puntos de negocio abordados en este proyecto son los siguientes:

- Ventas de tickets para torneos en línea:
- Permitir a los organizadores crear torneos con diferentes categorías y configuraciones.
- Ofrecer la venta de tickets virtuales para la participación en los torneos.
- Generar códigos QR únicos como entrada virtual al evento.
- Implementar un sistema de comisiones por cargo y servicio basado en el precio de venta de los tickets.
- Proporcionar la capacidad de crear etapas de ventas para los torneos.
- Creación de torneos en línea gratuitos:
- Permitir la creación de torneos gratuitos con límites de participantes según la categoría seleccionada.
- Limitar la cantidad de eventos gratuitos que un organizador puede crear.
- Creación de vistas de torneo virtuales gratuitos:
    - Ofrecer la posibilidad de crear vistas de torneo virtuales gratuitas para los espectadores.
    - Limitar la cantidad de eventos gratuitos que un usuario registrado puede crear.
    - Establecer límites en la cantidad de personas que pueden participar en la transmisión del evento.
- Creación de vistas de torneo virtuales de pago:
- Permitir a los organizadores crear eventos de pago para torneos o vender tickets para acceder a la transmisión.


## Arquitectura y Diseño (DDD)

En el desarrollo de este proyecto de torneos de videojuegos en línea, se adoptó una arquitectura basada en los principios del Domain-Driven Design (DDD). El DDD es un enfoque de diseño de software que se centra en modelar el dominio del problema de manera clara y expresiva, alineando el código con los conceptos y las reglas de negocio.
La arquitectura de esta solución se divide en módulos principales que encapsulan las diferentes áreas funcionales del sistema. Cada módulo se compone de entidades, repositorios y casos de uso que trabajaron juntos para cumplir con los requisitos del dominio.
A continuación, se describen los módulos principales y sus componentes:

### Módulo de Torneos:

Entidades:
- Tournament: Representa un torneo de videojuegos con sus atributos, como el nombre, la categoría, el juego, el número máximo de jugadores, el responsable, la información adicional y los límites de visualización.
- TournamentEntry: Representa la inscripción de un participante en un torneo, con atributos como el ID del torneo, el ID del usuario, el código de entrada y el estado de uso.

Repositorios:
- TournamentRepository: Proporciona métodos para crear, obtener y actualizar torneos en la capa de persistencia.
- TournamentEntryRepository: Permite crear, obtener y marcar como utilizadas las inscripciones de los participantes en los torneos.

Casos de uso:
- CreateTournamentUseCase: Maneja la lógica para crear un nuevo torneo, validando las reglas de negocio, como los límites de participantes por categoría y la cantidad máxima de torneos gratuitos por organizador.
- GenerateTournamentEntriesUseCase: Se encarga de generar las inscripciones de los participantes en un torneo, asignando códigos únicos y enviando notificaciones por correo electrónico.
- ValidateTournamentEntryUseCase: Verifica la validez de un código de entrada de un participante en un torneo.

### Módulo de Ventas:

Entidades:
- TicketSale: Representa la venta de un ticket para un torneo, con atributos como el ID del torneo, el ID del responsable, el precio, la comisión y la etapa de venta.

Repositorios:
- TicketSaleRepository: Proporciona métodos para crear y obtener ventas de tickets asociadas a un torneo.

Casos de uso:
- CreateTicketSaleUseCase: Maneja la lógica para crear una nueva venta de tickets, aplicando las reglas de negocio correspondientes.

La separación de responsabilidades y la encapsulación del dominio son principios fundamentales del DDD que se ha aplicado en el diseño arquitectónico. Cada módulo se encarga de una responsabilidad específica y encapsula la lógica y los datos relacionados con esa área del dominio. Esto permite tener un código más cohesivo, mantenible y fácil de entender.

Además, se ha utilizado repositorios como una capa de abstracción entre los casos de uso y la persistencia de datos. Los repositorios permiten desacoplar la lógica de negocio de los detalles de implementación de la base de datos, lo que facilita la realización de pruebas unitarias y la sustitución de la capa de persistencia si es necesario.
En resumen, esta arquitectura basada en DDD ha permitido modelar el dominio de los torneos de videojuegos de manera clara y expresiva, separando las responsabilidades y encapsulando la lógica de negocio en módulos cohesivos. Esto ha proporcionado una base sólida para el desarrollo de esta solución, facilitando la mantenibilidad, escalabilidad y adaptabilidad a medida que el proyecto evoluciona.

## Desarrollo Guiado por Comportamiento (BDD)

En este proyecto de torneos de videojuegos en línea, se han adoptado principios del Desarrollo Guiado por Comportamiento (BDD) para asegurar que la solución cumpla con las expectativas y requisitos de los usuarios finales. El BDD es una práctica de desarrollo que se centra en la colaboración entre los miembros del equipo y la definición de escenarios de comportamiento utilizando un lenguaje natural y comprensible para todos los involucrados.
La aplicación de los principios de BDD este nuestro proyecto permitiría:
Mejorar la comunicación y el entendimiento entre los miembros del equipo, incluyendo desarrolladores, analistas de negocio y stakeholders.
Definir escenarios de comportamiento claros y concisos que describen cómo debe funcionar el sistema desde la perspectiva del usuario.
Asegurar que el desarrollo esté guiado por las necesidades y expectativas reales de los usuarios.
Facilitar la creación de pruebas automatizadas basadas en los escenarios definidos.
A continuación, se presentan algunos ejemplos de escenarios y especificaciones de comportamiento utilizando lenguaje natural:

- Escenario 1: Creación exitosa de un torneo
´´Dado que soy un organizador de torneos Cuando creo un nuevo torneo con información válida Entonces el torneo debe ser creado exitosamente Y debe estar disponible para la inscripción de participantes

- Escenario 2: Generación de inscripciones para un torneo
´´Dado que soy un organizador de torneos Y he creado un torneo Cuando genero las inscripciones para los participantes Entonces cada participante debe recibir un código único de entrada Y se debe enviar un correo electrónico a cada participante con su código de entrada

Ahora en lenguaje Gherkin:

Feature: Creación de Torneos 
Como organizador de torneos Quiero poder crear nuevos torneos Para que los jugadores puedan inscribirse y participar 
Scenario: Creación exitosa de un torneo 
Given que soy un organizador de torneos 
When creo un nuevo torneo con información válida 
Then el torneo debe ser creado exitosamente 
And debe estar disponible para la inscripción de participantes 
Scenario: Intento de creación de torneo con límite de participantes excedido 
Given que soy un organizador de torneos 
When intento crear un torneo con un número de participantes mayor al límite permitido para la categoría 
Then el sistema debe mostrar un mensaje de error indicando que se ha excedido el límite de participantes 
And el torneo no debe ser creado 

Feature: Generación de Inscripciones para Torneos 
Como organizador de torneos Quiero generar inscripciones únicas para los participantes Para que puedan acceder al torneo de manera segura 
Scenario: Generación de inscripciones para un torneo 
Given que soy un organizador de torneos 
And he creado un torneo 
When genero las inscripciones para los participantes 
Then cada participante debe recibir un código único de entrada 
And se debe enviar un correo electrónico a cada participante con su código de entrada

Estos escenarios de comportamiento, escritos en lenguaje Gherkin, permiten describir de manera clara y concisa cómo debe funcionar nuestra solución desde la perspectiva del usuario. Se utilizan palabras clave como "Given" (Dado), "When" (Cuando) y "Then" (Entonces) para estructurar los escenarios en un formato fácil de entender.

## Desarrollo Guiado por Pruebas (TDD)

En este proyecto de torneos de videojuegos en línea, se han adoptado principios de la metodología de Desarrollo Guiado por Pruebas (TDD) para garantizar la calidad y la robustez del código. TDD es una práctica de desarrollo en la que escribimos pruebas automatizadas antes de escribir el código de producción, lo que nos permite obtener un código más limpio, modular y confiable.

El ciclo de desarrollo de TDD consiste en tres pasos fundamentales:

- Escribir una prueba fallida: Comenzamos escribiendo una prueba que defina el comportamiento esperado de una funcionalidad específica. Esta prueba debe fallar inicialmente, ya que aún no hemos implementado el código correspondiente.
- Escribir el código mínimo para pasar la prueba: A continuación, escribimos el código necesario para hacer que la prueba pase. Nos enfocamos en escribir solo el código suficiente para satisfacer los requisitos de la prueba, sin agregar funcionalidades adicionales.
- Refactorizar: Una vez que la prueba pasa, revisamos y modificamos el código para mejorarlo, manteniendo su funcionalidad. Esto nos permite eliminar duplicaciones, mejorar la legibilidad y aplicar principios de diseño sólido.

A continuación, se presentan algunos ejemplos de pruebas unitarias para los casos de uso y repositorios de nuestro proyecto:

´´// Prueba unitaria para el caso de uso CreateTournamentUseCase describe('CreateTournamentUseCase', () => { it('debe crear un torneo con información válida', async () => { // Arrange const tournamentData = { name: 'Torneo de Ejemplo', category: 'Principiante', game: 'Juego de Ejemplo', // ... }; const tournamentRepositoryMock = { create: jest.fn(), }; const createTournamentUseCase = new CreateTournamentUseCase(tournamentRepositoryMock); // Act await createTournamentUseCase.execute(tournamentData); // Assert expect(tournamentRepositoryMock.create).toHaveBeenCalledWith(tournamentData); }); });´´

´´// Prueba unitaria para el repositorio TournamentRepository describe('TournamentRepository', () => { it('debe guardar un torneo en la base de datos', async () => { // Arrange const tournament = new Tournament( 'Torneo de Ejemplo', 'Principiante', 'Juego de Ejemplo', // ... ); const dynamoDBClientMock = { put: jest.fn(), }; const tournamentRepository = new TournamentRepository(dynamoDBClientMock); // Act await tournamentRepository.create(tournament); // Assert expect(dynamoDBClientMock.put).toHaveBeenCalledWith({ TableName: 'Tournaments', Item: tournament, }); }); });´´

Estas pruebas unitarias nos permiten validar el comportamiento individual de los componentes de nuestro sistema, como los casos de uso y los repositorios. Escribimos pruebas para cubrir diferentes escenarios y casos límite, asegurándonos de que cada componente funcione correctamente de manera aislada.
La cobertura de pruebas es un aspecto importante en nuestro proyecto. Utilizamos herramientas como Jest para medir el porcentaje de código cubierto por pruebas. Nuestro objetivo es mantener una alta cobertura de pruebas, lo que nos brinda confianza en la calidad y fiabilidad de nuestro código. Una alta cobertura de pruebas nos permite detectar y prevenir errores de manera temprana, reducir los riesgos de regresión y facilitar el mantenimiento y la evolución del sistema a largo plazo.

## Clean Code

En este proyecto de torneos de videojuegos en línea, se han adoptado las prácticas de Clean Code para asegurar la calidad, legibilidad y mantenibilidad del código. Clean Code se refiere a un conjunto de principios y técnicas que nos ayudan a escribir código limpio, bien estructurado y fácil de entender.
A continuación, se describen algunas de las prácticas de Clean Code aplicadas en este proyecto:

### Código legible y bien estructurado: 
Hemos puesto énfasis en escribir código que sea fácil de leer y comprender. Esto implica utilizar una estructura clara, consistente y bien organizada. Por ejemplo, en nuestros casos de uso, seguimos una estructura similar

### Nombres significativos: 
Hemos utilizado nombres significativos y descriptivos para variables, funciones y clases. Esto nos ayuda a entender rápidamente el propósito y la funcionalidad de cada elemento sin necesidad de buscar explicaciones adicionales. Por ejemplo:

### Aplicación de principios SOLID: 
Hemos aplicado los principios SOLID en nuestro diseño y arquitectura. Por ejemplo, el principio de Responsabilidad Única (SRP) lo hemos aplicado en la separación de responsabilidades entre los casos de uso, los repositorios y las entidades. Cada clase tiene una única responsabilidad y encapsula su lógica de manera cohesiva. Otro ejemplo es el principio de Inversión de Dependencias (DIP), que hemos aplicado mediante el uso de interfaces para las dependencias externas, como los repositorios. Esto nos permite desacoplar las capas y facilitar la sustitución de implementaciones.

### Patrones de diseño: 
Hemos utilizado patrones de diseño cuando ha sido apropiado para resolver problemas comunes de manera elegante y eficiente. Por ejemplo, hemos aplicado el patrón Repository para abstraer la capa de persistencia y desacoplarla de la lógica de negocio. Esto nos permite cambiar fácilmente la implementación de la capa de persistencia sin afectar al resto del sistema.

### Manejo adecuado de errores y excepciones: 
Hemos implementado un manejo adecuado de errores y excepciones para proporcionar información clara y útil en caso de problemas. Utilizamos excepciones personalizadas para representar errores específicos del dominio y capturamos y manejamos las excepciones de manera apropiada en los diferentes niveles de la aplicación. Por ejemplo, en el caso de uso CreateTournamentUseCase, lanzamos una excepción personalizada cuando se excede el límite de participantes


## Plataforma Cloud (AWS)
En nuestro proyecto de torneos de videojuegos en línea, hemos aprovechado la plataforma de Amazon Web Services (AWS) para desarrollar y desplegar nuestra solución de manera escalable, confiable y rentable. AWS nos ha proporcionado un conjunto de servicios y herramientas que nos han permitido construir una arquitectura serverless sólida y eficiente.

A continuación, se describen los servicios de AWS utilizados en nuestro proyecto:

### AWS Lambda: 
AWS Lambda para implementar funciones serverless. Lambda permite ejecutar código sin la necesidad de administrar servidores subyacentes. Se han escrito las funciones en TypeScript y se han desplegado en Lambda, lo que permite escalar automáticamente en función de la demanda. Por ejemplo, se cuenta con Lambda para la creación de torneos, la generación de inscripciones y la validación de códigos de entrada. Estas funciones se activan a través de eventos, como solicitudes HTTP a través de API Gateway, y se ejecutan de manera eficiente y escalable.

### Amazon DynamoDB: 
Amazon DynamoDB como base de datos NoSQL para almacenar y recuperar datos de manera rápida y escalable. DynamoDB proporciona un rendimiento consistente y una alta disponibilidad sin la necesidad de administrar la infraestructura de base de datos subyacente. Se han creado tablas en DynamoDB para almacenar información sobre torneos, inscripciones de participantes y ventas de tickets. Se utiliza el SDK de AWS para interactuar con DynamoDB desde las funciones Lambda, lo que permite realizar operaciones de lectura y escritura de manera eficiente.

### Amazon API Gateway: 
Amazon API Gateway para exponer API REST al mundo exterior. API Gateway actúa como la puerta de entrada para las funciones Lambda, permitiendo a los clientes interactuar con la aplicación a través de endpoints HTTP. Se han configurado rutas y métodos en API Gateway para cada funcionalidad de la aplicación, como la creación de torneos, la generación de inscripciones y la validación de códigos de entrada. API Gateway se encarga de enrutar las solicitudes a las funciones Lambda correspondientes y devolver las respuestas al cliente.

### Amazon SES: 
Amazon SES (Simple Email Service) para enviar correos electrónicos a los participantes de los torneos. SES permite enviar correos electrónicos de manera confiable y escalable, sin la necesidad de administrar  infraestructura propia de correo electrónico. Cuando se generan las inscripciones para un torneo, se utiliza SES para enviar correos electrónicos a cada participante con su código de entrada único. Esto permite mantener informados a los participantes y facilitar su acceso al torneo.

La configuración y el despliegue de la aplicación en AWS se han realizado de manera sencilla y automatizada. Hemos utilizado el framework CDK para definir y desplegar nuestra infraestructura como código. Con CDK, podemos especificar los recursos de AWS necesarios, como las funciones Lambda, las tablas de DynamoDB y las rutas de API Gateway, en un archivo de despliegue especificando sus relaciones y los permisos necesarios autogestionados mediante librerías de desarrollo llamadas Construct. Luego, con un simple comando, es posible desplegar toda la aplicación en AWS de manera rápida y consistente.

La arquitectura serverless que se adoptó en AWS nos ha brindado varios beneficios en términos de escalabilidad y costo:

- Escalabilidad automática: AWS Lambda y DynamoDB nos permiten escalar automáticamente en función de la demanda. Cuando hay un aumento en el tráfico o las solicitudes, AWS se encarga de aprovisionar y escalar los recursos necesarios sin intervención manual. Esto permite manejar picos de tráfico de manera eficiente y sin preocuparnos por la infraestructura subyacente.

- Pago por uso: Con una arquitectura serverless, solo pagamos por los recursos que son realmente utilizados. AWS Lambda cobra por el tiempo de ejecución de las funciones y DynamoDB cobra por las operaciones de lectura y escritura realizadas. Esto significa que no es necesario que pagar por servidores inactivos o capacidad no utilizada, lo que resulta en un modelo de costos más eficiente y escalable.

- Reducción de la complejidad operativa: Al utilizar servicios administrados por AWS, como Lambda y DynamoDB, es posible centrarnos en el desarrollo de nuestra aplicación sin preocuparse por la administración de la infraestructura subyacente. AWS se encarga de la seguridad, el escalado y la disponibilidad de estos servicios, lo que nos permite ahorrar tiempo y esfuerzo en tareas operativas.
En resumen, la utilización de la plataforma de AWS en este proyecto permite desarrollar y desplegar una solución serverless escalable, confiable y rentable. Los servicios como AWS Lambda, Amazon DynamoDB, Amazon API Gateway y Amazon SES brindan las herramientas necesarias para construir una aplicación robusta y eficiente. La arquitectura serverless ha proporcionado escalabilidad automática y un modelo de costos más eficiente, permitiéndo así el enfoque en el desarrollo de funcionalidades y en la entrega de valor a los usuarios.

# Conclusiones
A lo largo de este proyecto de torneos de videojuegos en línea, se ha logrado desarrollar una solución sólida y escalable que cumple con los objetivos y requisitos establecidos. Se ha aplicado una combinación de principios y prácticas de desarrollo, como Domain-Driven Design (DDD), Behavior-Driven Development (BDD), Test-Driven Development (TDD) y Clean Code, lo que ha permitido crear un sistema robusto, mantenible y de alta calidad.
Entre los logros y resultados destacados del proyecto, podemos mencionar:
Implementación exitosa de la funcionalidad de creación de torneos, permitiendo a los organizadores configurar diferentes categorías, límites de participantes y opciones de pago.
Desarrollo de un sistema de generación de inscripciones únicas para los participantes, asegurando un acceso seguro y controlado a los torneos.
Integración de un servicio de registro para la venta de tickets y la gestión de comisiones, brindando una experiencia de compra sin problemas para los participantes.
Creación de una arquitectura serverless escalable y rentable utilizando los servicios de AWS, como Lambda, DynamoDB, API Gateway y SES.
Implementación de pruebas automatizadas exhaustivas, incluyendo pruebas unitarias garantizando la calidad y confiabilidad del sistema.
La aplicación de DDD  ha permitido modelar y estructurar nuestro dominio de manera clara y coherente, alineando el código con los conceptos y reglas de negocio. Se ha logrado una separación adecuada de responsabilidades y una encapsulación efectiva del dominio, lo que ha facilitado la comprensión y el mantenimiento del sistema.
La adopción de BDD ayudaría a colaborar estrechamente con los stakeholders y a definir escenarios de comportamiento claros y precisos. Se ha utilizado el lenguaje Gherkin para describir los escenarios en un formato legible y comprensible para todos los posibles miembros del equipo, lo que mejoraría la comunicación y el entendimiento de los requisitos.
La práctica de TDD ha sido fundamental para garantizar la calidad y la robustez del código. Al escribir pruebas antes del código de producción, se ha podido validar el comportamiento esperado de cada componente y detectar errores tempranamente. Además, la alta cobertura de pruebas nos ha brindado confianza en la fiabilidad del sistema.
La aplicación de los principios de Clean Code ha llevado a escribir un código legible, bien estructurado y fácil de mantener. Se han utilizado nombres significativos, seguido los principios SOLID y aplicado patrones de diseño cuando ha sido apropiado. Esto ha resultado en un código más claro, modular y reutilizable.

## Observaciones a futuro
Integración con plataformas de streaming populares, como Twitch o YouTube, para una mayor visibilidad y alcance de los torneos.
Desarrollo de una aplicación móvil complementaria para mejorar la experiencia de los participantes y brindar acceso en tiempo real a información relevante.
Expansión a nuevas regiones geográficas y soporte para múltiples idiomas, con el objetivo de atraer a una base de usuarios más amplia y diversa.
