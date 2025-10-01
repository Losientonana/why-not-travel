package forproject.spring_oauth2_jwt.enums;

public enum BudgetLevel {
    BUDGET("저예산"),
    MID_RANGE("중급"),
    LUXURY("럭셔리");

    private final String displayName;

    BudgetLevel(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
