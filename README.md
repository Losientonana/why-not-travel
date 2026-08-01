
<img width="1972" height="798" alt="TravelMateLogo" src="https://github.com/user-attachments/assets/2dc1633c-2aab-4060-b43e-d7de064b2c27" />

# ✈️ TravelMate

> 여행의 모든 순간을 함께 — 일정·예약·경비·정산을 한 곳에서 관리하는 협업 여행 플래너

<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-3.4.5-6DB33F?style=flat&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=nextdotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?style=flat&logo=mysql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/AWS-EC2-FF9900?style=flat&logo=amazonaws&logoColor=white"/>
</p>

<p align="center">
  <a href="https://www.whynottravel.xyz/" target="_blank"><strong>🌐 서비스 바로가기</strong></a>
</p>

---

## 📌 프로젝트 소개

여행을 자주 다니다 보니 반복적으로 마주치는 불편함이 있었습니다. 여행이
끝나면 지출 내역은 흩어지고, 루트와 예약 정보는 카톡·메일·메모장
곳곳에 분산되어 찾기 어렵고, 여러 명이 함께 쓴 돈을 정산하는 과정은
매번 번거롭고 복잡했습니다.

이 실생활의 불편함을 직접 해결하고자  개인 프로젝트 TravelMate를 기획했습니다. 동행자와 여행 일정·예약·사진·경비 정산을 한 플랫폼에서 관리하고 공유할 수 있는 협업 여행 플래너입니다.

직접 아키텍처를 설계하고 배포까지 전과정을 경험하는 사이드 프로젝트로서 — Spring Security, OAuth2, JWT,Redis, SSE, Docker, CI/CD 등 실서비스에 필요한 기술 스택을 스스로
선택하고 깊이 있게 구현해보는 것을 목표로 했습니다.

지인들과 실제 일본 여행에서 직접 사용하며 개선한 실사용 프로젝트입니다.

| | |
|---|---|
| **개발 기간** | 2025.07 ~ 2026.02 |
| **개발 인원** | 1인 (백엔드·인프라 전담 / 프론트 API 연동·데이터 처리 직접 구현 / UI 영역 생성형 AI 활용) |
| **배포** | AWS EC2 + Cloudflare + Docker Compose |

---

## 🛠️ 기술 스택

| 구분 | 기술 |
|---|---|
| **Backend** | Java 17, Spring Boot 3.4.5, Spring Security, OAuth2 Client, Spring Data JPA |
| **Auth** | JWT 이중 토큰 (Access 15분 / Refresh 7일 RTR), Google·Naver OAuth2 |
| **Database** | MySQL 8, Redis 7 |
| **Infra** | Docker Compose, Nginx, AWS EC2, GitHub Actions CI/CD, Cloudflare TLS, AWS S3 / MinIO |
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS |
| **Realtime** | SSE (Server-Sent Events) |

---

## 🏗️ 시스템 아키텍처

<img width="1662" height="946" alt="시스템아키텍처" src="https://github.com/user-attachments/assets/44a7ff74-be67-426c-a37e-c15d59724ddf" />


---


---

## 🖼️ 실사용 화면


https://www.notion.so/TravelMate-3af72f11e8e880be8b39eb39bd6408b6?source=copy_link
---

## 🔥 트러블 슈팅

### 1. 대용량 채권 분배 비동기 처리 + 분산 환경 캐시 불일치 해결

수만 건 동기 처리로 인한 504 Timeout 반복 발생 → `fastcgi_finish_request()` + Laravel Terminating 이벤트로 즉시 응답 후 백그라운드 실행, Chunk 분할·Bulk 쿼리 교체로 개선.  
로드밸런서 환경에서 서버 간 로컬 캐시 불일치 발생 → **Redis 도입**으로 어느 서버로 요청이 가든 동일한 진행 상태를 참조하도록 해결.

> **결과**: 사용자 대기 → 즉시 응답(1초 이내) / DB 쿼리: 건별 수만 회 → Bulk 수십 회

### 2. SSE 장기 연결로 인한 HikariCP 커넥션 풀 고갈

JPA OSIV 기본값(`open-in-view=true`)으로 SSE 연결 30분 동안 DB 커넥션을 점유 → 동시 접속자 증가 시 `Connection is not available` 에러, API 전체 응답 불가.  
`open-in-view=false` 적용으로 커넥션을 `@Transactional` 범위 안에서만 사용, Pool Size 조정 및 누수 감지 임계값 설정.

> **결과**: 커넥션 적시 반납, SSE I/O가 DB 커넥션에 영향을 주지 않는 구조로 개선

### 3. 공동 경비 동시 입금 시 잔액 정합성 깨짐 (Lost Update)

동시에 잔액을 읽고 저장 시 한 건이 유실되는 Lost Update 문제 →  
`@Lock(PESSIMISTIC_WRITE)` + 3초 타임아웃으로 DB 레벨 순차 처리 보장.

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value = "3000")})
@Query("SELECT sf FROM SharedFund sf WHERE sf.tripId = :tripId")
Optional<SharedFund> findByTripIdWithLock(@Param("tripId") Long tripId);
```

---

## 🗂️ ERD

<img width="6481" height="2082" alt="ERD" src="https://github.com/user-attachments/assets/653a673c-2a65-4631-92a1-cdea8bf4dfbe" />


---

## 📁 프로젝트 구조

```
my-fullstack-project/
├── backend/                          # Spring Boot
│   ├── src/main/java/forproject/
│   │   └── spring_oauth2_jwt/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       ├── entity/
│   │       ├── jwt/
│   │       ├── oauth2/
│   │       ├── aspect/               
│   │       └── config/
│   └── Dockerfile
├── frontend/                         # Next.js 15
│   ├── app/
│   │   ├── dashboard/
│   │   ├── trip/
│   │   ├── explore/
│   │   ├── invitations/
│   │   └── ...
│   └── Dockerfile
├── nginx/                            
├── docker-compose.prod.yml
└── docker-compose.local.yml
```

---

## 📋 주요 기능

### 🔐 인증 / 인가
- 이메일 인증 기반 회원가입
- Google · Naver 소셜 로그인 (OAuth2)
- JWT 이중 토큰 + RTR(Refresh Token Rotation) 방식
- AOP 커스텀 어노테이션 `@RequiresTripParticipant` 로 여행 멤버 선언적 인가

### 🗺️ 여행 관리
- 여행 플랜 생성·수정·삭제, 공개/비공개(구현 대기)
- 이메일 초대 기반 동행자 관리 (OWNER / MEMBER 권한)
- 일차별 일정·활동 등록 (이동·식사·관광·숙박)
- 항공·숙박·교통·식당·관광지 예약 통합 관리

### 💰 경비 & 정산
- 개인(PERSONAL) / 공동(PARTIAL_SHARED) 지출 구분, 균등·개별 분담
- 공동 경비 계좌 — 1인당 입금액 × 참여자 수 자동 계산, 비관적 락으로 잔액 정합성 보장
- Greedy 알고리즘으로 N명 지출을 최대 N-1건 정산으로 최적화
- 정산 상태 변경(신청→승인/거절) 시 SSE 실시간 알림

### 🔔 실시간 알림
- SSE 기반 정산 요청·승인·거절·초대 알림
- 미접속 사용자 알림 DB 저장 → 로그인 시 일괄 전송
---
