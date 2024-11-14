//package org.eightbit.damdda.common.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.stereotype.Component;
//
//import javax.annotation.PostConstruct;
//
//@Component
//public class RedisDataCleaner {
//    @Autowired
//    @Qualifier("redisTemplate")
//    private RedisTemplate<String, Object> redisTemplate;
//    @Autowired
//    @Qualifier("redisTemplateBlacklist")
//    private RedisTemplate<String, Object> redisTemplateBlacklist;
//
//    @PostConstruct
//    public void clearAllofRedisData() {
//        redisTemplate.getConnectionFactory().getConnection().flushAll();
//        redisTemplateBlacklist.getConnectionFactory().getConnection().flushAll();
//    }
//}
