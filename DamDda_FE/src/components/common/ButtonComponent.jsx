import { Button, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';

const ButtonComponent = ({ text, onClick, style }) => {
    return (
        <button style={style} onClick={onClick}>
            {text}
        </button>
    );
};

export const BlueButtonComponent = ({ text, onClick }) => {
    const buttonStyle = {
        backgroundColor: '#677cf9',
        padding: '10px 10px',
        border: '1px solid #677cf9',
        borderRadius: '5px',
        cursor: 'pointer',
        color: '#ffffff',
        width: '100%',
    };
    return (
        <button style={buttonStyle} onClick={onClick}>
            {text}
        </button>
    );
};

export const BlueBorderButtonComponent = ({ text, onClick }) => {
    const buttonStyle = {
        backgroundColor: 'transparent',
        padding: '10px 20px',
        border: '1px solid #677cf9',
        borderRadius: '5px',
        cursor: 'pointer',
        color: '#2d2736',
        width: '100%',
    };
    return (
        <button style={buttonStyle} onClick={onClick}>
            {text}
        </button>
    );
};

export const RedButtonComponent = ({ text, onClick }) => {
    const buttonStyle = {
        backgroundColor: '#ce9dee',
        padding: '10px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        color: '#ffffff',
        width: '100%',
    };

    return (
        <button style={buttonStyle} onClick={onClick}>
            {text}
        </button>
    );
};
export const RedBorderButtonComponent = ({ text, onClick }) => {
    const buttonStyle = {
        backgroundColor: 'transparent',
        padding: '10px 10px',
        border: '2px solid #ce9dee',
        borderRadius: '5px',
        cursor: 'pointer',
        color: '#2d2736',
        width: '100%',
    };

    return (
        <button style={buttonStyle} onClick={onClick}>
            {text}
        </button>
    );
};

// StatusButton 컴포넌트
export const StatusButton = ({ status, label, showRejectReason, rejectMessage, onClick, sx }) => {
    const getButtonProps = () => {
        switch (status) {
            case '진행중':
                return {
                    color: 'white',
                    borderColor: '#4caf50',
                    backgroundColor: '#4caf50',
                };
            case '마감':
                return {
                    color: 'white',
                    borderColor: '#f44336',
                    backgroundColor: '#f44336',
                };
            case '승인완료':
                return {
                    color: 'black',
                    borderColor: '#4caf50',
                    backgroundColor: '#4caf50',
                };
            case '승인대기':
                return {
                    color: 'black',
                    borderColor: '#ff9800',
                    backgroundColor: '#ff9800',
                };
            case '승인거절':
                return {
                    color: 'black',
                    borderColor: '#f44336',
                    backgroundColor: '#f44336',
                };
            case '미정':
                return {
                    color: 'black',
                    borderColor: 'yellow',
                    backgroundColor: 'yellow',
                };
            case '결제 취소':
                return {
                    color: 'white',
                    borderColor: 'white',
                    backgroundColor: '#677cf9',
                    disableHover: true,
                };
            case '결제 취소됨':
                return {
                    color: '#9e9e9e',
                    borderColor: '#9e9e9e',
                    backgroundColor: '#e0e0e0',
                    disableHover: true,
                };
            case '결제/배송 정보':
                return {
                    color: '#1e88e5',
                    borderColor: '#1e88e5',
                    backgroundColor: 'transparent',
                    hoverBackgroundColor: '#e3f2fd',
                    width: '140px',
                };
            default:
                return {
                    color: '#757575',
                    borderColor: '#757575',
                    backgroundColor: 'transparent',
                };
        }
    };

    const { color, borderColor, backgroundColor, width, hoverBackgroundColor, disableHover } = getButtonProps();

    return (
        <Tooltip title={showRejectReason && rejectMessage ? rejectMessage : ''} arrow placement="top">
            <Button
                variant="outlined"
                onClick={onClick}
                sx={{
                    '--variant-borderWidth': '2px',
                    borderRadius: 20,
                    width: width || '100px',
                    height: '40px',
                    fontSize: '14px',
                    color,
                    borderColor,
                    backgroundColor,
                    ...sx,
                    '&:hover': {
                        backgroundColor: disableHover ? backgroundColor : hoverBackgroundColor || backgroundColor,
                        borderColor,
                        color,
                    },
                }}
            >
                {label}
            </Button>
        </Tooltip>
    );
};

//Entire.jsx버튼
export const ProgressButton = ({ type, progress, handleClick, children }) => {
    return (
        <Button
            onClick={() => handleClick(type)}
            variant={progress === type ? 'contained' : 'outlined'}
            size="small"
            sx={{
                width: '100%',
                borderRadius: '12px',
                fontSize: '0.75rem',
                marginRight: '20px',
            }}
        >
            {children}
        </Button>
    );
};

//중복 확인 버튼
export const StyledBlueButtonComponent = ({ text, onClick, type = 'button', onKeyDown }) => {
    const [isHovered, setIsHovered] = useState(false);

    const buttonStyle = {
        width: '120px', // 버튼 너비
        height: '56px', // 입력 필드와 동일한 높이
        backgroundColor: isHovered ? '#556cd6' : '#677cf9', // 호버 시 색상 변경
        color: 'white',
        border: '2px solid #677cf9',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex', // 플렉스 박스 사용
        alignItems: 'center', // 수직 중앙 정렬
        justifyContent: 'center', // 수평 중앙 정렬
        margin: 0, // 버튼의 기본 마진 제거
        padding: 0, // 버튼의 기본 패딩 제거
        transition: 'background-color 0.3s ease', // 부드러운 색상 전환 효과
    };

    return (
        <button
            onKeyDown={onKeyDown}
            style={buttonStyle}
            onClick={onClick}
            type={type}
            onMouseEnter={() => setIsHovered(true)} // 마우스가 버튼에 올라갈 때
            onMouseLeave={() => setIsHovered(false)} // 마우스가 버튼에서 벗어날 때
        >
            {text}
        </button>
    );
};

//로그인 버튼
export const LoginBlueButtonComponent = ({ text, onClick, type = 'button', onKeyDown }) => {
    const buttonStyle = {
        backgroundColor: '#677cf9',
        padding: '10px 10px',
        border: '2px solid #677cf9',
        borderRadius: '5px',
        cursor: 'pointer',
        color: '#ffffff',
        width: '100%',
    };
    return (
        <button onKeyDown={onKeyDown} style={buttonStyle} onClick={onClick} type={type}>
            {text}
        </button>
    );
};




//------------------------------QnA 추가 시작--------------------------------------------//
// QnA 버튼

export const QnASmallButtonComponent = ({ text, onClick }) => {
  const buttonStyle = {
    backgroundColor: "#677cf9",
    padding: "5px 5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    color: "#ffffff",
    fontSize: "12px",
    width: "100%",
    height: "100%",
  };
  return (
    <button style={buttonStyle} onClick={onClick} size="small">
      {text}
    </button>
  );
};

export const QnAButtonComponent = ({ text, onClick }) => {
  const buttonStyle = {
    backgroundColor: "#677cf9",
    padding: "5px 5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    color: "#ffffff",
    width: "150px",
  };
  return (
    <button style={buttonStyle} onClick={onClick}>
      {text}
    </button>
  );
};
//------------------------------QnA 추가 끝--------------------------------------------//
