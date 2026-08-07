/**
 * 포트폴리오 에디터 폼 공통 라벨 컴포넌트
 * @param {{ children: React.ReactNode, htmlFor?: string, required?: boolean, sx?: object }} props - 라벨 내용, 연결할 input id, 필수 여부, MUI sx 스타일
 * @returns {JSX.Element} required가 true이면 별표 포함 label Typography
 */
import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";

export default function FieldLabel({ children, htmlFor, required = false, sx }) {
  return (
    <Text component="label" htmlFor={htmlFor} sx={sx}>
      {children}
      {required ? (
        <Box component="span" sx={{ color: "error.main" }} aria-hidden="true">
          {" *"}
        </Box>
      ) : null}
    </Text>
  );
}
