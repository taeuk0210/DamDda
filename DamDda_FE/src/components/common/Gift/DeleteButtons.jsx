import CloseIcon from '@mui/icons-material/Close'; // X 아이콘
import DeleteIcon from '@mui/icons-material/Delete'; // 휴지통 아이콘
import React, { useState } from 'react'; // React
import { TextField, IconButton, Box } from '@mui/material'; // MUI 컴포넌트들
import AddIcon from '@mui/icons-material/Add'; // + 아이콘
import RemoveIcon from '@mui/icons-material/Remove'; // - 아이콘

export const DeleteButtonX = ({ onClick }) => {
    return (
        <IconButton onClick={onClick} aria-label="delete">
            <CloseIcon fontSize="small" />
        </IconButton>
    );
};

export const DeleteButtonTrash = ({ onClick }) => {
    return (
        <IconButton onClick={onClick} aria-label="delete" size="small">
            <DeleteIcon fontSize="small" />
        </IconButton>
    );
};

export const NumericInput = ({ value, min, max, setNum }) => {
    //const [value, setValue] = useState(initialValue);

    const handleCountChange = (addNum) => {
        const newValue = Math.max(min, Math.min(max, value + addNum));

        setNum(isNaN(newValue) ? 0 : newValue);
    };

    return (
        <div className="count-box" style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            <IconButton onClick={() => handleCountChange(-1)} aria-label="decrease" size="small">
                <RemoveIcon fontSize="small" />
            </IconButton>
            <input
                value={value}
                onChange={(e) => {
                    setNum(Math.max(min, Math.min(max, Number(e.target.value))));
                }}
                style={{
                    width: '35px',
                    textAlign: 'center',
                    margin: '0px',
                    border: 'none',
                    outline: 'none', // 포커스 시 테두리 없애기
                    fontSize: '14px', // 줄인 글씨 크기
                }}
            />

            <IconButton onClick={() => handleCountChange(1)} aria-label="increase" size="small">
                <AddIcon fontSize="small" />
            </IconButton>
        </div>
    );
};
