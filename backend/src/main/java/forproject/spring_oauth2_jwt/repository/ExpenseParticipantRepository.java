package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.ExpenseParticipant;
import forproject.spring_oauth2_jwt.entity.IndividualExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseParticipantRepository extends JpaRepository<IndividualExpense, Long> {

    /**
     * 특정 사용자의 받을 돈 내역 (owedAmount > 0)
     * Fetch Join으로 expense와 participants도 함께 조회
     */
    @Query("SELECT DISTINCT p FROM ExpenseParticipant p " +
            "JOIN FETCH p.expense e " +
            "JOIN FETCH e.participants " +
            "WHERE e.tripId = :tripId AND p.userId = :userId AND p.owedAmount > 0 " +
            "ORDER BY e.expenseDate DESC, e.createdAt DESC")
    List<ExpenseParticipant> findCreditorsByTripIdAndUserId(
            @Param("tripId") Long tripId,
            @Param("userId") Long userId
    );

    /**
     * 특정 사용자의 줄 돈 내역 (owedAmount < 0)
     * Fetch Join으로 expense와 participants도 함께 조회
     */
    @Query("SELECT DISTINCT p FROM ExpenseParticipant p " +
            "JOIN FETCH p.expense e " +
            "JOIN FETCH e.participants " +
            "WHERE e.tripId = :tripId AND p.userId = :userId AND p.owedAmount < 0 " +
            "ORDER BY e.expenseDate DESC, e.createdAt DESC")
    List<ExpenseParticipant> findDebtorsByTripIdAndUserId(
            @Param("tripId") Long tripId,
            @Param("userId") Long userId
    );

    /**
     * 특정 여행의 모든 참여자 부채 (정산 집계용)
     */
    @Query("SELECT DISTINCT p FROM ExpenseParticipant p " +
            "JOIN FETCH p.expense e " +
            "JOIN FETCH e.participants " +
            "WHERE e.tripId = :tripId")
    List<ExpenseParticipant> findAllByTripId(@Param("tripId") Long tripId);
}
