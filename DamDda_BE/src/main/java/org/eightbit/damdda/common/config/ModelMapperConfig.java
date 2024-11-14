package org.eightbit.damdda.common.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * ModelMapper 설정 클래스.
 * 객체 간 매핑을 위한 ModelMapper Bean을 등록.
 */
@Configuration
public class ModelMapperConfig {

    /**
     * ModelMapper Bean 생성 및 설정.
     *
     * @return 설정된 ModelMapper 인스턴스
     */
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                // 필드 이름을 기준으로 매핑. Getter, Setter가 없어도 매핑 시도.
                .setFieldMatchingEnabled(true)
                // private 필드에도 접근 가능하도록 설정.
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);
        return modelMapper;
    }
}
