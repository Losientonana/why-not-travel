package forproject.spring_oauth2_jwt.repository;


import forproject.spring_oauth2_jwt.entity.TravelInvitation;
import forproject.spring_oauth2_jwt.enums.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TravelInvitationRepository extends JpaRepository<TravelInvitation, Long> {

    boolean existsByTripIdAndInvitedEmailAndStatus(Long tripId, String email, InvitationStatus status);
}
