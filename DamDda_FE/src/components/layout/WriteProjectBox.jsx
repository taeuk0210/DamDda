import { useUser } from "UserContext";
import Box from '@mui/material/Box'; // Box 컴포넌트 import
import Typography from '@mui/material/Typography'; // Typography 컴포넌트 import
import IconButton from '@mui/material/IconButton'; // IconButton 컴포넌트 import
import EditIcon from '@mui/icons-material/Edit'; // 수정 아이콘 import
import CloseIcon from '@mui/icons-material/Close'; // 닫기 아이콘 import
export function WriteProjectBox({projects, navigateRegister, navigateModifier, handleDeleteProject}) {
    
    return (
        <Box                  
        sx={{
            marginTop: "10px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "white",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            position: "absolute", // 버튼 아래에 위치시키기 위해 절대 위치 지정
            top: "100%", // 버튼 바로 아래에 위치
            left: "50%", // 수평 중앙 정렬
            transform: "translateX(-50%)", // 중앙 정렬 보정
            width: "300px", // 원하는 너비로 설정
            zIndex: 1000, // 다른 요소보다 상위에 위치하도록 zIndex를 크게 설정
          }}
        >
          {projects.length < 3 ? (
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#1263CE",
                textAlign: "center",
              }}
              onClick={navigateRegister} //() => navigate("/register")} // 클릭 시 이동
              style={{ cursor: "pointer" }} // 클릭 가능한 텍스트로 설정
            >
              + 새로운 프로젝트
            </Typography>
          ) : (
            <></>
          )}

          {projects.map((project) => (
            <Box
              key={project.id}
              sx={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <Typography>{project.title}</Typography>
              <IconButton
                size="small"
                onClick={() => navigateModifier(project.id)}
              >
                <EditIcon sx={{ color: "#4B89DC" }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteProject(project.id)}
              >
                <CloseIcon sx={{ color: "#f44e38" }} />
              </IconButton>
            </Box>
          ))}
        </Box>
    );
}