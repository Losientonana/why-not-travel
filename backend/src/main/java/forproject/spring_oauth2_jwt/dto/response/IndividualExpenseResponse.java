package forproject.spring_oauth2_jwt.dto.response;


import forproject.spring_oauth2_jwt.entity.IndividualExpense;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IndividualExpenseResponse {
    private Long id;
    private Long tripId;
    private String expenseType;
    private Long totalAmount;
    private Long foreignCurrencyAmount;  // 외화 금액 (예: JPY)
    private String description;
    private String category;
    private LocalDate date;
    private String splitMethod;
    private CreatedByInfo createdBy;
    private List<ParticipantInfo> participants;
    private String receiptUrl;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatedByInfo {
        private Long userId;
        private String userName;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantInfo {
        private Long userId;
        private String userName;
        private Long shareAmount;
        private Long paidAmount;
        private Long owedAmount;
    }

    public static IndividualExpenseResponse fromEntity(
            IndividualExpense expense,
            Map<Long, UserEntity> userMap
    ) {
        if (expense == null) {
            return null;
        }

        UserEntity creator = userMap.get(expense.getCreatedBy());
        String creatorName = (creator != null) ? creator.getName() : "알 수 없음";

        List<ParticipantInfo> participants = expense.getParticipants().stream()
                .map(p -> {
                    UserEntity user = userMap.get(p.getUserId());
                    String userName = (user != null) ? user.getName() : "알 수 없음";

                    return ParticipantInfo.builder()
                            .userId(p.getUserId())
                            .userName(userName)
                            .shareAmount(p.getShareAmount())
                            .paidAmount(p.getPaidAmount())
                            .owedAmount(p.getOwedAmount())
                            .build();
                })
                .collect(Collectors.toList());

        return IndividualExpenseResponse.builder()
                .id(expense.getId())
                .tripId(expense.getTripId())
                .expenseType(expense.getExpenseType().name())
                .totalAmount(expense.getTotalAmount())
                .foreignCurrencyAmount(expense.getForeignCurrencyAmount())
                .description(expense.getDescription())
                .category(expense.getCategory())
                .date(expense.getExpenseDate())
                .splitMethod(expense.getSplitMethod().name())
                .createdBy(CreatedByInfo.builder()
                        .userId(expense.getCreatedBy())
                        .userName(creatorName)
                        .build())
                .participants(participants)
                .build();
    }
}