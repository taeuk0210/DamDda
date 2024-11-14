package org.eightbit.damdda.admin.service.impl;

import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.admin.service.RedisService;
import org.eightbit.damdda.common.service.JwtService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {
    @Qualifier("redisTemplate")
    private final RedisTemplate<String, Object> redisTemplate;
    @Qualifier("redisTemplateBlacklist")
    private final RedisTemplate<String, Object> redisTemplateBlacklist;


    // 저장
    public void save(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    // 조회
    public Object findByKey(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    // 삭제
    public Boolean delete(String key) {
        return redisTemplate.delete(key);
    }

    // 키 존재 여부 확인
    public boolean exists(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    public void saveBlacklist(String key, Object value) {
        redisTemplateBlacklist.opsForValue().set(key, value, JwtService.ACCESS_EXPIRATION_TIME, TimeUnit.MILLISECONDS);
    }

    public Object findByKeyBlacklist(String key) {
        return redisTemplateBlacklist.opsForValue().get(key);
    }

    public Object deleteBlacklist(String key) {
        return redisTemplateBlacklist.delete(key);
    }

    public boolean existsBlacklist(String key) {
        return Boolean.TRUE.equals(redisTemplateBlacklist.hasKey(key));
    }
}
