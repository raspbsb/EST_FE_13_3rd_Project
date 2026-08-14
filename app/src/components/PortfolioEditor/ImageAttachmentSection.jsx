import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { CancelIcon, CloudUploadIcon } from "../../lib/icons";
import ImageActionButton from "./ImageActionButton";
import SortableImageItem from "./SortableImageItem";
import { memo, useRef } from "react";

function ImageAttachmentSection({
  sectionCardSx,
  thumbnailActionButtonSx,
  images,
  onAddImages,
  onDeleteImage,
  onSetThumbnailImage,
  onMoveImage,
}) {
  const fileInputRef = useRef(null);

  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  const primaryImage = sortedImages.find(image => image.isThumbnail) ?? sortedImages[0];
  const secondaryImages = sortedImages.filter(image => image.id !== primaryImage?.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const isImageLimitReached = images.length >= 5;

  const totalImageSize = images.reduce((sum, image) => sum + image.size, 0);

  const formatFileSize = size => {
    if (size >= 1024 * 1024) {
      return `${(size / 1024 / 1024).toFixed(1)}MB`;
    }

    return `${Math.ceil(size / 1024)}KB`;
  };

  const handleDragEnd = e => {
    const { active, over } = e;

    if (!over || active.id === over.id) return;

    onMoveImage(active.id, over.id);
  };

  return (
    <Paper className="portfolio-editor-image-section" elevation={0} sx={sectionCardSx}>
      <Stack className="portfolio-editor-image-section__header" direction="row">
        <Text component="h2" variant="h5" fontWeight={700}>
          이미지 첨부
        </Text>

        <Text className="portfolio-editor-image-section__limit" color="text.secondary" fontSize={12}>
          최대 5
        </Text>
      </Stack>

      <input
        ref={fileInputRef}
        type="file"
        aria-label="포트폴리오 이미지 파일 선택"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hidden
        onChange={e => {
          onAddImages(Array.from(e.target.files));
          e.target.value = "";
        }}
      />

      <ButtonBase
        className="portfolio-editor-image-section__dropzone"
        disabled={isImageLimitReached}
        aria-label={isImageLimitReached ? "이미지는 최대 5장까지 업로드할 수 있습니다" : "이미지 파일 업로드"}
        aria-describedby="portfolio-image-upload-help portfolio-image-upload-count"
        onClick={() => {
          if (isImageLimitReached) return;
          fileInputRef.current?.click();
        }}
      >
        <Stack className="portfolio-editor-image-section__dropzone-content" spacing={1}>
          <CloudUploadIcon className="portfolio-editor-image-section__dropzone-icon" aria-hidden="true" />

          <Text className="portfolio-editor-image-section__dropzone-title" fontWeight={700}>
            {isImageLimitReached ? "최대 5장 업로드됨" : "파일을 끌어서 놓거나 클릭하여 업로드"}
          </Text>

          <Text
            id="portfolio-image-upload-help"
            className="portfolio-editor-image-section__dropzone-help"
            color="text.secondary"
            fontSize={12}
          >
            PNG, JPG, WebP (최대 10MB)
          </Text>

          <Box />
        </Stack>
      </ButtonBase>

      <Text className="portfolio-editor-image-section__preview-title" fontWeight={700}>
        이미지 미리보기
      </Text>

      <Stack className="portfolio-editor-image-section__preview-list" spacing={2}>
        {primaryImage && (
          <Box className="portfolio-editor-image-section__primary-preview">
            <Box
              component="img"
              className="portfolio-editor-image-section__preview-image"
              src={primaryImage.previewUrl}
              alt="대표 이미지 미리보기"
            />
            <Chip
              className="portfolio-editor-image-section__thumbnail-badge"
              label="대표 이미지"
              color="primary"
              size="small"
            />
            <Stack className="portfolio-editor-image-section__preview-actions" direction="row" spacing={0.5}>
              <ImageActionButton
                aria-label="대표 이미지 삭제"
                danger
                onClick={() => onDeleteImage(primaryImage.id)}
                sx={thumbnailActionButtonSx}
              >
                <CancelIcon />
              </ImageActionButton>
            </Stack>
          </Box>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={secondaryImages.map(image => image.id)} strategy={rectSortingStrategy}>
            <Box className="portfolio-editor-image-section__secondary-grid">
              {secondaryImages.map((image, index) => (
                <SortableImageItem
                  key={image.id}
                  image={image}
                  imageNumber={index + 2}
                  thumbnailActionButtonSx={thumbnailActionButtonSx}
                  onSetThumbnailImage={onSetThumbnailImage}
                  onDeleteImage={onDeleteImage}
                />
              ))}
            </Box>
          </SortableContext>
        </DndContext>
      </Stack>

      <Stack className="portfolio-editor-image-section__footer" direction="row">
        <Text className="portfolio-editor-image-section__upload-count" color="primary" fontWeight={700} fontSize={12}>
          <Box id="portfolio-image-upload-count" component="span">
            {images.length}/5장 업로드됨
          </Box>
        </Text>

        <Text className="portfolio-editor-image-section__file-size" color="text.secondary" fontSize={12}>
          {formatFileSize(totalImageSize)}
        </Text>
      </Stack>
    </Paper>
  );
}

export default memo(ImageAttachmentSection);
