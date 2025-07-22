package sagi.Back_2_The_Future_Server.Repositories;

import org.springframework.stereotype.Repository;
import sagi.Back_2_The_Future_Server.Models.Youngster;

@Repository
public class YoungstersRepository {

    public Youngster[] getYoungsters() {
        Youngster[] youngsters = new Youngster[] {
                new Youngster(1, "Alice", "Tel Aviv", "050-1234567", "Reading", "Harry Potter"),
                new Youngster(2, "Bob", "Haifa", "052-7654321", "Gaming", "Ender's Game"),
                new Youngster(3, "Charlie", "Jerusalem", "053-1112233", "Swimming", "The Hobbit")
        };

        return youngsters;
    }
}
