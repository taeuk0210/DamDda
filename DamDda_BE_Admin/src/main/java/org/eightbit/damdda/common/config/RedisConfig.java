package org.eightbit.damdda.common.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericToStringSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
    @Value("${spring.redis.host}")
    private String host;
    @Value("${spring.redis.port}")
    private int port;
    @Value("${spring.redis.database}")
    private int database;
    @Value("${spring.redis.blacklist}")
    private int blacklist;
    @Value("${spring.redis.password}")
    private String password;

    @Bean(name = "redisConnectionFactory")
    public RedisConnectionFactory redisConnectionFactory() {
        LettuceConnectionFactory factory = new LettuceConnectionFactory();
        factory.setHostName(host);
        factory.setPort(port);
        factory.setDatabase(database);
        factory.setPassword(password);
        return factory;
    }

    @Bean(name = "redisConnectionFactoryBlacklist")
    public RedisConnectionFactory redisConnectionFactoryBlacklist() {
        LettuceConnectionFactory factory = new LettuceConnectionFactory();
        factory.setHostName(host);
        factory.setPort(port);
        factory.setDatabase(blacklist);
        factory.setPassword(password);
        return factory;
    }

    @Bean(name = "redisTemplate")
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory());
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericToStringSerializer<>(Object.class));
        return template;
    }
    @Bean(name = "redisTemplateBlacklist")
    public RedisTemplate<String, Object> redisTemplateBlacklist() {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactoryBlacklist());
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericToStringSerializer<>(Object.class));
        return template;
    }

}
