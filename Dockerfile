# syntax=docker/dockerfile:1
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY src ./src

RUN chmod +x ./mvnw
RUN ./mvnw -B -DskipTests \
    -Daether.connector.http.retryHandler.count=3 \
    -Daether.connector.http.retryHandler.requestTimeout=30000 \
    package

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
EXPOSE 8080
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
