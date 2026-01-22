package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.annotation.RequiresTripParticipant;
import forproject.spring_oauth2_jwt.dto.request.ReservationCreateRequest;
import forproject.spring_oauth2_jwt.dto.request.ReservationUpdateRequest;
import forproject.spring_oauth2_jwt.dto.response.ReservationResponse;
import forproject.spring_oauth2_jwt.entity.Reservation;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.enums.ReservationStatus;
import forproject.spring_oauth2_jwt.enums.ReservationType;
import forproject.spring_oauth2_jwt.repository.ReservationRepository;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    /**
     * 예약 등록
     */
    @RequiresTripParticipant
    @Transactional
    public ReservationResponse createReservation(Long tripId, Long userId, ReservationCreateRequest request) {
        log.info("예약 등록 - tripId: {}, userId: {}, type: {}", tripId, userId, request.getType());

        Reservation reservation = Reservation.builder()
                .tripId(tripId)
                .type(request.getType())
                .status(request.getStatus() != null ? request.getStatus() : ReservationStatus.PENDING)
                .title(request.getTitle())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                // 가격
                .price(request.getPrice())
                .currency(request.getCurrency() != null ? request.getCurrency() : "KRW")
                // 예약 정보
                .confirmationNumber(request.getConfirmationNumber())
                .bookingPlatform(request.getBookingPlatform())
                .bookingUrl(request.getBookingUrl())
                .notes(request.getNotes())
                // 위치
                .locationAddress(request.getLocationAddress())
                .locationLat(request.getLocationLat())
                .locationLng(request.getLocationLng())
                .locationPlaceId(request.getLocationPlaceId())
                // 항공
                .flightNumber(request.getFlightNumber())
                .airline(request.getAirline())
                .departureAirport(request.getDepartureAirport())
                .arrivalAirport(request.getArrivalAirport())
                .checkedBaggageEnabled(request.getCheckedBaggageEnabled())
                .checkedBaggageWeight(request.getCheckedBaggageWeight())
                .carryOnBaggageEnabled(request.getCarryOnBaggageEnabled())
                .carryOnBaggageWeight(request.getCarryOnBaggageWeight())
                .flightDuration(request.getFlightDuration())
                .checkInDeadline(request.getCheckInDeadline())
                .seatAssigned(request.getSeatAssigned())
                .seatNumber(request.getSeatNumber())
                // 숙소
                .checkInTime(request.getCheckInTime())
                .checkOutTime(request.getCheckOutTime())
                .roomType(request.getRoomType())
                .guestCount(request.getGuestCount())
                .hotelPhone(request.getHotelPhone())
                .breakfastIncluded(request.getBreakfastIncluded())
                // 레스토랑
                .reservationTime(request.getReservationTime())
                .partySize(request.getPartySize())
                // 교통
                .transportType(request.getTransportType())
                .pickupAddress(request.getPickupAddress())
                .dropoffAddress(request.getDropoffAddress())
                // 기차
                .departureStation(request.getDepartureStation())
                .arrivalStation(request.getArrivalStation())
                .trainDuration(request.getTrainDuration())
                .trainSeatNumber(request.getTrainSeatNumber())
                .trainSeatClass(request.getTrainSeatClass())
                // 메타
                .createdBy(userId)
                .build();

        Reservation saved = reservationRepository.save(reservation);
        log.info("예약 등록 완료 - reservationId: {}", saved.getId());

        UserEntity creator = userRepository.findById(userId).orElse(null);
        return ReservationResponse.fromEntity(saved, creator);
    }

    /**
     * 전체 예약 조회
     */
    @RequiresTripParticipant
    @Transactional(readOnly = true)
    public List<ReservationResponse> getAllReservations(Long tripId, Long userId) {
        log.info("전체 예약 조회 - tripId: {}, userId: {}", tripId, userId);

        List<Reservation> reservations = reservationRepository.findByTripIdOrderByStartDateAscStartTimeAsc(tripId);
        Map<Long, UserEntity> userMap = getUserMap(reservations);

        return reservations.stream()
                .map(r -> ReservationResponse.fromEntity(r, userMap.get(r.getCreatedBy())))
                .collect(Collectors.toList());
    }

    /**
     * 타입별 예약 조회
     */
    @RequiresTripParticipant
    @Transactional(readOnly = true)
    public List<ReservationResponse> getReservationsByType(Long tripId, Long userId, ReservationType type) {
        log.info("타입별 예약 조회 - tripId: {}, userId: {}, type: {}", tripId, userId, type);

        List<Reservation> reservations = reservationRepository.findByTripIdAndTypeOrderByStartDateAsc(tripId, type);
        Map<Long, UserEntity> userMap = getUserMap(reservations);

        return reservations.stream()
                .map(r -> ReservationResponse.fromEntity(r, userMap.get(r.getCreatedBy())))
                .collect(Collectors.toList());
    }

    /**
     * 단일 예약 조회
     */
    @RequiresTripParticipant
    @Transactional(readOnly = true)
    public ReservationResponse getReservation(Long tripId, Long userId, Long reservationId) {
        log.info("단일 예약 조회 - tripId: {}, userId: {}, reservationId: {}", tripId, userId, reservationId);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationId));

        if (!reservation.getTripId().equals(tripId)) {
            throw new IllegalArgumentException("해당 여행의 예약이 아닙니다");
        }

        UserEntity creator = userRepository.findById(reservation.getCreatedBy()).orElse(null);
        return ReservationResponse.fromEntity(reservation, creator);
    }

    /**
     * 예약 수정
     */
    @RequiresTripParticipant
    @Transactional
    public ReservationResponse updateReservation(Long tripId, Long userId, Long reservationId, ReservationUpdateRequest request) {
        log.info("예약 수정 - tripId: {}, userId: {}, reservationId: {}", tripId, userId, reservationId);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationId));

        if (!reservation.getTripId().equals(tripId)) {
            throw new IllegalArgumentException("해당 여행의 예약이 아닙니다");
        }

        // 등록자만 수정 가능
        if (!reservation.getCreatedBy().equals(userId)) {
            throw new IllegalArgumentException("예약 등록자만 수정할 수 있습니다");
        }

        // null이 아닌 필드만 업데이트
        if (request.getType() != null) reservation.setType(request.getType());
        if (request.getStatus() != null) reservation.setStatus(request.getStatus());
        if (request.getTitle() != null) reservation.setTitle(request.getTitle());
        if (request.getDescription() != null) reservation.setDescription(request.getDescription());
        if (request.getStartDate() != null) reservation.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) reservation.setEndDate(request.getEndDate());
        if (request.getStartTime() != null) reservation.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) reservation.setEndTime(request.getEndTime());
        // 가격
        if (request.getPrice() != null) reservation.setPrice(request.getPrice());
        if (request.getCurrency() != null) reservation.setCurrency(request.getCurrency());
        // 예약 정보
        if (request.getConfirmationNumber() != null) reservation.setConfirmationNumber(request.getConfirmationNumber());
        if (request.getBookingPlatform() != null) reservation.setBookingPlatform(request.getBookingPlatform());
        if (request.getBookingUrl() != null) reservation.setBookingUrl(request.getBookingUrl());
        if (request.getNotes() != null) reservation.setNotes(request.getNotes());
        // 위치
        if (request.getLocationAddress() != null) reservation.setLocationAddress(request.getLocationAddress());
        if (request.getLocationLat() != null) reservation.setLocationLat(request.getLocationLat());
        if (request.getLocationLng() != null) reservation.setLocationLng(request.getLocationLng());
        if (request.getLocationPlaceId() != null) reservation.setLocationPlaceId(request.getLocationPlaceId());
        // 항공
        if (request.getFlightNumber() != null) reservation.setFlightNumber(request.getFlightNumber());
        if (request.getAirline() != null) reservation.setAirline(request.getAirline());
        if (request.getDepartureAirport() != null) reservation.setDepartureAirport(request.getDepartureAirport());
        if (request.getArrivalAirport() != null) reservation.setArrivalAirport(request.getArrivalAirport());
        if (request.getCheckedBaggageEnabled() != null) reservation.setCheckedBaggageEnabled(request.getCheckedBaggageEnabled());
        if (request.getCheckedBaggageWeight() != null) reservation.setCheckedBaggageWeight(request.getCheckedBaggageWeight());
        if (request.getCarryOnBaggageEnabled() != null) reservation.setCarryOnBaggageEnabled(request.getCarryOnBaggageEnabled());
        if (request.getCarryOnBaggageWeight() != null) reservation.setCarryOnBaggageWeight(request.getCarryOnBaggageWeight());
        if (request.getFlightDuration() != null) reservation.setFlightDuration(request.getFlightDuration());
        if (request.getCheckInDeadline() != null) reservation.setCheckInDeadline(request.getCheckInDeadline());
        if (request.getSeatAssigned() != null) reservation.setSeatAssigned(request.getSeatAssigned());
        if (request.getSeatNumber() != null) reservation.setSeatNumber(request.getSeatNumber());
        // 숙소
        if (request.getCheckInTime() != null) reservation.setCheckInTime(request.getCheckInTime());
        if (request.getCheckOutTime() != null) reservation.setCheckOutTime(request.getCheckOutTime());
        if (request.getRoomType() != null) reservation.setRoomType(request.getRoomType());
        if (request.getGuestCount() != null) reservation.setGuestCount(request.getGuestCount());
        if (request.getHotelPhone() != null) reservation.setHotelPhone(request.getHotelPhone());
        if (request.getBreakfastIncluded() != null) reservation.setBreakfastIncluded(request.getBreakfastIncluded());
        // 레스토랑
        if (request.getReservationTime() != null) reservation.setReservationTime(request.getReservationTime());
        if (request.getPartySize() != null) reservation.setPartySize(request.getPartySize());
        // 교통
        if (request.getTransportType() != null) reservation.setTransportType(request.getTransportType());
        if (request.getPickupAddress() != null) reservation.setPickupAddress(request.getPickupAddress());
        if (request.getDropoffAddress() != null) reservation.setDropoffAddress(request.getDropoffAddress());
        // 기차
        if (request.getDepartureStation() != null) reservation.setDepartureStation(request.getDepartureStation());
        if (request.getArrivalStation() != null) reservation.setArrivalStation(request.getArrivalStation());
        if (request.getTrainDuration() != null) reservation.setTrainDuration(request.getTrainDuration());
        if (request.getTrainSeatNumber() != null) reservation.setTrainSeatNumber(request.getTrainSeatNumber());
        if (request.getTrainSeatClass() != null) reservation.setTrainSeatClass(request.getTrainSeatClass());

        Reservation updated = reservationRepository.save(reservation);
        log.info("예약 수정 완료 - reservationId: {}", updated.getId());

        UserEntity creator = userRepository.findById(updated.getCreatedBy()).orElse(null);
        return ReservationResponse.fromEntity(updated, creator);
    }

    /**
     * 예약 삭제
     */
    @RequiresTripParticipant
    @Transactional
    public void deleteReservation(Long tripId, Long userId, Long reservationId) {
        log.info("예약 삭제 - tripId: {}, userId: {}, reservationId: {}", tripId, userId, reservationId);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationId));

        if (!reservation.getTripId().equals(tripId)) {
            throw new IllegalArgumentException("해당 여행의 예약이 아닙니다");
        }

        // 등록자만 삭제 가능
        if (!reservation.getCreatedBy().equals(userId)) {
            throw new IllegalArgumentException("예약 등록자만 삭제할 수 있습니다");
        }

        reservationRepository.delete(reservation);
        log.info("예약 삭제 완료 - reservationId: {}", reservationId);
    }

    /**
     * 예약 현황 요약
     */
    @RequiresTripParticipant
    @Transactional(readOnly = true)
    public ReservationSummaryResponse getReservationSummary(Long tripId, Long userId) {
        log.info("예약 현황 요약 - tripId: {}, userId: {}", tripId, userId);

        long total = reservationRepository.countByTripId(tripId);

        // 타입별 개수
        Map<String, Long> byType = new HashMap<>();
        for (ReservationType type : ReservationType.values()) {
            byType.put(type.name().toLowerCase(), 0L);
        }
        List<Object[]> typeCounts = reservationRepository.countByTripIdGroupByType(tripId);
        for (Object[] row : typeCounts) {
            ReservationType type = (ReservationType) row[0];
            Long count = (Long) row[1];
            byType.put(type.name().toLowerCase(), count);
        }

        // 상태별 개수
        long confirmed = 0, pending = 0;
        List<Object[]> statusCounts = reservationRepository.countByTripIdGroupByStatus(tripId);
        for (Object[] row : statusCounts) {
            ReservationStatus status = (ReservationStatus) row[0];
            Long count = (Long) row[1];
            if (status == ReservationStatus.CONFIRMED) confirmed = count;
            else if (status == ReservationStatus.PENDING) pending = count;
        }

        return ReservationSummaryResponse.builder()
                .totalReservations(total)
                .byType(byType)
                .upcoming(total) // 간단히 전체로 (추후 날짜 비교 로직 추가 가능)
                .confirmed(confirmed)
                .pending(pending)
                .build();
    }

    /**
     * 사용자 Map 조회 (N+1 방지)
     */
    private Map<Long, UserEntity> getUserMap(List<Reservation> reservations) {
        if (reservations == null || reservations.isEmpty()) {
            return Collections.emptyMap();
        }

        List<Long> userIds = reservations.stream()
                .map(Reservation::getCreatedBy)
                .distinct()
                .collect(Collectors.toList());

        return userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));
    }

    /**
     * 예약 요약 응답 DTO (내부 클래스)
     */
    @lombok.Getter
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ReservationSummaryResponse {
        private long totalReservations;
        private Map<String, Long> byType;
        private long upcoming;
        private long confirmed;
        private long pending;
    }
}