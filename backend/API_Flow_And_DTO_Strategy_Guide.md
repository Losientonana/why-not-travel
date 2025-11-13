# API 흐름 및 DTO 전략 완벽 가이드

> 작성일: 2025-11-11
> 프로젝트: Spring Boot 3.4.5 + JPA Travel Planning Application

---

## 📋 목차

1. [프로젝트 전체 API 맵](#프로젝트-전체-api-맵)
2. [각 기능별 레이어 흐름](#각-기능별-레이어-흐름)
3. [DTO 설계 철학](#dto-설계-철학)
4. [Request DTO vs Response DTO](#request-dto-vs-response-dto)
5. [DTO 재사용 전략](#dto-재사용-전략)
6. [실무 표준 패턴](#실무-표준-패턴)
7. [안티패턴과 해결책](#안티패턴과-해결책)

---

## 프로젝트 전체 API 맵

### API 엔드포인트 전체 구조

```
┌─────────────────────────────────────────────────────────┐
│                    TravelPlanController                  │
│                  (/api/trips)                            │
└─────────────────────────────────────────────────────────┘

📝 여행 계획 (TravelPlan)
├─ POST   /api/trips                          여행 생성
├─ GET    /api/trips                          내 여행 목록
├─ GET    /api/trips/{tripId}/detail          여행 상세 정보
├─ PUT    /api/trips/{tripId}                 여행 수정 (미구현)
└─ DELETE /api/trips/{tripId}                 여행 삭제 (미구현)

📅 일정 (Itinerary)
├─ GET    /api/trips/{tripId}/itineraries     일정 목록 조회
├─ POST   /api/trips/detail/itineraries       일정 생성 (미구현)
├─ PUT    /api/trips/detail/itineraries/{id}  일정 수정 (미구현)
└─ DELETE /api/trips/detail/itineraries/{id}  일정 삭제 (미구현)

🎯 활동 (Activity)
├─ GET    /api/trips/{tripId}/activities      활동 목록 조회 (미구현)
├─ POST   /api/trips/detail/activities        활동 생성 (미구현)
├─ PUT    /api/trips/detail/activities/{id}   활동 수정 (미구현)
└─ DELETE /api/trips/detail/activities/{id}   활동 삭제 (미구현)

📷 사진 (Photo)
├─ GET    /api/trips/{tripId}/photos          사진 목록 조회
├─ POST   /api/trips/detail/photos            사진 업로드 (미구현)
└─ DELETE /api/trips/detail/photos/{id}       사진 삭제 (미구현)

💰 경비 (Expense)
├─ GET    /api/trips/{tripId}/expenses        경비 목록 조회
├─ POST   /api/trips/detail/expenses          경비 추가 (미구현)
├─ PUT    /api/trips/detail/expenses/{id}     경비 수정 (미구현)
└─ DELETE /api/trips/detail/expenses/{id}     경비 삭제 (미구현)

✅ 체크리스트 (Checklist)
├─ GET    /api/trips/{tripId}/checklists      체크리스트 조회
├─ POST   /api/trips/detail/checklists        체크리스트 생성 ✅ 완성
├─ PUT    /api/trips/detail/checklists/{id}   체크리스트 수정 (미구현)
└─ DELETE /api/trips/detail/checklists/{id}   체크리스트 삭제 (미구현)
```

---

## 각 기능별 레이어 흐름

### 1. 여행 생성 (POST /api/trips)

#### 전체 흐름도

```
[Client]
   │
   │ JSON Request Body
   ↓
┌─────────────────────────────────────────┐
│ TravelPlanController.create()           │
│ - @RequestBody TravelPlanCreateRequest  │ ← Request DTO
│ - @AuthenticationPrincipal UserPrincipal│ ← 인증 정보
└─────────────────────────────────────────┘
   │
   │ DTO 전달
   ↓
┌─────────────────────────────────────────┐
│ TravelPlanService.createTravelPlan()    │
│ - UserRepository (사용자 조회)          │ ← Repository
│ - TravelPlanEntity 생성                 │ ← Entity
│ - TravelPlanRepository.save()           │ ← Repository
└─────────────────────────────────────────┘
   │
   │ Entity → Response DTO 변환
   ↓
┌─────────────────────────────────────────┐
│ TravelPlanResponse 반환                 │ ← Response DTO
│ - ApiResponse로 감싸기                  │ ← 공통 래퍼
└─────────────────────────────────────────┘
   │
   │ JSON Response
   ↓
[Client]
```

#### 사용된 DTO/Entity

| 레이어 | 사용 객체 | 타입 | 역할 |
|--------|----------|------|------|
| **Controller** | `TravelPlanCreateRequestDTO` | Request DTO | 클라이언트 입력 데이터 |
| **Controller** | `UserPrincipal` | 인증 DTO | JWT에서 추출한 사용자 정보 |
| **Service** | `UserEntity` | Entity | 사용자 조회 |
| **Service** | `TravelPlanEntity` | Entity | 여행 계획 생성 및 저장 |
| **Repository** | `TravelPlanRepository` | JPA Repository | DB CRUD |
| **Service** | `TravelPlanResponse` | Response DTO | 클라이언트 응답 데이터 |
| **Controller** | `ApiResponse<TravelPlanResponse>` | 공통 래퍼 | 통일된 API 응답 |

#### 상세 코드 흐름

**1단계: Controller - 요청 받기**
```java
@PostMapping
public ResponseEntity<ApiResponse<TravelPlanResponse>> create(
    @RequestBody @Valid TravelPlanCreateRequestDTO req,  // ← Request DTO
    @AuthenticationPrincipal UserPrincipal user           // ← 인증 정보
) {
    // Service 호출
    TravelPlanResponse result = travelPlanService.createTravelPlan(req, user.getId());

    // 응답
    return ResponseEntity.ok(ApiResponse.success(result, "여행 계획이 생성되었습니다"));
}
```

**2단계: Service - 비즈니스 로직**
```java
@Transactional
public TravelPlanResponse createTravelPlan(TravelPlanCreateRequestDTO req, Long userId) {
    // 1. 사용자 조회
    UserEntity user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

    // 2. Entity 생성
    TravelPlanEntity entity = TravelPlanEntity.builder()
        .title(req.getTitle())
        .startDate(req.getStartDate())
        .endDate(req.getEndDate())
        .user(user)
        // ... 기타 필드
        .build();

    // 3. DB 저장
    TravelPlanEntity saved = travelPlanRepository.save(entity);

    // 4. Entity → Response DTO 변환
    TravelPlanResponse response = new TravelPlanResponse();
    response.setId(saved.getId());
    response.setTitle(saved.getTitle());
    // ... 기타 필드

    return response;
}
```

**3단계: Repository - DB 접근**
```java
public interface TravelPlanRepository extends JpaRepository<TravelPlanEntity, Long> {
    // save() 메서드 자동 제공
}
```

---

### 2. 여행 목록 조회 (GET /api/trips)

#### 전체 흐름도

```
[Client]
   │
   │ GET /api/trips
   ↓
┌─────────────────────────────────────────┐
│ TravelPlanController.myPlans()          │
│ - @AuthenticationPrincipal UserPrincipal│
└─────────────────────────────────────────┘
   │
   │ userId 전달
   ↓
┌─────────────────────────────────────────┐
│ TravelPlanService.listMyPlans()         │
│ - TravelPlanRepository (여행 조회)      │
│ - TravelParticipantRepository (참여 조회)│
└─────────────────────────────────────────┘
   │
   │ Entity → Response DTO 변환
   ↓
┌─────────────────────────────────────────┐
│ List<TravelPlanResponse> 반환           │
└─────────────────────────────────────────┘
   │
   │ JSON Array
   ↓
[Client]
```

#### 사용된 DTO/Entity

| 레이어 | 사용 객체 | 타입 | 역할 |
|--------|----------|------|------|
| **Controller** | `UserPrincipal` | 인증 DTO | 현재 사용자 정보 |
| **Service** | `TravelPlanEntity` | Entity | 여행 계획 조회 |
| **Service** | `TravelParticipant` | Entity | 참여자 정보 조회 |
| **Repository** | `TravelPlanRepository` | JPA Repository | 여행 조회 |
| **Repository** | `TravelParticipantRepository` | JPA Repository | 참여자 조회 |
| **Service** | `TravelPlanResponse` | Response DTO | 목록 응답 데이터 |

---

### 3. 여행 상세 조회 (GET /api/trips/{tripId}/detail)

#### 전체 흐름도

```
[Client]
   │
   │ GET /api/trips/5/detail
   ↓
┌─────────────────────────────────────────┐
│ TravelPlanController.getPlanDetail()    │
│ - @PathVariable tripId                  │
│ - @AuthenticationPrincipal UserPrincipal│
└─────────────────────────────────────────┘
   │
   │ tripId, userId 전달
   ↓
┌─────────────────────────────────────────┐
│ TravelPlanService.getTravelDetail()     │
│ - TravelPlanRepository (여행 조회)      │
│ - TravelParticipantRepository (참여자)  │
│ - ItineraryRepository (일정 개수)       │
│ - PhotoRepository (사진 개수)           │
│ - ChecklistRepository (체크리스트 통계) │
│ - ExpenseRepository (총 지출)           │
└─────────────────────────────────────────┘
   │
   │ 통합 DTO 생성
   ↓
┌─────────────────────────────────────────┐
│ TravelDetailResponse 반환               │
│ - 기본 정보                             │
│ - 참여자 목록 (ParticipantDTO)          │
│ - 통계 정보 (TravelStatisticsDTO)       │
└─────────────────────────────────────────┘
   │
   │ JSON
   ↓
[Client]
```

#### 사용된 DTO/Entity

| 레이어 | 사용 객체 | 타입 | 역할 |
|--------|----------|------|------|
| **Controller** | `UserPrincipal` | 인증 DTO | 현재 사용자 |
| **Service** | `TravelPlanEntity` | Entity | 여행 정보 |
| **Service** | `TravelParticipant` | Entity | 참여자 정보 |
| **Service** | `UserEntity` | Entity | 참여자 상세 정보 |
| **Service** | `TravelDetailResponse` | Response DTO | 통합 응답 |
| **Service** | `ParticipantDTO` | 내부 DTO | 참여자 정보 |
| **Service** | `TravelStatisticsDTO` | 내부 DTO | 통계 정보 |

---

### 4. 일정 조회 (GET /api/trips/{tripId}/itineraries)

#### 전체 흐름도

```
[Client]
   │
   │ GET /api/trips/5/itineraries
   ↓
┌─────────────────────────────────────────┐
│ TravelPlanController.getItineraries()   │
│ - @PathVariable tripId                  │
└─────────────────────────────────────────┘
   │
   │ tripId 전달
   ↓
┌─────────────────────────────────────────┐
│ TravelPlanService.getItineraries()      │
│ - TravelItineraryRepository (일정 조회) │
│ - TravelActivityRepository (활동 조회)  │
│ - N+1 방지 (일괄 조회 + groupingBy)     │
└─────────────────────────────────────────┘
   │
   │ Entity → Response DTO 변환
   ↓
┌─────────────────────────────────────────┐
│ List<ItineraryResponse> 반환            │
│ - activities 중첩 (ActivityResponse)    │
└─────────────────────────────────────────┘
   │
   │ JSON Array
   ↓
[Client]
```

#### 사용된 DTO/Entity

| 레이어 | 사용 객체 | 타입 | 역할 |
|--------|----------|------|------|
| **Service** | `TravelItinerary` | Entity | 일정 정보 |
| **Service** | `TravelActivity` | Entity | 세부 활동 정보 |
| **Repository** | `TravelItineraryRepository` | JPA Repository | 일정 조회 |
| **Repository** | `TravelActivityRepository` | JPA Repository | 활동 조회 |
| **Service** | `ItineraryResponse` | Response DTO | 일정 응답 |
| **Service** | `ActivityResponse` | Response DTO | 활동 응답 (중첩) |

---

### 5. 체크리스트 생성 (POST /api/trips/detail/checklists) ✅ 완성

#### 전체 흐름도

```
[Client]
   │
   │ POST /api/trips/detail/checklists
   │ Body: {"tripId": 5, "task": "여권 확인"}
   ↓
┌─────────────────────────────────────────┐
│ TravelPlanController.createChecklist()  │
│ - @RequestBody ChecklistCreateRequest   │ ← Request DTO
│ - @Valid 검증                           │
│ - @AuthenticationPrincipal UserPrincipal│
└─────────────────────────────────────────┘
   │
   │ DTO + userId 전달
   ↓
┌─────────────────────────────────────────┐
│ TravelPlanService.createChecklist()     │
│ 1. TravelParticipantRepository (권한)   │ ← 권한 체크
│ 2. displayOrder 자동 설정               │ ← 비즈니스 로직
│ 3. TravelChecklist Entity 생성          │ ← Entity
│ 4. TravelChecklistRepository.save()     │ ← Repository
│ 5. UserRepository (담당자 이름 조회)    │ ← N+1 방지
└─────────────────────────────────────────┘
   │
   │ Entity → Response DTO 변환
   ↓
┌─────────────────────────────────────────┐
│ ChecklistResponse 반환                  │ ← Response DTO
│ - ApiResponse로 감싸기                  │
└─────────────────────────────────────────┘
   │
   │ JSON
   ↓
[Client]
```

#### 사용된 DTO/Entity

| 레이어 | 사용 객체 | 타입 | 역할 |
|--------|----------|------|------|
| **Controller** | `ChecklistCreateRequestDTO` | Request DTO | 생성 요청 데이터 |
| **Controller** | `UserPrincipal` | 인증 DTO | 현재 사용자 |
| **Service** | `TravelParticipant` | Entity | 권한 확인 |
| **Service** | `TravelChecklist` | Entity | 체크리스트 생성 |
| **Service** | `UserEntity` | Entity | 담당자 이름 조회 |
| **Repository** | `TravelChecklistRepository` | JPA Repository | 체크리스트 CRUD |
| **Repository** | `TravelParticipantRepository` | JPA Repository | 참여자 조회 |
| **Repository** | `UserRepository` | JPA Repository | 사용자 조회 |
| **Service** | `ChecklistResponse` | Response DTO | 생성 응답 데이터 |

---

## DTO 설계 철학

### DTO란 무엇인가?

**DTO (Data Transfer Object)**:
- 계층 간 데이터 전송을 위한 객체
- 로직을 포함하지 않음 (순수한 데이터 컨테이너)
- 직렬화/역직렬화 가능해야 함

### 왜 Entity를 직접 노출하면 안 되는가?

#### ❌ Entity 직접 노출의 문제점

**1. 보안 문제**
```java
// ❌ 나쁜 예: Entity 직접 반환
@GetMapping("/{id}")
public UserEntity getUser(@PathVariable Long id) {
    return userRepository.findById(id).orElseThrow();
}

// 결과: 비밀번호, 내부 ID 등 민감한 정보 노출
{
  "id": 1,
  "username": "hong",
  "password": "$2a$10$...",  // 노출되면 안 됨!
  "role": "ROLE_ADMIN",
  "internalCode": "ABC123"   // 내부 정보 노출
}
```

**2. 순환 참조 문제**
```java
@Entity
public class TravelPlan {
    @OneToMany(mappedBy = "travelPlan")
    private List<TravelParticipant> participants;
}

@Entity
public class TravelParticipant {
    @ManyToOne
    private TravelPlan travelPlan;  // 순환 참조!
}

// JSON 직렬화 시 무한 루프 발생
// TravelPlan → Participant → TravelPlan → ...
```

**3. DB 구조 변경 시 API 깨짐**
```java
// DB 컬럼명 변경: user_name → username
@Entity
public class User {
    @Column(name = "username")  // 변경!
    private String userName;
}

// API 응답이 강제로 변경됨
// before: { "userName": "홍길동" }
// after:  { "username": "홍길동" }  // 클라이언트 코드 깨짐!
```

**4. 불필요한 데이터 전송**
```java
@Entity
public class TravelPlan {
    private Long id;
    private String title;
    // ... 20개의 필드

    @Lob
    private byte[] largeData;  // 큰 바이너리 데이터
}

// 목록 조회 시 불필요한 데이터까지 전송
// 네트워크 비용 증가, 성능 저하
```

#### ✅ DTO를 사용하는 이유

**1. 계층 분리 (Separation of Concerns)**
```
Presentation Layer (Controller)
    ↕ DTO
Business Layer (Service)
    ↕ Entity
Persistence Layer (Repository)
```

**2. API 안정성**
- DB 구조가 변경되어도 API 응답은 유지 가능
- DTO만 수정하면 됨

**3. 보안**
- 필요한 정보만 선택적으로 노출
- 민감한 정보 제외 가능

**4. 성능**
- 필요한 필드만 전송
- 네트워크 비용 절감

**5. 유연성**
- 여러 Entity를 조합하여 하나의 DTO 생성 가능
- 프론트엔드 요구사항에 맞춘 구조 제공

---

## Request DTO vs Response DTO

### 왜 분리해야 하는가?

#### 근본적인 이유: **책임(Responsibility)이 다르다**

```
Request DTO의 책임:
- 클라이언트가 "무엇을 보내야 하는가"
- 입력 데이터 검증
- 필수 필드만 포함

Response DTO의 책임:
- 서버가 "무엇을 보여줄 것인가"
- 추가 정보 제공 (계산된 값, 조인된 데이터)
- 모든 필요한 정보 포함
```

### 구체적인 차이점

#### 1. 필드 구성이 다르다

**예시: 체크리스트 생성**

```java
// Request DTO - 클라이언트가 보내는 것
@Getter @Setter
public class ChecklistCreateRequestDTO {
    @NotNull
    private Long tripId;           // 어느 여행인지

    @NotBlank
    private String task;           // 할 일

    private Long assigneeUserId;   // 담당자 (선택)
    private Integer displayOrder;  // 순서 (선택)

    // ❌ 제외된 필드:
    // - id (DB가 생성)
    // - completed (기본값 false)
    // - completedAt (완료 시에만)
    // - createdAt (자동 생성)
}

// Response DTO - 서버가 보여주는 것
@Data @Builder
public class ChecklistResponse {
    private Long id;                // ✅ 생성된 ID 반환
    private String task;
    private Boolean completed;       // ✅ 상태 정보
    private Long assigneeUserId;
    private String assigneeName;     // ✅ 추가 정보 (JOIN)
    private LocalDateTime completedAt;  // ✅ 완료 시간
    private Integer displayOrder;    // ✅ 계산된 순서
}
```

**왜 이렇게 다른가?**

| 필드 | Request | Response | 이유 |
|------|---------|----------|------|
| `id` | ❌ 없음 | ✅ 있음 | DB에서 생성되므로 요청 시 불필요, 응답 시 필수 |
| `completed` | ❌ 없음 | ✅ 있음 | 생성 시 무조건 false, 응답 시 상태 표시 |
| `assigneeName` | ❌ 없음 | ✅ 있음 | Request는 ID만, Response는 이름 추가 제공 |
| `displayOrder` | ⭕ 선택 | ✅ 있음 | Request는 선택(null이면 자동 설정), Response는 항상 포함 |

#### 2. 검증 규칙이 다르다

```java
// Request DTO - 엄격한 검증
public class TravelPlanCreateRequestDTO {
    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 100, message = "제목은 100자 이하여야 합니다")
    private String title;

    @NotNull(message = "시작일은 필수입니다")
    @FutureOrPresent(message = "과거 날짜는 선택할 수 없습니다")
    private LocalDate startDate;

    @Email(message = "올바른 이메일 형식이어야 합니다")
    private String inviteEmail;
}

// Response DTO - 검증 불필요
public class TravelPlanResponse {
    private String title;           // 검증 어노테이션 없음
    private LocalDate startDate;    // 이미 검증된 데이터
    private String inviteEmail;     // 응답에만 포함
}
```

**이유**: Request는 클라이언트 입력을 검증해야 하지만, Response는 이미 검증된 데이터

#### 3. 사용 목적이 다르다

```java
// ❌ 나쁜 예: 하나의 DTO로 Request/Response 겸용
@Data
public class ChecklistDTO {
    private Long id;              // Request 시 불필요, Response 시 필요
    private Long tripId;          // Request 시 필요, Response 시 불필요 (중복)
    private String task;
    private Boolean completed;    // Request 시 불필요, Response 시 필요
    private String assigneeName;  // Request 시 불필요, Response 시 필요

    // 클라이언트가 혼란스러움: 어떤 필드를 보내야 하는지?
}

// ✅ 좋은 예: 명확하게 분리
public class ChecklistCreateRequestDTO {
    private Long tripId;          // 명확: 이것만 보내면 됨
    private String task;
}

public class ChecklistResponse {
    private Long id;              // 명확: 서버가 이것들을 보내줌
    private String task;
    private Boolean completed;
    private String assigneeName;
}
```

#### 4. 진화 방향이 다르다

**시나리오**: 체크리스트에 "우선순위" 기능 추가

```java
// Request DTO - 새 필드 추가
public class ChecklistCreateRequestDTO {
    private Long tripId;
    private String task;
    private Integer priority;  // ← 새로 추가
}

// Response DTO - 추가 정보 포함
public class ChecklistResponse {
    private Long id;
    private String task;
    private Integer priority;
    private String priorityLabel;  // ← "높음", "중간", "낮음" 텍스트 추가
}
```

**변경 영향**:
- Request DTO 변경: 클라이언트가 새 필드 보내야 함 (Breaking Change 가능)
- Response DTO 변경: 클라이언트가 새 필드 무시 가능 (Non-Breaking)

---

### Request DTO의 종류

```java
// 1. Create (생성)
ChecklistCreateRequestDTO
TravelPlanCreateRequestDTO

// 2. Update (수정)
ChecklistUpdateRequestDTO
TravelPlanUpdateRequestDTO

// 3. Search (검색)
TravelPlanSearchRequestDTO {
    private String keyword;
    private LocalDate startDate;
    private LocalDate endDate;
}

// 4. Filter (필터링)
ChecklistFilterRequestDTO {
    private Boolean completed;
    private Long assigneeUserId;
}
```

### Response DTO의 종류

```java
// 1. Simple (단순 응답)
ChecklistResponse
TravelPlanResponse

// 2. Detail (상세 응답)
TravelDetailResponse {
    // 기본 정보
    private Long id;
    private String title;

    // 중첩된 정보
    private List<ParticipantDTO> participants;
    private TravelStatisticsDTO statistics;
}

// 3. List (목록 응답)
TravelPlanListResponse {
    private Long totalCount;
    private int currentPage;
    private List<TravelPlanResponse> items;
}

// 4. Summary (요약 응답)
TravelSummaryResponse {
    private Long id;
    private String title;
    private int photoCount;
    // 간략한 정보만
}
```

---

## DTO 재사용 전략

### 실무에서 DTO를 재사용하는 기준

#### ✅ 재사용해도 되는 경우

**1. 동일한 정보를 전달할 때**

```java
// ParticipantDTO - 여러 Response에서 재사용
@Data @Builder
public class ParticipantDTO {
    private Long userId;
    private String userName;
    private String role;
}

// 재사용 1: 여행 상세에서
public class TravelDetailResponse {
    private List<ParticipantDTO> participants;  // 재사용
}

// 재사용 2: 참여자 목록 API에서
public class ParticipantListResponse {
    private List<ParticipantDTO> participants;  // 같은 DTO 재사용
}
```

**2. 공통 내부 DTO**

```java
// AddressDTO - 여러 도메인에서 재사용
@Data
public class AddressDTO {
    private String zipCode;
    private String address1;
    private String address2;
}

// 재사용 1: 사용자 주소
public class UserDetailResponse {
    private AddressDTO address;
}

// 재사용 2: 숙소 주소
public class AccommodationResponse {
    private AddressDTO address;
}
```

#### ❌ 재사용하면 안 되는 경우

**1. Request ↔ Response 간 재사용 금지**

```java
// ❌ 나쁜 예
@Data
public class ChecklistDTO {
    private Long id;          // Response용
    private Long tripId;      // Request용
    private String task;      // 공통
}

// 클라이언트: "id를 보내야 하나? tripId는 어디서 나온 거지?"

// ✅ 좋은 예: 명확하게 분리
public class ChecklistCreateRequestDTO {
    private Long tripId;
    private String task;
}

public class ChecklistResponse {
    private Long id;
    private String task;
    private Boolean completed;
}
```

**2. 생성 ↔ 수정 Request DTO 재사용 금지**

```java
// ❌ 나쁜 예: Create와 Update를 하나로
@Data
public class ChecklistRequestDTO {
    private Long id;          // Update만 필요
    private Long tripId;      // Create만 필요
    private String task;
}

// ✅ 좋은 예: 명확하게 분리
public class ChecklistCreateRequestDTO {
    private Long tripId;      // Create: tripId 필요
    private String task;
}

public class ChecklistUpdateRequestDTO {
    // tripId 없음 (URL에서 체크리스트 ID로 조회)
    private String task;
    private Boolean completed;
}
```

**이유**:
- Create: `tripId` 필요 (어느 여행에 추가할지)
- Update: `tripId` 불필요 (이미 생성된 체크리스트 수정)

**3. 다른 검증 규칙이 필요한 경우**

```java
// ❌ 나쁜 예: 검증 규칙이 다른데 재사용
@Data
public class TravelPlanDTO {
    @NotBlank  // Create에서만 필수
    private String title;

    @NotNull   // Create에서만 필수
    private LocalDate startDate;
}

// Update 시 문제: 모든 필드를 보내지 않아도 되는데 @NotBlank 때문에 에러

// ✅ 좋은 예: 분리
public class TravelPlanCreateRequestDTO {
    @NotBlank
    private String title;

    @NotNull
    private LocalDate startDate;
}

public class TravelPlanUpdateRequestDTO {
    // 선택적 수정 가능
    private String title;          // null이면 수정 안 함
    private LocalDate startDate;   // null이면 수정 안 함
}
```

---

### 재사용을 위한 계층 구조

```java
// 1. 공통 필드를 Base DTO로
@Data
public abstract class BaseChecklistDTO {
    private String task;
    private Long assigneeUserId;
    private Integer displayOrder;
}

// 2. Request DTO들이 상속
public class ChecklistCreateRequestDTO extends BaseChecklistDTO {
    @NotNull
    private Long tripId;  // Create만의 필드
}

public class ChecklistUpdateRequestDTO extends BaseChecklistDTO {
    // tripId 없음 (URL에서 ID로 조회)
    private Boolean completed;  // Update만의 필드
}

// 3. Response는 별도
public class ChecklistResponse {
    private Long id;
    private String task;
    private Boolean completed;
    private String assigneeName;  // 추가 정보
    // Base 상속하지 않음 (Response는 다른 구조)
}
```

**장점**:
- 공통 필드 중복 제거
- 각 DTO의 목적은 명확
- 변경 영향도 최소화

---

## 실무 표준 패턴

### 1. DTO 네이밍 규칙

```
[도메인명][작업][Request/Response]DTO

예시:
- ChecklistCreateRequestDTO      (생성 요청)
- ChecklistUpdateRequestDTO       (수정 요청)
- ChecklistResponse               (단순 응답)
- TravelDetailResponse            (상세 응답)
- TravelPlanListResponse          (목록 응답)
```

### 2. 패키지 구조

```
com.example.project
├── dto
│   ├── request                 ← Request DTO
│   │   ├── ChecklistCreateRequestDTO.java
│   │   ├── ChecklistUpdateRequestDTO.java
│   │   ├── TravelPlanCreateRequestDTO.java
│   │   └── TravelPlanUpdateRequestDTO.java
│   │
│   ├── response                ← Response DTO
│   │   ├── ChecklistResponse.java
│   │   ├── TravelDetailResponse.java
│   │   └── TravelPlanResponse.java
│   │
│   ├── common                  ← 공통 DTO
│   │   ├── ParticipantDTO.java
│   │   ├── TravelStatisticsDTO.java
│   │   └── ApiResponse.java
│   │
│   └── internal                ← 내부 전용 DTO
│       ├── TravelCalculationDTO.java
│       └── UserPermissionDTO.java
```

### 3. Validation 표준

```java
// Request DTO - 검증 필수
public class ChecklistCreateRequestDTO {
    // 1. @NotNull: null 불가 (모든 타입)
    @NotNull(message = "여행 ID는 필수입니다")
    private Long tripId;

    // 2. @NotBlank: null, "", "   " 모두 불가 (String 전용)
    @NotBlank(message = "체크리스트 내용은 필수입니다")
    private String task;

    // 3. @Size: 길이 제한
    @Size(max = 500, message = "내용은 500자 이하여야 합니다")
    private String notes;

    // 4. @Email: 이메일 형식
    @Email(message = "올바른 이메일 형식이어야 합니다")
    private String email;

    // 5. @Min, @Max: 숫자 범위
    @Min(value = 0, message = "순서는 0 이상이어야 합니다")
    @Max(value = 999, message = "순서는 999 이하여야 합니다")
    private Integer displayOrder;

    // 6. @Pattern: 정규식
    @Pattern(regexp = "^[0-9]{3}-[0-9]{4}-[0-9]{4}$", message = "전화번호 형식이 올바르지 않습니다")
    private String phone;

    // 7. @Valid: 중첩 객체 검증
    @Valid
    @Size(max = 10)
    private List<TravelTagDto> tags;
}

// Response DTO - 검증 불필요
public class ChecklistResponse {
    private Long id;
    private String task;
    // 검증 어노테이션 없음
}
```

### 4. Entity → DTO 변환 패턴

#### 방법 1: 직접 변환 (간단한 경우)

```java
public ChecklistResponse toResponse(TravelChecklist entity) {
    ChecklistResponse response = new ChecklistResponse();
    response.setId(entity.getId());
    response.setTask(entity.getTask());
    response.setCompleted(entity.getCompleted());
    return response;
}
```

#### 방법 2: Builder 패턴 (권장)

```java
public ChecklistResponse toResponse(TravelChecklist entity) {
    return ChecklistResponse.builder()
        .id(entity.getId())
        .task(entity.getTask())
        .completed(entity.getCompleted())
        .assigneeUserId(entity.getAssigneeUserId())
        .displayOrder(entity.getDisplayOrder())
        .build();
}
```

#### 방법 3: 정적 팩토리 메서드 (Response DTO에 포함)

```java
@Data @Builder
public class ChecklistResponse {
    private Long id;
    private String task;
    private Boolean completed;

    // 정적 팩토리 메서드
    public static ChecklistResponse from(TravelChecklist entity) {
        return ChecklistResponse.builder()
            .id(entity.getId())
            .task(entity.getTask())
            .completed(entity.getCompleted())
            .build();
    }
}

// 사용
ChecklistResponse response = ChecklistResponse.from(entity);
```

#### 방법 4: MapStruct (대규모 프로젝트)

```java
@Mapper(componentModel = "spring")
public interface ChecklistMapper {
    ChecklistResponse toResponse(TravelChecklist entity);

    TravelChecklist toEntity(ChecklistCreateRequestDTO dto);
}

// 사용
@Autowired
private ChecklistMapper checklistMapper;

ChecklistResponse response = checklistMapper.toResponse(entity);
```

### 5. 공통 응답 래퍼 패턴

```java
@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private String code;
    private T data;

    // 성공 응답
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "성공", null, data);
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, null, data);
    }

    // 실패 응답
    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(false, message, code, null);
    }
}

// 사용 예
return ResponseEntity.ok(ApiResponse.success(checklistResponse, "체크리스트가 생성되었습니다"));
```

---

## 안티패턴과 해결책

### ❌ 안티패턴 1: Entity를 그대로 반환

```java
// ❌ 나쁜 예
@GetMapping("/{id}")
public TravelPlanEntity getTravelPlan(@PathVariable Long id) {
    return travelPlanRepository.findById(id).orElseThrow();
}

// 문제점:
// 1. 민감한 정보 노출 (user.password 등)
// 2. 순환 참조로 JSON 직렬화 실패
// 3. DB 구조 변경 시 API 깨짐
// 4. 불필요한 데이터 전송
```

```java
// ✅ 좋은 예
@GetMapping("/{id}")
public ResponseEntity<ApiResponse<TravelPlanResponse>> getTravelPlan(@PathVariable Long id) {
    TravelPlanResponse response = travelPlanService.getTravelPlan(id);
    return ResponseEntity.ok(ApiResponse.success(response));
}

// Service
public TravelPlanResponse getTravelPlan(Long id) {
    TravelPlanEntity entity = travelPlanRepository.findById(id).orElseThrow();
    return toResponse(entity);  // Entity → DTO 변환
}
```

### ❌ 안티패턴 2: 만능 DTO

```java
// ❌ 나쁜 예: 모든 용도를 하나로
@Data
public class ChecklistDTO {
    private Long id;              // Response용
    private Long tripId;          // Request용
    private String task;
    private Boolean completed;
    private String assigneeName;  // Response용 (추가 정보)
}

// 사용 시 혼란
// - 생성 시: id, assigneeName 불필요 → 클라이언트 혼란
// - 조회 시: tripId 중복 → 불필요한 데이터
// - 수정 시: tripId 변경 불가 → 보안 위험
```

```java
// ✅ 좋은 예: 용도별 분리
public class ChecklistCreateRequestDTO {
    @NotNull
    private Long tripId;

    @NotBlank
    private String task;
}

public class ChecklistUpdateRequestDTO {
    // tripId 없음 (URL에서 ID로 조회)
    private String task;
    private Boolean completed;
}

public class ChecklistResponse {
    private Long id;
    private String task;
    private Boolean completed;
    private String assigneeName;
}
```

### ❌ 안티패턴 3: N+1 문제 무시

```java
// ❌ 나쁜 예
public List<ChecklistResponse> getChecklists(Long tripId) {
    List<TravelChecklist> checklists = checklistRepository.findByTripId(tripId);

    return checklists.stream()
        .map(checklist -> {
            // 각 체크리스트마다 User 조회 쿼리 발생! (N+1)
            UserEntity assignee = userRepository.findById(checklist.getAssigneeUserId()).orElse(null);

            return ChecklistResponse.builder()
                .id(checklist.getId())
                .task(checklist.getTask())
                .assigneeName(assignee != null ? assignee.getUsername() : null)
                .build();
        })
        .collect(Collectors.toList());
}
```

```java
// ✅ 좋은 예: 미리 조회
public List<ChecklistResponse> getChecklists(Long tripId) {
    List<TravelChecklist> checklists = checklistRepository.findByTripId(tripId);

    // 1. 모든 assigneeUserId 수집
    List<Long> assigneeIds = checklists.stream()
        .map(TravelChecklist::getAssigneeUserId)
        .filter(Objects::nonNull)
        .distinct()
        .collect(Collectors.toList());

    // 2. 한 번에 조회 (1개 쿼리)
    Map<Long, UserEntity> userMap = userRepository.findAllById(assigneeIds).stream()
        .collect(Collectors.toMap(UserEntity::getId, user -> user));

    // 3. Map에서 조회 (추가 쿼리 없음)
    return checklists.stream()
        .map(checklist -> {
            UserEntity assignee = userMap.get(checklist.getAssigneeUserId());

            return ChecklistResponse.builder()
                .id(checklist.getId())
                .task(checklist.getTask())
                .assigneeName(assignee != null ? assignee.getUsername() : null)
                .build();
        })
        .collect(Collectors.toList());
}
```

### ❌ 안티패턴 4: 검증 누락

```java
// ❌ 나쁜 예: 검증 없음
@Data
public class ChecklistCreateRequestDTO {
    private Long tripId;          // null 가능?
    private String task;          // 빈 문자열 가능?
}

// Controller에서 수동 검증 (중복 코드)
if (request.getTripId() == null) {
    throw new IllegalArgumentException("tripId는 필수입니다");
}
```

```java
// ✅ 좋은 예: 선언적 검증
@Data
public class ChecklistCreateRequestDTO {
    @NotNull(message = "여행 ID는 필수입니다")
    private Long tripId;

    @NotBlank(message = "체크리스트 내용은 필수입니다")
    private String task;
}

// Controller
@PostMapping
public ResponseEntity<?> create(@RequestBody @Valid ChecklistCreateRequestDTO request) {
    // @Valid가 자동으로 검증
}
```

---

## 요약

### 핵심 원칙

1. **Entity는 절대 Controller에서 사용하지 않는다**
   - Controller ↔ DTO ↔ Service ↔ Entity ↔ Repository

2. **Request DTO와 Response DTO는 분리한다**
   - 책임이 다르고, 진화 방향이 다르기 때문

3. **DTO 재사용은 신중하게**
   - 동일한 정보를 전달할 때만 재사용
   - Request/Response 간 재사용 금지

4. **검증은 Request DTO에서**
   - `@Valid` + `@NotNull`, `@NotBlank` 등
   - Response DTO는 검증 불필요

5. **N+1 문제를 항상 고려**
   - 미리 조회 + `Collectors.toMap()` 패턴

### 레이어별 DTO 사용 정리

| 레이어 | Request DTO | Response DTO | Entity |
|--------|-------------|--------------|--------|
| **Controller** | ✅ 입력 | ✅ 출력 | ❌ 사용 금지 |
| **Service** | ✅ 입력 | ✅ 생성 | ✅ 비즈니스 로직 |
| **Repository** | ❌ | ❌ | ✅ CRUD |

### DTO 설계 체크리스트

```
□ Entity를 직접 반환하지 않는가?
□ Request DTO와 Response DTO를 분리했는가?
□ Request DTO에 검증 어노테이션을 추가했는가?
□ Response DTO에 불필요한 검증 어노테이션이 없는가?
□ DTO 네이밍이 명확한가? (*CreateRequestDTO, *Response)
□ N+1 문제를 고려했는가?
□ 민감한 정보를 Response에서 제외했는가?
□ 공통 응답 래퍼(ApiResponse)를 사용했는가?
```

---

끝!
