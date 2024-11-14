package org.eightbit.damdda.project.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.domain.QProject;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Repository
public class ProjectRepositoryImpl implements ProjectRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    @Value("${server.recommendation.base-url}")
    private String recommendationBaseUrl;

    public ProjectRepositoryImpl(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    @Override
    public Page<Project> findProjects(Long memberId, String category, String search, String progress, List<String> sortConditions, Pageable pageable) {
        QProject project = QProject.project;
        BooleanBuilder builder = new BooleanBuilder();

        // 1. 카테고리 필터 (all인 경우 필터링 안 함)
        if (category != null && !"전체".equals(category) && !"all".equals(category)) {
            // 카테고리 배열 선언
            List<String> validCategories = Arrays.asList("K-POP", "K-콘텐츠", "게임", "문화재", "뷰티", "음식", "패션");

            // category가 유효한 카테고리 중 하나인지 확인
            if (validCategories.contains(category)) {
                builder.and(project.category.name.eq(category));
            }
        }

        // 2. 검색어 필터 (%search%)
        if (search != null && !search.isEmpty()) {
            builder.and(
                    project.title.containsIgnoreCase(search)
                            .or(project.description.containsIgnoreCase(search))
                            .or(project.descriptionDetail.containsIgnoreCase(search))
                            .or(project.tags.any().name.containsIgnoreCase(search))
            );
        }

        // 3. progress 필터
        if (progress != null) {
            LocalDateTime now = LocalDateTime.now();
            switch (progress) {
                case "ongoing":
                    builder.and(project.startDate.before(now).and(project.endDate.after(now)));
                    break;
                case "upcoming":
                    builder.and(project.startDate.after(now));
                    break;
                case "completed":
                    builder.and(project.endDate.before(now));
                    break;
            }
        }

        // 삭제되지 않은 항목 필터 (deletedAt IS NULL 추가)
        builder.and(project.deletedAt.isNull()); // deletedAt이 NULL인 항목만 조회

        // 4. 정렬 처리 (동적 정렬)
        OrderSpecifier<?>[] orderSpecifiers = getOrderSpecifiers(sortConditions, project);

        // 데이터 조회 및 페이징 처리
        List<Project> content = queryFactory
                .select(project)  // 여기에 Project 엔티티를 명시적으로 지정
                .from(project)
                .where(builder)
                .orderBy(orderSpecifiers)
                .fetch();

        // 전체 개수 조회
        long total = queryFactory.selectFrom(project)
                .where(builder)
                .fetch().size();

        // PageImpl 객체로 반환
        return new PageImpl<>(content, pageable, total);

    }

    private OrderSpecifier<?>[] getOrderSpecifiers(List<String> sortConditions, QProject project) {
        List<OrderSpecifier<?>> orderSpecifiers = new ArrayList<>();

        // 정렬 조건이 비어 있으면 기본 정렬 추가
        if (sortConditions == null || sortConditions.isEmpty()) {
            orderSpecifiers.add(project.id.desc());  // 기본 정렬 조건
        } else {
            for (String condition : sortConditions) {
                switch (condition) {
                    case "all":
                        orderSpecifiers.add(project.id.desc());
                        break;
                    case "likeCnt":
                        orderSpecifiers.add(project.likeCnt.desc());
                        break;
                    case "endDate":
                        orderSpecifiers.add(project.endDate.asc());
                        break;
                    case "viewCnt":
                        orderSpecifiers.add(project.viewCnt.desc());
                        break;
                    case "supporterCnt":
                        orderSpecifiers.add(project.supporterCnt.desc());
                        break;
                    case "targetFunding":
                        orderSpecifiers.add(project.fundsReceive.desc());
                        break;
                    case "createdAt":
                        orderSpecifiers.add(project.createdAt.desc());
                        break;
                    default:
                        break;
                }
            }
        }

        return orderSpecifiers.toArray(new OrderSpecifier<?>[0]);
    }

    public Page<Project> getProjectByRecommendOrder(Long memberId, String category, String search, String progress, List<String> sortConditions, Pageable pageable) {
        if (memberId == 0L) {
            return findProjects(memberId, category, search, progress, List.of("likeCnt"), pageable);
        }

        try {
            URL url = new URL(recommendationBaseUrl + "/api/recommend/" + memberId);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                //JSON parsing
                JSONArray jsonArray = new JSONArray(response.toString());
                log.info("[project] RECOMMENDATION ORDER : {}", jsonArray.toString());

                if (jsonArray.isEmpty()) {
                    return findProjects(memberId, category, search, progress, List.of("likeCnt"), pageable);
                } else {
                    QProject project = QProject.project;
                    List<Project> content = jsonArray
                            .toList()
                            .stream()
                            .map(id -> {
                                        Long projectId = Long.valueOf((Integer) id);
                                        BooleanBuilder builder = new BooleanBuilder();
                                        builder.and(project.id.eq(projectId));
                                        return queryFactory
                                                .select(project)
                                                .from(project)
                                                .where(builder)
                                                .fetch().get(0);
                                    }
                            ).collect(Collectors.toList());
                    return new PageImpl<>(content, pageable, jsonArray.length());
                }
            } else {
                log.info("[project] GET Request failed, response code is {}", responseCode);
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return null;
    }
}