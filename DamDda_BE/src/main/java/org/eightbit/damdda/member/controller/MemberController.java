package org.eightbit.damdda.member.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.common.utils.validation.MemberValidator;
import org.eightbit.damdda.member.dto.MemberDTO;
import org.eightbit.damdda.member.dto.MemberSearchDTO;
import org.eightbit.damdda.member.dto.PasswordDTO;
import org.eightbit.damdda.member.dto.RegisterDTO;
import org.eightbit.damdda.member.service.LoginService;
import org.eightbit.damdda.member.service.MemberService;
import org.eightbit.damdda.member.service.RegisterService;
import org.eightbit.damdda.security.jwt.JwtService;
import org.eightbit.damdda.security.user.AccountCredentials;
import org.eightbit.damdda.security.user.User;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.NoSuchElementException;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("/member") // member로 변경하는게 적절
public class MemberController {

    private final RegisterService registerService;
    private final MemberService memberService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final LoginService loginService;
    private final MemberValidator memberValidator;

    @GetMapping("/userinfo")
    public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal User user) {
        Long memberId = user.getMemberId();
        Map<String, Object> userInfo = memberService.getUserInfo(memberId);
        return ResponseEntity.ok().body(userInfo);
    }

    @PostMapping
    public ResponseEntity<String> insertMember(@RequestBody RegisterDTO registerDTO) {
        try {
            registerService.insertMember(registerDTO);
            return ResponseEntity.ok("success");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/check/id")
    public ResponseEntity<String> checkLoginId(@RequestParam("loginId") String loginId) {
        try {
            if (registerService.checkLoginId(loginId)) {
                return new ResponseEntity<>("unavailable", HttpStatus.OK);
            }
            return new ResponseEntity<>("available", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/check/nickname")
    public ResponseEntity<String> checkNickname(@RequestParam("nickname") String nickname) {
        try {
            if (registerService.checkNickname(nickname)) {
                return new ResponseEntity<>("unavailable", HttpStatus.OK);
            }
            return new ResponseEntity<>("available", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AccountCredentials credentials) {
        try {
            UsernamePasswordAuthenticationToken creds =         // 인증 아직 안됨
                    new UsernamePasswordAuthenticationToken(
                            credentials.getLoginId(),
                            credentials.getPassword()
                    );

            Authentication auth = authenticationManager.authenticate(creds);
            String currentUserNickname = ((User) auth.getPrincipal()).getNickname();
            String jwts = jwtService.getToken(((User) auth.getPrincipal()).getMember().getId(), auth.getName());
            return ResponseEntity.ok()
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwts)
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization")
                    .body(Map.of("X-Nickname", currentUserNickname));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("logout");
    }

    @GetMapping("/profile")
    public ResponseEntity<MemberDTO> getProfile(@RequestParam("loginId") String loginId) {
        try {
            return ResponseEntity.ok(memberService.getMember(loginId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/findid")
    public ResponseEntity<String> findId(String name, String email) {
        try {
            return ResponseEntity.ok(loginService.findId(name, email));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // GetMapping -> PostMapping으로 변경, 매개변수 @RequestParams String password -> @RequestBody PasswordDTO password로 변경
    @PostMapping("/confirmpw")
    public ResponseEntity<MemberDTO> confirmPassword(@RequestBody PasswordDTO password) {
        try {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String loginId = user.getMember().getLoginId();
            MemberDTO memberDTO = memberService.confirmPw(loginId, password.getPassword());

            if (memberDTO != null) {
                return ResponseEntity.ok(memberDTO);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemberDTO> updateProfile(@PathVariable Long id, @RequestPart(value = "image", required = false) MultipartFile image, @RequestPart(value = "member") MemberDTO memberDTO) {
        memberValidator.validateMemberIdForLoginUser(id);
        try {
            if (image != null) {
                String fileName = memberService.uploadFile(image);
                memberDTO.setImageUrl(fileName);
            }
            MemberDTO updateInfo = memberService.updateMember(memberDTO);

            return ResponseEntity.ok(updateInfo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Long>> checkMemberDetails(MemberSearchDTO memberSearchDTO) {
        try {
            return ResponseEntity.ok(Map.of("id", loginService.checkMemberDetails(memberSearchDTO)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Map<String, Boolean>> modifyPassword(
            @PathVariable Long id,
            @RequestBody PasswordDTO passwordDTO
    ) {
        try {
            boolean result = loginService.modifyPassword(id, passwordDTO.getPassword());
            return ResponseEntity.ok(Map.of("isSuccess", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteMember(@PathVariable Long id, @AuthenticationPrincipal User user) {
        memberValidator.validateMemberIdForLoginUser(id);
        try {
            memberService.deleteMember(user.getMemberId());
            return ResponseEntity.ok(Map.of("isSuccess", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}