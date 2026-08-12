/**
 * 포트폴리오 이미지 업로드 영역, 대표/보조 이미지 미리보기 그리드
 * @param {{ sectionCardSx: object, thumbnailActionButtonSx: object }} props - sectionCardSx: 이미지 첨부 카드 sx, thumbnailActionButtonSx: 썸네일 액션 버튼 sx
 * @returns {JSX.Element} 이미지 업로드 드롭존, 대표 이미지 미리보기, 보조 이미지 2열 그리드, 업로드 개수/용량
 */
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import { CancelIcon, CloudUploadIcon, OpenWithIcon, PushPinIcon } from "../../lib/icons";
import ImageActionButton from "./ImageActionButton";
import { memo, useRef } from "react";

function ImageAttachmentSection({
  sectionCardSx,
  thumbnailActionButtonSx,
  images,
  onAddImages,
  onDeleteImage,
  onSetThumbnailImage,
}) {
  const fileInputRef = useRef(null);

  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  const primaryImage = sortedImages.find(image => image.isThumbnail) ?? sortedImages[0];
  const secondaryImages = sortedImages.filter(image => image.id !== primaryImage?.id);

  return (
    <Paper className="portfolio-editor-image-section" elevation={0} sx={sectionCardSx}>
      <Stack direction="row" sx={{ mb: 3, width: "100%", justifyContent: "space-between", alignItems: "center" }}>
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
        onClick={() => fileInputRef.current?.click()}
        sx={{
          width: "100%",
          minHeight: 194,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed",
          borderColor: "#8d99ae",
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Stack spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
          <CloudUploadIcon sx={{ fontSize: 40, color: "#212121" }} />

          <Text className="portfolio-editor-image-section__dropzone-title" fontWeight={700}>
            파일을 끌어서 놓거나 클릭하여 업로드
          </Text>

          <Text className="portfolio-editor-image-section__dropzone-help" color="text.secondary" fontSize={12}>
            PNG, JPG, WebP (최대 10MB)
          </Text>

          <Box />
        </Stack>
      </ButtonBase>

      <Text fontWeight={700} sx={{ mb: 2 }}>
        이미지 미리보기
      </Text>

      <Stack spacing={2} sx={{ mb: 2 }}>
        {primaryImage && (
          <Box
            sx={{
              position: "relative",
              aspectRatio: "358 / 220",
              border: "1px solid",
              borderColor: "#d7dbe7",
              borderRadius: 1,
              bgcolor: "#f5f7fb",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={primaryImage.previewUrl}
              alt="대표 이미지 미리보기"
              sx={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
              }}
            />
            <Chip
              className="portfolio-editor-image-section__thumbnail-badge"
              label="대표 이미지"
              color="primary"
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                borderRadius: 1,
                fontWeight: 700,
              }}
            />
            <Stack direction="row" spacing={0.5} sx={{ position: "absolute", top: 8, right: 8 }}>
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

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 2,
          }}
        >
          {secondaryImages.map((image, index) => {
            const imageNumber = index + 2;

            return (
              <Box
                key={image.id}
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
                  <ImageActionButton aria-label={`이미지 ${imageNumber} 이동`} sx={thumbnailActionButtonSx}>
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
          })}
        </Box>
      </Stack>

      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Text className="portfolio-editor-image-section__upload-count" color="primary" fontWeight={700} fontSize={12}>
          {images.length}/5장 업로드됨
        </Text>

        <Text className="portfolio-editor-image-section__file-size" color="text.secondary" fontSize={12}>
          980KB
        </Text>
      </Stack>
    </Paper>
  );
}

export default memo(ImageAttachmentSection);
