# 여행 상세 데이터 구조 완벽 가이드

> 작성일: 2025-11-11
> 프로젝트: Spring Boot 3.4.5 + JPA Travel Planning Application

---

## 📋 목차

1. [전체 구조 개요](#전체-구조-개요)
2. [Entity 계층 구조](#entity-계층-구조)
3. [DTO 설계 패턴](#dto-설계-패턴)
4. [각 기능별 상세 분석](#각-기능별-상세-분석)
5. [Service-Controller-Repository 사용 패턴](#service-controller-repository-사용-패턴)
6. [실무 적용 가이드](#실무-적용-가이드)

---

## 전체 구조 개요

### 여행 데이터 계층 구조

```
TravelPlan (여행 계획)
    ├── TravelParticipant (참여자)
    ├── TravelItinerary (일정)
    │   └── TravelActivity (세부 활동)
    ├── TravelPhoto (사진)
    ├── TravelExpense (경비)
    └── TravelChecklist (체크리스트)
```

### 테이블 관계

```sql
travel_plans (1)
    ├─── travel_participants (N) -- 참여자
    ├─── travel_itineraries (N) -- 일정
    │       └─── travel_activities (N) -- 세부 활동
    ├─── travel_photos (N) -- 사진
    ├─── travel_expenses (N) -- 경비
    └─── travel_checklists (N) -- 체크리스트
```

---

## Entity 계층 구조

### 1. TravelPlan (여행 계획) - 메인 Entity

**테이블**: `travel_plans`
**역할**: 여행의 기본 정보를 담는 최상위 Entity

```java
@Entity
@Table(name = "travel_plans")
public class TravelPlanEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;              // 생성자

    private String title;                 // 여행 제목
    private String description;           // 설명
    private LocalDate startDate;          // 시작일
    private LocalDate endDate;            // 종료일
    private String destination;           // 목적지
    private String imageUrl;              // 대표 이미지
    private BigDecimal estimatedCost;     // 예상 비용
    private String visibility;            // PUBLIC/PRIVATE
    private boolean isDeleted;            // 삭제 여부
    private String tags;                  // JSON 형태 태그

    @Enumerated(EnumType.STRING)
    private TravelStyle travelStyle;      // 여행 스타일

    @Enumerated(EnumType.STRING)
    private BudgetLevel budgetLevel;      // 예산 수준

    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

**주요 특징**:
- `@ManyToOne` 관계로 User와 연결
- Enum 타입으로 여행 스타일, 예산 수준 관리
- JSON 컬럼으로 태그 저장 (유연성)
- Soft Delete 패턴 (`isDeleted`)

---

### 2. TravelParticipant (참여자) - 권한 관리 Entity

**테이블**: `travel_participants`
**역할**: 여행에 참여하는 사용자와 권한 관리

```java
@Entity
@Table(name = "travel_participants")
public class TravelParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tripId;                  // 여행 ID (FK)
    private Long userId;                  // 사용자 ID (FK)

    @Builder.Default
    private String role = "VIEWER";       // OWNER, EDITOR, VIEWER

    @CreationTimestamp
    private LocalDateTime joinedAt;       // 참여 시간
}
```

**권한 레벨**:
- `OWNER`: 여행 생성자, 모든 권한
- `EDITOR`: 수정 가능
- `VIEWER`: 읽기만 가능

**사용 시나리오**:
- 체크리스트 생성 시 참여자 권한 확인
- 일정 수정 시 EDITOR 이상 권한 필요
- 여행 삭제는 OWNER만 가능

---

### 3. TravelItinerary (일정) - 날짜별 그룹 Entity

**테이블**: `travel_itineraries`
**역할**: 여행의 각 날짜(1일차, 2일차)를 표현

```java
@Entity
@Table(name = "travel_itineraries")
public class TravelItinerary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tripId;                  // 여행 ID (FK)
    private Integer dayNumber;            // 1일차, 2일차, 3일차...
    private LocalDate date;               // 해당 날짜
    private String title;                 // 제목 (예: "제주 도착")
    private String notes;                 // 메모

    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

**설계 포인트**:
- `dayNumber`로 일차 표시 (1, 2, 3...)
- `date`로 실제 날짜 저장 (2025-11-15)
- 하나의 Itinerary에 여러 Activity 포함

**예시**:
```
1일차 (2025-11-15) "제주 도착"
  ├─ 09:00 공항 도착
  ├─ 11:00 렌터카 픽업
  └─ 14:00 호텔 체크인

2일차 (2025-11-16) "한라산 등반"
  ├─ 07:00 등반 시작
  └─ 15:00 하산
```

---

### 4. TravelActivity (세부 활동) - 시간별 상세 일정

**테이블**: `travel_activities`
**역할**: 각 일정(Itinerary)의 시간별 세부 활동

```java
@Entity
@Table(name = "travel_activities")
public class TravelActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long itineraryId;             // 일정 ID (FK)
    private LocalTime time;               // 시간 (09:00, 14:30)
    private String title;                 // 활동 제목
    private String location;              // 장소
    private String activityType;          // 활동 타입
    private Integer durationMinutes;      // 소요 시간 (분)

    @Builder.Default
    private BigDecimal cost = BigDecimal.ZERO;  // 비용

    private String notes;                 // 메모

    @Builder.Default
    private Integer displayOrder = 0;     // 표시 순서

    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

**활동 타입** (`activityType`):
- `TRANSPORT`: 이동
- `FOOD`: 식사
- `ACTIVITY`: 관광/활동
- `ACCOMMODATION`: 숙박
- `REST`: 휴식

**설계 포인트**:
- `displayOrder`로 같은 시간대 활동 정렬
- `durationMinutes`로 소요 시간 관리
- `cost` 필드로 개별 활동 비용 추적

---

### 5. TravelPhoto (사진) - 추억 저장

**테이블**: `travel_photos`
**역할**: 여행 중 촬영한 사진 관리

```java
@Entity
@Table(name = "travel_photos")
public class TravelPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tripId;                  // 여행 ID (FK)
    private Long userId;                  // 업로드 사용자 ID
    private String imageUrl;              // 이미지 URL
    private String caption;               // 사진 설명
    private LocalDate takenAt;            // 촬영 날짜

    @Builder.Default
    private Integer likesCount = 0;       // 좋아요 개수 (캐시)

    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

**설계 포인트**:
- `likesCount`: 좋아요 개수를 캐싱 (성능 최적화)
- `takenAt`: 촬영 날짜로 일정별로 사진 그룹핑 가능
- `userId`: 누가 업로드했는지 추적

---

### 6. TravelExpense (경비) - 지출 관리

**테이블**: `travel_expenses`
**역할**: 여행 중 발생한 지출 기록

```java
@Entity
@Table(name = "travel_expenses")
public class TravelExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tripId;                  // 여행 ID (FK)
    private String category;              // 카테고리
    private String item;                  // 항목명
    private BigDecimal amount;            // 금액
    private Long paidByUserId;            // 지불한 사용자 ID
    private LocalDate expenseDate;        // 지출 날짜
    private String notes;                 // 메모

    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

**카테고리** (`category`):
- `TRANSPORT`: 교통비
- `FOOD`: 식비
- `ACCOMMODATION`: 숙박비
- `ACTIVITY`: 활동비
- `ETC`: 기타

**사용 시나리오**:
- 정산 기능: 누가 얼마 썼는지 추적
- 예산 관리: 총 지출 vs 예상 비용 비교
- 카테고리별 지출 분석

---

### 7. TravelChecklist (체크리스트) - 준비물 관리

**테이블**: `travel_checklists`
**역할**: 여행 준비물 및 할 일 관리

```java
@Entity
@Table(name = "travel_checklists")
public class TravelChecklist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tripId;                  // 여행 ID (FK)
    private String task;                  // 체크리스트 내용

    @Builder.Default
    private Boolean completed = false;    // 완료 여부

    private Long assigneeUserId;          // 담당자 ID
    private LocalDateTime completedAt;    // 완료 시간

    @Builder.Default
    private Integer displayOrder = 0;     // 표시 순서

    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

**설계 포인트**:
- `assigneeUserId`: 담당자 지정 가능
- `completedAt`: 언제 완료했는지 추적
- `displayOrder`: 우선순위 관리

---

## DTO 설계 패턴

### DTO 3대 분류

```
1. Request DTO (클라이언트 → 서버)
   - 생성: *CreateRequestDTO
   - 수정: *UpdateRequestDTO
   - 검증 어노테이션 필수

2. Response DTO (서버 → 클라이언트)
   - 단일: *Response
   - 목록: *ListResponse
   - 상세: *DetailResponse

3. 내부 DTO (서버 내부 전달용)
   - ParticipantDTO
   - TravelStatisticsDTO
```

---

## 각 기능별 상세 분석

### 1. 체크리스트 (Checklist) - 완성 예제

#### Entity
```java
TravelChecklist {
    id, tripId, task, completed,
    assigneeUserId, completedAt, displayOrder, createdAt
}
```

#### Request DTO
```java
@Getter @Setter @Builder
public class ChecklistCreateRequestDTO {
    @NotNull(message = "여행 ID값은 필수입니다.")
    private Long tripId;

    @NotBlank(message = "체크리스트 내용은 필수입니다.")
    private String task;

    private Long assigneeUserId;      // 선택
    private Integer displayOrder;     // 선택 (null이면 자동 설정)
}
```

**제외 필드**:
- `id`: DB 자동 생성
- `completed`: 생성 시 무조건 `false`
- `completedAt`: 완료 시에만 설정
- `createdAt`: `@CreationTimestamp` 자동 생성

#### Response DTO
```java
@Data @Builder
public class ChecklistResponse {
    private Long id;
    private String task;
    private Boolean completed;
    private Long assigneeUserId;
    private String assigneeName;      // 추가 정보!
    private LocalDateTime completedAt;
    private Integer displayOrder;
}
```

**추가 필드**:
- `assigneeName`: 담당자 이름 (N+1 방지 위해 미리 조회)

#### Repository
```java
public interface TravelChecklistRepository extends JpaRepository<TravelChecklist, Long> {
    // 특정 여행의 체크리스트 조회 (순서대로)
    List<TravelChecklist> findByTripIdOrderByDisplayOrderAsc(Long tripId);

    // 전체 개수
    int countByTripId(Long tripId);

    // 완료된 개수
    int countByTripIdAndCompletedTrue(Long tripId);

    // 미완료 항목만 조회
    List<TravelChecklist> findByTripIdAndCompletedFalseOrderByDisplayOrderAsc(Long tripId);

    // displayOrder 자동 설정용
    @Query("SELECT MAX(c.displayOrder) FROM TravelChecklist c WHERE c.tripId = :tripId")
    Integer findMaxDisplayOrderByTripId(@Param("tripId") Long tripId);
}
```

#### Service
```java
@Service
@Transactional
public class TravelPlanService {

    public ChecklistResponse createChecklist(ChecklistCreateRequestDTO request, Long userId) {
        // 1. 권한 확인
        TravelParticipant member = participantRepository
                .findByTripIdAndUserId(request.getTripId(), userId)
                .orElseThrow(() -> new RuntimeException("여행 참여자만 추가 가능"));

        // 2. displayOrder 자동 설정
        Integer order = request.getDisplayOrder();
        if (order == null) {
            Integer maxOrder = checklistRepository.findMaxDisplayOrderByTripId(request.getTripId());
            order = (maxOrder == null) ? 0 : maxOrder + 1;
        }

        // 3. Entity 생성
        TravelChecklist checklist = TravelChecklist.builder()
                .tripId(request.getTripId())
                .task(request.getTask())
                .completed(false)
                .assigneeUserId(request.getAssigneeUserId())
                .displayOrder(order)
                .build();

        // 4. DB 저장
        TravelChecklist saved = checklistRepository.save(checklist);

        // 5. 담당자 이름 조회
        String assigneeName = null;
        if (saved.getAssigneeUserId() != null) {
            assigneeName = userRepository.findById(saved.getAssigneeUserId())
                    .map(UserEntity::getUsername)
                    .orElse(null);
        }

        // 6. Response DTO 생성
        return ChecklistResponse.builder()
                .id(saved.getId())
                .task(saved.getTask())
                .completed(saved.getCompleted())
                .assigneeUserId(saved.getAssigneeUserId())
                .assigneeName(assigneeName)
                .completedAt(saved.getCompletedAt())
                .displayOrder(saved.getDisplayOrder())
                .build();
    }
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/trips")
public class TravelPlanController {

    @PostMapping("/detail/checklists")
    public ResponseEntity<ApiResponse<ChecklistResponse>> createChecklist(
            @RequestBody @Valid ChecklistCreateRequestDTO request,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        ChecklistResponse response = travelPlanService.createChecklist(request, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "체크리스트가 생성되었습니다"));
    }

    @GetMapping("/{tripId}/checklists")
    public ResponseEntity<List<ChecklistResponse>> getChecklists(@PathVariable Long tripId) {
        List<ChecklistResponse> checklists = travelPlanService.getChecklists(tripId);
        return ResponseEntity.ok(checklists);
    }
}
```

---

### 2. 일정 (Itinerary) - 구조 분석

#### Entity 관계
```
TravelItinerary (1)
    └── TravelActivity (N)
```

#### Response DTO
```java
@Data @Builder
public class ItineraryResponse {
    private Long id;
    private Integer dayNumber;        // 1일차, 2일차
    private LocalDate date;           // 실제 날짜
    private String title;             // 제목
    private String notes;             // 메모
    private List<ActivityResponse> activities;  // 세부 활동 목록!
}
```

**특징**:
- `activities` 필드로 세부 활동을 중첩 구조로 포함
- N+1 문제 방지를 위해 JOIN FETCH 또는 미리 조회 필요

#### ActivityResponse
```java
@Data @Builder
public class ActivityResponse {
    private Long id;
    private LocalTime time;           // 09:00, 14:30
    private String title;             // 활동 제목
    private String location;          // 장소
    private String activityType;      // TRANSPORT, FOOD, ACTIVITY...
    private Integer durationMinutes;  // 소요 시간
    private BigDecimal cost;          // 비용
    private String notes;             // 메모
}
```

#### Service 예시 (N+1 방지)
```java
public List<ItineraryResponse> getItineraries(Long tripId) {
    // 1. 모든 일정 조회
    List<TravelItinerary> itineraries = itineraryRepository.findByTripIdOrderByDayNumberAsc(tripId);

    // 2. 모든 일정의 ID 수집
    List<Long> itineraryIds = itineraries.stream()
            .map(TravelItinerary::getId)
            .collect(Collectors.toList());

    // 3. 모든 활동을 한 번에 조회 (N+1 방지!)
    List<TravelActivity> activities = activityRepository.findByItineraryIdIn(itineraryIds);

    // 4. 일정 ID별로 활동 그룹핑
    Map<Long, List<TravelActivity>> activityMap = activities.stream()
            .collect(Collectors.groupingBy(TravelActivity::getItineraryId));

    // 5. DTO 변환
    return itineraries.stream()
            .map(itinerary -> {
                List<ActivityResponse> activityResponses = activityMap
                        .getOrDefault(itinerary.getId(), Collections.emptyList())
                        .stream()
                        .map(activity -> ActivityResponse.builder()
                                .id(activity.getId())
                                .time(activity.getTime())
                                .title(activity.getTitle())
                                .location(activity.getLocation())
                                .activityType(activity.getActivityType())
                                .durationMinutes(activity.getDurationMinutes())
                                .cost(activity.getCost())
                                .notes(activity.getNotes())
                                .build())
                        .collect(Collectors.toList());

                return ItineraryResponse.builder()
                        .id(itinerary.getId())
                        .dayNumber(itinerary.getDayNumber())
                        .date(itinerary.getDate())
                        .title(itinerary.getTitle())
                        .notes(itinerary.getNotes())
                        .activities(activityResponses)
                        .build();
            })
            .collect(Collectors.toList());
}
```

**핵심 포인트**:
- 일정을 먼저 조회
- 모든 활동을 한 번에 조회 (`findByItineraryIdIn`)
- `Collectors.groupingBy`로 일정별로 활동 그룹핑
- N+1 문제 완벽 방지!

---

### 3. 사진 (Photo) - 구조 분석

#### Response DTO
```java
@Data @Builder
public class PhotoResponse {
    private Long id;
    private String imageUrl;          // 이미지 URL
    private String caption;           // 사진 설명
    private LocalDate takenAt;        // 촬영 날짜
    private Integer likesCount;       // 좋아요 수
    private Long userId;              // 업로드 사용자 ID
    private String userName;          // 업로드 사용자 이름 (추가 정보)
}
```

#### Service 예시
```java
public List<PhotoResponse> getPhotos(Long tripId) {
    List<TravelPhoto> photos = photoRepository.findByTripIdOrderByTakenAtDesc(tripId);

    // 업로드 사용자 정보 조회 (N+1 방지)
    List<Long> userIds = photos.stream()
            .map(TravelPhoto::getUserId)
            .distinct()
            .collect(Collectors.toList());

    Map<Long, UserEntity> userMap = userRepository.findAllById(userIds).stream()
            .collect(Collectors.toMap(UserEntity::getId, user -> user));

    return photos.stream()
            .map(photo -> PhotoResponse.builder()
                    .id(photo.getId())
                    .imageUrl(photo.getImageUrl())
                    .caption(photo.getCaption())
                    .takenAt(photo.getTakenAt())
                    .likesCount(photo.getLikesCount())
                    .userId(photo.getUserId())
                    .userName(userMap.get(photo.getUserId()).getUsername())
                    .build())
            .collect(Collectors.toList());
}
```

---

### 4. 경비 (Expense) - 구조 분석

#### Response DTO
```java
@Data @Builder
public class ExpenseResponse {
    private Long id;
    private String category;          // TRANSPORT, FOOD, ACCOMMODATION...
    private String item;              // 항목명
    private BigDecimal amount;        // 금액
    private Long paidByUserId;        // 지불한 사용자 ID
    private String paidByUserName;    // 지불한 사용자 이름 (추가 정보)
    private LocalDate expenseDate;    // 지출 날짜
    private String notes;             // 메모
}
```

#### Service 예시
```java
public List<ExpenseResponse> getExpenses(Long tripId) {
    List<TravelExpense> expenses = expenseRepository.findByTripIdOrderByExpenseDateDesc(tripId);

    // 지불자 정보 조회 (N+1 방지)
    List<Long> userIds = expenses.stream()
            .map(TravelExpense::getPaidByUserId)
            .filter(Objects::nonNull)
            .distinct()
            .collect(Collectors.toList());

    Map<Long, UserEntity> userMap = userRepository.findAllById(userIds).stream()
            .collect(Collectors.toMap(UserEntity::getId, user -> user));

    return expenses.stream()
            .map(expense -> {
                String paidByUserName = expense.getPaidByUserId() != null
                        ? userMap.get(expense.getPaidByUserId()).getUsername()
                        : null;

                return ExpenseResponse.builder()
                        .id(expense.getId())
                        .category(expense.getCategory())
                        .item(expense.getItem())
                        .amount(expense.getAmount())
                        .paidByUserId(expense.getPaidByUserId())
                        .paidByUserName(paidByUserName)
                        .expenseDate(expense.getExpenseDate())
                        .notes(expense.getNotes())
                        .build();
            })
            .collect(Collectors.toList());
}
```

---

### 5. 여행 상세 정보 (TravelDetail) - 통합 조회

#### Response DTO
```java
@Data @Builder
public class TravelDetailResponse {
    // 기본 정보
    private Long id;
    private String title;
    private String description;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private String imageUrl;
    private BigDecimal estimatedCost;
    private String visibility;

    // 상태 정보
    private String status;                    // UPCOMING, ONGOING, COMPLETED
    private String statusDescription;         // 상태 설명

    // 참여자 정보
    private List<ParticipantDTO> participants;

    // 통계 정보
    private TravelStatisticsDTO statistics;

    // 현재 사용자 권한
    private String currentUserRole;           // OWNER, EDITOR, VIEWER
    private Boolean isOwner;
}
```

#### ParticipantDTO (내부 DTO)
```java
@Data @Builder
public class ParticipantDTO {
    private Long participantId;
    private Long userId;
    private String userName;
    private String userEmail;
    private String role;              // OWNER, EDITOR, VIEWER
    private LocalDateTime joinedAt;
}
```

#### TravelStatisticsDTO (내부 DTO)
```java
@Data @Builder
public class TravelStatisticsDTO {
    private int itineraryCount;               // 일정 개수
    private int photoCount;                   // 사진 개수
    private int completedChecklistCount;      // 완료된 체크리스트
    private int totalChecklistCount;          // 전체 체크리스트
    private BigDecimal totalExpenses;         // 총 지출
    private BigDecimal estimatedBudget;       // 예상 예산
    private Double budgetUsagePercentage;     // 예산 사용률
}
```

#### Service 예시
```java
public TravelDetailResponse getTravelDetail(Long tripId, Long userId) {
    // 1. 여행 정보 조회
    TravelPlanEntity trip = travelPlanRepository.findById(tripId)
            .orElseThrow(() -> new IllegalArgumentException("여행을 찾을 수 없습니다"));

    // 2. 참여자 정보 조회
    List<TravelParticipant> participants = participantRepository.findByTripId(tripId);

    List<Long> userIds = participants.stream()
            .map(TravelParticipant::getUserId)
            .collect(Collectors.toList());

    Map<Long, UserEntity> userMap = userRepository.findAllById(userIds).stream()
            .collect(Collectors.toMap(UserEntity::getId, u -> u));

    List<ParticipantDTO> participantDTOs = participants.stream()
            .map(p -> ParticipantDTO.builder()
                    .participantId(p.getId())
                    .userId(p.getUserId())
                    .userName(userMap.get(p.getUserId()).getUsername())
                    .userEmail(userMap.get(p.getUserId()).getEmail())
                    .role(p.getRole())
                    .joinedAt(p.getJoinedAt())
                    .build())
            .collect(Collectors.toList());

    // 3. 통계 정보 계산
    int itineraryCount = itineraryRepository.countByTripId(tripId);
    int photoCount = photoRepository.countByTripId(tripId);
    int totalChecklistCount = checklistRepository.countByTripId(tripId);
    int completedChecklistCount = checklistRepository.countByTripIdAndCompletedTrue(tripId);

    BigDecimal totalExpenses = expenseRepository.sumAmountByTripId(tripId);
    if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

    Double budgetUsagePercentage = 0.0;
    if (trip.getEstimatedCost() != null && trip.getEstimatedCost().compareTo(BigDecimal.ZERO) > 0) {
        budgetUsagePercentage = totalExpenses
                .divide(trip.getEstimatedCost(), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    TravelStatisticsDTO statistics = TravelStatisticsDTO.builder()
            .itineraryCount(itineraryCount)
            .photoCount(photoCount)
            .completedChecklistCount(completedChecklistCount)
            .totalChecklistCount(totalChecklistCount)
            .totalExpenses(totalExpenses)
            .estimatedBudget(trip.getEstimatedCost())
            .budgetUsagePercentage(budgetUsagePercentage)
            .build();

    // 4. 현재 사용자 권한 확인
    TravelParticipant currentUserParticipant = participants.stream()
            .filter(p -> p.getUserId().equals(userId))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("권한이 없습니다"));

    boolean isOwner = trip.getUser().getId().equals(userId);

    // 5. 여행 상태 계산
    LocalDate today = LocalDate.now();
    String status;
    String statusDescription;

    if (today.isBefore(trip.getStartDate())) {
        status = "UPCOMING";
        statusDescription = "여행 시작 전";
    } else if (today.isAfter(trip.getEndDate())) {
        status = "COMPLETED";
        statusDescription = "여행 완료";
    } else {
        status = "ONGOING";
        statusDescription = "여행 중";
    }

    // 6. Response 생성
    return TravelDetailResponse.builder()
            .id(trip.getId())
            .title(trip.getTitle())
            .description(trip.getDescription())
            .destination(trip.getDestination())
            .startDate(trip.getStartDate())
            .endDate(trip.getEndDate())
            .imageUrl(trip.getImageUrl())
            .estimatedCost(trip.getEstimatedCost())
            .visibility(trip.getVisibility())
            .status(status)
            .statusDescription(statusDescription)
            .participants(participantDTOs)
            .statistics(statistics)
            .currentUserRole(currentUserParticipant.getRole())
            .isOwner(isOwner)
            .build();
}
```

---

## Service-Controller-Repository 사용 패턴

### 전체 API 엔드포인트 구조

```
GET  /api/trips/{tripId}/detail          # 여행 상세 정보 (통합)
GET  /api/trips/{tripId}/itineraries     # 일정 목록
GET  /api/trips/{tripId}/photos          # 사진 목록
GET  /api/trips/{tripId}/expenses        # 경비 목록
GET  /api/trips/{tripId}/checklists      # 체크리스트 목록

POST /api/trips/detail/checklists        # 체크리스트 생성
POST /api/trips/detail/itineraries       # 일정 생성
POST /api/trips/detail/activities        # 활동 생성
POST /api/trips/detail/photos            # 사진 업로드
POST /api/trips/detail/expenses          # 경비 추가
```

### Repository 계층 - Spring Data JPA 활용

```java
// TravelChecklistRepository
public interface TravelChecklistRepository extends JpaRepository<TravelChecklist, Long> {
    List<TravelChecklist> findByTripIdOrderByDisplayOrderAsc(Long tripId);
    int countByTripId(Long tripId);
    int countByTripIdAndCompletedTrue(Long tripId);

    @Query("SELECT MAX(c.displayOrder) FROM TravelChecklist c WHERE c.tripId = :tripId")
    Integer findMaxDisplayOrderByTripId(@Param("tripId") Long tripId);
}

// TravelItineraryRepository
public interface TravelItineraryRepository extends JpaRepository<TravelItinerary, Long> {
    List<TravelItinerary> findByTripIdOrderByDayNumberAsc(Long tripId);
    int countByTripId(Long tripId);
}

// TravelActivityRepository
public interface TravelActivityRepository extends JpaRepository<TravelActivity, Long> {
    List<TravelActivity> findByItineraryIdOrderByDisplayOrderAsc(Long itineraryId);
    List<TravelActivity> findByItineraryIdIn(List<Long> itineraryIds);  // N+1 방지용
}

// TravelPhotoRepository
public interface TravelPhotoRepository extends JpaRepository<TravelPhoto, Long> {
    List<TravelPhoto> findByTripIdOrderByTakenAtDesc(Long tripId);
    int countByTripId(Long tripId);
}

// TravelExpenseRepository
public interface TravelExpenseRepository extends JpaRepository<TravelExpense, Long> {
    List<TravelExpense> findByTripIdOrderByExpenseDateDesc(Long tripId);

    @Query("SELECT SUM(e.amount) FROM TravelExpense e WHERE e.tripId = :tripId")
    BigDecimal sumAmountByTripId(@Param("tripId") Long tripId);
}

// TravelParticipantRepository
public interface TravelParticipantRepository extends JpaRepository<TravelParticipant, Long> {
    List<TravelParticipant> findByTripId(Long tripId);
    Optional<TravelParticipant> findByTripIdAndUserId(Long tripId, Long userId);
}
```

---

## 실무 적용 가이드

### 1. N+1 문제 해결 패턴

**문제 상황**:
```java
// ❌ 나쁜 예: N+1 발생
List<TravelChecklist> checklists = checklistRepository.findByTripId(tripId);
return checklists.stream()
        .map(checklist -> {
            // 각 체크리스트마다 User 조회 쿼리 발생!
            UserEntity assignee = userRepository.findById(checklist.getAssigneeUserId()).orElse(null);
            return ChecklistResponse.builder()
                    .assigneeName(assignee != null ? assignee.getUsername() : null)
                    .build();
        })
        .collect(Collectors.toList());
```

**해결 방법**:
```java
// ✅ 좋은 예: 미리 조회
List<TravelChecklist> checklists = checklistRepository.findByTripId(tripId);

// 1. 모든 assigneeUserId 수집
List<Long> assigneeIds = checklists.stream()
        .map(TravelChecklist::getAssigneeUserId)
        .filter(Objects::nonNull)
        .distinct()
        .collect(Collectors.toList());

// 2. 한 번에 조회
Map<Long, UserEntity> userMap = userRepository.findAllById(assigneeIds).stream()
        .collect(Collectors.toMap(UserEntity::getId, user -> user));

// 3. Map에서 조회
return checklists.stream()
        .map(checklist -> {
            UserEntity assignee = userMap.get(checklist.getAssigneeUserId());
            return ChecklistResponse.builder()
                    .assigneeName(assignee != null ? assignee.getUsername() : null)
                    .build();
        })
        .collect(Collectors.toList());
```

---

### 2. Request DTO 설계 원칙

**포함해야 할 필드**:
- 클라이언트가 입력하는 필드만
- 필수 필드: `@NotNull`, `@NotBlank` 검증

**제외해야 할 필드**:
- `id`: DB 자동 생성
- `createdAt`: `@CreationTimestamp` 자동 생성
- `userId`: `@AuthenticationPrincipal`에서 추출
- 기본값이 있는 필드 (서비스에서 설정)

---

### 3. Response DTO 설계 원칙

**포함해야 할 필드**:
- 클라이언트가 화면에 표시할 모든 정보
- 추가 정보 (예: userName, assigneeName)
- 통계 정보 (예: likesCount, budgetUsagePercentage)

**제외해야 할 필드**:
- 민감한 정보 (비밀번호, JWT 시크릿 등)
- 불필요한 관계 (순환 참조 방지)

---

### 4. Entity vs DTO 사용 규칙

| 레이어 | Entity 사용 | DTO 사용 |
|--------|------------|----------|
| **Controller** | ❌ 절대 사용 금지 | ✅ Request/Response DTO |
| **Service** | ✅ 비즈니스 로직 처리 | ✅ 입출력 |
| **Repository** | ✅ DB CRUD | ❌ 사용 안 함 |

**이유**:
- Entity를 Controller에 직접 노출하면 보안 위험
- 순환 참조 문제 발생 가능
- DB 구조 변경 시 API 응답도 강제 변경됨

---

### 5. 트랜잭션 관리

```java
// 조회 전용
@Transactional(readOnly = true)
public List<ChecklistResponse> getChecklists(Long tripId) {
    // ...
}

// 생성/수정/삭제
@Transactional
public ChecklistResponse createChecklist(...) {
    // ...
}
```

**`readOnly = true` 장점**:
- 성능 최적화 (Flush 생략)
- 실수로 데이터 변경 방지

---

### 6. 권한 체크 패턴

```java
// 참여자 여부 확인
TravelParticipant participant = participantRepository
        .findByTripIdAndUserId(tripId, userId)
        .orElseThrow(() -> new UnauthorizedException("권한이 없습니다"));

// EDITOR 이상 권한 필요
if (!participant.getRole().equals("OWNER") && !participant.getRole().equals("EDITOR")) {
    throw new UnauthorizedException("수정 권한이 없습니다");
}

// OWNER만 가능
if (!participant.getRole().equals("OWNER")) {
    throw new UnauthorizedException("소유자만 삭제할 수 있습니다");
}
```

---

## 요약

### Entity 7개
1. `TravelPlan`: 여행 기본 정보
2. `TravelParticipant`: 참여자 및 권한
3. `TravelItinerary`: 날짜별 일정
4. `TravelActivity`: 시간별 세부 활동
5. `TravelPhoto`: 사진
6. `TravelExpense`: 경비
7. `TravelChecklist`: 체크리스트

### Response DTO 7개
1. `TravelDetailResponse`: 여행 상세 (통합)
2. `ItineraryResponse`: 일정 + 활동 목록
3. `ActivityResponse`: 세부 활동
4. `PhotoResponse`: 사진 + 업로드 사용자
5. `ExpenseResponse`: 경비 + 지불 사용자
6. `ChecklistResponse`: 체크리스트 + 담당자
7. `ParticipantDTO`, `TravelStatisticsDTO`: 내부 DTO

### Request DTO (현재 1개, 추가 필요 6개)
1. ✅ `ChecklistCreateRequestDTO`: 완성
2. ⏳ `ItineraryCreateRequestDTO`: 필요
3. ⏳ `ActivityCreateRequestDTO`: 필요
4. ⏳ `PhotoUploadRequestDTO`: 필요
5. ⏳ `ExpenseCreateRequestDTO`: 필요
6. ⏳ `ParticipantInviteRequestDTO`: 필요
7. ⏳ `TravelPlanUpdateRequestDTO`: 필요

### 핵심 패턴
- **N+1 방지**: `findAllById` + `Collectors.toMap`
- **권한 체크**: `TravelParticipant` 조회
- **자동 설정**: displayOrder, completed
- **통계 계산**: Repository count/sum 메서드
- **상태 관리**: LocalDate 비교로 UPCOMING/ONGOING/COMPLETED

---

이 문서를 기반으로 나머지 Request DTO들을 작성하고, 각 기능의 CRUD를 완성하면 됩니다!
