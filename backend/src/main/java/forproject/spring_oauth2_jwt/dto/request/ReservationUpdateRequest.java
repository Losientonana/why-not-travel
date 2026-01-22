package forproject.spring_oauth2_jwt.dto.request;

import forproject.spring_oauth2_jwt.enums.ReservationStatus;
import forproject.spring_oauth2_jwt.enums.ReservationType;
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
public class ReservationUpdateRequest {

    private ReservationType type;
    private ReservationStatus status;

    @Size(max = 100, message = "제목은 100자 이내로 입력해주세요")
    private String title;

    @Size(max = 500, message = "설명은 500자 이내로 입력해주세요")
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;

    // 가격 정보
    private BigDecimal price;
    private String currency;

    // 예약 정보
    private String confirmationNumber;
    private String bookingPlatform;
    private String bookingUrl;
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
    private Boolean checkedBaggageEnabled;
    private Integer checkedBaggageWeight;
    private Boolean carryOnBaggageEnabled;
    private Integer carryOnBaggageWeight;
    private Integer flightDuration;
    private LocalTime checkInDeadline;
    private Boolean seatAssigned;
    private String seatNumber;

    // 숙소 전용
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private String roomType;
    private Integer guestCount;
    private String hotelPhone;
    private Boolean breakfastIncluded;

    // 레스토랑 전용
    private LocalTime reservationTime;
    private Integer partySize;

    // 교통 전용
    private String transportType;
    private String pickupAddress;
    private String dropoffAddress;

    // 기차 전용
    private String departureStation;
    private String arrivalStation;
    private Integer trainDuration;
    private String trainSeatNumber;
    private String trainSeatClass;
}