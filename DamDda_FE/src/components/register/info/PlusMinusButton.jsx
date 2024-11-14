import AddBoxIcon from "@mui/icons-material/AddBox";
import { IconButton } from "@mui/material";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

export const AddButton = (props) => {
  const { onClick } = props;
  return (
    <IconButton onClick={onClick}>
      <AddBoxIcon />
    </IconButton>
  );
};

export const MinusButton = (props) => {
  const { onClick } = props;
  return (
    <IconButton onClick={onClick}>
      <IndeterminateCheckBoxIcon />
    </IconButton>
  );
};
