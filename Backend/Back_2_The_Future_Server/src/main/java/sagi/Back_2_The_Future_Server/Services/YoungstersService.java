package sagi.Back_2_The_Future_Server.Services;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import sagi.Back_2_The_Future_Server.Models.Youngster;
import sagi.Back_2_The_Future_Server.Repositories.YoungstersRepository;

@Service
public class YoungstersService {
    private YoungstersRepository youngstersRepository;

    public YoungstersService(YoungstersRepository youngstersRepository) {
        this.youngstersRepository = youngstersRepository;
    }

    public Youngster[] getYoungsters() {
        return youngstersRepository.getYoungsters();
    }

    public void addYoungster(Youngster youngster) {
        youngstersRepository.addYoungster(youngster);
    }
}
