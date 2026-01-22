package forproject.spring_oauth2_jwt.dto.response;


import forproject.spring_oauth2_jwt.entity.Reservation;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {

    private Long id;
    private Long tripId;

    // 공통 필드
    private String type;
    private String status;
    private String title;
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
    private LocationInfo location;

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

    // 메타 정보
    private CreatedByInfo createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationInfo {
        private String address;
        private Double latitude;
        private Double longitude;
        private String placeId;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatedByInfo {
        private Long userId;
        private String userName;
    }

    /**
     * Entity → Response 변환
     */
    public static ReservationResponse fromEntity(Reservation reservation, UserEntity creator) {
        if (reservation == null) {
            return null;
        }

        String creatorName = (creator != null) ? creator.getName() : "알 수 없음";

        LocationInfo locationInfo = null;
        if (reservation.getLocationAddress() != null) {
            locationInfo = LocationInfo.builder()
                    .address(reservation.getLocationAddress())
                    .latitude(reservation.getLocationLat())
                    .longitude(reservation.getLocationLng())
                    .placeId(reservation.getLocationPlaceId())
                    .build();
        }

        return ReservationResponse.builder()
                .id(reservation.getId())
                .tripId(reservation.getTripId())
                // 공통
                .type(reservation.getType().name())
                .status(reservation.getStatus().name())
                .title(reservation.getTitle())
                .description(reservation.getDescription())
                .startDate(reservation.getStartDate())
                .endDate(reservation.getEndDate())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                // 가격
                .price(reservation.getPrice())
                .currency(reservation.getCurrency())
                // 예약 정보
                .confirmationNumber(reservation.getConfirmationNumber())
                .bookingPlatform(reservation.getBookingPlatform())
                .bookingUrl(reservation.getBookingUrl())
                .notes(reservation.getNotes())
                // 위치
                .location(locationInfo)
                // 항공
                .flightNumber(reservation.getFlightNumber())
                .airline(reservation.getAirline())
                .departureAirport(reservation.getDepartureAirport())
                .arrivalAirport(reservation.getArrivalAirport())
                .checkedBaggageEnabled(reservation.getCheckedBaggageEnabled())
                .checkedBaggageWeight(reservation.getCheckedBaggageWeight())
                .carryOnBaggageEnabled(reservation.getCarryOnBaggageEnabled())
                .carryOnBaggageWeight(reservation.getCarryOnBaggageWeight())
                .flightDuration(reservation.getFlightDuration())
                .checkInDeadline(reservation.getCheckInDeadline())
                .seatAssigned(reservation.getSeatAssigned())
                .seatNumber(reservation.getSeatNumber())
                // 숙소
                .checkInTime(reservation.getCheckInTime())
                .checkOutTime(reservation.getCheckOutTime())
                .roomType(reservation.getRoomType())
                .guestCount(reservation.getGuestCount())
                .hotelPhone(reservation.getHotelPhone())
                .breakfastIncluded(reservation.getBreakfastIncluded())
                // 레스토랑
                .reservationTime(reservation.getReservationTime())
                .partySize(reservation.getPartySize())
                // 교통
                .transportType(reservation.getTransportType())
                .pickupAddress(reservation.getPickupAddress())
                .dropoffAddress(reservation.getDropoffAddress())
                // 기차
                .departureStation(reservation.getDepartureStation())
                .arrivalStation(reservation.getArrivalStation())
                .trainDuration(reservation.getTrainDuration())
                .trainSeatNumber(reservation.getTrainSeatNumber())
                .trainSeatClass(reservation.getTrainSeatClass())
                // 메타
                .createdBy(CreatedByInfo.builder()
                        .userId(reservation.getCreatedBy())
                        .userName(creatorName)
                        .build())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .build();
    }
}