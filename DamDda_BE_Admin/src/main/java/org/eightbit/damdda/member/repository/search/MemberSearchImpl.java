package org.eightbit.damdda.member.repository.search;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.JPQLQuery;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.member.domain.QMember;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.sql.Timestamp;
import java.util.List;

@Log4j2
public class MemberSearchImpl extends QuerydslRepositorySupport implements MemberSearch {

    public MemberSearchImpl() {
        super(Member.class);
    }

    @Override
    public Page<Member> findByKeyword(String query, String keyword, Pageable pageable) {
        QMember member = QMember.member;
        JPQLQuery<Member> memberJPQLQuery = from(member);

        if (keyword != null && query != null) {
            BooleanBuilder booleanBuilder = new BooleanBuilder();
            switch (query) {
                case "loginId":
                    booleanBuilder.and(member.loginId.like("%" + keyword + "%"));
                    break;
                case "name":
                    booleanBuilder.and(member.name.like("%" + keyword + "%"));
                    break;
                case "email":
                    booleanBuilder.and(member.email.like("%" + keyword + "%"));
                    break;
                case "phoneNumber":
                    booleanBuilder.and(member.phoneNumber.like("%" + keyword + "%"));
                case "createdAt":
                    booleanBuilder.and(member.createdAt.eq(Timestamp.valueOf(keyword)));
                    break;
            }
            memberJPQLQuery.where(booleanBuilder);
        }

        memberJPQLQuery.select(member);
        memberJPQLQuery.orderBy(member.id.asc());
        getQuerydsl().applyPagination(pageable, memberJPQLQuery);

        List<Member> memberList = memberJPQLQuery.fetch();

        long total = memberJPQLQuery.fetchCount();
        return new PageImpl<>(memberList, pageable, total);
    }
}
