package forproject.spring_oauth2_jwt.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.quartz.SimpleTrigger;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 여행 진행 상태
 * 여행 공개범위
 * 여행 제목
 * 여행 날짜
 * 여행 장소
 * 참여 수
 * 일정 갯수
 * 사진 갯수
 * 체크리스트 전체 갯수
 */
@Getter
@Setter
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

    // 외화 설정
    private String foreignCurrency;  // "JPY", "USD" 등 (null이면 KRW만)
    private BigDecimal exchangeRate; // 1 외화 = X 원 (예: 9.3 = 1엔당 9.3원)

}
