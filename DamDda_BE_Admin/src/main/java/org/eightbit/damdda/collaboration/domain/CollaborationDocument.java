package org.eightbit.damdda.collaboration.domain;

import lombok.*;
import org.eightbit.damdda.common.domain.BaseEntity;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "collab_documents")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CollaborationDocument extends BaseEntity {
    @ManyToOne
    private Collaboration collaboration;

    private String url;
}

