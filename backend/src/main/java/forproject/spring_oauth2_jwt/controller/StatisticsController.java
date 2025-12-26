package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.ApiResponse;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.dto.response.ExpenseStatisticsResponse;
import forproject.spring_oauth2_jwt.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/trips/{tripId}/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    /**
     * 지출 통계 조회
     *
     * GET /api/trips/{tripId}/statistics/expenses
     */
    @GetMapping("/expenses")
    public ResponseEntity<ApiResponse<ExpenseStatisticsResponse>> getExpenseStatistics(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("지출 통계 조회 - tripId: {}, userId: {}", tripId, user.getId());
        ExpenseStatisticsResponse response = statisticsService.getExpenseStatistics(tripId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
