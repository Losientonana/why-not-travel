package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.PhotoAlbum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoAlbumRepository extends JpaRepository<PhotoAlbum, Long> {

    /**
     * 특정 여행의 앨범 목록 조회 (날짜순 정렬)
     */
    List<PhotoAlbum> findByTripIdOrderByAlbumDateDesc(Long tripId);

    /**
     * 특정 여행의 앨범 목록 조회 (displayOrder 순서)
     */
    List<PhotoAlbum> findByTripIdOrderByDisplayOrderAsc(Long tripId);

    /**
     * 특정 여행의 앨범 개수
     */
    int countByTripId(Long tripId);
}