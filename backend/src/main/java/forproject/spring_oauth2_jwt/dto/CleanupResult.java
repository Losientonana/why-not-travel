package forproject.spring_oauth2_jwt.dto;

import lombok.*;
import org.hibernate.validator.internal.util.privilegedactions.LoadClass;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CleanupResult {
    private int scannedCount;
    private int deletedCount;
    private int errorCount;
    private List<String> deletedFiles = new ArrayList<>();
    private List<String> errorFiles = new ArrayList<>();
    private LocalDateTime executedAt = LocalDateTime.now();

    public boolean isSuccess() {
        return errorCount == 0;
    }
    public boolean hasProcessedFile(){
        return scannedCount > 0;
    }
}
