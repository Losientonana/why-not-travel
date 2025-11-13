package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TravelExpenseRepository extends JpaRepository<TravelExpense, Long> {

    /**
     * 특정 여행의 경비 목록 조회 (최신순)
     */
    List<TravelExpense> findByTripIdOrderByExpenseDateDescCreatedAtDesc(Long tripId);

    /**
     * 특정 여행의 경비 합계
     */
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM TravelExpense e WHERE e.tripId = :tripId")
    BigDecimal sumAmountByTripId(@Param("tripId") Long tripId);

    /**
     * 카테고리별 경비 조회
     */
    List<TravelExpense> findByTripIdAndCategoryOrderByExpenseDateDesc(Long tripId, String category);

    /**
     * 카테고리별 합계
     */
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM TravelExpense e WHERE e.tripId = :tripId AND e.category = :category")
    BigDecimal sumAmountByTripIdAndCategory(@Param("tripId") Long tripId, @Param("category") String category);

    /**
     * 특정 사용자가 지불한 경비 조회
     */
    List<TravelExpense> findByTripIdAndPaidByUserIdOrderByExpenseDateDesc(Long tripId, Long userId);
}
