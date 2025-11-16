package forproject.spring_oauth2_jwt.dto;

import forproject.spring_oauth2_jwt.entity.TravelExpense;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 경비 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {

    private Long id;
    private String category;
    private String item;
    private BigDecimal amount;
    private Long paidByUserId;
    private String paidByUserName;
    private LocalDate expenseDate;
    private String notes;

    public static ExpenseResponse fromEntity(TravelExpense expense, UserEntity paidBy) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .category(expense.getCategory())
                .item(expense.getItem())
                .amount(expense.getAmount())
                .paidByUserId(expense.getPaidByUserId())
                .paidByUserName(paidBy != null ? paidBy.getUsername() : null)
                .expenseDate(expense.getExpenseDate())
                .notes(expense.getNotes())
                .build();
    }
}