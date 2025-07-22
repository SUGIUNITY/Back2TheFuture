package sagi.Back_2_The_Future_Server.Models;

public class Youngster {
    private int id;
    private String name;
    private String residence;
    private String phoneNumber;
    private String hobby;
    private String book;

    public Youngster(int id, String name, String residence, String phoneNumber, String hobby, String book) {
        setId(id);
        setName(name);
        setResidence(residence);
        setPhoneNumber(phoneNumber);
        setHobby(hobby);
        setBook(book);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getResidence() {
        return residence;
    }

    public void setResidence(String residence) {
        this.residence = residence;
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
