package forproject.spring_oauth2_jwt.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 범용 더미 데이터 삽입 API
 *
 * 사용법:
 * POST /api/mock/insert
 * {
 *   "table": "travel_itineraries",
 *   "data": [
 *     {
 *       "trip_id": 1,
 *       "day_number": 1,
 *       "date": "2024-03-15",
 *       "title": "Day 1"
 *     }
 *   ]
 * }
 */
@Profile({"local", "dev"})  // local, dev 환경에서만 활성화
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mock")
public class MockDataController {

    private final JdbcTemplate jdbcTemplate;

    /**
     * 동적 데이터 삽입
     * POST /api/mock/insert
     */
    @PostMapping("/insert")
    public ResponseEntity<Map<String, Object>> insertData(@RequestBody InsertRequest request) {
        String tableName = request.getTable();
        List<Map<String, Object>> dataList = request.getData();

        log.info("=== 데이터 삽입 시작: table={}, count={} ===", tableName, dataList.size());

        Map<String, Object> result = new HashMap<>();
        int successCount = 0;
        List<String> errors = new ArrayList<>();

        try {
            for (Map<String, Object> data : dataList) {
                try {
                    insertRow(tableName, data);
                    successCount++;
                } catch (Exception e) {
                    errors.add("데이터 삽입 실패: " + data + " - " + e.getMessage());
                    log.error("삽입 실패", e);
                }
            }

            result.put("success", true);
            result.put("table", tableName);
            result.put("totalCount", dataList.size());
            result.put("successCount", successCount);
            result.put("failCount", dataList.size() - successCount);

            if (!errors.isEmpty()) {
                result.put("errors", errors);
            }

            log.info("=== 데이터 삽입 완료: 성공={}, 실패={} ===", successCount, errors.size());
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("전체 작업 실패", e);
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }

    /**
     * 단일 행 삽입
     */
    private void insertRow(String tableName, Map<String, Object> data) {
        if (data.isEmpty()) {
            throw new IllegalArgumentException("데이터가 비어있습니다.");
        }

        // 컬럼명과 값 분리
        List<String> columns = new ArrayList<>(data.keySet());
        List<Object> values = new ArrayList<>(data.values());

        // SQL 생성
        String columnsPart = String.join(", ", columns);
        String placeholders = String.join(", ", Collections.nCopies(columns.size(), "?"));

        String sql = String.format("INSERT INTO %s (%s) VALUES (%s)",
                tableName, columnsPart, placeholders);

        log.debug("SQL: {}", sql);
        log.debug("Values: {}", values);

        // 실행
        jdbcTemplate.update(sql, values.toArray());
    }

    /**
     * 특정 테이블의 모든 데이터 삭제
     * DELETE /api/mock/truncate?table=travel_itineraries
     */
    @DeleteMapping("/truncate")
    public ResponseEntity<Map<String, Object>> truncateTable(@RequestParam String table) {
        log.warn("=== 테이블 데이터 전체 삭제: table={} ===", table);

        Map<String, Object> result = new HashMap<>();

        try {
            // 안전을 위해 특정 테이블만 허용
            List<String> allowedTables = Arrays.asList(
                    "travel_itineraries",
                    "travel_activities",
                    "travel_photos",
                    "travel_checklists",
                    "travel_expenses",
                    "travel_participants"
            );

            if (!allowedTables.contains(table)) {
                throw new IllegalArgumentException("허용되지 않은 테이블입니다: " + table);
            }

            // FK 제약조건 임시 해제 (MySQL)
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");

            // 데이터 삭제
            int deletedRows = jdbcTemplate.update("DELETE FROM " + table);

            // FK 제약조건 복구
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");

            result.put("success", true);
            result.put("table", table);
            result.put("deletedRows", deletedRows);

            log.info("=== 테이블 삭제 완료: {}행 삭제됨 ===", deletedRows);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("테이블 삭제 실패", e);
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }

    /**
     * 조건부 삭제
     * DELETE /api/mock/delete
     * {
     *   "table": "travel_itineraries",
     *   "where": {
     *     "trip_id": 1
     *   }
     * }
     */
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteData(@RequestBody DeleteRequest request) {
        String tableName = request.getTable();
        Map<String, Object> whereClause = request.getWhere();

        log.info("=== 조건부 삭제: table={}, where={} ===", tableName, whereClause);

        Map<String, Object> result = new HashMap<>();

        try {
            if (whereClause == null || whereClause.isEmpty()) {
                throw new IllegalArgumentException("WHERE 조건이 필요합니다. 전체 삭제는 /truncate를 사용하세요.");
            }

            // WHERE 절 생성
            List<String> conditions = new ArrayList<>();
            List<Object> values = new ArrayList<>();

            for (Map.Entry<String, Object> entry : whereClause.entrySet()) {
                conditions.add(entry.getKey() + " = ?");
                values.add(entry.getValue());
            }

            String wherePart = String.join(" AND ", conditions);
            String sql = String.format("DELETE FROM %s WHERE %s", tableName, wherePart);

            log.debug("SQL: {}", sql);
            log.debug("Values: {}", values);

            int deletedRows = jdbcTemplate.update(sql, values.toArray());

            result.put("success", true);
            result.put("table", tableName);
            result.put("deletedRows", deletedRows);

            log.info("=== 삭제 완료: {}행 삭제됨 ===", deletedRows);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("삭제 실패", e);
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }

    /**
     * 특정 테이블 조회
     * GET /api/mock/query?table=travel_itineraries&where=trip_id:1&limit=100
     */
    @GetMapping("/query")
    public ResponseEntity<Map<String, Object>> queryData(
            @RequestParam String table,
            @RequestParam(required = false) String where,
            @RequestParam(defaultValue = "100") int limit) {

        log.info("=== 데이터 조회: table={}, where={}, limit={} ===", table, where, limit);

        Map<String, Object> result = new HashMap<>();

        try {
            String sql = "SELECT * FROM " + table;
            List<Object> params = new ArrayList<>();

            // WHERE 절 파싱 (간단한 형태: column:value)
            if (where != null && !where.isEmpty()) {
                String[] parts = where.split(":");
                if (parts.length == 2) {
                    sql += " WHERE " + parts[0] + " = ?";
                    params.add(parts[1]);
                }
            }

            sql += " LIMIT ?";
            params.add(limit);

            log.debug("SQL: {}", sql);

            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params.toArray());

            result.put("success", true);
            result.put("table", table);
            result.put("count", rows.size());
            result.put("data", rows);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("조회 실패", e);
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }

    // ===== DTO 클래스들 =====

    @lombok.Data
    public static class InsertRequest {
        private String table;
        private List<Map<String, Object>> data;
    }

    @lombok.Data
    public static class DeleteRequest {
        private String table;
        private Map<String, Object> where;
    }
}
