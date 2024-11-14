import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import FilePresentIcon from '@mui/icons-material/FilePresent'; 
import styles from '../css/FileDownloadComponent.module.css';

export const FileDownloadComponent = ({ handleDownload, fileName }) => {
  return (
    <TextField
    className={styles.customTextField} 
      label="File"
      variant="outlined"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton onClick={() => handleDownload(fileName)} className={styles.iconButton}>
              <FilePresentIcon className={styles.fileIcon} />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <span
              onClick={() => handleDownload(fileName)}
              className={styles.fileName}
            >
              {fileName}
            </span>
          </InputAdornment>
        ),
        readOnly: true, 
      }}
    />
  );
};
