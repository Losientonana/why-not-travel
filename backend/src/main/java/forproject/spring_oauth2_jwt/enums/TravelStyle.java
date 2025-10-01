package forproject.spring_oauth2_jwt.enums;

public enum TravelStyle {
    HEALING("힐링"),
    ADVENTURE("모험"),
    CULTURE("문화탐방"),
    GOURMET("맛집투어"),
    SHOPPING("쇼핑"),
    NATURE("자연"),
    CITY("도시");

    private final String displayName;
    TravelStyle(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
