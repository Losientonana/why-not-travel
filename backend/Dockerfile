# ========================================
# Stage 1: Build Stage (빌드 환경)
# ========================================
# AWS 배포를 위한 amd64 플랫폼 (M1/M2/M3에서도 동작)
FROM --platform=linux/amd64 gradle:8.5-jdk17-alpine AS build

WORKDIR /app

# Gradle 캐시 최적화 (의존성 파일만 먼저 복사)
COPY build.gradle settings.gradle ./
COPY gradle ./gradle

# 의존성 다운로드 (캐싱 레이어 - 실패해도 계속 진행)
RUN gradle dependencies --no-daemon || true

# 소스 코드 복사
COPY src ./src

# JAR 빌드
# 개발: SKIP_TESTS=true로 빠른 빌드
# 프로덕션: 테스트 포함 권장
ARG SKIP_TESTS=true
RUN if [ "$SKIP_TESTS" = "true" ]; then \
      echo "⚠️  테스트 스킵 모드 (개발 전용)"; \
      gradle bootJar --no-daemon -x test; \
    else \
      echo "✅ 테스트 포함 빌드 (프로덕션 권장)"; \
      gradle bootJar --no-daemon; \
    fi

# ========================================
# Stage 2: Runtime Stage (실행 환경)
# ========================================
# AWS 배포를 위한 amd64 플랫폼 (Alpine Linux 기반, 경량화)
FROM --platform=linux/amd64 eclipse-temurin:17-jre-alpine

# 보안 패치 적용 및 필수 도구 설치
RUN apk upgrade --no-cache && \
    apk add --no-cache wget && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# 빌드 스테이지에서 JAR 파일만 복사 (소스 코드 미포함)
COPY --from=build /app/build/libs/*.jar app.jar

# 비root 유저 생성 및 권한 설정
RUN addgroup -S spring && \
    adduser -S spring -G spring && \
    chown -R spring:spring /app

# 보안: 비root 유저로 전환
USER spring:spring

# 헬스체크 설정 (AWS ECS와 호환)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# 포트 노출 (문서화 목적)
EXPOSE 8080

# JVM 메모리 최적화 옵션 (환경 변수로 덮어쓰기 가능)
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:ParallelGCThreads=2"

# 보안 강화 JVM 옵션
ENV JAVA_SECURITY_OPTS="-Djava.security.egd=file:/dev/./urandom"

# 애플리케이션 실행
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS $JAVA_SECURITY_OPTS -jar app.jar"]

# 메타데이터
LABEL maintainer="travel-platform-dev"
LABEL version="1.0.0"
LABEL description="Travel Platform Backend (Spring Boot 3.4.5 + Java 17)"
