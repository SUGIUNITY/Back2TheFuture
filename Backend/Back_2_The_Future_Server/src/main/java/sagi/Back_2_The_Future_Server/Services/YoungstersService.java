package sagi.Back_2_The_Future_Server.Services;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import sagi.Back_2_The_Future_Server.Models.Youngster;
import sagi.Back_2_The_Future_Server.Repositories.YoungstersRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class YoungstersService {
    private final YoungstersRepository youngstersRepository;

    public YoungstersService(YoungstersRepository youngstersRepository) {
        this.youngstersRepository = youngstersRepository;
    }

    public ResponseEntity<Youngster> getYoungsterById(int id) throws Exception {
        if (youngstersRepository.existsByYoungsterId(id)) {
            return new ResponseEntity<>(youngstersRepository.findByYoungsterId(id), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

        public ResponseEntity<List<Youngster>> getYoungsters() {
        return new ResponseEntity<>(this.youngstersRepository.findAll(), HttpStatus.OK);
    }

    public ResponseEntity<String> addYoungster(Youngster youngster) {
        this.youngstersRepository.save(youngster);

        return new ResponseEntity<>("Youngster was added successfully", HttpStatus.OK);
    }

    public ResponseEntity<String> deleteYoungsterById(int id) throws Exception {
        if (youngstersRepository.existsByYoungsterId(id)) {
            youngstersRepository.deleteByYoungsterId(id);
            return new ResponseEntity<>("Youngster was deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Youngster not found", HttpStatus.NOT_FOUND);
        }
    }
}
