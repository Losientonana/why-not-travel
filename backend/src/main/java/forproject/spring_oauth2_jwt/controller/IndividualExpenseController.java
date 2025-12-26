package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.ApiResponse;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.dto.request.PersonalExpenseCreateRequest;
import forproject.spring_oauth2_jwt.dto.request.SharedExpenseCreateRequest;
import forproject.spring_oauth2_jwt.dto.response.IndividualExpenseResponse;
import forproject.spring_oauth2_jwt.service.IndividualExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/trips/{tripId}/individual-expenses")
@RequiredArgsConstructor
public class IndividualExpenseController {
    private final IndividualExpenseService individualExpenseService;


    /**
     * 개인지출 등록
     * @param tripId
     * @param user
     * @param request
     * @return
     */
    @PostMapping("/personal")
    public ResponseEntity<ApiResponse<IndividualExpenseResponse>> createPersonalExpense(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user,
            @RequestBody @Valid PersonalExpenseCreateRequest request
    ){
        log.info("개인지출 등록 요청 - tripId: {}, userId: {}", tripId, user.getId());
        IndividualExpenseResponse response = individualExpenseService.createPersonalExpense(
                tripId, user.getId(), request
        );
        return ResponseEntity.ok(ApiResponse.success(response, "개인지출이 등록되었습니다"));
    }

    /**
     * 공유지출 등록
     */
    @PostMapping("/shared")
    public ResponseEntity<ApiResponse<IndividualExpenseResponse>> createSharedExpense(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user,
            @RequestBody @Valid SharedExpenseCreateRequest request
    ){
        log.info("공유지출 등록 요청 - tripId: {}, userId: {}", tripId, user.getId());
        IndividualExpenseResponse response = individualExpenseService.createSharedExpense(
                tripId, user.getId(), request
        );
        return ResponseEntity.ok(ApiResponse.success(response, "공유지출이 등록되었습니다"));
    }

    /**
     * 전체 지출 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<IndividualExpenseResponse>>> getAllExpenses(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("전체 지출 조회 - tripId: {}, userId: {}", tripId, user.getId());
        List<IndividualExpenseResponse> response =  individualExpenseService.getAllExpenses(tripId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 개인지출만 조회
     */
    @GetMapping("/personal")
    public ResponseEntity<ApiResponse<List<IndividualExpenseResponse>>> getPersonalExpenses(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("개인지출 조회 - tripId: {}, userId: {}", tripId, user.getId());
        List<IndividualExpenseResponse> response =  individualExpenseService.getPersonalExpenses(tripId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 공유지출만 조회
     */
    @GetMapping("/shared")
    public ResponseEntity<ApiResponse<List<IndividualExpenseResponse>>> getSharedExpenses(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("공유지출 조회 - tripId: {}, userId: {}", tripId, user.getId());
        List<IndividualExpenseResponse> response =  individualExpenseService.getSharedExpenses(tripId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 내가 받을 돈 조회
     */
    @GetMapping("/to-receive")
    public ResponseEntity<ApiResponse<List<IndividualExpenseResponse>>> getToReceive(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("내가 받을 돈 조회 - tripId: {}, userId: {}", tripId, user.getId());
        List<IndividualExpenseResponse> response =  individualExpenseService.getToReceive(tripId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 내가 줄 돈 조회
     */
    @GetMapping("/to-pay")
    public ResponseEntity<ApiResponse<List<IndividualExpenseResponse>>> getToPay(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("내가 줄 돈 조회 - tripId: {}, userId: {}", tripId, user.getId());
        List<IndividualExpenseResponse> response =  individualExpenseService.getToPay(tripId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
