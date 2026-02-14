FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /build

COPY . .

WORKDIR /build/backend
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /build/backend/target/quarkus-app/lib/ /app/lib/
COPY --from=build /build/backend/target/quarkus-app/*.jar /app/
COPY --from=build /build/backend/target/quarkus-app/app/ /app/app/
COPY --from=build /build/backend/target/quarkus-app/quarkus/ /app/quarkus/

EXPOSE 8080
CMD ["java", "-jar", "/app/quarkus-run.jar"]