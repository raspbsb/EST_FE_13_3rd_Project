/**
 * 이미지 썸네일 위 핀, 이동, 삭제 액션 버튼 공통 래퍼
 * @param {{ "aria-label": string, children: React.ReactNode, danger?: boolean, sx?: object }} props - aria-label: 버튼 접근성 이름, children: 버튼 안에 표시할 아이콘, danger: 삭제 계열 버튼 여부, sx: IconButton 추가 sx
 * @returns {JSX.Element} 이미지 썸네일 위에 배치할 액션 IconButton
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
