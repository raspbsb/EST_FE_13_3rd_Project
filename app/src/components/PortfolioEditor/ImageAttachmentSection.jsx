/**
 * 포트폴리오 이미지 업로드 영역, 대표/보조 이미지 미리보기 그리드
 * @param {{ cardSx: object, imageActionButtonSx: object }} props - 공통 카드 스타일, 이미지 액션 버튼 스타일 객체
 * @returns {JSX.Element} 업로드 드롭존, 대표 이미지, 보조 이미지 목록, 업로드 상태 텍스트
 */
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Text from "@mui/material/Typography";
import { CancelIcon, CloudUploadIcon, OpenWithIcon, PushPinIcon } from "../../lib/icons";
import ImageActionButton from "./ImageActionButton";

const previewImages = [
  "https://www.figma.com/api/mcp/asset/9f627a9c-01d7-44ba-a75d-5ea10f3fb01e.png",
  "https://www.figma.com/api/mcp/asset/385f11bb-0572-4357-9154-183a2069f19e.png",
  "https://www.figma.com/api/mcp/asset/dda323de-80c4-4823-8eb5-72dcfb6ad13a.png",
  "https://www.figma.com/api/mcp/asset/f87e37eb-22aa-4570-a56a-dcc1a0129bdc.png",
];

export default function ImageAttachmentSection({ cardSx, imageActionButtonSx }) {
  const [primaryImage, ...secondaryImages] = previewImages;

  return (
    <Paper elevation={0} sx={cardSx}>
      <Stack direction="row" sx={{ mb: 3, width: "100%", justifyContent: "space-between", alignItems: "center" }}>
        <Text component="h2" variant="h5" fontWeight={700}>
          이미지 첨부
        </Text>

        <Text color="text.secondary" fontSize={12}>
          최대 5
        </Text>
      </Stack>

      <ButtonBase
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

          <Text fontWeight={700}>파일을 끌어서 놓거나 클릭하여 업로드</Text>

          <Text color="text.secondary" fontSize={12}>
            PNG, JPG, WebP (최대 10MB)
          </Text>

          <Box />
        </Stack>
      </ButtonBase>

      <Text fontWeight={700} sx={{ mb: 2 }}>
        이미지 미리보기
      </Text>

      <Stack spacing={2} sx={{ mb: 2 }}>
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
            src={primaryImage}
            alt="대표 이미지 미리보기"
            sx={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover",
            }}
          />
          <Chip
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
            <ImageActionButton aria-label="대표 이미지 삭제" danger sx={imageActionButtonSx}>
              <CancelIcon />
            </ImageActionButton>
          </Stack>
        </Box>

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
                key={image}
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
                  src={image}
                  alt={`이미지 미리보기 ${imageNumber}`}
                  sx={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Stack direction="row" spacing={0.5} sx={{ position: "absolute", top: 8, right: 8 }}>
                  <ImageActionButton aria-label={`이미지 ${imageNumber} 대표 이미지로 고정`} sx={imageActionButtonSx}>
                    <PushPinIcon />
                  </ImageActionButton>
                  <ImageActionButton aria-label={`이미지 ${imageNumber} 이동`} sx={imageActionButtonSx}>
                    <OpenWithIcon />
                  </ImageActionButton>
                  <ImageActionButton aria-label={`이미지 ${imageNumber} 삭제`} danger sx={imageActionButtonSx}>
                    <CancelIcon />
                  </ImageActionButton>
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Stack>

      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Text color="primary" fontWeight={700} fontSize={12}>
          {previewImages.length}/5장 업로드됨
        </Text>

        <Text color="text.secondary" fontSize={12}>
          980KB
        </Text>
      </Stack>
    </Paper>
  );
}
