package sagi.Back_2_The_Future_Server.Controllers;

import org.springframework.web.bind.annotation.*;
import sagi.Back_2_The_Future_Server.Models.Youngster;
import sagi.Back_2_The_Future_Server.Services.YoungstersService;


@RestController
@RequestMapping("/youngsters")
public class YoungstersController {

    private YoungstersService youngstersService;

    public YoungstersController(YoungstersService youngstersService) {
        this.youngstersService = youngstersService;
    }

    @GetMapping("")
    public Youngster[] getYoungsters() {
        return youngstersService.getYoungsters();
    }

    @PostMapping("/add-youngster")
    public void addYoungster(@RequestBody Youngster youngster) {
        youngstersService.addYoungster(youngster);
    }

}
