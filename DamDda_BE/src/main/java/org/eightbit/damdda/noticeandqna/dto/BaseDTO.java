package org.eightbit.damdda.noticeandqna.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eightbit.damdda.common.utils.validation.CreateValidation;
import org.eightbit.damdda.common.utils.validation.UpdateValidation;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.PastOrPresent;
import java.time.LocalDateTime;

/**
 * 공통적인 필드를 가지는 기본 DTO 클래스.
 * 다른 DTO들이 이 클래스를 상속받아 공통 필드(id, savedAt)를 재사용.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaseDTO {

    /**
     * 엔티티의 고유 ID.
     * - 생성 시에는 null이어야 하며(CreateValidation 그룹에서 검사),
     * - 업데이트 시에는 필수로 존재해야 함(UpdateValidation 그룹에서 검사).
     */
    @Null(groups = CreateValidation.class, message = "ID는 생성 시 null이어야 합니다.")
    @NotNull(groups = UpdateValidation.class, message = "ID는 업데이트 시 필수 항목입니다.")
    private Long id;

    /**
     * 엔티티가 저장된 시각.
     * - 저장된 시간은 과거 또는 현재 시점이어야 하며,
     * 미래의 시간 값은 허용되지 않음.
     */
    @PastOrPresent(message = "저장된 시간은 과거 또는 현재 시점이어야 합니다.")
    private LocalDateTime createdAt;
}