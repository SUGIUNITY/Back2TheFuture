package sagi.Back_2_The_Future_Server.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sagi.Back_2_The_Future_Server.Models.Youngster;
import sagi.Back_2_The_Future_Server.Services.YoungstersService;

import java.util.ArrayList;


@RestController
@RequestMapping("/youngsters")
public class YoungstersController {

    private YoungstersService youngstersService;

    public YoungstersController(YoungstersService youngstersService) {
        this.youngstersService = youngstersService;
    }

    @GetMapping("")
    public ResponseEntity<ArrayList<Youngster>> getYoungsters() {
        try {
            return youngstersService.getYoungsters();
        } catch (Exception exception) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Youngster> getYoungsterById(@PathVariable("id") int id) {
        try {
            return youngstersService.getYoungsterById(id);
        } catch (Exception exception) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/add-youngster")
    public ResponseEntity<String> addYoungster(@RequestBody Youngster youngster) {
        try {
            return youngstersService.addYoungster(youngster);
        } catch (Exception exception) {
            return new ResponseEntity<>(exception.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete-youngster/{id}")
    public ResponseEntity<String> deleteYoungsterById(@PathVariable("id") int id) {
        try {
            return youngstersService.deleteYoungsterById(id);
        } catch (Exception exception) {
            return new ResponseEntity<>(exception.toString(), HttpStatus.NOT_FOUND);
        }
    }
}
