import { width } from '@mui/system';
import { DeleteButtonX, DeleteButtonTrash, NumericInput } from 'components/common/Gift/DeleteButtons'; // 경로에 맞게 수정

export const OptionOrder = ({ option, num, setNum, onDelete }) => {
    const style = {
        display: "flex", 
        flexDirection: "row", 
        justifyContent: "space-between",
        alignItems: "center",
        width: "300px"
    }

    return (
        <div style={style}>
            <div style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "5px"}}>{option}</div>
            <NumericInput value={num} min={0} max={9999} setNum={(newNum) => setNum(newNum)}></NumericInput>
            <div style={{ width: "50px" }}></div>
            <DeleteButtonX onClick={onDelete}></DeleteButtonX>
        </div>
    );
};