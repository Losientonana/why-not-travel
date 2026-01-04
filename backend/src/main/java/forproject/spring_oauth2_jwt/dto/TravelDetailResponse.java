package forproject.spring_oauth2_jwt.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    private Long estimatedCost;
    private String visibility;

    // 상태 정보
    private String status;

    // ?? 왜 두개가 필요할까?
    private String statusDescription;

    // 참여자 정보
    private List<ParticipantDTO> participants;

    // 통계 정보 (count만)
    private TravelStatisticsDTO statistics;

    // 현재 사용자 권한
    private String currentUserRole;
    private Boolean isOwner;
}

