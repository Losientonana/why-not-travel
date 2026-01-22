package forproject.spring_oauth2_jwt.entity;

import forproject.spring_oauth2_jwt.enums.ReservationType;
import forproject.spring_oauth2_jwt.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "reservation", indexes = {
        @Index(name = "idx_reservation_trip", columnList = "trip_id"),
        @Index(name = "idx_reservation_type", columnList = "trip_id, type"),
        @Index(name = "idx_reservation_status", columnList = "trip_id, status"),
        @Index(name = "idx_reservation_date", columnList = "trip_id, start_date")
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    // ========== 공통 필드 ==========

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private ReservationType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private ReservationStatus status = ReservationStatus.PENDING;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    // ========== 가격 정보 ==========

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "currency", length = 10)
    @Builder.Default
    private String currency = "KRW";

    // ========== 예약 정보 ==========

    @Column(name = "confirmation_number", length = 100)
    private String confirmationNumber;

    @Column(name = "booking_platform", length = 50)
    private String bookingPlatform;

    @Column(name = "booking_url", length = 500)
    private String bookingUrl;

    @Column(name = "notes", length = 1000)
    private String notes;

    // ========== 위치 정보 ==========

    @Column(name = "location_address", length = 300)
    private String locationAddress;

    @Column(name = "location_lat")
    private Double locationLat;

    @Column(name = "location_lng")
    private Double locationLng;

    @Column(name = "location_place_id", length = 100)
    private String locationPlaceId;

    // ========== 항공 전용 필드 ==========

    @Column(name = "flight_number", length = 20)
    private String flightNumber;

    @Column(name = "airline", length = 50)
    private String airline;

    @Column(name = "departure_airport", length = 10)
    private String departureAirport;

    @Column(name = "arrival_airport", length = 10)
    private String arrivalAirport;

    // ========== 숙소 전용 필드 ==========

    @Column(name = "check_in_time")
    private LocalTime checkInTime;

    @Column(name = "check_out_time")
    private LocalTime checkOutTime;

    @Column(name = "room_type", length = 50)
    private String roomType;

    @Column(name = "guest_count")
    private Integer guestCount;

    // ========== 레스토랑 전용 필드 ==========

    @Column(name = "reservation_time")
    private LocalTime reservationTime;

    @Column(name = "party_size")
    private Integer partySize;

    // ========== 교통 전용 필드 ==========

    @Column(name = "transport_type", length = 20)
    private String transportType; // bus, train, subway, taxi, rental

    @Column(name = "pickup_address", length = 300)
    private String pickupAddress;

    @Column(name = "dropoff_address", length = 300)
    private String dropoffAddress;

    // ========== 메타 정보 ==========

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}