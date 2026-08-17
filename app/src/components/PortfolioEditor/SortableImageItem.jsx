import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CancelIcon, OpenWithIcon, PushPinIcon } from "../../lib/icons";
import ImageActionButton from "./ImageActionButton";

export default function SortableImageItem({
  image,
  imageNumber,
  thumbnailActionButtonSx,
  onSetThumbnailImage,
  onDeleteImage,
}) {
  // dnd-kit이 이 이미지 아이템의 드래그 핸들러와 위치 변환 값을 제공한다.
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: image.id,
  });

  // dnd-kit이 계산한 transform/transition은 드래그 중 위치 이동을 위해 인라인 style로 전달해야 한다.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: "relative",
        aspectRatio: "1 / 1",
        border: "1px solid",
        borderColor: "#d7dbe7",
        borderRadius: 1,
        bgcolor: "#f5f7fb",
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={image.previewUrl}
        alt={`이미지 미리보기 ${imageNumber}`}
        sx={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <Stack direction="row" spacing={0.5} sx={{ position: "absolute", top: 8, right: 8 }}>
        <ImageActionButton
          aria-label={`이미지 ${imageNumber} 대표 이미지로 고정`}
          onClick={() => onSetThumbnailImage(image.id)}
          sx={thumbnailActionButtonSx}
        >
          <PushPinIcon />
        </ImageActionButton>
        {/* 이동 버튼에만 드래그 이벤트를 연결해 삭제/대표 지정 버튼과 동작이 섞이지 않게 한다. */}
        <ImageActionButton
          aria-label={`이미지 ${imageNumber} 이동`}
          sx={thumbnailActionButtonSx}
          {...attributes}
          {...listeners}
        >
          <OpenWithIcon />
        </ImageActionButton>
        <ImageActionButton
          aria-label={`이미지 ${imageNumber} 삭제`}
          danger
          onClick={() => onDeleteImage(image.id)}
          sx={thumbnailActionButtonSx}
        >
          <CancelIcon />
        </ImageActionButton>
      </Stack>
    </Box>
  );
}
