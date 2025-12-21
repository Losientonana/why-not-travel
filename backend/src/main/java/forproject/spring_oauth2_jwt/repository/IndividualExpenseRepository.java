package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.IndividualExpense;
import forproject.spring_oauth2_jwt.enums.ExpenseType;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@ReadingConverter
public interface IndividualExpenseRepository extends JpaRepository<IndividualExpense, Long> {

    /**
     * 전체 조회 (Fetch Join으로 N+1 방지)
     */
    @Query("SELECT DISTINCT e FROM IndividualExpense e " +
            "LEFT JOIN FETCH e.participants " +
            "WHERE e.tripId = :tripId " +
            "ORDER BY e.expenseDate DESC, e.createdAt DESC")
    List<IndividualExpense> findByTripIdWithParticipants(@Param("tripId") Long tripId);

    /**
     * 타입별 필터링 (Fetch Join)
     */
    @Query("SELECT DISTINCT e FROM IndividualExpense e " +
            "LEFT JOIN FETCH e.participants " +
            "WHERE e.tripId = :tripId AND e.expenseType = :expenseType " +
            "ORDER BY e.expenseDate DESC, e.createdAt DESC")
    List<IndividualExpense> findByTripIdAndExpenseTypeWithParticipants(
            @Param("tripId") Long tripId,
            @Param("expenseType") ExpenseType expenseType
    );
}
