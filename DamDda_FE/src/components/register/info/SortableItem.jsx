import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

// base import

// 드래그 앤 드롭 가능한 개별 이미지 아이템
const SortableItem = (props) => {
  const { url, index, title, onRemove } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: "0 8px",
    cursor: "pointer",
    width: "60px",
    height: "60px",
    objectFit: "cover",
    position: "relative",
    display: "inline-block",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners}>
        <img
          src={url}
          alt={`썸네일 ${index}`}
          style={{
            width: "100%",
            height: "100%",
          }}
          onClick={() => alert(`이미지 ${index + 1} 클릭`)}
        />
      </div>

      {index === 0 && (
        <div
          className="representative-tag"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            color: "white",
            padding: "2px 5px",
            borderRadius: "10px",
          }}
        >
          대표
        </div>
      )}
      <IconButton
        onClick={(e) => {
          e.stopPropagation(); // 클릭 이벤트 버블링 방지
          onRemove(index); // 삭제 버튼 클릭 시 이미지 삭제
        }}
        style={{
          position: "absolute",
          top: "-1px",
          right: "-5px",
          backgroundColor: "#EDEDED",
          padding: "0px",
        }}
      >
        <CloseIcon fontSize={"small"} />
      </IconButton>
    </div>
  );
};

export default SortableItem;
