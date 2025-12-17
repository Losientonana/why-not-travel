package forproject.spring_oauth2_jwt.enums;

public enum TradeType {
    DEPOSIT("입금"),
    EXPENSE("지출");

    private final String description;

    TransactionType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
