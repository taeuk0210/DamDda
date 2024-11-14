//package org.eightbit.damdda.repository;
//
//import lombok.extern.log4j.Log4j2;
//import org.eightbit.damdda.admin.domain.Admin;
//import org.eightbit.damdda.admin.repository.AdminRepository;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//
//@SpringBootTest
//@Log4j2
//public class RepositoryTests {
//
//
//    @Autowired
//    private AdminRepository adminRepository;
//
//
//    @Test
//    public void insertAdmin() {
//        BCryptPasswordEncoder cryptor = new BCryptPasswordEncoder();
//        Admin admin = Admin.builder()
//                .loginId("admin")
//                .password(cryptor.encode("admin123!@#"))
//                .build();
//        adminRepository.save(admin);
//    }
//
//
//}
