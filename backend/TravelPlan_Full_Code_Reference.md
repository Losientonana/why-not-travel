# TravelPlan 전체 코드 레퍼런스

> 회사에서 손코딩용으로 사용하기 위한 전체 코드 정리 문서

## 📋 목차

1. [Entity 계층](#1-entity-계층)
2. [Repository 계층](#2-repository-계층)
3. [DTO 계층](#3-dto-계층)
4. [Service 계층](#4-service-계층)
5. [Controller 계층](#5-controller-계층)
6. [구현된 API 엔드포인트](#6-구현된-api-엔드포인트)
7. [미구현 기능 목록](#7-미구현-기능-목록)

---

## 1. Entity 계층

### 1.1 UserEntity.java
```java
package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true, unique = true, length = 50)
    private String username;

    @Column(nullable = true, length = 30)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = true)
    private String password;

    @Column(nullable = false)
    private String role; // "USER", "ADMIN" 등

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean isDeleted = false;

    private LocalDateTime deletedAt;
}
```

### 1.2 TravelPlanEntity.java
```java
package forproject.spring_oauth2_jwt.entity;

import forproject.spring_oauth2_jwt.enums.BudgetLevel;
import forproject.spring_oauth2_jwt.enums.TravelStyle;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "travel_plans")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelPlanEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = true, length = 100)
    private String destination; // 여행지 (ex: "제주도", "일본")

    @Column(nullable = true)
    private String imageUrl; // 여행 대표 이미지

    @Column(nullable = true)
    private BigDecimal estimatedCost; // 예상 비용

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String visibility = "PUBLIC"; // PUBLIC/PRIVATE

    @Column(nullable = false)
    private boolean isDeleted = false;

    @Column(columnDefinition = "JSON", nullable = true)
    private String tags;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true, length = 30)
    private TravelStyle travelStyle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true, length = 20)
    private BudgetLevel budgetLevel;
}
```

### 1.3 TravelParticipant.java
```java
package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "travel_participants")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id")
    private Long tripId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "role", nullable = false, length = 20)
    @Builder.Default
    private String role = "OWNER";

    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;
}
```

### 1.4 TravelItinerary.java
```java
package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "travel_itineraries")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelItinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    /**
     * 일차 번호 (1일차, 2일차, 3일차...)
     */
    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    /**
     * 해당 날짜
     */
    @Column(name = "date", nullable = false)
    private LocalDate date;

    /**
     * 제목 (선택사항: "제주 도착", "한라산 등반" 등)
     */
    @Column(name = "title", length = 255)
    private String title;

    /**
     * 메모
     */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
```

### 1.5 TravelActivity.java
```java
package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 여행 세부 활동 엔티티
 * - 각 일정(Itinerary)에 여러 활동 포함
 * - 09:00 공항 도착, 11:00 렌터카 픽업 등
 */
@Entity
@Table(name = "travel_activities")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "itinerary_id", nullable = false)
    private Long itineraryId;

    /**
     * 시간 (09:00, 14:30 등)
     */
    @Column(name = "time")
    private LocalTime time;

    /**
     * 활동 제목
     */
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    /**
     * 장소
     */
    @Column(name = "location", length = 255)
    private String location;

    /**
     * 활동 타입: TRANSPORT(이동), FOOD(식사), ACTIVITY(활동), ACCOMMODATION(숙박), REST(휴식)
     */
    @Column(name = "activity_type", length = 50)
    private String activityType;

    /**
     * 소요 시간 (분)
     */
    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    /**
     * 비용
     */
    @Column(name = "cost", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal cost = BigDecimal.ZERO;

    /**
     * 메모
     */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    /**
     * 표시 순서 (같은 날짜 내 정렬용)
     */
    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
```

### 1.6 TravelChecklist.java
```java
package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * 여행 체크리스트 엔티티
 */
@Entity
@Table(name = "travel_checklists")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelChecklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    /**
     * 체크리스트 내용
     */
    @Column(name = "task", nullable = false, columnDefinition = "TEXT")
    private String task;

    /**
     * 완료 여부
     */
    @Column(name = "completed")
    @Builder.Default
    private Boolean completed = false;

    /**
     * 담당자 ID
     */
    @Column(name = "assignee_user_id")
    private Long assigneeUserId;

    /**
     * 완료 시간
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /**
     * 표시 순서
     */
    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
```

### 1.7 TravelPhoto.java
```java
package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 여행 사진 엔티티
 */
@Entity
@Table(name = "travel_photos")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    /**
     * 업로드한 사용자 ID
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * 이미지 URL
     */
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    /**
     * 사진 설명
     */
    @Column(name = "caption", columnDefinition = "TEXT")
    private String caption;

    /**
     * 사진 촬영 날짜
     */
    @Column(name = "taken_at")
    private LocalDate takenAt;

    /**
     * 좋아요 개수 (캐시)
     */
    @Column(name = "likes_count")
    @Builder.Default
    private Integer likesCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
```

### 1.8 TravelExpense.java
```java
package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 여행 경비 엔티티
 */
@Entity
@Table(name = "travel_expenses")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    /**
     * 카테고리: TRANSPORT(교통), FOOD(식비), ACCOMMODATION(숙박), ACTIVITY(활동), ETC(기타)
     */
    @Column(name = "category", nullable = false, length = 50)
    private String category;

    /**
     * 항목명
     */
    @Column(name = "item", nullable = false, length = 255)
    private String item;

    /**
     * 금액
     */
    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    /**
     * 지불한 사용자 ID
     */
    @Column(name = "paid_by_user_id")
    private Long paidByUserId;

    /**
     * 지출 날짜
     */
    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    /**
     * 메모
     */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
```

---

## 2. Repository 계층

### 2.1 UserRepository.java
```java
package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Boolean existsByUsername(String username);

    UserEntity findByEmail(String email);

    UserEntity findByUsername(String username);

    boolean existsByEmail(String email);
}
```

### 2.2 TravelPlanRepository.java
```java
package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelPlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface TravelPlanRepository extends JpaRepository<TravelPlanEntity,Long> {
    List<TravelPlanEntity> findByUser_Id(Long userId); // 유저별 일정 조회

    List<TravelPlanEntity> findByUser_IdAndIsDeletedFalse(Long userId);

    Optional<TravelPlanEntity> findByIdAndIsDeletedFalse(Long tripId);

    /**
     * 특정 파일명이 포함된 이미지를 사용하는 여행 계획 조회
     */
    @Query("SELECT COUNT(t) FROM TravelPlanEntity t WHERE t.imageUrl LIKE CONCAT('%', :fileName, '%')")
    long countByImageUrlContaining(@Param("fileName") String fileName);

    @Query("SELECT t FROM TravelPlanEntity t WHERE t.imageUrl LIKE CONCAT('%', :fileName, '%')")
    List<TravelPlanEntity> findByImageUrlContaining(@Param("fileName") String fileName);

    /**
     * 여행 상태들을 리스트로 반환
     */
    List<TravelPlanEntity> findByIdInAndUser_IdAndIsDeletedFalse(List<Long> tripIds, Long userId);
}
```

### 2.3 TravelParticipantRepository.java
```java
package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TravelParticipantRepository extends JpaRepository<TravelParticipant, Long> {
    /**
     * 특정 여행의 참여자 목록 조회
     */
    List<TravelParticipant> findByTripIdOrderByJoinedAt(Long tripId);

    /**
     * 특정 여행의 참여자 수
     */
    int countByTripId(Long tripId);

    /**
     * 특정 사용자가 특정 여행의 참여자인지 확인
     */
    boolean existsByTripIdAndUserId(Long tripId, Long userId);

    /**
     * 특정 사용자의 역할 조회
     */
    Optional<TravelParticipant> findByTripIdAndUserId(Long tripId, Long userId);

    /**
     * 특정 여행의 방장(OWNER) 조회
     */
    Optional<TravelParticipant> findByTripIdAndRole(Long tripId, String role);

    /**
     * 사용자 정보와 함께 조회 (N+1 방지)
     */
    @Query("SELECT tp FROM TravelParticipant tp WHERE tp.tripId = :tripId ORDER BY tp.joinedAt")
    List<TravelParticipant> findByTripIdWithUser(@Param("tripId") Long tripId);
}
```

### 2.4 TravelItineraryRepository.java
```java
package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelItinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TravelItineraryRepository extends JpaRepository<TravelItinerary, Long> {

    /**
     * 특정 여행의 일정 목록 조회 (일차 순서대로)
     */
    List<TravelItinerary> findByTripIdOrderByDayNumber(Long tripId);

    /**
     * 특정 여행의 일정 개수
     */
    int countByTripId(Long tripId);

    /**
     * 특정 여행의 특정 일자 조회
     */
    TravelItinerary findByTripIdAndDayNumber(Long tripId, Integer dayNumber);
}
```

### 2.5 TravelActivityRepository.java
```java
package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TravelActivityRepository extends JpaRepository<TravelActivity, Long> {

    /**
     * 특정 일정의 활동 목록 조회 (시간 순서대로)
     */
    List<TravelActivity> findByItineraryIdOrderByDisplayOrderAscTimeAsc(Long itineraryId);

    /**
     * 여러 일정의 활동 한 번에 조회 (N+1 방지)
     */
    List<TravelActivity> findByItineraryIdInOrderByDisplayOrderAscTimeAsc(List<Long> itineraryIds);

    /**
     * 특정 일정의 활동 개수
     */
    int countByItineraryId(Long itineraryId);
}
```

### 2.6 TravelChecklistRepository.java
```java
package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelChecklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TravelChecklistRepository extends JpaRepository<TravelChecklist, Long> {
    /**
     * 특정 여행의 체크리스트 조회 (순서대로)
     */
    List<TravelChecklist> findByTripIdOrderByDisplayOrderAsc(Long tripId);

    /**
     * 특정 여행의 체크리스트 전체 개수
     */
    int countByTripId(Long tripId);

    /**
     * 완료된 체크리스트 개수
     */
    int countByTripIdAndCompletedTrue(Long tripId);

    /**
     * 미완료된 체크리스트 조회
     */
    List<TravelChecklist> findByTripIdAndCompletedFalseOrderByDisplayOrderAsc(Long tripId);

    /**
     * displayOrder 자동 설정을 위한 커스텀
     */
    @Query("SELECT MAX(c.displayOrder) FROM TravelChecklist c WHERE c.tripId = :tripId")
    Integer findMaxDisplayOrderByTripId(@Param("tripId") Long tripId);
}
```

### 2.7 TravelPhotoRepository.java
```java
package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TravelPhotoRepository extends JpaRepository<TravelPhoto, Long> {

    /**
     * 특정 여행의 사진 목록 조회 (최신순)
     */
    List<TravelPhoto> findByTripIdOrderByCreatedAtDesc(Long tripId);

    /**
     * 특정 날짜의 사진 조회
     */
    List<TravelPhoto> findByTripIdAndTakenAtOrderByCreatedAtDesc(Long tripId, LocalDate takenAt);

    /**
     * 특정 여행의 사진 개수
     */
    int countByTripId(Long tripId);

    /**
     * 특정 사용자가 업로드한 사진 조회
     */
    List<TravelPhoto> findByTripIdAndUserIdOrderByCreatedAtDesc(Long tripId, Long userId);
}
```

### 2.8 TravelExpenseRepository.java
```java
package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TravelExpenseRepository extends JpaRepository<TravelExpense, Long> {

    /**
     * 특정 여행의 경비 목록 조회 (최신순)
     */
    List<TravelExpense> findByTripIdOrderByExpenseDateDescCreatedAtDesc(Long tripId);

    /**
     * 특정 여행의 경비 합계
     */
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM TravelExpense e WHERE e.tripId = :tripId")
    BigDecimal sumAmountByTripId(@Param("tripId") Long tripId);

    /**
     * 카테고리별 경비 조회
     */
    List<TravelExpense> findByTripIdAndCategoryOrderByExpenseDateDesc(Long tripId, String category);

    /**
     * 카테고리별 합계
     */
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM TravelExpense e WHERE e.tripId = :tripId AND e.category = :category")
    BigDecimal sumAmountByTripIdAndCategory(@Param("tripId") Long tripId, @Param("category") String category);

    /**
     * 특정 사용자가 지불한 경비 조회
     */
    List<TravelExpense> findByTripIdAndPaidByUserIdOrderByExpenseDateDesc(Long tripId, Long userId);
}
```

---

## 3. DTO 계층

### 3.1 Request DTOs

#### 3.1.1 TravelPlanCreateRequestDTO.java
```java
package forproject.spring_oauth2_jwt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class TravelPlanCreateRequestDTO {
    @NotBlank(message = "여행 제목은 필수 입니다")
    @Size(max = 100)
    private String title;

    @NotNull(message = "시작일은 필수 입니다")
    private LocalDate startDate;

    @NotNull(message = "종료일은 필수 입니다")
    private LocalDate endDate;

    @Size(max = 300)
    private String description;

    @Size(max = 100, message = "여행지는 100자 이하여야 합니다.")
    private String destination;

    private String imageUri;

    private BigDecimal estimatedCost;

    @Valid
    @Size(max = 10, message = "태그는 최대 10개까지 선택 가능합니다")
    private List<TravelTagDto> tags; // 여행 태그 리스트

    @Size(max = 30, message = "여행 스타일은 30자 이하여야 합니다")
    private String travelStyle; // HEALING, ADVENTURE, CULTURE, GOURMET

    @Size(max = 20, message = "예산 수준은 20자 이하여야 합니다")
    private String budgetLevel; // BUDGET, MID_RANGE, LUXURY

    @NotBlank(message = "공개 설정은 필수입니다.")
    private String visibility;

    // 초대할 이메일 목록 추가
    @Size(max = 20, message = "초대할 사람은 최대 20명까지 가능합니다")
    private List<@Email(message = "올바른 이메일 형식이어야 합니다") String> inviteEmails;
}
```

#### 3.1.2 ChecklistCreateRequestDTO.java
```java
package forproject.spring_oauth2_jwt.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistCreateRequestDTO {

    @NotNull(message = "여행 ID값은 필수입니다.")
    private Long tripId;

    @NotBlank(message = "체크리스트 내용은 필수입니다.")
    private String task;

    private Long assigneeUserId;
    private Integer displayOrder;
}
```

### 3.2 Response DTOs

#### 3.2.1 TravelPlanResponse.java
```java
package forproject.spring_oauth2_jwt.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter @Setter
public class TravelPlanResponse {
    private Long id;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private String destination;
    private String description;
    private String name;
    private String visibility;
    private String status;
    private String imageUrl;
    private String participants;
}
```

#### 3.2.2 TravelDetailResponse.java
```java
package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 여행 상세 정보 응답 DTO
 * - 페이지 첫 로딩시 사용
 * - 기본 정보 + 통계 + 참여자 포함
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelDetailResponse {
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
    private String status;
    private String statusDescription;

    // 참여자 정보
    private List<ParticipantDTO> participants;

    // 통계 정보 (count만)
    private TravelStatisticsDTO statistics;

    // 현재 사용자 권한
    private String currentUserRole;
    private Boolean isOwner;
}
```

#### 3.2.3 TravelStatisticsDTO.java
```java
package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelStatisticsDTO {
    /**
     * 일정 개수
     */
    private int itineraryCount;

    /**
     * 사진 개수
     */
    private int photoCount;

    /**
     * 완료된 체크리스트 개수
     */
    private int completedChecklistCount;

    /**
     * 전체 체크리스트 개수
     */
    private int totalChecklistCount;

    /**
     * 총 지출 금액
     */
    private BigDecimal totalExpenses;

    /**
     * 예상 예산
     */
    private BigDecimal estimatedBudget;

    /**
     * 예산 사용률(%)
     */
    private Double budgetUsagePercentage;
}
```

#### 3.2.4 ParticipantDTO.java
```java
package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * 참여자 정보 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantDTO {

    private Long participantId;
    private Long userId;
    private String userName;
    private String userEmail;
    private String role; // OWNER, EDITOR, VIEWER
    private LocalDateTime joinedAt;
}
```

#### 3.2.5 ItineraryResponse.java
```java
package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

/**
 * 일정 응답 DTO
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItineraryResponse {
    private Long id;
    private Integer dayNumber;
    private LocalDate date;
    private String title;
    private String notes;
    private List<ActivityResponse> activities;
}
```

#### 3.2.6 ActivityResponse.java
```java
package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ActivityResponse {

    private Long id;
    private LocalTime time;
    private String title;
    private String location;
    private String activityType;
    private Integer durationMinutes;
    private BigDecimal cost;
    private String notes;
}
```

#### 3.2.7 PhotoResponse.java
```java
package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * 사진 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhotoResponse {

    private Long id;
    private String imageUrl;
    private String caption;
    private LocalDate takenAt;
    private Integer likesCount;
    private Long userId;
    private String userName;
}
```

#### 3.2.8 ChecklistResponse.java
```java
package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistResponse {
    private Long id;
    private String task;
    private Boolean completed;
    private Long assigneeUserId;
    private String assigneeName;
    private LocalDateTime completedAt;
    private Integer displayOrder;
}
```

#### 3.2.9 ExpenseResponse.java
```java
package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 경비 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {

    private Long id;
    private String category;
    private String item;
    private BigDecimal amount;
    private Long paidByUserId;
    private String paidByUserName;
    private LocalDate expenseDate;
    private String notes;
}
```

### 3.3 Common DTOs

#### 3.3.1 ApiResponse.java
```java
package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private String error;

    // 성공 응답
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .build();
    }

    // 성공 응답 (메시지 없음)
    public static <T> ApiResponse<T> success(T data) {
        return success(data, null);
    }

    // 실패 응답
    public static <T> ApiResponse<T> error(String error, String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(error)
                .message(message)
                .build();
    }
}
```

#### 3.3.2 UserPrincipal.java
```java
package forproject.spring_oauth2_jwt.dto;

import forproject.spring_oauth2_jwt.entity.UserEntity;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Getter @Setter
public class UserPrincipal implements UserDetails, OAuth2User {

    private final Long id;
    private final String username;
    private final String password;
    private final String name;
    private final String email;
    private final String role;
    private final Map<String, Object> attributes; // 소셜 로그인용(없으면 null)

    // 1) Entity로부터 생성 (일반 로그인, DB 조회)
    public UserPrincipal(UserEntity userEntity) {
        this.id = userEntity.getId();
        this.username = userEntity.getUsername();
        this.password = userEntity.getPassword();
        this.name = userEntity.getName();
        this.email = userEntity.getEmail();
        this.role = userEntity.getRole();
        this.attributes = null;
    }

    // 2) DTO + attributes로부터 생성 (소셜 로그인, OAuth2)
    public UserPrincipal(UserDTO userDTO, Map<String, Object> attributes) {
        this.id = userDTO.getId();
        this.username = userDTO.getUsername();
        this.password = null; // 소셜 로그인은 PW 없음
        this.name = userDTO.getName();
        this.email = userDTO.getEmail();
        this.role = userDTO.getRole();
        this.attributes = attributes != null ? Collections.unmodifiableMap(attributes) : null;
    }

    // ----- UserDetails 메서드 -----
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(() -> role); // 람다(권장)
        return authorities;
    }
    @Override
    public String getPassword() { return password; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }

    // ----- OAuth2User 메서드 -----
    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }
    @Override
    public String getName() {
        return name;
    }
}
```

---

## 4. Service 계층

### 4.1 TravelPlanService.java (전체)
```java
package forproject.spring_oauth2_jwt.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import forproject.spring_oauth2_jwt.dto.*;
import forproject.spring_oauth2_jwt.dto.request.ChecklistCreateRequestDTO;
import forproject.spring_oauth2_jwt.entity.*;
import forproject.spring_oauth2_jwt.enums.BudgetLevel;
import forproject.spring_oauth2_jwt.enums.TravelStyle;
import forproject.spring_oauth2_jwt.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TravelPlanService {
    private final TravelPlanRepository travelPlanRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final TravelParticipantRepository travelParticipantRepository;
    private final TravelItineraryRepository itineraryRepository;
    private final TravelActivityRepository activityRepository;
    private final TravelPhotoRepository photoRepository;
    private final TravelChecklistRepository checklistRepository;
    private final TravelExpenseRepository expenseRepository;
    private final TravelParticipantRepository participantRepository;

    // 일정 생성
    public TravelPlanResponse createTravelPlan(TravelPlanCreateRequestDTO req, Long userId) {
        try {
            log.info("여행 계획 생성 시작 - 사용자: {}, 제목: {}", userId, req.getTitle());

            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

            // 태그를 JSON으로 변환
            String tagsJson = null;
            if (req.getTags() != null && !req.getTags().isEmpty()) {
                tagsJson = objectMapper.writeValueAsString(req.getTags());
            }

            // Enum 변환
            TravelStyle travelStyle = null;
            if (req.getTravelStyle() != null) {
                try {
                    travelStyle = TravelStyle.valueOf(req.getTravelStyle());
                } catch (IllegalArgumentException e) {
                    log.warn("잘못된 여행 스타일: {}", req.getTravelStyle());
                }
            }

            BudgetLevel budgetLevel = null;
            if (req.getBudgetLevel() != null) {
                try {
                    budgetLevel = BudgetLevel.valueOf(req.getBudgetLevel());
                } catch (IllegalArgumentException e) {
                    log.warn("잘못된 예산 수준: {}", req.getBudgetLevel());
                }
            }

            TravelPlanEntity entity = TravelPlanEntity.builder()
                    .title(req.getTitle())
                    .startDate(req.getStartDate())
                    .endDate(req.getEndDate())
                    .description(req.getDescription())
                    .destination(req.getDestination())
                    .imageUrl(req.getImageUri())
                    .estimatedCost(req.getEstimatedCost())
                    .tags(tagsJson)
                    .travelStyle(travelStyle)
                    .budgetLevel(budgetLevel)
                    .user(user)
                    .visibility(req.getVisibility() != null ? req.getVisibility() : "PUBLIC")
                    .build();

            TravelPlanEntity saved = travelPlanRepository.save(entity);

            // 중요: 여행 생성자를 TravelParticipants에 OWNER로 등록
            TravelParticipant participant = TravelParticipant.builder()
                    .tripId(saved.getId())
                    .userId(saved.getUser().getId())
                    .build();

            travelParticipantRepository.save(participant);

            // 초대 이메일 처리 (현재는 로그만 출력)
            if (req.getInviteEmails() != null && !req.getInviteEmails().isEmpty()) {
                log.info("초대할 이메일 목록: {}", req.getInviteEmails());
                // TODO: 이메일 발송 로직 구현
            }

            TravelPlanResponse resp = new TravelPlanResponse();
            resp.setId(saved.getId());
            resp.setTitle(saved.getTitle());
            resp.setStartDate(saved.getStartDate());
            resp.setEndDate(saved.getEndDate());
            resp.setDescription(saved.getDescription());
            resp.setName(user.getName());
            resp.setVisibility(saved.getVisibility());

            log.info("여행 계획 생성 완료 - ID: {}", saved.getId());
            return resp;

        } catch (JsonProcessingException e) {
            log.error("태그 JSON 변환 실패: {}", e.getMessage());
            throw new RuntimeException("여행 계획 생성 중 오류가 발생했습니다.", e);
        }
    }

    // 내 일정 전체 조회
    public List<TravelPlanResponse> listMyPlans(Long userId) {
        List<TravelPlanEntity> plans = travelPlanRepository.findByUser_IdAndIsDeletedFalse(userId);

        List<TravelPlanResponse> result = plans.stream().map(plan -> {
            TravelPlanResponse resp = new TravelPlanResponse();
            resp.setId(plan.getId());
            resp.setTitle(plan.getTitle());
            resp.setStartDate(plan.getStartDate());
            resp.setEndDate(plan.getEndDate());
            resp.setDescription(plan.getDescription());
            resp.setName(plan.getUser().getName());
            resp.setVisibility(plan.getVisibility());
            resp.setDestination(plan.getDestination());
            resp.setImageUrl(plan.getImageUrl());
            return resp;
        }).collect(Collectors.toList());

        return result;
    }

    /**
     * 여행 상세 정보 조회 (옵션A)
     */
    @Transactional(readOnly = true)
    public TravelDetailResponse getTravelDetail(Long tripId, Long userId) {

        log.info("travelDetail2 - tripId: {}, userId: {}", tripId, userId);

        // 여행의 기본 정보 조회
        TravelPlanEntity trip = travelPlanRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("여행을 찾을 수 없습니다: " + tripId));

        // 참여자 조회
        List<TravelParticipant> participants = travelParticipantRepository.findByTripIdOrderByJoinedAt(tripId);
        List<ParticipantDTO> participantDTOS = toParticipantDtos(participants);

        // 통계 계산
        TravelStatisticsDTO statisticsDTO = calculateStatistics(tripId, trip.getEstimatedCost());

        // 현재 사용자 권한 확인
        String currentUserRole = getCurrentUserRole(tripId, userId);
        boolean isOwner = "OWNER".equals(currentUserRole) || trip.getUser().equals(userId);

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
                .participants(participantDTOS)
                .statistics(statisticsDTO)
                .status("계획중")
                .statusDescription("계획중")
                .currentUserRole(currentUserRole)
                .isOwner(isOwner)
                .build();
    }

    /**
     * 참여자 DTO로 변환
     */
    private List<ParticipantDTO> toParticipantDtos(List<TravelParticipant> participants) {
        // userId 목록 추출
        List<Long> userIds = participants.stream()
                .map(TravelParticipant::getUserId)
                .collect(Collectors.toList());

        // 사용자 정보 한 번에 조회 (N+1 방지)
        List<UserEntity> users = userRepository.findAllById(userIds);
        Map<Long, UserEntity> userMap = users.stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));

        return participants.stream()
                .map(participant -> {
                    UserEntity user = userMap.get(participant.getUserId());
                    return ParticipantDTO.builder()
                            .participantId(participant.getId())
                            .userId(participant.getUserId())
                            .userName(user != null ? user.getUsername() : "Unknown")
                            .userEmail(user != null ? user.getEmail() : "")
                            .role(participant.getRole())
                            .joinedAt(participant.getJoinedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * 통계 계산(COUNT,SUM)
     */
    private TravelStatisticsDTO calculateStatistics(Long tripId, BigDecimal estimatedBudget) {
        // COUNT 쿼리들
        int itineraryCount = itineraryRepository.countByTripId(tripId);
        int photoCount = photoRepository.countByTripId(tripId);
        int totalChecklistCount = checklistRepository.countByTripId(tripId);
        int completedChecklistCount = checklistRepository.countByTripIdAndCompletedTrue(tripId);

        // SUM 쿼리
        BigDecimal totalExpenses = expenseRepository.sumAmountByTripId(tripId);

        // 예산 사용률 계산
        double budgetUsagePercentage = 0.0;
        if (estimatedBudget != null && estimatedBudget.compareTo(BigDecimal.ZERO) > 0) {
            budgetUsagePercentage = totalExpenses
                    .divide(estimatedBudget, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        return TravelStatisticsDTO.builder()
                .itineraryCount(itineraryCount)
                .photoCount(photoCount)
                .completedChecklistCount(completedChecklistCount)
                .totalChecklistCount(totalChecklistCount)
                .totalExpenses(totalExpenses)
                .estimatedBudget(estimatedBudget)
                .budgetUsagePercentage(budgetUsagePercentage)
                .build();
    }

    /**
     * 현재 사용자의 역할 조회
     */
    private String getCurrentUserRole(Long tripId, Long userId) {
        return travelParticipantRepository.findByTripIdAndUserId(tripId, userId)
                .map(TravelParticipant::getRole)
                .orElse(null);
    }

    /**
     * 일정 조회(옵션 B: 일정 탭 클릭)
     */
    @Transactional(readOnly = true)
    public List<ItineraryResponse> getItineraries(Long tripId) {
        // 일정 조회
        List<TravelItinerary> itineraries = itineraryRepository.findByTripIdOrderByDayNumber(tripId);
        List<Long> itineraryIds = itineraries.stream()
                .map(TravelItinerary::getId)
                .collect(Collectors.toList());

        List<TravelActivity> activities = activityRepository
                .findByItineraryIdInOrderByDisplayOrderAscTimeAsc(itineraryIds);

        // 활동을 일정별로 그룹화
        Map<Long, List<TravelActivity>> activitiesByItinerary = activities.stream()
                .collect(Collectors.groupingBy(TravelActivity::getItineraryId));

        // DTO 변환
        return itineraries.stream()
                .map(itinerary -> ItineraryResponse.builder()
                        .id(itinerary.getId())
                        .dayNumber(itinerary.getDayNumber())
                        .date(itinerary.getDate())
                        .title(itinerary.getTitle())
                        .notes(itinerary.getNotes())
                        .activities(toActivityDtos(activitiesByItinerary.get(itinerary.getId())))
                        .build())
                .collect(Collectors.toList());
    }

    private List<ActivityResponse> toActivityDtos(List<TravelActivity> activities) {
        if (activities == null) {
            return List.of();
        }

        return activities.stream()
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
    }

    /**
     * 사진 조회 (옵션 B: 사진 탭 클릭 시)
     */
    @Transactional(readOnly = true)
    public List<PhotoResponse> getPhotos(Long tripId) {
        List<TravelPhoto> photos = photoRepository.findByTripIdOrderByCreatedAtDesc(tripId);

        // 사용자 정보 한 번에 조회
        List<Long> userIds = photos.stream()
                .map(TravelPhoto::getUserId)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, UserEntity> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));

        return photos.stream()
                .map(photo -> {
                    UserEntity user = userMap.get(photo.getUserId());
                    return PhotoResponse.builder()
                            .id(photo.getId())
                            .imageUrl(photo.getImageUrl())
                            .caption(photo.getCaption())
                            .takenAt(photo.getTakenAt())
                            .likesCount(photo.getLikesCount())
                            .userId(photo.getUserId())
                            .userName(user != null ? user.getUsername() : "Unknown")
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * 체크리스트 조회 (옵션 B)
     */
    @Transactional(readOnly = true)
    public List<ChecklistResponse> getChecklists(Long tripId) {
        List<TravelChecklist> checklists = checklistRepository.findByTripIdOrderByDisplayOrderAsc(tripId);

        // 담당자 정보 조회
        List<Long> assigneeIds = checklists.stream()
                .map(TravelChecklist::getAssigneeUserId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, UserEntity> userMap = userRepository.findAllById(assigneeIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));

        return checklists.stream()
                .map(checklist -> {
                    UserEntity assignee = checklist.getAssigneeUserId() != null
                            ? userMap.get(checklist.getAssigneeUserId())
                            : null;

                    return ChecklistResponse.builder()
                            .id(checklist.getId())
                            .task(checklist.getTask())
                            .completed(checklist.getCompleted())
                            .assigneeUserId(checklist.getAssigneeUserId())
                            .assigneeName(assignee != null ? assignee.getUsername() : null)
                            .completedAt(checklist.getCompletedAt())
                            .displayOrder(checklist.getDisplayOrder())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * 경비 조회 (옵션 B)
     */
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpenses(Long tripId) {
        List<TravelExpense> expenses = expenseRepository.findByTripIdOrderByExpenseDateDescCreatedAtDesc(tripId);

        // 지불자 정보 조회
        List<Long> paidByIds = expenses.stream()
                .map(TravelExpense::getPaidByUserId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, UserEntity> userMap = userRepository.findAllById(paidByIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));

        return expenses.stream()
                .map(expense -> {
                    UserEntity paidBy = expense.getPaidByUserId() != null
                            ? userMap.get(expense.getPaidByUserId())
                            : null;

                    return ExpenseResponse.builder()
                            .id(expense.getId())
                            .category(expense.getCategory())
                            .item(expense.getItem())
                            .amount(expense.getAmount())
                            .paidByUserId(expense.getPaidByUserId())
                            .paidByUserName(paidBy != null ? paidBy.getUsername() : null)
                            .expenseDate(expense.getExpenseDate())
                            .notes(expense.getNotes())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * 체크리스트 생성
     */
    @Transactional
    public ChecklistResponse createChecklist(ChecklistCreateRequestDTO request, Long userId){
        TravelParticipant member = participantRepository.findByTripIdAndUserId(request.getTripId(),
                        userId).orElseThrow(() -> new RuntimeException("여행 참여자만 체크리스트를 추가할 수 있습니다"));

        Integer order = request.getDisplayOrder();
        if (order == null) {
            // 해당 여행의 마지막 순서 + 1
            Integer maxOrder = checklistRepository.findMaxDisplayOrderByTripId(request.getTripId());
            order = (maxOrder == null) ? 0 : maxOrder + 1;
        }

        TravelChecklist checklist = TravelChecklist.builder()
                .tripId(request.getTripId())
                .task(request.getTask())
                .completed(false)
                .assigneeUserId(request.getAssigneeUserId())
                .displayOrder(order)
                .build();

        TravelChecklist saved = checklistRepository.save(checklist);

        String assigneeName = null;
        if (saved.getAssigneeUserId() != null) {
            assigneeName = userRepository.findById(saved.getAssigneeUserId())
                    .map(UserEntity::getUsername)
                    .orElse(null);
        }
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

---

## 5. Controller 계층

### 5.1 TravelPlanController.java
```java
package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.*;
import forproject.spring_oauth2_jwt.dto.request.ChecklistCreateRequestDTO;
import forproject.spring_oauth2_jwt.service.TravelPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/trips")
public class TravelPlanController {
    private final TravelPlanService travelPlanService;

    // 일정 생성 (로그인 사용자만)
    @PostMapping
    public ResponseEntity<ApiResponse<TravelPlanResponse>> create(
            @RequestBody @Valid TravelPlanCreateRequestDTO req,
            @AuthenticationPrincipal UserPrincipal user,
            BindingResult bindingResult
    ) {
        log.info("data = {}", req);
        try {
            // 유효성 검사 실패 처리
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getAllErrors().get(0).getDefaultMessage();
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("VALIDATION_ERROR", errorMessage)
                );
            }

            log.info("여행 계획 생성 요청 - 사용자: {}, 제목: {}", user.getId(), req.getTitle());
            TravelPlanResponse result = travelPlanService.createTravelPlan(req, user.getId());

            return ResponseEntity.ok(
                    ApiResponse.success(result, "여행 계획이 성공적으로 생성되었습니다.")
            );

        } catch (IllegalArgumentException e) {
            log.warn("여행 계획 생성 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("INVALID_REQUEST", e.getMessage())
            );

        } catch (Exception e) {
            log.error("여행 계획 생성 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error("INTERNAL_SERVER_ERROR", "서버 내부 오류가 발생했습니다.")
            );
        }
    }

    // 내 일정 목록
    @GetMapping
    public ResponseEntity<List<TravelPlanResponse>> myPlans(
            @AuthenticationPrincipal UserPrincipal user) {
        log.info("show trip {}", user);
        List<TravelPlanResponse> result = travelPlanService.listMyPlans(user.getId());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{tripId}/detail")
    public ResponseEntity<TravelDetailResponse> getPlanDetail(@PathVariable Long tripId, @AuthenticationPrincipal UserPrincipal user) {
        log.info("GET /api/trips/{}/detail - userId: {}", tripId, user.getId());

        TravelDetailResponse response = travelPlanService.getTravelDetail(tripId, user.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * 옵션 B: 일정 조회 (일정 탭 클릭 시)
     * GET /api/trips/{tripId}/itineraries
     */
    @GetMapping("/{tripId}/itineraries")
    public ResponseEntity<List<ItineraryResponse>> getItineraries(@PathVariable Long tripId) {
        log.info("GET /api/trips/{}/itineraries", tripId);

        List<ItineraryResponse> itineraries = travelPlanService.getItineraries(tripId);
        return ResponseEntity.ok(itineraries);
    }

    /**
     * 옵션 B: 사진 조회 (사진 탭 클릭 시)
     * GET /api/trips/{tripId}/photos
     */
    @GetMapping("/{tripId}/photos")
    public ResponseEntity<List<PhotoResponse>> getPhotos(@PathVariable Long tripId) {
        log.info("GET /api/trips/{}/photos", tripId);

        List<PhotoResponse> photos = travelPlanService.getPhotos(tripId);
        return ResponseEntity.ok(photos);
    }

    /**
     * 옵션 B: 체크리스트 조회 (체크리스트 탭 클릭 시)
     * GET /api/trips/{tripId}/checklists
     */
    @GetMapping("/{tripId}/checklists")
    public ResponseEntity<List<ChecklistResponse>> getChecklists(@PathVariable Long tripId) {
        log.info("GET /api/trips/{}/checklists", tripId);

        List<ChecklistResponse> checklists = travelPlanService.getChecklists(tripId);
        return ResponseEntity.ok(checklists);
    }

    /**
     * 옵션 B: 경비 조회 (경비 탭 클릭 시)
     * GET /api/trips/{tripId}/expenses
     */
    @GetMapping("/{tripId}/expenses")
    public ResponseEntity<List<ExpenseResponse>> getExpenses(@PathVariable Long tripId) {
        log.info("GET /api/trips/{}/expenses", tripId);

        List<ExpenseResponse> expenses = travelPlanService.getExpenses(tripId);
        return ResponseEntity.ok(expenses);
    }

    @PostMapping("/detail/checklists")
    public ResponseEntity<ApiResponse<ChecklistResponse>> createChecklist(
            @RequestBody @Valid ChecklistCreateRequestDTO request,
            @AuthenticationPrincipal UserPrincipal user
            ){
        ChecklistResponse response = travelPlanService.createChecklist(request, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
```

---

## 6. 구현된 API 엔드포인트

### 6.1 TravelPlan CRUD

| 메서드 | URL | 설명 | 구현여부 |
|--------|-----|------|----------|
| POST | `/api/trips` | 여행 계획 생성 | ✅ |
| GET | `/api/trips` | 내 여행 목록 조회 | ✅ |
| GET | `/api/trips/{tripId}/detail` | 여행 상세 조회 | ✅ |
| PUT | `/api/trips/{tripId}` | 여행 계획 수정 | ❌ |
| DELETE | `/api/trips/{tripId}` | 여행 계획 삭제 | ❌ |

### 6.2 Itinerary (일정)

| 메서드 | URL | 설명 | 구현여부 |
|--------|-----|------|----------|
| GET | `/api/trips/{tripId}/itineraries` | 일정 목록 조회 | ✅ |
| POST | `/api/trips/{tripId}/itineraries` | 일정 추가 | ❌ |
| PUT | `/api/trips/{tripId}/itineraries/{itineraryId}` | 일정 수정 | ❌ |
| DELETE | `/api/trips/{tripId}/itineraries/{itineraryId}` | 일정 삭제 | ❌ |

### 6.3 Activity (활동)

| 메서드 | URL | 설명 | 구현여부 |
|--------|-----|------|----------|
| POST | `/api/itineraries/{itineraryId}/activities` | 활동 추가 | ❌ |
| PUT | `/api/activities/{activityId}` | 활동 수정 | ❌ |
| DELETE | `/api/activities/{activityId}` | 활동 삭제 | ❌ |

### 6.4 Photo (사진)

| 메서드 | URL | 설명 | 구현여부 |
|--------|-----|------|----------|
| GET | `/api/trips/{tripId}/photos` | 사진 목록 조회 | ✅ |
| POST | `/api/trips/{tripId}/photos` | 사진 업로드 | ❌ |
| PUT | `/api/photos/{photoId}` | 사진 정보 수정 | ❌ |
| DELETE | `/api/photos/{photoId}` | 사진 삭제 | ❌ |

### 6.5 Checklist (체크리스트)

| 메서드 | URL | 설명 | 구현여부 |
|--------|-----|------|----------|
| GET | `/api/trips/{tripId}/checklists` | 체크리스트 조회 | ✅ |
| POST | `/api/trips/detail/checklists` | 체크리스트 추가 | ✅ |
| PUT | `/api/checklists/{checklistId}` | 체크리스트 수정 | ❌ |
| PATCH | `/api/checklists/{checklistId}/complete` | 체크리스트 완료 토글 | ❌ |
| DELETE | `/api/checklists/{checklistId}` | 체크리스트 삭제 | ❌ |

### 6.6 Expense (경비)

| 메서드 | URL | 설명 | 구현여부 |
|--------|-----|------|----------|
| GET | `/api/trips/{tripId}/expenses` | 경비 목록 조회 | ✅ |
| POST | `/api/trips/{tripId}/expenses` | 경비 추가 | ❌ |
| PUT | `/api/expenses/{expenseId}` | 경비 수정 | ❌ |
| DELETE | `/api/expenses/{expenseId}` | 경비 삭제 | ❌ |

---

## 7. 미구현 기능 목록

### 7.1 필수 구현 기능

#### 7.1.1 TravelPlan 수정/삭제
```java
// Controller
@PutMapping("/{tripId}")
public ResponseEntity<ApiResponse<TravelPlanResponse>> update(
        @PathVariable Long tripId,
        @RequestBody @Valid TravelPlanCreateRequestDTO req,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}

@DeleteMapping("/{tripId}")
public ResponseEntity<ApiResponse<Void>> delete(
        @PathVariable Long tripId,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}
```

#### 7.1.2 Itinerary CRUD
```java
// POST /api/trips/{tripId}/itineraries
@PostMapping("/{tripId}/itineraries")
public ResponseEntity<ApiResponse<ItineraryResponse>> createItinerary(
        @PathVariable Long tripId,
        @RequestBody @Valid ItineraryCreateRequestDTO req,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}

// PUT /api/trips/{tripId}/itineraries/{itineraryId}
@PutMapping("/{tripId}/itineraries/{itineraryId}")
public ResponseEntity<ApiResponse<ItineraryResponse>> updateItinerary(
        @PathVariable Long tripId,
        @PathVariable Long itineraryId,
        @RequestBody @Valid ItineraryUpdateRequestDTO req,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}

// DELETE /api/trips/{tripId}/itineraries/{itineraryId}
@DeleteMapping("/{tripId}/itineraries/{itineraryId}")
public ResponseEntity<ApiResponse<Void>> deleteItinerary(
        @PathVariable Long tripId,
        @PathVariable Long itineraryId,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}
```

#### 7.1.3 Activity CRUD
```java
// POST /api/itineraries/{itineraryId}/activities
@PostMapping("/itineraries/{itineraryId}/activities")
public ResponseEntity<ApiResponse<ActivityResponse>> createActivity(
        @PathVariable Long itineraryId,
        @RequestBody @Valid ActivityCreateRequestDTO req,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}

// PUT /api/activities/{activityId}
@PutMapping("/activities/{activityId}")
public ResponseEntity<ApiResponse<ActivityResponse>> updateActivity(
        @PathVariable Long activityId,
        @RequestBody @Valid ActivityUpdateRequestDTO req,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}

// DELETE /api/activities/{activityId}
@DeleteMapping("/activities/{activityId}")
public ResponseEntity<ApiResponse<Void>> deleteActivity(
        @PathVariable Long activityId,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}
```

#### 7.1.4 Photo CRUD
```java
// POST /api/trips/{tripId}/photos
@PostMapping("/{tripId}/photos")
public ResponseEntity<ApiResponse<PhotoResponse>> uploadPhoto(
        @PathVariable Long tripId,
        @RequestParam("file") MultipartFile file,
        @RequestParam(required = false) String caption,
        @RequestParam(required = false) LocalDate takenAt,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출 (파일 업로드 + DB 저장)
}

// PUT /api/photos/{photoId}
@PutMapping("/photos/{photoId}")
public ResponseEntity<ApiResponse<PhotoResponse>> updatePhoto(
        @PathVariable Long photoId,
        @RequestBody @Valid PhotoUpdateRequestDTO req,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}

// DELETE /api/photos/{photoId}
@DeleteMapping("/photos/{photoId}")
public ResponseEntity<ApiResponse<Void>> deletePhoto(
        @PathVariable Long photoId,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출 (파일 삭제 + DB 삭제)
}
```

#### 7.1.5 Checklist 수정/삭제/완료토글
```java
// PUT /api/checklists/{checklistId}
@PutMapping("/checklists/{checklistId}")
public ResponseEntity<ApiResponse<ChecklistResponse>> updateChecklist(
        @PathVariable Long checklistId,
        @RequestBody @Valid ChecklistUpdateRequestDTO req,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}

// PATCH /api/checklists/{checklistId}/complete
@PatchMapping("/checklists/{checklistId}/complete")
public ResponseEntity<ApiResponse<ChecklistResponse>> toggleComplete(
        @PathVariable Long checklistId,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출 (완료 상태 토글)
}

// DELETE /api/checklists/{checklistId}
@DeleteMapping("/checklists/{checklistId}")
public ResponseEntity<ApiResponse<Void>> deleteChecklist(
        @PathVariable Long checklistId,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}
```

#### 7.1.6 Expense CRUD
```java
// POST /api/trips/{tripId}/expenses
@PostMapping("/{tripId}/expenses")
public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
        @PathVariable Long tripId,
        @RequestBody @Valid ExpenseCreateRequestDTO req,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}

// PUT /api/expenses/{expenseId}
@PutMapping("/expenses/{expenseId}")
public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
        @PathVariable Long expenseId,
        @RequestBody @Valid ExpenseUpdateRequestDTO req,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}

// DELETE /api/expenses/{expenseId}
@DeleteMapping("/expenses/{expenseId}")
public ResponseEntity<ApiResponse<Void>> deleteExpense(
        @PathVariable Long expenseId,
        @AuthenticationPrincipal UserPrincipal user) {
    // Service 호출
}
```

---

## 8. 핵심 패턴 및 주의사항

### 8.1 Entity vs DTO 분리
- **Entity**: 데이터베이스 테이블과 1:1 매핑, Repository에서만 사용
- **Request DTO**: 클라이언트 → 서버 데이터 전송, 유효성 검증 포함
- **Response DTO**: 서버 → 클라이언트 데이터 전송, 필요한 정보만 노출

### 8.2 N+1 문제 방지
```java
// BAD: N+1 발생
List<TravelChecklist> checklists = checklistRepository.findByTripId(tripId);
for (TravelChecklist checklist : checklists) {
    UserEntity user = userRepository.findById(checklist.getAssigneeUserId()); // N번 조회
}

// GOOD: 배치 로딩
List<Long> userIds = checklists.stream()
    .map(TravelChecklist::getAssigneeUserId)
    .distinct()
    .collect(Collectors.toList());
Map<Long, UserEntity> userMap = userRepository.findAllById(userIds).stream()
    .collect(Collectors.toMap(UserEntity::getId, user -> user));
```

### 8.3 @Transactional 사용
- **읽기 전용**: `@Transactional(readOnly = true)` - 성능 최적화
- **쓰기 작업**: `@Transactional` - 원자성 보장

### 8.4 Validation
- `@NotNull`: null 체크 (Long, Integer 등)
- `@NotBlank`: null, "", "   " 체크 (String만)
- `@NotEmpty`: null, 빈 컬렉션 체크

### 8.5 Builder 패턴
```java
// Entity 생성 시 Builder 사용
TravelChecklist checklist = TravelChecklist.builder()
    .tripId(request.getTripId())
    .task(request.getTask())
    .completed(false)
    .displayOrder(order)
    .build();
```

### 8.6 권한 검증
```java
// 참여자인지 확인
TravelParticipant member = participantRepository.findByTripIdAndUserId(tripId, userId)
    .orElseThrow(() -> new RuntimeException("여행 참여자만 접근 가능합니다"));

// OWNER인지 확인
if (!"OWNER".equals(member.getRole())) {
    throw new RuntimeException("권한이 없습니다");
}
```

---

## 9. 손코딩 시 체크리스트

### 9.1 Controller 작성 시
- [ ] `@RestController` 어노테이션
- [ ] `@RequestMapping("/api/trips")` 경로 설정
- [ ] `@AuthenticationPrincipal UserPrincipal user` 인증 처리
- [ ] `@Valid` + `BindingResult` 유효성 검증
- [ ] `ApiResponse` 래핑
- [ ] try-catch 예외 처리

### 9.2 Service 작성 시
- [ ] `@Service` + `@RequiredArgsConstructor`
- [ ] `@Transactional` 트랜잭션 처리
- [ ] 권한 검증 로직
- [ ] N+1 방지 (배치 로딩)
- [ ] Entity → DTO 변환

### 9.3 Repository 작성 시
- [ ] `extends JpaRepository<Entity, Long>`
- [ ] 메서드 네이밍 규칙 (findBy, countBy, existsBy)
- [ ] `@Query` JPQL 작성 시 COALESCE 사용

### 9.4 DTO 작성 시
- [ ] Request DTO: `@NotNull`, `@NotBlank`, `@Size` 검증
- [ ] Response DTO: `@Builder` 패턴
- [ ] Lombok: `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`

### 9.5 Entity 작성 시
- [ ] `@Entity` + `@Table(name="테이블명")`
- [ ] `@Id` + `@GeneratedValue(strategy = GenerationType.IDENTITY)`
- [ ] `@Builder.Default` 기본값 설정
- [ ] `@CreationTimestamp` 생성 시간 자동 기록

---

**손코딩 화이팅! 🚀**
