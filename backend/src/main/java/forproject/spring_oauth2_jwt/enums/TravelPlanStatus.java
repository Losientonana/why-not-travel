package forproject.spring_oauth2_jwt.enums;

public enum TravelPlanStatus {
    PLANNING("계획중"),
    ONGOING("여행중"),
    COMPLETED("완료");

    private final String description;

    TravelPlanStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
