package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelPhotoRepository extends JpaRepository<TravelPhoto, Long> {

    /**
     * 특정 여행의 사진 목록 조회 (최신순)
     */
    List<TravelPhoto> findByTripIdOrderByCreatedAtDesc(Long tripId);

    /**
     * 특정 앨범의 사진 목록 조회 (최신순)
     */
    List<TravelPhoto> findByAlbumIdOrderByCreatedAtDesc(Long albumId);

    /**
     * 특정 여행의 모든 사진 조회 (앨범별 그룹화를 위해)
     */
    List<TravelPhoto> findByTripIdOrderByAlbumIdAscCreatedAtAsc(Long tripId);

    /**
     * 특정 앨범의 사진 개수
     */
    int countByAlbumId(Long albumId);

    /**
     * 특정 여행의 사진 개수
     */
    int countByTripId(Long tripId);

    /**
     * 여러 앨범의 사진 조회 (앨범별 대표 사진 가져오기용)
     */
    @Query("SELECT p FROM TravelPhoto p WHERE p.albumId IN :albumIds ORDER BY p.albumId ASC, p.createdAt ASC")
    List<TravelPhoto> findByAlbumIdIn(@Param("albumIds") List<Long> albumIds);
}