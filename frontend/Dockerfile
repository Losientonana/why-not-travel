# ========================================
# Multi-stage Dockerfile
# ========================================
# 개발: docker-compose up 사용 (Hot Reload)
# 프로덕션: docker build --target production 사용

# ========================================
# Base Stage: 공통 의존성 설치
# ========================================
FROM node:20.10.0-alpine AS base
WORKDIR /app

# 보안 패치 적용
RUN apk upgrade --no-cache && \
    rm -rf /var/cache/apk/*

# 패키지 파일 복사
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# ========================================
# Development Stage: Hot Reload 지원
# ========================================
FROM base AS development

# 개발 의존성 포함 설치
RUN if [ -f pnpm-lock.yaml ]; then \
      npm install -g pnpm && pnpm install; \
    elif [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

# 소스 코드 복사
COPY . .

# 비root 유저 생성 및 전환
RUN addgroup -g 1001 nodejs && \
    adduser -S nextjs -u 1001 -G nodejs && \
    chown -R nextjs:nodejs /app

USER nextjs:nodejs

# 포트 노출
EXPOSE 3000

# 환경 변수
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# 개발 서버 실행 (Hot Reload 활성화)
CMD ["npm", "run", "dev"]

# ========================================
# Dependencies Stage: 프로덕션 의존성만 설치
# ========================================
FROM base AS deps

# libc6-compat 추가 (Alpine에서 필요)
RUN apk add --no-cache libc6-compat

# 프로덕션 의존성만 설치
RUN if [ -f pnpm-lock.yaml ]; then \
      npm install -g pnpm && pnpm install --prod --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
      npm ci --only=production; \
    else \
      npm install --only=production; \
    fi

# ========================================
# Builder Stage: Next.js 빌드
# ========================================
FROM base AS builder

# libc6-compat 추가
RUN apk add --no-cache libc6-compat

# 모든 의존성 설치 (devDependencies 포함)
RUN if [ -f pnpm-lock.yaml ]; then \
      npm install -g pnpm && pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

# 소스 코드 복사
COPY . .

# 환경 변수 설정 (빌드 시점)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Next.js 빌드 (standalone 모드)
RUN npm run build

# ========================================
# Production Stage: 최소한의 런타임 이미지
# ========================================
FROM node:20.10.0-alpine AS production

# 보안 패치 적용
RUN apk upgrade --no-cache && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# 프로덕션 환경 변수
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 비root 유저 생성
RUN addgroup -g 1001 nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# 빌드된 파일만 복사 (standalone 모드 사용 시)
# Note: next.config.mjs에 output: 'standalone' 설정 필요
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# standalone 모드를 사용하는 경우 (추천)
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# CMD ["node", "server.js"]

# standalone 모드를 사용하지 않는 경우
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# 비root 유저로 전환
USER nextjs:nodejs

# 포트 노출
EXPOSE 3000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Next.js 프로덕션 서버 실행
CMD ["npm", "start"]

# 메타데이터
LABEL maintainer="travel-platform-dev"
LABEL version="1.0.0"
LABEL description="Travel Platform Frontend (Next.js 14.2.16 + React 18)"
