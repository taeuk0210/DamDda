package org.eightbit.damdda.common.domain;


import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.sql.Timestamp;

@MappedSuperclass
@EntityListeners(value={AuditingEntityListener.class})
public abstract class DateEntity extends BaseEntity {

    @CreatedDate
    @Column(updatable = false)
    private Timestamp createdAt;

    private Timestamp deletedAt;
}
