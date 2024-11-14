package org.eightbit.damdda.admin.service;

public interface RedisService {
    void save(String key, Object value);

    Object findByKey(String key);

    Boolean delete(String key);

    boolean exists(String key);

    void saveBlacklist(String key, Object value);

    Object findByKeyBlacklist(String key);

    Object deleteBlacklist(String key);

    boolean existsBlacklist(String key);
}
