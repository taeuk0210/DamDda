const { Snackbar, Alert } = require("@mui/material");

const MessageBox = (props) => {
  const { open, handleClose, color, message } = props;
  return (
    <Snackbar
      open={open}
      autoHideDuration={1500}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ width: "100%" }}
    >
      <Alert
        onClose={handleClose}
        severity={color}
        variant="outlined"
        sx={{
          position: "fixed",
          top: 200,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MessageBox;
