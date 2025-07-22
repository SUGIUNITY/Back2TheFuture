package sagi.Back_2_The_Future_Server.Services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import sagi.Back_2_The_Future_Server.Models.Youngster;
import sagi.Back_2_The_Future_Server.Repositories.YoungstersRepository;

@Service
public class YoungstersService {
    private YoungstersRepository youngstersRepository;

    public YoungstersService(YoungstersRepository youngstersRepository) {
        this.youngstersRepository = youngstersRepository;
    }

    public ResponseEntity<Youngster[]> getYoungsters() {
        return youngstersRepository.getYoungsters();
    }

    public ResponseEntity<Void> addYoungster(Youngster youngster) {
        return youngstersRepository.addYoungster(youngster);
    }

    public ResponseEntity<Void> deleteYoungsterById(int id) {
        return youngstersRepository.deleteYoungsterById(id);
    }
}
