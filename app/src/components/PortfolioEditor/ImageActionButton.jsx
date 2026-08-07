/**
 * 이미지 썸네일 위 핀, 이동, 삭제 액션 버튼 공통 래퍼
 * @param {{ "aria-label": string, children: React.ReactNode, danger?: boolean, sx?: object }} props - 접근성 라벨, 아이콘, 위험 액션 여부, 공통 버튼 스타일
 * @returns {JSX.Element} danger 여부에 따라 색상 조정된 MUI IconButton
 */
import IconButton from "@mui/material/IconButton";

export default function ImageActionButton({ "aria-label": ariaLabel, children, danger = false, sx }) {
  return (
    <IconButton
      type="button"
      aria-label={ariaLabel}
      sx={{
        ...sx,
        color: danger ? "#ba1a1a" : sx?.color,
      }}
    >
      {children}
    </IconButton>
  );
}
