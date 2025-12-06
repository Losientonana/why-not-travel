package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "travel_invitations")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TravelInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 초대한 여행 계획 ID
     */
    @Column(nullable = false)
    private Long tripId;

    /**
     * 초대한 사람 (여행 생성자)
     */
    @Column(nullable = false)
    private Long inviterId;


}
