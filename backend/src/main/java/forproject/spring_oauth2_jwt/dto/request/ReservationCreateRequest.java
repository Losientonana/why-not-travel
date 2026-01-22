package forproject.spring_oauth2_jwt.dto.request;


import forproject.spring_oauth2_jwt.enums.ReservationStatus;
import forproject.spring_oauth2_jwt.enums.ReservationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationCreateRequest {

    @NotNull(message = "예약 타입은 필수입니다")
    private ReservationType type;

    private ReservationStatus status; // 기본값: PENDING

    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 100, message = "제목은 100자 이내로 입력해주세요")
    private String title;

    @Size(max = 500, message = "설명은 500자 이내로 입력해주세요")
    private String description;

    @NotNull(message = "시작 날짜는 필수입니다")
    private LocalDate startDate;

    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;

    // 가격 정보
    private BigDecimal price;
    private String currency;

    // 예약 정보
    @Size(max = 100, message = "예약번호는 100자 이내로 입력해주세요")
    private String confirmationNumber;

    @Size(max = 50, message = "예약 플랫폼은 50자 이내로 입력해주세요")
    private String bookingPlatform;

    @Size(max = 500, message = "예약 URL은 500자 이내로 입력해주세요")
    private String bookingUrl;

    @Size(max = 1000, message = "메모는 1000자 이내로 입력해주세요")
    private String notes;

    // 위치 정보
    private String locationAddress;
    private Double locationLat;
    private Double locationLng;
    private String locationPlaceId;

    // 항공 전용
    private String flightNumber;
    private String airline;
    private String departureAirport;
    private String arrivalAirport;

    // 숙소 전용
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private String roomType;
    private Integer guestCount;

    // 레스토랑 전용
    private LocalTime reservationTime;
    private Integer partySize;

    // 교통 전용
    private String transportType;
    private String pickupAddress;
    private String dropoffAddress;
}