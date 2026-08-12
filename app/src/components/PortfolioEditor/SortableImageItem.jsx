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
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: image.id,
  });

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
