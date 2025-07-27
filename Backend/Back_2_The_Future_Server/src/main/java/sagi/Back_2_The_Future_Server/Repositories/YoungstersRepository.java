package sagi.Back_2_The_Future_Server.Repositories;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import sagi.Back_2_The_Future_Server.Models.Youngster;

import java.util.ArrayList;
import java.util.Arrays;

@Repository
public class YoungstersRepository {
    private ArrayList<Youngster> youngsters = new ArrayList<Youngster>();

    public YoungstersRepository() {
        this.youngsters.add(new Youngster(1, "Alice", "Tel Aviv", "050-1234567", "Reading", "Harry Potter"));
        this.youngsters.add(new Youngster(2, "Bob", "Haifa", "052-7654321", "Gaming", "Ender's Game"));
        this.youngsters.add(new Youngster(3, "Charlie", "Jerusalem", "053-1112233", "Swimming", "The Hobbit"));
    }

    public ResponseEntity<ArrayList<Youngster>> getYoungsters() {
       return new ResponseEntity<>(this.youngsters, HttpStatus.OK);
    }

    public ResponseEntity<Youngster> getYoungsterById(int id) throws Exception {
        final Youngster youngster = this.youngsters.stream().filter(young -> young.getId() == id).findFirst().orElseThrow(Exception::new);

        return new ResponseEntity<>(youngster, HttpStatus.OK);
    }

    public ResponseEntity<String> addYoungster(Youngster youngster) {
        this.youngsters.add(youngster);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    public ResponseEntity<String> deleteYoungsterById(int id) throws Exception {
        final Youngster youngsterToRemove = this.youngsters.stream().filter(young -> young.getId() == id).findFirst().orElseThrow(Exception::new);
        this.youngsters.remove(youngsterToRemove);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
