import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Text from "@mui/material/Typography";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Switch from "@mui/material/Switch";

// Material Icons
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";

export default function PortfolioEditor({ data }) {
  // 경로에서 파라미터 받기
  const { id } = useParams();
  // 페이지 이동 초기화
  const navigate = useNavigate();
  // 현재 경로가 id/edit이면 true
  const isEdit = Boolean(id);

  const [checked, setChecked] = useState(false);

  const handleSwitch = e => {
    setChecked(e.target.checked);
  };

  const handleSubmit = e => {
    e.preventDefault();
  };

  useEffect(() => {
    console.log(checked);
  }, [checked]);

  // AI 분석 결과 데이터 객체

  return (
    <>
      {/* 전체 컨테이너 */}
      <Container
        component="main"
        maxWidth={false}
        sx={{
          maxWidth: "1272px",
          py: 6,
        }}
      >
        {/* 헤더 */}
        <Box>
          {/* 타이틀 & 페이지 설명 */}
          <Text component="h1" variant="h4" fontWeight={700}>
            포트폴리오 {isEdit ? "수정" : "등록"}
          </Text>

          {/* 임시저장 */}
          <Box></Box>
        </Box>

        {/* 전송 폼 */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* 콘텐츠 그리드 */}
          <Box>
            {/* 좌측 (기본 정보 & AI 분석) */}
            <Box>
              {/* 기본 정보 */}
              <Box></Box>

              {/* AI 분석 */}
              <Box></Box>
            </Box>

            {/* 우측 (이미지 & 유형 정보) */}
            <Box></Box>

            {/* 하단 (초안 가이드) */}
            <Box></Box>

            {/* 하단 고정 sticky 액션 바 */}
            <Box>
              {/* 공개/비공개 토글 그룹 */}
              <Box>
                <Switch onChange={handleSwitch} />
                {/* 공개/비공개 텍스트 */}
                <Box>
                  <Text>{checked ? "공개 설정" : "비공개 설정"}</Text>
                  <Text>{checked ? "모든 사용자가 " : "초대된 사람만 "}내 포트폴리오를 볼 수 있습니다.</Text>
                </Box>
                {checked ? <PublicIcon /> : <LockIcon />}
              </Box>

              {/* 임시저장/미리보기/수정완료 버튼 */}
              <Box>
                <Button type="button" variant="outlined">
                  임시저장
                </Button>
                <Button type="button" variant="outlined">
                  Outlined
                </Button>
                <Button type="submit" variant="contained">
                  {isEdit ? "수정 완료" : "작성 완료"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
