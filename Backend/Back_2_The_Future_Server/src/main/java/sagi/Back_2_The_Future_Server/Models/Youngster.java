package sagi.Back_2_The_Future_Server.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "youngsters")
public class Youngster {
    @Id
    private String id;

    @Field("youngster_id")
    private int youngsterId;

    @Field("name")
    private String name;

    @Field("location")
    private String location;

    @Field("phone_number")
    private String phoneNumber;

    @Field("hobby")
    private String hobby;

    @Field("book")
    private String book;

    public Youngster(String id, int youngsterId, String name, String location, String phoneNumber, String hobby, String book) {
        setId(id);
        setYoungsterId(youngsterId);
        setName(name);
        setLocation(location);
        setPhoneNumber(phoneNumber);
        setHobby(hobby);
        setBook(book);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getYoungsterId() {
        return youngsterId;
    }

    public void setYoungsterId(int youngsterId) {
        this.youngsterId = youngsterId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getHobby() {
        return hobby;
    }

    public void setHobby(String hobby) {
        this.hobby = hobby;
    }

    public String getBook() {
        return book;
    }

    public void setBook(String book) {
        this.book = book;
    }
}
