# 데이터베이스 테이블 명세서 (초안)

이 문서는 제공된 요구사항 목록과 현재 백엔드 Entity 설계를 기반으로 작성된 데이터베이스 테이블 명세서입니다. 각 테이블의 목적, 컬럼, 데이터 타입 및 제약 조건을 정의합니다.

---

## 1. `users` 테이블 (사용자 정보)

*   **목적**: 회원가입 및 로그인 기능을 위한 사용자 기본 정보를 저장합니다. (요구사항 1, 2, 4)
*   **대응 Entity**: `UserEntity`

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 사용자 고유 ID |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | 사용자 로그인 아이디 (일반 로그인용) |
| `name` | VARCHAR(30) | NULLABLE | 사용자 실명 |
| `nickname` | VARCHAR(30) | UNIQUE, NULLABLE | 사용자 닉네임 (요구사항 4) |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | 사용자 이메일 (로그인 및 비밀번호 찾기용) |
| `password` | VARCHAR(255) | NULLABLE | 암호화된 비밀번호 (소셜 로그인 시 NULL) |
| `role` | VARCHAR(20) | NOT NULL | 사용자 역할 (예: 'ROLE_USER', 'ROLE_ADMIN') |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 계정 생성 일시 |
| `is_deleted` | BOOLEAN | NOT NULL, DEFAULT FALSE | 계정 삭제 여부 (소프트 삭제) |
| `deleted_at` | DATETIME | NULLABLE | 계정 삭제 일시 |

---

## 2. `travel_plans` 테이블 (여행 플랜)

*   **목적**: 사용자가 생성하는 여행 플랜의 기본 정보를 저장합니다. (요구사항 5, 7, 8, 9, 10)
*   **대응 Entity**: `TravelPlanEntity`

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 여행 플랜 고유 ID |
| `user_id` | BIGINT | FK (`users.id`), NOT NULL | 플랜을 작성한 사용자 ID |
| `title` | VARCHAR(255) | NOT NULL | 여행 플랜 제목 |
| `description` | TEXT | NULLABLE | 여행 플랜 설명 |
| `start_date` | DATE | NOT NULL | 여행 시작일 |
| `end_date` | DATE | NOT NULL | 여행 종료일 |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 플랜 생성 일시 |
| `visibility` | VARCHAR(20) | NOT NULL, DEFAULT 'PUBLIC' | 플랜 공개 여부 (PUBLIC/PRIVATE) |
| `is_deleted` | BOOLEAN | NOT NULL, DEFAULT FALSE | 플랜 삭제 여부 (소프트 삭제) |

---

## 3. `travel_days` 테이블 (여행 일차별 정보)

*   **목적**: 특정 여행 플랜의 각 일차에 대한 정보를 저장합니다. (요구사항 6)
*   **대응 Entity**: `TravelDayEntity`

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 여행 일차 고유 ID |
| `plan_id` | BIGINT | FK (`travel_plans.id`), NOT NULL | 해당 여행 플랜 ID |
| `day_number` | INT | NOT NULL | 여행 일차 (예: 1, 2, 3) |
| `memo` | TEXT | NULLABLE | 해당 일차에 대한 메모 |

---

## 4. `travel_places` 테이블 (여행 장소)

*   **목적**: 여행 일차별로 방문할 장소 정보를 저장합니다. (요구사항 6)
*   **대응 Entity**: `TravelPlaceEntity`

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 여행 장소 고유 ID |
| `day_id` | BIGINT | FK (`travel_days.id`), NOT NULL | 해당 여행 일차 ID |
| `name` | VARCHAR(255) | NOT NULL | 장소 이름 |
| `location` | VARCHAR(255) | NULLABLE | 장소 주소 또는 위치 정보 |
| `memo` | TEXT | NULLABLE | 장소에 대한 메모 |

---

## 5. `companion_posts` 테이블 (동행 모집글)

*   **목적**: 사용자가 작성하는 동행 모집글 정보를 저장합니다. (요구사항 11, 14)
*   **대응 Entity**: `CompanionPostEntity`

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 동행 모집글 고유 ID |
| `user_id` | BIGINT | FK (`users.id`), NOT NULL | 모집글 작성자 ID |
| `title` | VARCHAR(255) | NOT NULL | 모집글 제목 |
| `description` | TEXT | NULLABLE | 모집글 상세 설명 |
| `region` | VARCHAR(100) | NOT NULL | 동행 희망 지역 |
| `start_date` | DATE | NOT NULL | 동행 시작일 |
| `end_date` | DATE | NOT NULL | 동행 종료일 |
| `status` | VARCHAR(50) | NOT NULL | 모집 현황 (예: '모집중', '마감') |
| `max_member` | INT | NULLABLE | 최대 모집 인원 |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 모집글 작성 일시 |
| `is_deleted` | BOOLEAN | NOT NULL, DEFAULT FALSE | 모집글 삭제 여부 (소프트 삭제) |

---

## 6. `companion_joins` 테이블 (동행 신청/참여)

*   **목적**: 사용자가 동행 모집글에 신청하거나 참여하는 정보를 저장합니다. (요구사항 12, 15)
*   **대응 Entity**: `CompanionJoinEntity`

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 동행 신청 고유 ID |
| `post_id` | BIGINT | FK (`companion_posts.id`), NOT NULL | 신청한 동행 모집글 ID |
| `user_id` | BIGINT | FK (`users.id`), NOT NULL | 신청한 사용자 ID |
| `status` | VARCHAR(50) | NOT NULL | 신청 상태 (예: '신청', '수락', '거절') |
| `applied_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 신청 일시 |

---

## 7. `companion_chats` 테이블 (동행 채팅)

*   **목적**: 동행 참여자들 간의 채팅 메시지를 저장합니다. (요구사항 13)
*   **대응 Entity**: `CompanionChatEntity`

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 채팅 메시지 고유 ID |
| `post_id` | BIGINT | FK (`companion_posts.id`), NOT NULL | 해당 동행 모집글 ID |
| `user_id` | BIGINT | FK (`users.id`), NOT NULL | 메시지를 보낸 사용자 ID |
| `message` | TEXT | NOT NULL | 채팅 메시지 내용 |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 메시지 전송 일시 |

---

## 8. `travel_reviews` 테이블 (여행 플랜 후기)

*   **목적**: 여행 플랜에 대한 후기 및 평점을 저장합니다. (요구사항 16, 18, 19)
*   **대응 Entity**: `TravelReviewEntity`

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 후기 고유 ID |
| `plan_id` | BIGINT | FK (`travel_plans.id`), NOT NULL | 해당 여행 플랜 ID |
| `user_id` | BIGINT | FK (`users.id`), NOT NULL | 후기 작성자 ID |
| `content` | VARCHAR(2000) | NOT NULL | 후기 내용 |
| `rating` | INT | NULLABLE | 평점 (1~5) |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 후기 작성 일시 |
| `is_deleted` | BOOLEAN | NOT NULL, DEFAULT FALSE | 후기 삭제 여부 (소프트 삭제) |

---

## 9. `site_reviews` 테이블 (사이트 후기)

*   **목적**: 사이트/서비스에 대한 사용자 후기 및 평점을 저장합니다. (요구사항 23)
*   **대응 Entity**: `SiteReviewEntity`

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 사이트 후기 고유 ID |
| `user_id` | BIGINT | FK (`users.id`), NOT NULL | 후기 작성자 ID |
| `content` | VARCHAR(1000) | NOT NULL | 후기 내용 |
| `rating` | INT | NULLABLE | 평점 |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 후기 작성 일시 |

---

## 10. `qas` 테이블 (Q&A 질문)

*   **목적**: Q&A 게시판의 질문글을 저장합니다. (요구사항 20, 22)
*   **대응 Entity**: `QnaEntity`

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 질문글 고유 ID |
| `user_id` | BIGINT | FK (`users.id`), NOT NULL | 질문 작성자 ID |
| `title` | VARCHAR(255) | NOT NULL | 질문 제목 |
| `content` | VARCHAR(2000) | NOT NULL | 질문 내용 |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 질문 작성 일시 |
| `is_deleted` | BOOLEAN | NOT NULL, DEFAULT FALSE | 질문 삭제 여부 (소프트 삭제) |

---

## 11. 추가 제안 테이블 (요구사항 기반)

현재 Entity 설계에 직접적으로 반영되지 않았지만, 요구사항을 충족하기 위해 필요하다고 판단되는 테이블들입니다.

### 11.1. `companion_reviews` 테이블 (동행 후기)

*   **목적**: 동행 경험에 대한 후기 및 평점을 저장합니다. (요구사항 17)
*   **필요성**: `TravelReviewEntity`는 `plan_id`에 연결되어 있어 여행 플랜 후기에 가깝습니다. 동행 자체에 대한 후기를 별도로 관리하기 위해 제안합니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 동행 후기 고유 ID |
| `companion_post_id` | BIGINT | FK (`companion_posts.id`), NOT NULL | 해당 동행 모집글 ID |
| `user_id` | BIGINT | FK (`users.id`), NOT NULL | 후기 작성자 ID |
| `content` | VARCHAR(2000) | NOT NULL | 후기 내용 |
| `rating` | INT | NULLABLE | 평점 (1~5) |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 후기 작성 일시 |
| `is_deleted` | BOOLEAN | NOT NULL, DEFAULT FALSE | 후기 삭제 여부 (소프트 삭제) |

### 11.2. `qna_replies` 테이블 (Q&A 답변/댓글)

*   **목적**: Q&A 질문에 대한 답변 또는 댓글을 저장합니다. (요구사항 21)
*   **필요성**: `QnaEntity`는 질문 본문만 가지고 있습니다. 답변 기능을 위해 제안합니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 답변/댓글 고유 ID |
| `qna_id` | BIGINT | FK (`qas.id`), NOT NULL | 해당 질문글 ID |
| `user_id` | BIGINT | FK (`users.id`), NOT NULL | 답변/댓글 작성자 ID |
| `content` | VARCHAR(2000) | NOT NULL | 답변/댓글 내용 |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 작성 일시 |
| `is_deleted` | BOOLEAN | NOT NULL, DEFAULT FALSE | 삭제 여부 (소프트 삭제) |
| `parent_reply_id` | BIGINT | FK (`qna_replies.id`), NULLABLE | 부모 답변/댓글 ID (대댓글 구현 시) |

---

## 12. 전체적인 수정 제안

1.  **Entity와 테이블 명칭 일관성**:
    *   `QnaEntity`가 `qas` 테이블로 매핑되어 있습니다. `qnas` 또는 `questions`와 같이 Entity 이름과 테이블 이름의 일관성을 맞추는 것을 고려해볼 수 있습니다. (현재도 동작에는 문제 없음)
2.  **`TravelReviewEntity`의 `plan_id` 제약 조건**:
    *   현재 `TravelReviewEntity`의 `plan_id`는 `NOT NULL`입니다. 만약 동행 후기(`companion_reviews`)를 별도 테이블로 만들지 않고 `TravelReviewEntity`를 확장하여 플랜 후기와 동행 후기를 모두 담으려면, `plan_id`와 `companion_post_id` 둘 중 하나는 `NULL`을 허용해야 합니다. 하지만 위 명세에서는 `companion_reviews`를 별도 테이블로 제안했으므로, `TravelReviewEntity`는 `plan_id`가 `NOT NULL`인 것이 적절합니다.
3.  **`is_deleted` 필드 활용**:
    *   대부분의 Entity에 `is_deleted` 필드가 잘 적용되어 있어 소프트 삭제 전략을 따르고 있음을 알 수 있습니다. 이는 데이터 보존 및 복구에 유리합니다.
4.  **인덱스 및 성능 고려**:
    *   이 명세는 논리적 설계에 가깝습니다. 실제 운영 환경에서는 외래 키(`FK`)가 걸린 컬럼이나 자주 검색 조건으로 사용되는 컬럼에 인덱스(Index)를 추가하여 쿼리 성능을 최적화해야 합니다. (예: `travel_plans.user_id`, `companion_posts.user_id`, `travel_reviews.plan_id` 등)
5.  **데이터 길이 및 타입 재검토**:
    *   `VARCHAR`의 길이(예: `VARCHAR(255)`, `VARCHAR(1000)`, `VARCHAR(2000)`)는 실제 저장될 데이터의 최대 길이를 고려하여 적절하게 설정되었는지 다시 한번 검토하는 것이 좋습니다. 너무 길면 공간 낭비, 너무 짧으면 데이터 잘림이 발생할 수 있습니다. `TEXT` 타입은 긴 텍스트에 적합합니다.
6.  **`DATETIME` vs `TIMESTAMP`**:
    *   `created_at`과 같은 시간 정보는 `DATETIME` 또는 `TIMESTAMP` 중 어떤 것을 사용할지 DBMS의 특성과 요구사항(타임존 처리 등)을 고려하여 결정하는 것이 좋습니다. 현재 `DATETIME`으로 통일되어 있습니다.

---

이 명세서는 현재 프로젝트의 데이터베이스 구조를 명확히 이해하고, 향후 기능을 확장하는 데 매우 유용한 자료가 될 것입니다. 특히 제안된 추가 테이블들은 요구사항을 완전히 충족시키기 위해 필요한 부분입니다.
