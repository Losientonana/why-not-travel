# Entity 컬럼 및 연관관계 완벽 가이드

> 작성일: 2025-11-11
> 프로젝트: Spring Boot 3.4.5 + JPA Travel Planning Application

---

## 📋 목차

1. [전체 ERD 구조](#전체-erd-구조)
2. [Entity별 상세 분석](#entity별-상세-분석)
3. [연관관계 매핑](#연관관계-매핑)
4. [FK(Foreign Key) 정리](#fkforeign-key-정리)
5. [인덱스 전략](#인덱스-전략)
6. [컬럼 네이밍 규칙](#컬럼-네이밍-규칙)

---

## 전체 ERD 구조

### 테이블 관계도

```
┌─────────────────┐
│   users         │ (사용자)
└────────┬────────┘
         │ 1:N (생성자)
         ↓
┌─────────────────┐
│ travel_plans    │ (여행 계획 - 메인)
└────────┬────────┘
         │
         ├───────→ travel_participants (N) -- 참여자
         │
         ├───────→ travel_itineraries (N) -- 일정
         │              │
         │              └───→ travel_activities (N) -- 세부 활동
         │
         ├───────→ travel_photos (N) -- 사진
         │
         ├───────→ travel_expenses (N) -- 경비
         │
         └───────→ travel_checklists (N) -- 체크리스트
```

### 테이블 개수 및 관계

| 테이블 | 역할 | 관계 | 부모 테이블 |
|--------|------|------|------------|
| `users` | 사용자 | 1:N | - |
| `travel_plans` | 여행 계획 | N:1 | users |
| `travel_participants` | 참여자 | N:1 | travel_plans, users |
| `travel_itineraries` | 일정 | N:1 | travel_plans |
| `travel_activities` | 세부 활동 | N:1 | travel_itineraries |
| `travel_photos` | 사진 | N:1 | travel_plans, users |
| `travel_expenses` | 경비 | N:1 | travel_plans, users |
| `travel_checklists` | 체크리스트 | N:1 | travel_plans, users(선택) |

---

## Entity별 상세 분석

### 1. UserEntity (사용자)

**테이블명**: `users`
**역할**: 시스템 사용자 정보 (OAuth2 로그인)

#### 컬럼 상세

| 컬럼명 | 타입 | 제약조건 | 설명 | 예시 |
|--------|------|----------|------|------|
| `id` | BIGINT | PK, AUTO_INCREMENT | 사용자 고유 ID | 1, 2, 3 |
| `username` | VARCHAR(255) | NOT NULL, UNIQUE | 사용자명 (로그인 ID) | "hong_gildong" |
| `email` | VARCHAR(255) | UNIQUE | 이메일 | "hong@example.com" |
| `name` | VARCHAR(100) | | 실명 | "홍길동" |
| `role` | VARCHAR(20) | NOT NULL | 권한 | "ROLE_USER", "ROLE_ADMIN" |
| `provider` | VARCHAR(20) | | OAuth2 제공자 | "google", "naver" |
| `provider_id` | VARCHAR(255) | | OAuth2 사용자 ID | "1234567890" |
| `created_at` | DATETIME | NOT NULL | 가입 시간 | 2025-11-11 12:00:00 |

#### 연관관계

```java
// 1:N - 생성한 여행 계획
@OneToMany(mappedBy = "user")
private List<TravelPlanEntity> travelPlans;
```

**설명**:
- 한 사용자는 여러 개의 여행 계획을 생성할 수 있음
- `travel_plans.user_id`가 FK

#### 비즈니스 규칙
- OAuth2 로그인 사용자 자동 생성
- `username`은 중복 불가
- `role`은 기본값 "ROLE_USER"

---

### 2. TravelPlanEntity (여행 계획)

**테이블명**: `travel_plans`
**역할**: 여행의 기본 정보 (메인 테이블)

#### 컬럼 상세

| 컬럼명 | 타입 | 제약조건 | 설명 | 예시 |
|--------|------|----------|------|------|
| `id` | BIGINT | PK, AUTO_INCREMENT | 여행 고유 ID | 1, 2, 3 |
| `user_id` | BIGINT | FK, NOT NULL | 생성자 ID | 5 |
| `title` | VARCHAR(255) | NOT NULL | 여행 제목 | "제주도 힐링 여행" |
| `description` | TEXT | | 여행 설명 | "가족과 함께하는 3박 4일..." |
| `start_date` | DATE | NOT NULL | 시작일 | 2025-12-01 |
| `end_date` | DATE | NOT NULL | 종료일 | 2025-12-04 |
| `destination` | VARCHAR(100) | | 목적지 | "제주도" |
| `image_url` | VARCHAR(500) | | 대표 이미지 URL | "http://...jpg" |
| `estimated_cost` | DECIMAL(15,2) | | 예상 비용 | 1500000.00 |
| `visibility` | VARCHAR(20) | NOT NULL, DEFAULT 'PUBLIC' | 공개 여부 | "PUBLIC", "PRIVATE" |
| `is_deleted` | BOOLEAN | NOT NULL, DEFAULT false | 삭제 여부 (Soft Delete) | true, false |
| `tags` | JSON | | 태그 (배열) | ["힐링", "가족여행"] |
| `travel_style` | VARCHAR(30) | ENUM | 여행 스타일 | "HEALING", "ADVENTURE" |
| `budget_level` | VARCHAR(20) | ENUM | 예산 수준 | "BUDGET", "LUXURY" |
| `created_at` | DATETIME | NOT NULL, AUTO | 생성 시간 | 2025-11-11 12:00:00 |

#### Enum 타입 상세

**TravelStyle (여행 스타일)**:
- `HEALING`: 힐링
- `ADVENTURE`: 모험
- `CULTURAL`: 문화 탐방
- `FOOD`: 맛집 투어
- `SHOPPING`: 쇼핑
- `NATURE`: 자연 탐방

**BudgetLevel (예산 수준)**:
- `BUDGET`: 저예산 (백패킹)
- `MODERATE`: 중간 예산
- `LUXURY`: 고급

#### 연관관계

```java
// N:1 - 생성자
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id")
private UserEntity user;

// 1:N - 참여자 (양방향 매핑 안 함, 조회만)
// List<TravelParticipant> participants

// 1:N - 일정
// List<TravelItinerary> itineraries

// 1:N - 사진
// List<TravelPhoto> photos

// 1:N - 경비
// List<TravelExpense> expenses

// 1:N - 체크리스트
// List<TravelChecklist> checklists
```

**설명**:
- 한 여행은 한 명의 생성자(user)를 가짐
- 한 여행은 여러 참여자, 일정, 사진, 경비, 체크리스트를 가질 수 있음
- 양방향 매핑은 하지 않음 (순환 참조 방지)

#### 비즈니스 규칙
- `start_date`는 `end_date`보다 이전이어야 함
- `is_deleted = true`인 경우 조회 시 제외
- `visibility = "PRIVATE"`인 경우 참여자만 조회 가능

---

### 3. TravelParticipant (참여자)

**테이블명**: `travel_participants`
**역할**: 여행 참여자 및 권한 관리

#### 컬럼 상세

| 컬럼명 | 타입 | 제약조건 | 설명 | 예시 |
|--------|------|----------|------|------|
| `id` | BIGINT | PK, AUTO_INCREMENT | 참여자 레코드 ID | 1, 2, 3 |
| `trip_id` | BIGINT | FK, NOT NULL | 여행 ID | 5 |
| `user_id` | BIGINT | FK, NOT NULL | 사용자 ID | 3 |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT 'VIEWER' | 권한 | "OWNER", "EDITOR", "VIEWER" |
| `joined_at` | DATETIME | NOT NULL, AUTO | 참여 시간 | 2025-11-11 12:00:00 |

#### 권한 레벨 상세

| Role | 설명 | 권한 |
|------|------|------|
| `OWNER` | 소유자 (생성자) | 모든 권한 (삭제 포함) |
| `EDITOR` | 편집자 | 일정, 경비, 체크리스트 추가/수정 |
| `VIEWER` | 뷰어 | 읽기만 가능 |

#### 연관관계

```java
// N:1 - 여행
private Long tripId;  // FK만 저장 (Entity 참조 X)

// N:1 - 사용자
private Long userId;  // FK만 저장 (Entity 참조 X)
```

**설명**:
- 연관관계를 Entity 참조가 아닌 ID로만 관리 (성능 최적화)
- `@ManyToOne` 사용하지 않음

#### 유니크 제약조건

```sql
UNIQUE KEY `unique_trip_user` (`trip_id`, `user_id`)
```

**의미**: 한 사용자는 한 여행에 한 번만 참여 가능

#### 비즈니스 규칙
- 여행 생성 시 생성자는 자동으로 `OWNER` 역할로 참여자 추가
- 한 여행에 최소 1명의 `OWNER` 필수
- `OWNER`는 다른 참여자 초대/삭제 가능
- `EDITOR`는 데이터 수정 가능하지만 참여자 관리 불가

---

### 4. TravelItinerary (일정)

**테이블명**: `travel_itineraries`
**역할**: 여행의 날짜별 일정 (1일차, 2일차...)

#### 컬럼 상세

| 컬럼명 | 타입 | 제약조건 | 설명 | 예시 |
|--------|------|----------|------|------|
| `id` | BIGINT | PK, AUTO_INCREMENT | 일정 고유 ID | 1, 2, 3 |
| `trip_id` | BIGINT | FK, NOT NULL | 여행 ID | 5 |
| `day_number` | INT | NOT NULL | 일차 번호 | 1, 2, 3 |
| `date` | DATE | NOT NULL | 해당 날짜 | 2025-12-01 |
| `title` | VARCHAR(255) | | 일정 제목 | "제주 도착 및 숙소 체크인" |
| `notes` | TEXT | | 메모 | "렌터카는 공항에서 픽업" |
| `created_at` | DATETIME | NOT NULL, AUTO | 생성 시간 | 2025-11-11 12:00:00 |

#### 연관관계

```java
// N:1 - 여행
private Long tripId;  // FK만 저장

// 1:N - 세부 활동
// List<TravelActivity> activities
```

**설명**:
- 하나의 일정(Itinerary)은 여러 개의 세부 활동(Activity)을 가짐
- `day_number`와 `date`는 같이 저장하여 편의성 제공

#### 유니크 제약조건

```sql
UNIQUE KEY `unique_trip_day` (`trip_id`, `day_number`)
```

**의미**: 한 여행에서 같은 일차는 중복 불가

#### 비즈니스 규칙
- `day_number`는 1부터 시작
- `date`는 여행의 `start_date`와 `end_date` 사이여야 함
- 일정 삭제 시 해당 일정의 모든 세부 활동도 삭제 (CASCADE)

---

### 5. TravelActivity (세부 활동)

**테이블명**: `travel_activities`
**역할**: 각 일정의 시간별 세부 활동 (09:00 공항 도착, 14:00 호텔 체크인 등)

#### 컬럼 상세

| 컬럼명 | 타입 | 제약조건 | 설명 | 예시 |
|--------|------|----------|------|------|
| `id` | BIGINT | PK, AUTO_INCREMENT | 활동 고유 ID | 1, 2, 3 |
| `itinerary_id` | BIGINT | FK, NOT NULL | 일정 ID | 7 |
| `time` | TIME | | 시간 | 09:00:00 |
| `title` | VARCHAR(255) | NOT NULL | 활동 제목 | "공항 도착" |
| `location` | VARCHAR(255) | | 장소 | "제주국제공항" |
| `activity_type` | VARCHAR(50) | | 활동 타입 | "TRANSPORT" |
| `duration_minutes` | INT | | 소요 시간 (분) | 120 |
| `cost` | DECIMAL(15,2) | DEFAULT 0 | 비용 | 50000.00 |
| `notes` | TEXT | | 메모 | "미리 체크인하면 빠름" |
| `display_order` | INT | NOT NULL, DEFAULT 0 | 표시 순서 | 0, 1, 2 |
| `created_at` | DATETIME | NOT NULL, AUTO | 생성 시간 | 2025-11-11 12:00:00 |

#### 활동 타입 (activity_type) 상세

| 타입 | 한글 | 설명 | 아이콘 예시 |
|------|------|------|------------|
| `TRANSPORT` | 이동 | 교통 수단 이용 | 🚗 🚌 ✈️ |
| `FOOD` | 식사 | 식사 및 카페 | 🍽️ ☕ |
| `ACTIVITY` | 활동 | 관광, 액티비티 | 🎭 🏊 🎿 |
| `ACCOMMODATION` | 숙박 | 호텔 체크인/아웃 | 🏨 |
| `REST` | 휴식 | 자유 시간 | 😴 |

#### 연관관계

```java
// N:1 - 일정
private Long itineraryId;  // FK만 저장
```

**설명**:
- 하나의 세부 활동은 하나의 일정에 속함
- `display_order`로 같은 일정 내 활동 순서 관리

#### 인덱스

```sql
INDEX `idx_itinerary_order` (`itinerary_id`, `display_order`)
```

**이유**: 일정별 활동 조회 시 정렬 성능 향상

#### 비즈니스 규칙
- `time`이 null이면 시간 미정
- `display_order`로 정렬하되, 같은 순서면 `time` 기준 정렬
- `cost` 합계로 일정별 예상 비용 계산 가능

---

### 6. TravelPhoto (사진)

**테이블명**: `travel_photos`
**역할**: 여행 중 촬영한 사진 관리

#### 컬럼 상세

| 컬럼명 | 타입 | 제약조건 | 설명 | 예시 |
|--------|------|----------|------|------|
| `id` | BIGINT | PK, AUTO_INCREMENT | 사진 고유 ID | 1, 2, 3 |
| `trip_id` | BIGINT | FK, NOT NULL | 여행 ID | 5 |
| `user_id` | BIGINT | FK, NOT NULL | 업로드한 사용자 ID | 3 |
| `image_url` | VARCHAR(500) | NOT NULL | 이미지 URL | "http://cdn.../photo.jpg" |
| `caption` | TEXT | | 사진 설명 | "한라산 정상에서" |
| `taken_at` | DATE | | 촬영 날짜 | 2025-12-02 |
| `likes_count` | INT | NOT NULL, DEFAULT 0 | 좋아요 개수 (캐시) | 15 |
| `created_at` | DATETIME | NOT NULL, AUTO | 업로드 시간 | 2025-11-11 12:00:00 |

#### 연관관계

```java
// N:1 - 여행
private Long tripId;  // FK만 저장

// N:1 - 업로드 사용자
private Long userId;  // FK만 저장
```

**설명**:
- 한 사진은 한 여행에 속함
- 한 사진은 한 명의 사용자가 업로드

#### 인덱스

```sql
INDEX `idx_trip_taken` (`trip_id`, `taken_at` DESC)
```

**이유**: 여행별 사진 조회 시 촬영 날짜 역순 정렬

#### 비즈니스 규칙
- `taken_at`이 null이면 업로드 시간(`created_at`)을 기본값으로 사용
- `likes_count`는 캐시 필드 (실제 좋아요는 별도 테이블에서 관리하고, 여기는 성능을 위한 카운트)
- 사진 삭제 시 실제 파일도 S3에서 삭제 필요

---

### 7. TravelExpense (경비)

**테이블명**: `travel_expenses`
**역할**: 여행 중 발생한 지출 기록

#### 컬럼 상세

| 컬럼명 | 타입 | 제약조건 | 설명 | 예시 |
|--------|------|----------|------|------|
| `id` | BIGINT | PK, AUTO_INCREMENT | 경비 고유 ID | 1, 2, 3 |
| `trip_id` | BIGINT | FK, NOT NULL | 여행 ID | 5 |
| `category` | VARCHAR(50) | NOT NULL | 카테고리 | "TRANSPORT" |
| `item` | VARCHAR(255) | NOT NULL | 항목명 | "제주 - 서울 항공권" |
| `amount` | DECIMAL(15,2) | NOT NULL | 금액 | 180000.00 |
| `paid_by_user_id` | BIGINT | FK | 지불한 사용자 ID | 3 |
| `expense_date` | DATE | NOT NULL | 지출 날짜 | 2025-12-01 |
| `notes` | TEXT | | 메모 | "카드 할인 적용" |
| `created_at` | DATETIME | NOT NULL, AUTO | 등록 시간 | 2025-11-11 12:00:00 |

#### 카테고리 (category) 상세

| 카테고리 | 한글 | 설명 | 예시 |
|----------|------|------|------|
| `TRANSPORT` | 교통 | 교통비 | 항공권, 버스, 택시, 렌터카 |
| `FOOD` | 식비 | 식사 및 음료 | 레스토랑, 카페, 편의점 |
| `ACCOMMODATION` | 숙박 | 숙박비 | 호텔, 펜션, 게스트하우스 |
| `ACTIVITY` | 활동 | 액티비티 비용 | 입장료, 체험료, 투어 |
| `ETC` | 기타 | 기타 지출 | 쇼핑, 기념품, 예상치 못한 지출 |

#### 연관관계

```java
// N:1 - 여행
private Long tripId;  // FK만 저장

// N:1 - 지불 사용자
private Long paidByUserId;  // FK만 저장 (nullable)
```

**설명**:
- 한 경비는 한 여행에 속함
- `paidByUserId`가 null이면 공동 지출

#### 인덱스

```sql
INDEX `idx_trip_date` (`trip_id`, `expense_date` DESC)
INDEX `idx_paid_by` (`paid_by_user_id`)
```

**이유**:
- 여행별 경비 조회 시 날짜 역순 정렬
- 사용자별 지출 조회 (정산 기능)

#### 비즈니스 규칙
- `amount`는 항상 양수
- `paid_by_user_id`가 null이면 전체 공동 지출 (예: 숙박비를 모두가 나눠냄)
- `expense_date`는 여행 기간 내여야 함
- 카테고리별 합계로 지출 분석 가능

---

### 8. TravelChecklist (체크리스트)

**테이블명**: `travel_checklists`
**역할**: 여행 준비물 및 할 일 관리

#### 컬럼 상세

| 컬럼명 | 타입 | 제약조건 | 설명 | 예시 |
|--------|------|----------|------|------|
| `id` | BIGINT | PK, AUTO_INCREMENT | 체크리스트 ID | 1, 2, 3 |
| `trip_id` | BIGINT | FK, NOT NULL | 여행 ID | 5 |
| `task` | TEXT | NOT NULL | 체크리스트 내용 | "여권 유효기간 확인" |
| `completed` | BOOLEAN | NOT NULL, DEFAULT false | 완료 여부 | true, false |
| `assignee_user_id` | BIGINT | FK, NULL | 담당자 ID | 3 |
| `completed_at` | DATETIME | | 완료 시간 | 2025-11-15 14:30:00 |
| `display_order` | INT | NOT NULL, DEFAULT 0 | 표시 순서 | 0, 1, 2 |
| `created_at` | DATETIME | NOT NULL, AUTO | 생성 시간 | 2025-11-11 12:00:00 |

#### 연관관계

```java
// N:1 - 여행
private Long tripId;  // FK만 저장

// N:1 - 담당자 (선택)
private Long assigneeUserId;  // FK만 저장 (nullable)
```

**설명**:
- 한 체크리스트는 한 여행에 속함
- `assigneeUserId`가 null이면 담당자 미지정

#### 인덱스

```sql
INDEX `idx_trip_order` (`trip_id`, `display_order`)
INDEX `idx_trip_completed` (`trip_id`, `completed`)
```

**이유**:
- 여행별 체크리스트 순서대로 조회
- 완료/미완료 필터링

#### 비즈니스 규칙
- `completed = true`인 경우 `completed_at` 필수
- `completed = false`로 변경 시 `completed_at = null`
- `display_order`로 우선순위 관리 (낮을수록 높은 우선순위)
- `assignee_user_id`는 여행 참여자 중 한 명이어야 함

---

## 연관관계 매핑

### 1. User → TravelPlan (1:N)

```
users (1) ─────────────→ travel_plans (N)
  └─ id                      └─ user_id (FK)
```

**관계**: 한 사용자는 여러 여행을 생성할 수 있음

**조인 쿼리**:
```sql
SELECT tp.*
FROM travel_plans tp
INNER JOIN users u ON tp.user_id = u.id
WHERE u.id = 5;
```

---

### 2. TravelPlan → TravelParticipant (1:N)

```
travel_plans (1) ───────→ travel_participants (N)
  └─ id                      └─ trip_id (FK)
```

**관계**: 한 여행은 여러 참여자를 가질 수 있음

**조인 쿼리**:
```sql
SELECT u.username, tp.role, tp.joined_at
FROM travel_participants tp
INNER JOIN users u ON tp.user_id = u.id
WHERE tp.trip_id = 5;
```

---

### 3. TravelPlan → TravelItinerary (1:N)

```
travel_plans (1) ───────→ travel_itineraries (N)
  └─ id                      └─ trip_id (FK)
```

**관계**: 한 여행은 여러 일정을 가질 수 있음

**조인 쿼리**:
```sql
SELECT *
FROM travel_itineraries
WHERE trip_id = 5
ORDER BY day_number;
```

---

### 4. TravelItinerary → TravelActivity (1:N)

```
travel_itineraries (1) ───────→ travel_activities (N)
  └─ id                           └─ itinerary_id (FK)
```

**관계**: 한 일정은 여러 세부 활동을 가질 수 있음

**조인 쿼리**:
```sql
SELECT ta.*
FROM travel_activities ta
INNER JOIN travel_itineraries ti ON ta.itinerary_id = ti.id
WHERE ti.trip_id = 5
ORDER BY ti.day_number, ta.display_order;
```

---

### 5. TravelPlan → TravelPhoto (1:N)

```
travel_plans (1) ───────→ travel_photos (N)
  └─ id                      └─ trip_id (FK)
```

**관계**: 한 여행은 여러 사진을 가질 수 있음

**조인 쿼리**:
```sql
SELECT tp.*, u.username as uploader_name
FROM travel_photos tp
INNER JOIN users u ON tp.user_id = u.id
WHERE tp.trip_id = 5
ORDER BY tp.taken_at DESC;
```

---

### 6. TravelPlan → TravelExpense (1:N)

```
travel_plans (1) ───────→ travel_expenses (N)
  └─ id                      └─ trip_id (FK)
```

**관계**: 한 여행은 여러 경비를 가질 수 있음

**조인 쿼리**:
```sql
SELECT te.*, u.username as paid_by_name
FROM travel_expenses te
LEFT JOIN users u ON te.paid_by_user_id = u.id
WHERE te.trip_id = 5
ORDER BY te.expense_date DESC;
```

---

### 7. TravelPlan → TravelChecklist (1:N)

```
travel_plans (1) ───────→ travel_checklists (N)
  └─ id                      └─ trip_id (FK)
```

**관계**: 한 여행은 여러 체크리스트를 가질 수 있음

**조인 쿼리**:
```sql
SELECT tc.*, u.username as assignee_name
FROM travel_checklists tc
LEFT JOIN users u ON tc.assignee_user_id = u.id
WHERE tc.trip_id = 5
ORDER BY tc.display_order;
```

---

## FK(Foreign Key) 정리

### 전체 FK 목록

| 자식 테이블 | FK 컬럼 | 부모 테이블 | 부모 컬럼 | ON DELETE | 설명 |
|------------|---------|------------|----------|-----------|------|
| `travel_plans` | `user_id` | `users` | `id` | CASCADE | 사용자 삭제 시 여행도 삭제 |
| `travel_participants` | `trip_id` | `travel_plans` | `id` | CASCADE | 여행 삭제 시 참여자도 삭제 |
| `travel_participants` | `user_id` | `users` | `id` | CASCADE | 사용자 삭제 시 참여 기록 삭제 |
| `travel_itineraries` | `trip_id` | `travel_plans` | `id` | CASCADE | 여행 삭제 시 일정도 삭제 |
| `travel_activities` | `itinerary_id` | `travel_itineraries` | `id` | CASCADE | 일정 삭제 시 활동도 삭제 |
| `travel_photos` | `trip_id` | `travel_plans` | `id` | CASCADE | 여행 삭제 시 사진도 삭제 |
| `travel_photos` | `user_id` | `users` | `id` | SET NULL | 사용자 삭제 시 NULL 설정 |
| `travel_expenses` | `trip_id` | `travel_plans` | `id` | CASCADE | 여행 삭제 시 경비도 삭제 |
| `travel_expenses` | `paid_by_user_id` | `users` | `id` | SET NULL | 사용자 삭제 시 NULL 설정 |
| `travel_checklists` | `trip_id` | `travel_plans` | `id` | CASCADE | 여행 삭제 시 체크리스트도 삭제 |
| `travel_checklists` | `assignee_user_id` | `users` | `id` | SET NULL | 사용자 삭제 시 NULL 설정 |

### ON DELETE 전략 설명

**CASCADE**:
- 부모 레코드 삭제 시 자식 레코드도 자동 삭제
- 예: 여행 삭제 시 관련 모든 데이터 삭제

**SET NULL**:
- 부모 레코드 삭제 시 FK를 NULL로 설정
- 예: 사용자 탈퇴 시 사진은 남기되 업로더 정보만 제거

---

## 인덱스 전략

### 기본 인덱스 (자동 생성)

```sql
-- PK는 자동으로 클러스터드 인덱스 생성
PRIMARY KEY (id)

-- FK는 자동으로 인덱스 생성 (MySQL 8.0+)
INDEX `fk_user_id` (user_id)
INDEX `fk_trip_id` (trip_id)
```

### 복합 인덱스 (성능 최적화용)

| 테이블 | 인덱스명 | 컬럼 | 용도 |
|--------|----------|------|------|
| `travel_participants` | `idx_trip_user` | `(trip_id, user_id)` | 참여자 중복 체크, 권한 조회 |
| `travel_itineraries` | `idx_trip_day` | `(trip_id, day_number)` | 일정 순서대로 조회 |
| `travel_activities` | `idx_itinerary_order` | `(itinerary_id, display_order)` | 활동 순서대로 조회 |
| `travel_photos` | `idx_trip_taken` | `(trip_id, taken_at DESC)` | 사진 날짜 역순 조회 |
| `travel_expenses` | `idx_trip_date` | `(trip_id, expense_date DESC)` | 경비 날짜 역순 조회 |
| `travel_checklists` | `idx_trip_order` | `(trip_id, display_order)` | 체크리스트 순서 조회 |
| `travel_checklists` | `idx_trip_completed` | `(trip_id, completed)` | 완료/미완료 필터링 |

### 인덱스 설계 원칙

1. **WHERE 절에 자주 사용되는 컬럼**: 인덱스 생성
2. **ORDER BY에 자주 사용되는 컬럼**: 복합 인덱스에 포함
3. **복합 인덱스 순서**: 카디널리티 높은 컬럼 먼저
4. **인덱스 컬럼 개수**: 2-3개 이내 권장

---

## 컬럼 네이밍 규칙

### 기본 규칙

```
1. snake_case 사용 (MySQL 표준)
   ✅ user_id
   ❌ userId, UserID

2. 예약어 피하기
   ✅ item_order
   ❌ order

3. 명확한 의미
   ✅ created_at
   ❌ date1, dt

4. FK 네이밍
   ✅ user_id (부모 테이블명_id)
   ❌ uid, user
```

### 타입별 접미사

| 타입 | 접미사 | 예시 |
|------|--------|------|
| 날짜 | `_date` | `start_date`, `expense_date` |
| 시간 | `_at` | `created_at`, `joined_at` |
| 시각 (TIME) | `_time` | `departure_time` |
| 불린 | `is_`, `has_` | `is_deleted`, `has_photo` |
| 개수 | `_count` | `likes_count`, `member_count` |
| 금액 | `_cost`, `_amount` | `estimated_cost`, `total_amount` |
| URL | `_url` | `image_url`, `profile_url` |
| ID(FK) | `_id` | `user_id`, `trip_id` |

### 예약어 회피 전략

```sql
-- 예약어 사용 시 백틱으로 감싸기
SELECT `order`, `rank`, `level` FROM ...

-- 또는 다른 이름 사용
item_order (O)
order (X)

task_rank (O)
rank (X)
```

---

## 데이터 예시

### 전체 데이터 흐름 예시

```sql
-- 1. 사용자 생성
INSERT INTO users (username, email, name, role)
VALUES ('hong_gildong', 'hong@example.com', '홍길동', 'ROLE_USER');
-- id = 1

-- 2. 여행 생성
INSERT INTO travel_plans (user_id, title, start_date, end_date, destination)
VALUES (1, '제주도 힐링 여행', '2025-12-01', '2025-12-04', '제주도');
-- id = 5

-- 3. 참여자 추가 (생성자는 자동으로 OWNER)
INSERT INTO travel_participants (trip_id, user_id, role)
VALUES (5, 1, 'OWNER');
-- id = 10

-- 4. 친구 초대
INSERT INTO travel_participants (trip_id, user_id, role)
VALUES (5, 2, 'EDITOR'), (5, 3, 'VIEWER');

-- 5. 1일차 일정 생성
INSERT INTO travel_itineraries (trip_id, day_number, date, title)
VALUES (5, 1, '2025-12-01', '제주 도착 및 숙소 체크인');
-- id = 7

-- 6. 세부 활동 추가
INSERT INTO travel_activities (itinerary_id, time, title, location, activity_type, display_order)
VALUES
  (7, '09:00', '공항 도착', '제주국제공항', 'TRANSPORT', 0),
  (7, '11:00', '렌터카 픽업', '제주공항 렌터카', 'TRANSPORT', 1),
  (7, '14:00', '호텔 체크인', '제주 힐튼 호텔', 'ACCOMMODATION', 2);

-- 7. 체크리스트 추가
INSERT INTO travel_checklists (trip_id, task, assignee_user_id, display_order)
VALUES
  (5, '여권 유효기간 확인', 1, 0),
  (5, '렌터카 예약', 2, 1),
  (5, '숙소 예약 확인', 1, 2);

-- 8. 경비 추가
INSERT INTO travel_expenses (trip_id, category, item, amount, paid_by_user_id, expense_date)
VALUES
  (5, 'TRANSPORT', '제주 항공권', 180000, 1, '2025-12-01'),
  (5, 'ACCOMMODATION', '호텔 숙박비 (3박)', 450000, 2, '2025-12-01');

-- 9. 사진 업로드
INSERT INTO travel_photos (trip_id, user_id, image_url, caption, taken_at)
VALUES (5, 1, 'https://cdn.../jeju.jpg', '제주 공항 도착!', '2025-12-01');
```

---

## 쿼리 예시 모음

### 1. 여행 상세 정보 조회 (참여자 포함)

```sql
SELECT
  tp.*,
  u.username as creator_name,
  (SELECT COUNT(*) FROM travel_participants WHERE trip_id = tp.id) as participant_count,
  (SELECT COUNT(*) FROM travel_itineraries WHERE trip_id = tp.id) as itinerary_count,
  (SELECT COUNT(*) FROM travel_photos WHERE trip_id = tp.id) as photo_count,
  (SELECT COUNT(*) FROM travel_checklists WHERE trip_id = tp.id AND completed = true) as completed_checklist_count,
  (SELECT COUNT(*) FROM travel_checklists WHERE trip_id = tp.id) as total_checklist_count,
  (SELECT SUM(amount) FROM travel_expenses WHERE trip_id = tp.id) as total_expenses
FROM travel_plans tp
INNER JOIN users u ON tp.user_id = u.id
WHERE tp.id = 5 AND tp.is_deleted = false;
```

### 2. 일정 + 활동 조회 (N+1 방지)

```sql
-- 1단계: 모든 일정 조회
SELECT * FROM travel_itineraries WHERE trip_id = 5 ORDER BY day_number;

-- 2단계: 모든 활동 조회 (IN 절 사용)
SELECT * FROM travel_activities
WHERE itinerary_id IN (7, 8, 9, 10)
ORDER BY itinerary_id, display_order;
```

### 3. 참여자 목록 조회 (사용자 정보 포함)

```sql
SELECT
  tp.id as participant_id,
  tp.role,
  tp.joined_at,
  u.id as user_id,
  u.username,
  u.email
FROM travel_participants tp
INNER JOIN users u ON tp.user_id = u.id
WHERE tp.trip_id = 5
ORDER BY
  CASE tp.role
    WHEN 'OWNER' THEN 1
    WHEN 'EDITOR' THEN 2
    WHEN 'VIEWER' THEN 3
  END,
  tp.joined_at;
```

### 4. 체크리스트 진행률 조회

```sql
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) as completed,
  ROUND(SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM travel_checklists
WHERE trip_id = 5;
```

### 5. 카테고리별 지출 합계

```sql
SELECT
  category,
  COUNT(*) as count,
  SUM(amount) as total_amount,
  ROUND(SUM(amount) * 100.0 / (SELECT SUM(amount) FROM travel_expenses WHERE trip_id = 5), 2) as percentage
FROM travel_expenses
WHERE trip_id = 5
GROUP BY category
ORDER BY total_amount DESC;
```

### 6. 사용자별 지출 정산

```sql
SELECT
  u.username,
  COUNT(*) as expense_count,
  SUM(te.amount) as total_paid
FROM travel_expenses te
INNER JOIN users u ON te.paid_by_user_id = u.id
WHERE te.trip_id = 5
GROUP BY u.id, u.username
ORDER BY total_paid DESC;
```

### 7. 날짜별 사진 그룹핑

```sql
SELECT
  taken_at,
  COUNT(*) as photo_count
FROM travel_photos
WHERE trip_id = 5
GROUP BY taken_at
ORDER BY taken_at;
```

---

## 요약

### 테이블 관계 요약

```
users (1) ─────────→ travel_plans (N)
                          │
                          ├───→ travel_participants (N) ←─── users (N)
                          │
                          ├───→ travel_itineraries (N)
                          │          │
                          │          └───→ travel_activities (N)
                          │
                          ├───→ travel_photos (N) ←─── users (N)
                          │
                          ├───→ travel_expenses (N) ←─── users (N)
                          │
                          └───→ travel_checklists (N) ←─── users (N)
```

### 핵심 포인트

1. **TravelPlan이 중심**: 모든 여행 데이터는 travel_plans를 기준으로 연결
2. **FK는 ID만 저장**: Entity 참조 대신 Long 타입 ID로 관리 (성능 최적화)
3. **Soft Delete**: travel_plans는 `is_deleted` 플래그 사용
4. **CASCADE 전략**: 여행 삭제 시 관련 데이터 모두 삭제
5. **SET NULL 전략**: 사용자 삭제 시 데이터는 유지, 참조만 제거
6. **복합 인덱스**: 조회 성능을 위해 (trip_id, 정렬컬럼) 형태로 생성
7. **N+1 방지**: `IN` 절 + `Collectors.groupingBy` 패턴 사용

---

끝!
