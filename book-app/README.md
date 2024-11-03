Book App - CI/CD con Kubernetes y ArgoCD

Descripción del Proyecto

Este proyecto es una aplicación web simple llamada Book App, diseñada para funcionar como un "libro" editable. La aplicación permite visualizar y modificar el contenido del libro a través de una API REST. La infraestructura del proyecto utiliza un pipeline de CI/CD con GitHub Actions para pruebas y despliegue de imágenes Docker, así como Kubernetes y ArgoCD para el despliegue automatizado en un clúster. El proyecto está configurado para diferenciar los entornos develop y master, ofreciendo rutas diferentes para cada uno y configuraciones específicas.

Estructura de Archivos del Proyecto

El proyecto está organizado de la siguiente manera:

perl
Copiar código
proyecto-cicd-keepcoding/
├── .github/
│   └── workflows/
│       └── ci.yml              # Configuración de CI/CD en GitHub Actions
├── book-app/
│   ├── server.js               # Código principal de la aplicación
│   ├── package.json            # Dependencias de Node.js
│   ├── package-lock.json       # Versión exacta de las dependencias
├── k8s/
│   ├── deployment.yaml         # Configuración de despliegue de Kubernetes
│   ├── service.yaml            # Configuración de servicio de Kubernetes
│   └── hpa.yaml                # Configuración del Autoscaler Horizontal
├── Dockerfile                  # Dockerfile para construir la imagen de Docker de la app
└── README.md                   # Documentación del proyecto

A continuación se describe cada archivo en detalle.

.github/workflows/ci.yml
Este archivo configura el pipeline de CI/CD en GitHub Actions, que se activa en cada push a las ramas develop y master. Las tareas en el pipeline incluyen:
Checkout de Código: Clona el repositorio en el entorno de GitHub Actions.
Configuración de Node.js: Establece la versión de Node.js para el entorno.
Instalación de Dependencias: Instala las dependencias necesarias de book-app.
Linting y Pruebas: Ejecuta npm run lint y npm test para verificar la calidad del código y realizar pruebas.
Build y Push de la Imagen Docker: Construye y publica la imagen en Docker Hub. La imagen se etiqueta como latest y se publica en Docker Hub para facilitar el despliegue en Kubernetes.

book-app/server.js
El archivo principal de la aplicación que define las rutas y lógica de negocio:
Rutas /book y /dev/book: La ruta cambia según el entorno (master o develop). Permite:
Ver el contenido del libro mediante GET.
Actualizar el contenido del libro mediante PUT.
Puerto: La aplicación escucha en el puerto 8080.

book-app/package.json
Define las dependencias del proyecto y los scripts:
Dependencias:
express: Framework de Node.js para crear el servidor.
body-parser: Middleware para parsear cuerpos JSON.
sqlite3 (opcional, si en el futuro se implementa persistencia).
Scripts: Comandos útiles como npm run lint y npm test para ejecutar las verificaciones de calidad y pruebas.

k8s/deployment.yaml
Archivo de despliegue de Kubernetes que define cómo y cuántas réplicas de la aplicación deben ejecutarse:
Replicas: Configuradas en 2 para alta disponibilidad.
Contenedor:
Imagen: miltonrpg/book-app:latest, que se actualiza automáticamente en cada commit a master.
Probes:
livenessProbe y readinessProbe: Configuradas para mantener la aplicación en buen estado reiniciando contenedores defectuosos y verificando su disponibilidad antes de enviar tráfico.
Variables de Entorno:
NODE_ENV: Configurada en production para la rama master y en development para develop.

k8s/service.yaml
Este archivo define el servicio de Kubernetes para exponer la aplicación al exterior:
Tipo de Servicio: NodePort para exponer el servicio localmente en el puerto 30080.
Selector: Apunta al Deployment de book-app para enrutar el tráfico a los pods correspondientes.

k8s/hpa.yaml
Configura el Horizontal Pod Autoscaler para el despliegue de la aplicación. Ajusta automáticamente el número de réplicas basándose en el uso de CPU:
Replicas Mínimas: 1
Replicas Máximas: 5
Umbral de CPU: Escala automáticamente cuando el uso promedio de CPU supera el 70%.

Dockerfile
Archivo que define la imagen Docker para la aplicación. Contiene instrucciones para instalar dependencias y ejecutar la aplicación.
Instrucciones:
Instala las dependencias de package.json.
Expone el puerto 8080 para la aplicación.
Configuración de Imagen: La imagen se etiqueta como latest y se publica en Docker Hub, permitiendo el despliegue automatizado con ArgoCD.

Despliegue y Configuración de ArgoCD
ArgoCD está configurado para monitorear el repositorio de GitHub y desplegar la aplicación en el clúster de Kubernetes.

Diferentes Ramas para Diferentes Entornos:
develop: Usa la ruta /dev/book y está configurado para el entorno de desarrollo.
master: Usa la ruta /book y está configurado para el entorno de producción.

Sincronización Automática:
La sincronización automática en ArgoCD está habilitada para desplegar cualquier cambio en las ramas develop y master automáticamente.

Instrucciones de Despliegue
Hacer un Push:
Realiza cambios en develop o master y haz un push al repositorio.
Pipeline en GitHub Actions:
El pipeline de GitHub Actions se ejecuta automáticamente, construyendo y publicando la imagen Docker en Docker Hub.

Sincronización en ArgoCD:
ArgoCD monitorea el repositorio y despliega la aplicación en Kubernetes cuando detecta cambios.
Puedes verificar el despliegue en la interfaz de ArgoCD y forzar la sincronización si es necesario.

Pruebas de la Aplicación
Desarrollo:
Accede a http://localhost:8080/dev/book para ver y actualizar el contenido en el entorno de develop.
Producción:
Accede a http://localhost:8080/book para ver y actualizar el contenido en el entorno de master.
Para realizar una actualización del contenido en desarrollo o producción, puedes hacer un PUT a las rutas /dev/book o /book, según el entorno, enviando un JSON como:

json
Copiar código
{
  "content": "Nuevo contenido del libro."
}

Este README proporciona una visión completa de la configuración y el flujo de trabajo del proyecto, asegurando que los cambios sean gestionados y desplegados en los entornos correspondientes de manera automatizada.