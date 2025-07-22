package sagi.Back_2_The_Future_Server.Repositories;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import sagi.Back_2_The_Future_Server.Models.Youngster;

import java.util.Arrays;

@Repository
public class YoungstersRepository {
    Youngster[] youngsters = new Youngster[]{
            new Youngster(1, "Alice", "Tel Aviv", "050-1234567", "Reading", "Harry Potter"),
            new Youngster(2, "Bob", "Haifa", "052-7654321", "Gaming", "Ender's Game"),
            new Youngster(3, "Charlie", "Jerusalem", "053-1112233", "Swimming", "The Hobbit")
    };

    public ResponseEntity<Youngster[]> getYoungsters() {
       return new ResponseEntity<>(youngsters, HttpStatus.OK);
    }

    public ResponseEntity<Void> addYoungster(Youngster youngster) {
        Youngster[] newYoungsters = Arrays.copyOf(youngsters, youngsters.length + 1);
        newYoungsters[youngsters.length] = youngster;
        youngsters = newYoungsters;

        return new ResponseEntity<>(HttpStatus.OK);
    }

    public ResponseEntity<Void> deleteYoungsterById(int id) {
        Youngster[] newYoungsters = new Youngster[youngsters.length - 1];
        int lastIndexOfNewArray = 0;

        for (int iteratorIndex = 0; iteratorIndex < youngsters.length; iteratorIndex++) {

            if (youngsters[iteratorIndex].getId() != id) {
                if (lastIndexOfNewArray == newYoungsters.length) {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }

                newYoungsters[lastIndexOfNewArray] = youngsters[iteratorIndex];
                lastIndexOfNewArray++;
            }
        }

        youngsters = newYoungsters;
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
