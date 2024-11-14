package org.eightbit.damdda.noticeandqna.service;

import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.common.exception.custom.UnauthorizedAccessException;
import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.member.service.MemberService;
import org.eightbit.damdda.noticeandqna.domain.QnaQuestion;
import org.eightbit.damdda.noticeandqna.dto.QnaQuestionDTO;
import org.eightbit.damdda.noticeandqna.repository.QnaQuestionRepository;
import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.service.ProjectService;
import org.eightbit.damdda.security.util.SecurityContextUtil;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QnaQuestionServiceImpl implements QnaQuestionService {

    private final ModelMapper modelMapper;
    private final QnaQuestionRepository qnaQuestionRepository;
    private final MemberService memberService;
    private final ProjectService projectService;
    private final SecurityContextUtil securityContextUtil;

    /**
     * Q&A 질문을 저장하는 메서드.
     * - 기존 Q&A 질문이 존재할 경우 작성자(memberId) 확인 후 저장.
     * - 새로 저장된 Q&A 질문을 DTO로 변환하여 반환.
     *
     * @param qnaQuestionDTO 저장할 Q&A 질문 데이터.
     * @return 저장된 Q&A 질문의 DTO.
     */
    @Transactional
    @Override
    public QnaQuestionDTO saveQnaQuestion(QnaQuestionDTO qnaQuestionDTO) {
        Long qnaQuestionId = qnaQuestionDTO.getId();
        Long memberId = securityContextUtil.getAuthenticatedMemberId();

        // 이미 존재하는 멤버를 가져와서 빌더에 포함
        Member existingMember = memberService.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Project existingProject = projectService.findById(qnaQuestionDTO.getProjectId());

        // 빌더 패턴을 사용하여 QnaQuestion 객체 생성
        QnaQuestion qnaQuestion = QnaQuestion.builder()
                .id(qnaQuestionId)
                .project(existingProject)
                .title(qnaQuestionDTO.getTitle())
                .content(qnaQuestionDTO.getContent())
                .member(existingMember)  // member도 빌더로 설정
                .visibility(QnaQuestion.Visibility.PUBLIC)
                .build();

        // 기존 질문이 존재하는 경우 작성자가 일치하는지 확인
        if (qnaQuestionId != null && qnaQuestionRepository.existsById(qnaQuestionId)) {
            validateMemberIsQuestioner(memberId, qnaQuestionId);
        }

        // Q&A 질문 저장
        QnaQuestion savedQnaQuestion = qnaQuestionRepository.save(qnaQuestion);

        // 저장된 Q&A 질문을 DTO로 변환하여 반환
        return modelMapper.map(savedQnaQuestion, QnaQuestionDTO.class);
    }

    /**
     * Q&A 질문을 소프트 삭제하는 메서드.
     * - 작성자(memberId)를 확인한 후 소프트 삭제 수행.
     * - Q&A 질문이 존재하지 않을 경우 NoSuchElementException을 던짐.
     *
     * @param qnaQuestionId 삭제할 Q&A 질문의 ID.
     * @return 삭제 성공 여부.
     */
    @Transactional
    @Override
    public boolean softDeleteQnaQuestion(Long qnaQuestionId) {
        Long memberId = securityContextUtil.getAuthenticatedMemberId();
        validateMemberIsQuestioner(memberId, qnaQuestionId);  // 작성자 확인.

        // Q&A 질문 소프트 삭제.
        int deleteResult = qnaQuestionRepository.softDeleteQnaQuestion(qnaQuestionId);

        // 삭제할 질문이 없을 경우 예외 발생.
        if (deleteResult == 0) {
            throw new NoSuchElementException("QnaQuestion with ID " + qnaQuestionId + " not found.");
        }

        return true;  // 성공적으로 삭제된 경우 true 반환.
    }

    /**
     * 특정 프로젝트에 속한 삭제되지 않은 Q&A 질문들을 페이징 처리하여 가져오는 메서드.
     * 읽기 전용 트랜잭션으로 처리하여 성능 최적화를 진행.
     *
     * @param projectId 프로젝트 ID.
     * @param pageable  페이징 정보.
     * @return 페이징된 Q&A 질문 목록.
     */
    @Override
    public Page<QnaQuestionDTO> getQnaQuestionsByProjectId(Long projectId, Pageable pageable) {
        // 삭제되지 않은 Q&A 질문 조회.
        Page<QnaQuestion> qnaQuestions = qnaQuestionRepository.findAllByDeletedAtIsNullAndProjectId(projectId, pageable);

        // 엔티티 -> DTO 변환.
        List<QnaQuestionDTO> qnaQuestionDTOs = qnaQuestions.stream()
                .map(qnaQuestion -> {
                    // QnaQuestion을 QnaQuestionDTO로 변환
                    QnaQuestionDTO qnaQuestionDTO = modelMapper.map(qnaQuestion, QnaQuestionDTO.class);
                    // memberId를 이용해 닉네임을 설정
                    qnaQuestionDTO.setMemberId(memberService.getById(qnaQuestion.getMember().getId()).getNickname());
                    return qnaQuestionDTO;
                })
                .collect(Collectors.toList());

        // DTO 리스트를 Page 객체로 반환.
        return new PageImpl<>(qnaQuestionDTOs, pageable, qnaQuestions.getTotalElements());
    }

    /**
     * Q&A 질문의 작성자(memberId) 확인 메서드.
     * - 현재 로그인된 사용자가 해당 질문의 작성자인지 확인.
     * - 작성자가 일치하지 않을 경우 UnauthorizedAccessException 예외를 던짐.
     *
     * @param memberId      현재 로그인된 사용자의 ID.
     * @param qnaQuestionId 질문의 ID.
     */
    public void validateMemberIsQuestioner(Long memberId, Long qnaQuestionId) {
        // 질문 작성자 ID 조회.
        Long questionerId = qnaQuestionRepository.findById(qnaQuestionId).orElseThrow().getMember().getId();

        // 작성자 불일치 또는 작성자가 없는 경우 예외 발생.
        if (questionerId == null) throw new NoSuchElementException("Author not found for the given question.");
        if (!memberId.equals(questionerId))
            throw new UnauthorizedAccessException("Member ID unauthorized for qna question " + qnaQuestionId);
    }

}