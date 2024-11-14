//package org.eightbit.damdda.repository;
//
//import lombok.extern.log4j.Log4j2;
//import org.eightbit.damdda.DamDdaApplication;
//import org.eightbit.damdda.admin.service.RedisService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.context.annotation.ComponentScan;
//import org.springframework.test.context.ContextConfiguration;
//
//@Log4j2
//@SpringBootTest
//@ContextConfiguration(classes = DamDdaApplication.class)
//@ComponentScan(basePackages = "org.eightbit.damdda")
//public class RedisServiceTests {
//
//    @Autowired
//    private RedisService redisService;
//
//    @Test
//    public void saveValue() {
//        String clientIP = "http://localhost:3000";
//        String refreshToken = "Bearer 1aksbfaiw3uf4g234.24g1g4513g5235f.fq3f";
//        Object value = refreshToken;
//
//        redisService.save(clientIP, value);
//    }
//
//
//}
