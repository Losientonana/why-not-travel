package forproject.spring_oauth2_jwt.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SettlementListResponse {

    private List<SettlementResponse> settlements;
}
