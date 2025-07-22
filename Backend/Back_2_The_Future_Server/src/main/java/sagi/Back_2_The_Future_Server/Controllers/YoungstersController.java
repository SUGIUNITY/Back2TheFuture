package sagi.Back_2_The_Future_Server.Controllers;

import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Youngster[]> getYoungsters() {
        return youngstersService.getYoungsters();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Youngster> getYoungsterById(@PathVariable("id") int id) {
        return youngstersService.getYoungsterById(id);
    }

    @PostMapping("/add-youngster")
    public ResponseEntity<Void> addYoungster(@RequestBody Youngster youngster) {
        return youngstersService.addYoungster(youngster);
    }

    @DeleteMapping("/delete-youngster/{id}")
    public ResponseEntity<Void> deleteYoungsterById(@PathVariable("id") int id) {
        return youngstersService.deleteYoungsterById(id);
    }
}
