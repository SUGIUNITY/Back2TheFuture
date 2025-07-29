package sagi.Back_2_The_Future_Server.Repositories;

import org.springframework.stereotype.Repository;
import sagi.Back_2_The_Future_Server.Models.Youngster;
import org.springframework.data.mongodb.repository.MongoRepository;


@Repository
public interface YoungstersRepository extends MongoRepository<Youngster, String>{
    boolean existsByYoungsterId(int id);
    void deleteByYoungsterId(int id);
    Youngster findByYoungsterId(int id);
}
