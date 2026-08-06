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
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Text from "@mui/material/Typography";

// Material Icons
import { PublicIcon, LockIcon, VisibilityOutlinedIcon, ErrorOutlinedIcon, OutlinedInput } from "../lib/icons";

export default function PortfolioEditor({ data }) {
  // 경로에서 파라미터 받기
  const { id } = useParams();
  // 페이지 이동 초기화
  const navigate = useNavigate();
  // 현재 경로가 id/edit이면 true
  const isEdit = Boolean(id);

  // 로컬 스토리지 임시저장 데이터. 객체 데이터 확정되면 키값은 기본값으로 넣어주기
  const [temp, setTemp] = useState([{ id: null }]);

  // 공개/비공개 토글 스위치 체크여부 상태
  const [switchChecked, setSwitchChecked] = useState(false);

  // 공개/비공개 토글 스위치 핸들링 함수
  const handleSwitch = e => {
    setSwitchChecked(e.target.checked);
  };

  // 폼 전송 함수
  const handleSubmit = e => {
    e.preventDefault();
  };

  // 실험용 콘솔로그 끝나면 지울것
  useEffect(() => {
    console.log(switchChecked);
  }, [switchChecked]);

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
        {/* 타이틀 */}
        <Box>
          {/* 타이틀 & 페이지 설명 */}
          <Box>
            <Text component="h1" variant="h4" fontWeight={700}>
              포트폴리오 {isEdit ? "수정" : "등록"}
            </Text>
            <Text>
              프로젝트 정보를{" "}
              {isEdit
                ? "최신으로 유지하고 AI 분석을 통해 디테일을 강화하세요."
                : "입력하고 AI 분석을 통해 포트폴리오를 완성하세요."}
            </Text>
          </Box>

          {/* 임시저장 */}
          {temp[0].id ? (
            <Box>
              {/* 텍스트 그룹 */}
              <Box>
                <Text>이전에 임시저장한 내용이 있습니다.</Text>
                <Text>최신 저장 : 2026.08.02 18:30</Text>
              </Box>
              {/* 버튼 그룹 */}
              <Box>
                <Button type="submit" variant="contained">
                  최신 저장 내용 적용
                </Button>
                <Button type="button" variant="outlined">
                  전체 저장 목록 확인
                </Button>
              </Box>
            </Box>
          ) : null}
        </Box>

        {/* 전송 폼 */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* 콘텐츠 그리드 */}
          <Box>
            {/* 좌측 (기본 정보 & AI 분석) */}
            <Box>
              {/* 기본 정보 */}
              <Box>
                {/* 섹션 타이틀 */}
                <Box>
                  <Text>
                    <ErrorOutlinedIcon />
                    프로젝트 기본 정보
                  </Text>
                </Box>

                <FormControl fullWidth required>
                  <Text component="label" htmlFor="title" sx={{ mb: 1 }}>
                    프로젝트명
                    <Box component="span" sx={{ color: "error.main" }} aria-hidden="true">
                      {" *"}
                    </Box>
                  </Text>

                  <OutlinedInput id="title" name="title" size="small" />
                </FormControl>

                {/* 기간/배포 그룹 */}
                <Box>
                  <FormControl fullWidth>
                    <Text component="label" htmlFor="started_at" sx={{ mb: 1 }}>
                      프로젝트 기간
                    </Text>
                    <OutlinedInput id="started_at" name="started_at" size="small" />
                  </FormControl>
                  {" ~ "}
                  <FormControl fullWidth>
                    <OutlinedInput id="ended_at" name="ended_at" size="small" />
                  </FormControl>
                  <FormControl fullWidth required>
                    <Text component="label" htmlFor="deploy_url" sx={{ mb: 1 }}>
                      배포 URL
                    </Text>
                    <OutlinedInput id="deploy_url" name="deploy_url" size="small" />
                  </FormControl>
                </Box>

                {/* 역할/레포 그룹 */}
                <Box>
                  <FormControl fullWidth required>
                    <Text component="label" htmlFor="author_role" sx={{ mb: 1 }}>
                      담당 역할
                    </Text>

                    <OutlinedInput id="author_role" name="author_role" size="small" />
                  </FormControl>
                  <FormControl fullWidth required>
                    <Text component="label" htmlFor="repository_url" sx={{ mb: 1 }}>
                      GitHub 저장소 URL
                      <Box component="span" sx={{ color: "error.main" }} aria-hidden="true">
                        {" *"}
                      </Box>
                    </Text>

                    <OutlinedInput id="repository_url" name="repository_url" size="small" />
                  </FormControl>
                </Box>
                <FormControl fullWidth required>
                  <Text component="label" htmlFor="description" sx={{ mb: 1 }}>
                    프로젝트 설명
                    <Box component="span" sx={{ color: "error.main" }} aria-hidden="true">
                      {" *"}
                    </Box>
                  </Text>

                  <OutlinedInput id="description" name="description" size="small" />
                </FormControl>
              </Box>

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
                  <Text>{switchChecked ? "공개 설정" : "비공개 설정"}</Text>
                  <Text>{switchChecked ? "모든 사용자가 " : "초대된 사람만 "}내 포트폴리오를 볼 수 있습니다.</Text>
                </Box>
                {switchChecked ? <PublicIcon /> : <LockIcon />}
              </Box>

              {/* 임시저장/미리보기/수정완료 버튼 */}
              <Box>
                <Button type="button" variant="outlined">
                  임시저장
                </Button>
                <Button type="button" variant="outlined">
                  <VisibilityOutlinedIcon />
                  미리보기
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
