package sagi.Back_2_The_Future_Server.Services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import sagi.Back_2_The_Future_Server.Models.Youngster;
import sagi.Back_2_The_Future_Server.Repositories.YoungstersRepository;

import java.util.ArrayList;

@Service
public class YoungstersService {
    private final YoungstersRepository youngstersRepository;

    public YoungstersService(YoungstersRepository youngstersRepository) {
        this.youngstersRepository = youngstersRepository;
    }

    public ResponseEntity<Youngster> getYoungsterById(int id) throws Exception {
        return this.youngstersRepository.getYoungsterById(id);
    }

        public ResponseEntity<ArrayList<Youngster>> getYoungsters() {
        return this.youngstersRepository.getYoungsters();
    }

    public ResponseEntity<String> addYoungster(Youngster youngster) {
        return this.youngstersRepository.addYoungster(youngster);
    }

    public ResponseEntity<String> deleteYoungsterById(int id) throws Exception {
        return this.youngstersRepository.deleteYoungsterById(id);
    }
}
