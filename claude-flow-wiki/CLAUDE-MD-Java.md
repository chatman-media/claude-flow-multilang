# Claude Code Configuration for Java Projects

## 🚨 CRITICAL: JAVA PARALLEL EXECUTION PATTERNS

**MANDATORY RULE**: Java projects require Maven/Gradle ecosystem coordination with parallel build operations.

## 🚨 CRITICAL: CONCURRENT EXECUTION FOR ALL JAVA OPERATIONS

**ABSOLUTE RULE**: ALL Java operations MUST be concurrent/parallel in a single message:

### 🔴 MANDATORY CONCURRENT PATTERNS FOR JAVA:

1. **Build Tools**: ALWAYS batch ALL Maven/Gradle commands in ONE message
2. **Spring Boot Operations**: ALWAYS batch ALL Spring framework setup
3. **Testing**: ALWAYS run ALL JUnit/TestNG suites in parallel
4. **Database Operations**: ALWAYS batch ALL JPA/Hibernate configurations
5. **Enterprise Features**: ALWAYS batch ALL enterprise patterns together

### ⚡ JAVA GOLDEN RULE: "1 MESSAGE = ALL JVM ECOSYSTEM OPERATIONS"

**Examples of CORRECT Java concurrent execution:**

```java
// ✅ CORRECT: Everything in ONE message
[Single Message]:
  - TodoWrite { todos: [10+ todos with all Java tasks] }
  - Task("You are Java architect. Coordinate via hooks for Spring Boot design...")
  - Task("You are Enterprise developer. Coordinate via hooks for microservices...")
  - Task("You are DevOps engineer. Coordinate via hooks for deployment...")
  - Bash("mvn archetype:generate -DgroupId=com.example -DartifactId=my-app")
  - Bash("mvn clean install")
  - Bash("mvn spring-boot:run")
  - Write("pom.xml", mavenConfiguration)
  - Write("src/main/java/Application.java", springBootApp)
  - Write("src/main/java/controller/UserController.java", restController)
  - Write("src/main/java/service/UserService.java", serviceLayer)
  - Write("src/main/java/repository/UserRepository.java", dataLayer)
  - Write("src/test/java/UserControllerTest.java", unitTests)
  - Write("application.properties", springConfig)
```

## 🎯 JAVA-SPECIFIC SWARM PATTERNS

### ☕ Maven/Gradle Build Coordination

**Maven Build Strategy:**
```bash
# Always batch Maven operations
mvn clean compile
mvn test
mvn package
mvn spring-boot:run
mvn deploy
```

**Gradle Build Strategy:**
```bash
# Always batch Gradle operations
./gradlew clean build
./gradlew test
./gradlew bootRun
./gradlew publishToMavenLocal
```

**Parallel Development Setup:**
```java
// ✅ CORRECT: All setup in ONE message
[BatchTool]:
  - Bash("mvn archetype:generate -DgroupId=com.company -DartifactId=spring-app")
  - Bash("cd spring-app && mvn clean install")
  - Write("pom.xml", springBootPom)
  - Write("src/main/resources/application.yml", springConfig)
  - Write("src/main/java/Application.java", springBootMain)
  - Write("src/main/java/config/DatabaseConfig.java", dbConfig)
  - Write("src/main/java/controller/ApiController.java", restController)
  - Write("src/test/java/ApplicationTest.java", integrationTest)
  - Bash("cd spring-app && mvn spring-boot:run")
```

### 🏗️ Java Agent Specialization

**Agent Types for Java Projects:**

1. **Spring Boot Agent** - Framework setup, REST APIs, dependency injection
2. **Enterprise Agent** - JEE patterns, microservices, enterprise integration
3. **Database Agent** - JPA, Hibernate, database design and optimization
4. **Testing Agent** - JUnit, Mockito, integration testing
5. **Security Agent** - Spring Security, authentication, authorization
6. **DevOps Agent** - Docker, Kubernetes, CI/CD pipelines

### 🌱 Spring Boot Framework Coordination

**Spring Boot Project Setup:**
```java
// Spring Boot swarm initialization
[BatchTool]:
  - Write("src/main/java/com/example/Application.java", springBootApplication)
  - Write("src/main/java/com/example/controller/UserController.java", userController)
  - Write("src/main/java/com/example/service/UserService.java", userService)
  - Write("src/main/java/com/example/repository/UserRepository.java", userRepository)
  - Write("src/main/java/com/example/model/User.java", userEntity)
  - Write("src/main/java/com/example/config/SecurityConfig.java", securityConfig)
  - Write("src/main/resources/application.yml", applicationConfig)
  - Write("pom.xml", springBootPom)
  - Bash("mvn clean install && mvn spring-boot:run")
```

### 🏢 Enterprise Java Coordination

**Enterprise Patterns Setup:**
```java
// Enterprise Java batch
[BatchTool]:
  - Write("src/main/java/service/BusinessService.java", businessLogic)
  - Write("src/main/java/dto/UserDTO.java", dataTransferObjects)
  - Write("src/main/java/mapper/UserMapper.java", entityMapping)
  - Write("src/main/java/exception/BusinessException.java", exceptionHandling)
  - Write("src/main/java/validation/UserValidator.java", inputValidation)
  - Write("src/main/java/util/Constants.java", applicationConstants)
  - Bash("mvn clean compile test")
```

## 🧪 JAVA TESTING COORDINATION

### ⚡ JUnit Testing Strategy

**Parallel Testing Setup:**
```java
// Test coordination pattern
[BatchTool]:
  - Write("src/test/java/controller/UserControllerTest.java", controllerTests)
  - Write("src/test/java/service/UserServiceTest.java", serviceTests)
  - Write("src/test/java/repository/UserRepositoryTest.java", repositoryTests)
  - Write("src/test/java/integration/UserIntegrationTest.java", integrationTests)
  - Write("src/test/resources/application-test.yml", testConfig)
  - Bash("mvn test -Dtest=**/*Test")
  - Bash("mvn test -Dtest=**/*IntegrationTest")
  - Bash("mvn jacoco:report")
```

### 🔬 Advanced Testing Coordination

**Advanced Testing Setup:**
```java
[BatchTool]:
  - Write("src/test/java/config/TestConfiguration.java", testConfig)
  - Write("src/test/java/util/TestDataBuilder.java", testDataUtils)
  - Write("src/test/java/mock/MockUserService.java", mockServices)
  - Bash("mvn test -Dspring.profiles.active=test")
  - Bash("mvn verify -Pfailsafe")
```

## 💾 DATABASE INTEGRATION COORDINATION

### 🗄️ JPA/Hibernate Coordination

**Database Setup Pattern:**
```java
// Database integration batch
[BatchTool]:
  - Write("src/main/java/entity/BaseEntity.java", baseEntity)
  - Write("src/main/java/entity/User.java", userEntity)
  - Write("src/main/java/repository/UserRepository.java", jpaRepository)
  - Write("src/main/java/service/UserService.java", serviceWithTransactional)
  - Write("src/main/resources/db/migration/V1__Create_users_table.sql", flywayMigration)
  - Write("src/main/resources/application.yml", databaseConfig)
  - Bash("mvn flyway:migrate")
  - Bash("mvn spring-boot:run")
```

### 📊 Database Performance Coordination

**Database Optimization Batch:**
```java
[BatchTool]:
  - Write("src/main/java/config/DatabaseConfig.java", connectionPooling)
  - Write("src/main/java/repository/UserRepositoryCustom.java", customQueries)
  - Write("src/main/java/util/QueryUtils.java", queryOptimization)
  - Bash("mvn clean test -Dspring.profiles.active=performance")
```

## 🔧 JAVA BUILD TOOLS COORDINATION

### 📦 Maven Advanced Configuration

**Maven Multi-Module Coordination:**
```java
// Maven multi-module setup
[BatchTool]:
  - Write("pom.xml", parentPom)
  - Write("common/pom.xml", commonModulePom)
  - Write("api/pom.xml", apiModulePom)
  - Write("service/pom.xml", serviceModulePom)
  - Write("web/pom.xml", webModulePom)
  - Bash("mvn clean install -pl common,api,service,web")
  - Bash("mvn dependency:tree")
```

### 🎯 Gradle Advanced Configuration

**Gradle Multi-Project Setup:**
```java
// Gradle multi-project coordination
[BatchTool]:
  - Write("build.gradle", rootBuildGradle)
  - Write("settings.gradle", gradleSettings)
  - Write("common/build.gradle", commonBuildGradle)
  - Write("api/build.gradle", apiBuildGradle)
  - Write("service/build.gradle", serviceBuildGradle)
  - Bash("./gradlew clean build")
  - Bash("./gradlew dependencyInsight --dependency spring-boot")
```

## 🔒 JAVA SECURITY COORDINATION

### 🛡️ Spring Security Patterns

**Security Implementation Batch:**
```java
[BatchTool]:
  - Write("src/main/java/config/SecurityConfig.java", springSecurityConfig)
  - Write("src/main/java/security/JwtAuthenticationFilter.java", jwtFilter)
  - Write("src/main/java/security/UserDetailsServiceImpl.java", userDetailsService)
  - Write("src/main/java/controller/AuthController.java", authController)
  - Write("src/main/java/util/JwtUtil.java", jwtUtility)
  - Bash("mvn clean test -Dtest=SecurityConfigTest")
```

**Java Security Checklist:**
- Input validation and sanitization
- SQL injection prevention (use JPA)
- Authentication and authorization
- HTTPS enforcement
- Secure session management
- OWASP security headers
- Dependency vulnerability scanning
- Security testing

## ⚡ JAVA PERFORMANCE OPTIMIZATION

### 🚀 Performance Coordination

**Performance Optimization Batch:**
```java
[BatchTool]:
  - Write("src/main/java/config/CacheConfig.java", cachingConfiguration)
  - Write("src/main/java/util/PerformanceMonitor.java", performanceUtils)
  - Write("src/main/java/service/AsyncService.java", asyncProcessing)
  - Write("src/main/resources/logback-spring.xml", loggingConfig)
  - Bash("mvn clean test -Dspring.profiles.active=performance")
  - Bash("java -XX:+PrintGCDetails -jar target/app.jar")
```

### 🔄 Microservices Coordination

**Microservices Architecture:**
```java
[BatchTool]:
  - Write("src/main/java/config/EurekaClientConfig.java", serviceDiscovery)
  - Write("src/main/java/client/UserServiceClient.java", feignClient)
  - Write("src/main/java/controller/GatewayController.java", apiGateway)
  - Write("src/main/resources/bootstrap.yml", microserviceConfig)
  - Bash("mvn spring-boot:run -Dspring.profiles.active=eureka")
```

## 🚀 JAVA DEPLOYMENT PATTERNS

### ⚙️ Production Deployment

**Deployment Coordination:**
```java
[BatchTool]:
  - Write("Dockerfile", javaDockerfile)
  - Write("docker-compose.yml", dockerCompose)
  - Write("k8s/deployment.yaml", kubernetesDeployment)
  - Write("k8s/service.yaml", kubernetesService)
  - Write("scripts/deploy.sh", deploymentScript)
  - Bash("mvn clean package -Pprod")
  - Bash("docker build -t java-app:latest .")
  - Bash("kubectl apply -f k8s/")
```

### 🐳 Docker Coordination

**Docker Multi-Stage Build:**
```java
[BatchTool]:
  - Write("Dockerfile", multiStageDockerfile)
  - Write(".dockerignore", dockerIgnore)
  - Write("docker-compose.dev.yml", devDockerCompose)
  - Write("docker-compose.prod.yml", prodDockerCompose)
  - Bash("docker-compose -f docker-compose.dev.yml up --build")
  - Bash("docker-compose -f docker-compose.prod.yml up -d")
```

## 📊 JAVA CODE QUALITY COORDINATION

### 🎨 Code Quality Tools

**Quality Tools Batch:**
```java
[BatchTool]:
  - Write("checkstyle.xml", checkstyleConfig)
  - Write("spotbugs-exclude.xml", spotbugsExclusions)
  - Write("pmd-ruleset.xml", pmdRules)
  - Write("sonar-project.properties", sonarConfig)
  - Bash("mvn checkstyle:check")
  - Bash("mvn spotbugs:check")
  - Bash("mvn pmd:check")
  - Bash("mvn sonar:sonar")
```

### 📝 Documentation Coordination

**Javadoc and Documentation Setup:**
```java
[BatchTool]:
  - Write("src/main/java/package-info.java", packageDocumentation)
  - Write("docs/api-guide.md", apiDocumentation)
  - Write("docs/deployment-guide.md", deploymentDocs)
  - Bash("mvn javadoc:javadoc")
  - Bash("mvn site")
```

## 🔄 JAVA CI/CD COORDINATION

### 🏗️ GitHub Actions for Java

**CI/CD Pipeline Batch:**
```java
[BatchTool]:
  - Write(".github/workflows/ci.yml", javaCI)
  - Write(".github/workflows/deploy.yml", deploymentWorkflow)
  - Write("scripts/test.sh", testScript)
  - Write("scripts/build.sh", buildScript)
  - Bash("mvn clean verify")
  - Bash("mvn deploy -Prelease")
```

### 🏢 Enterprise CI/CD

**Enterprise Pipeline Setup:**
```java
[BatchTool]:
  - Write("Jenkinsfile", jenkinspipeline)
  - Write("sonar-project.properties", sonarQubeConfig)
  - Write("nexus-staging.xml", nexusConfiguration)
  - Bash("mvn clean deploy -Pnexus")
```

## 💡 JAVA BEST PRACTICES

### 📝 Code Quality Standards

1. **Java Conventions**: Follow Oracle coding standards
2. **Design Patterns**: Apply appropriate design patterns
3. **SOLID Principles**: Maintain clean architecture
4. **Exception Handling**: Proper error management
5. **Unit Testing**: High test coverage with JUnit
6. **Documentation**: Comprehensive Javadoc comments

### 🎯 Performance Optimization

1. **Memory Management**: Efficient object creation and garbage collection
2. **Collections**: Proper use of Java collections
3. **Concurrency**: Thread-safe programming patterns
4. **Caching**: Strategic caching implementation
5. **Database Optimization**: Efficient JPA queries
6. **JVM Tuning**: Optimal JVM parameters

## 📚 JAVA LEARNING RESOURCES

### 🎓 Recommended Topics

1. **Core Java**: OOP, collections, generics, lambdas
2. **Spring Framework**: Dependency injection, AOP, MVC
3. **Spring Boot**: Auto-configuration, microservices
4. **JPA/Hibernate**: Object-relational mapping
5. **Testing**: JUnit, Mockito, integration testing
6. **Build Tools**: Maven, Gradle project management

### 🔧 Essential Tools

1. **IDEs**: IntelliJ IDEA, Eclipse, VS Code
2. **Build Tools**: Maven, Gradle, Ant
3. **Testing**: JUnit, TestNG, Mockito, AssertJ
4. **Quality**: Checkstyle, SpotBugs, PMD, SonarQube
5. **Profiling**: JProfiler, VisualVM, JConsole
6. **Application Servers**: Tomcat, Jetty, WildFly

### 🏢 Enterprise Technologies

1. **Frameworks**: Spring Boot, Spring Cloud, Quarkus
2. **Microservices**: Netflix OSS, Spring Cloud Gateway
3. **Messaging**: RabbitMQ, Apache Kafka, ActiveMQ
4. **Databases**: PostgreSQL, MySQL, Oracle, MongoDB
5. **Caching**: Redis, Hazelcast, Ehcache
6. **Monitoring**: Micrometer, Actuator, Prometheus

---

**Remember**: Java swarms excel with Maven/Gradle coordination, parallel compilation, and enterprise-grade testing. Always batch build operations and leverage the rich Java ecosystem for robust, scalable applications.