/**
 * 포트폴리오 에디터 폼 공통 라벨 컴포넌트
 * @param {{ children: React.ReactNode, htmlFor?: string, required?: boolean, sx?: object }} props - children: 화면에 표시할 라벨 텍스트/노드, htmlFor: 라벨 클릭 시 포커스할 input id, required: 필수 별표 표시 여부, sx: 라벨 Typography sx
 * @returns {JSX.Element} 폼 입력 요소와 연결 가능한 공통 라벨 Typography
 */
import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";

export default function FieldLabel({ children, htmlFor, required = false, feedback = "", sx }) {
  return (
    <Text
      component="label"
      htmlFor={htmlFor}
      sx={{
        ...sx,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Box component="span">
        {children}
        {required ? (
          <Box component="span" sx={{ color: "error.main" }} aria-hidden="true">
            {" *"}
          </Box>
        ) : null}
      </Box>
      {feedback ? (
        <Box className="portfolio-editor-field-feedback" component="span">
          {feedback}
        </Box>
      ) : null}
    </Text>
  );
}
