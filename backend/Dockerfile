# Etapa 1: compilación
# Usamos una imagen que ya trae Maven + JDK 21 para no instalar nada manualmente.
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copiamos primero solo el pom.xml y descargamos dependencias.
# Docker cachea cada instrucción: si el pom.xml no cambia, esta capa
# no se vuelve a ejecutar aunque cambiemos el código fuente después.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Ahora sí copiamos el código fuente y compilamos el jar (sin correr tests,
# porque en esta etapa solo queremos el artefacto final).
COPY src src
RUN mvn clean package -DskipTests -B

# Etapa 2: ejecución
# Imagen liviana que solo tiene el JRE (no hace falta el JDK completo ni Maven
# para *ejecutar* un jar ya compilado).
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copiamos únicamente el jar generado en la etapa anterior.
COPY --from=build /app/target/*.jar app.jar

# Carpeta donde el backend guarda los PDF de remitos/órdenes de provisión
# (RemitoService/OrdenProvisionService usan rutas relativas "uploads/...").
# Se monta como volumen en docker-compose para que los archivos no se
# pierdan si se recrea el contenedor.
RUN mkdir -p /app/uploads

# Corremos como usuario sin privilegios, no como root (buena práctica de
# hardening de contenedores). El chown va antes de crear el volumen nombrado
# "uploads_data": Docker copia el contenido/permisos existentes de /app/uploads
# al volumen la primera vez, así que el ownership correcto se preserva.
RUN groupadd -r protecciones && \
    useradd -r -g protecciones -d /app -s /usr/sbin/nologin protecciones && \
    chown -R protecciones:protecciones /app

USER protecciones

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
