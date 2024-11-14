import React from 'react'; // React
import { Typography, TextField, Button, Box, Modal, styled } from '@mui/material'; // Material-UI 컴포넌트
import { useUser } from 'UserContext';
import Cookies from 'js-cookie';
import { SERVER_URL } from 'constants/URLs';
import axios from 'axios';
import { ModalInputText } from 'components/detail/MoreComponent';

const ModalBox = styled(Box)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    boxShadow: 24,
    padding: '20px',
    borderRadius: '8px',
});

export const CollabModal = ({ onClose, setCollabDetails, collabDetails, errors, setErrors, projectId }) => {
    const { user } = useUser();
    const handleFileDelete = (index) => {
        const confirmation = window.confirm('정말로 삭제하시겠습니까?');
        if (confirmation) {
            const newFiles = collabDetails.files.filter((_, i) => i !== index);
            setCollabDetails({ ...collabDetails, files: newFiles });
        }
    };
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (collabDetails.files.length + files.length <= 3) {
            setCollabDetails({
                ...collabDetails,
                files: [...collabDetails.files, ...files],
            });
        } else {
            alert('최대 3개의 파일만 첨부할 수 있습니다.');
        }
    };

    const handleCollabSubmit = async () => {
        alert('협업하기 요청 버튼 클릭!');
        const newErrors = {
            title: !collabDetails.title,
            name: !collabDetails.name,
            phone: !collabDetails.phone,
            email: !collabDetails.email,
            message: !collabDetails.message,
        };

        setErrors(newErrors);

        const formData = new FormData();

        /*오늘 날짜*/
        const date = new Date();
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const today = `${year}-${month}-${day}`;

        const jsonData = {
            email: collabDetails.email,
            phoneNumber: collabDetails.phone,
            content: collabDetails.message,
            user_id: user.id,
            collaborationDTO: {
                title: collabDetails.title,
                CollaborateDate: today,
                name: collabDetails.name,
            },
        };

        formData.append('jsonData', JSON.stringify(jsonData));
        collabDetails.files.forEach((file, index) => {
            formData.append('collabDocList', file);
        });

        if (!newErrors.title && !newErrors.message && !newErrors.name && !newErrors.phone && !newErrors.email) {
            try {
                const response = await axios.post(`${SERVER_URL}/collab/register/${projectId}`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...(Cookies.get('accessToken') && {
                            Authorization: `Bearer ${Cookies.get('accessToken')}`,
                        }),
                    },
                });

                alert('협업 요청이 전송되었습니다.');
                onClose();
            } catch (error) {}
        }
    };

    return (
        <>
            {/* 협업 모달 */}
            <Modal open={true} onClose={onClose}>
                <ModalBox>
                    <Typography variant="h6" component="h2">
                        협업 요청
                    </Typography>
                    {/* 제목 */}
                    <TextField
                        label="제목"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={collabDetails.title}
                        onChange={(e) =>
                            setCollabDetails({
                                ...collabDetails,
                                title: e.target.value,
                            })
                        }
                        error={errors.title}
                        helperText={errors.title ? '제목을 입력하세요.' : ''}
                        InputProps={{
                            style: {
                                borderColor: errors.title ? 'red' : 'inherit',
                            },
                        }}
                    />
                    {/* 이름 */}
                    <TextField
                        label="이름"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={collabDetails.name}
                        onChange={(e) => setCollabDetails({ ...collabDetails, name: e.target.value })}
                        error={errors.name}
                        helperText={errors.name ? '이름을 입력하세요.' : ''}
                        InputProps={{
                            style: {
                                borderColor: errors.name ? 'red' : 'inherit',
                            },
                        }}
                    />
                    {/* 전화번호 */}
                    <TextField
                        label="전화번호"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={collabDetails.phone}
                        onChange={(e) => setCollabDetails({ ...collabDetails, phone: e.target.value })}
                        error={errors.phone}
                        helperText={errors.phone ? '전화번호를 입력하세요.' : ''}
                        InputProps={{
                            style: {
                                borderColor: errors.phone ? 'red' : 'inherit',
                            },
                        }}
                    />
                    {/* 이메일 */}
                    <TextField
                        label="이메일"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={collabDetails.email}
                        onChange={(e) => setCollabDetails({ ...collabDetails, email: e.target.value })}
                        error={errors.email}
                        helperText={errors.email ? '이메일을 입력하세요.' : ''}
                        InputProps={{
                            style: {
                                borderColor: errors.email ? 'red' : 'inherit',
                            },
                        }}
                    />
                    {/* 협업내용 */}
                    <TextField
                        label="협업 내용"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={collabDetails.message}
                        onChange={(e) =>
                            setCollabDetails({
                                ...collabDetails,
                                message: e.target.value,
                            })
                        }
                        error={errors.message}
                        helperText={errors.message ? '협업 내용을 입력하세요.' : ''}
                        InputProps={{
                            style: {
                                borderColor: errors.message ? 'red' : 'inherit',
                            },
                        }}
                    />
                    {/* 파일첨부 버튼 */}
                    <Button variant="contained" component="label" fullWidth margin="normal">
                        파일 첨부
                        <input type="file" hidden multiple onChange={handleFileChange} />
                    </Button>
                    {/* 파일 랜더링 */}
                    {collabDetails.files.map((file, index) => (
                        <div
                            key={index}
                            style={{
                                marginTop: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="body2">첨부된 파일: {file.name}</Typography>
                            <Button
                                variant="outlined"
                                onClick={() => handleFileDelete(index)}
                                style={{ marginLeft: '10px' }}
                            >
                                삭제
                            </Button>
                        </div>
                    ))}
                    {/* 닫기 및 협업요청 버튼 */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: '20px',
                        }}
                    >
                        <Button variant="outlined" onClick={onClose} style={{ marginRight: '10px' }}>
                            닫기
                        </Button>
                        <Button variant="contained" onClick={handleCollabSubmit}>
                            협업 요청하기
                        </Button>
                    </div>
                </ModalBox>
            </Modal>
        </>
    );
};
