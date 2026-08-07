import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// mui Components
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Text from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

// UI Components

// Material Icons
import {
  EditIcon,
  PublicIcon,
  LockIcon,
  VisibilityIcon,
  ErrorTriangleIcon,
  CalendarIcon,
  AwesomeIcon,
  DropDownIcon,
  ErrorCircleIcon,
  CloudUploadIcon,
} from "../lib/icons";

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
            {/* 상단 (주요 정보 입력 & 분석) */}
            <Box>
              {/* 좌측 (기본 정보 & AI 분석) */}
              <Stack className="left-side primary-info">
                {/* 기본 정보 섹션 */}
                <Box component="section">
                  {/* 섹션 타이틀 */}
                  <Box>
                    <Text>
                      <ErrorCircleIcon />
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
                      <OutlinedInput
                        id="started_at"
                        name="started_at"
                        size="small"
                        endAdornment={
                          <InputAdornment position="start">
                            <CalendarIcon />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    {" ~ "}
                    <FormControl fullWidth>
                      <OutlinedInput
                        id="ended_at"
                        name="ended_at"
                        size="small"
                        endAdornment={
                          <InputAdornment position="start">
                            <CalendarIcon />
                          </InputAdornment>
                        }
                      />
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
                        GitHub 저장소 URL (저장소 분석 시 필수)
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

                {/* 깃허브 AI 분석 섹션 */}
                <Box component="section">
                  {/* 섹션 타이틀 */}
                  <Stack>
                    <Stack>
                      <AwesomeIcon color="primary" sx={{ fontSize: { xs: 32, md: 40 } }} aria-hidden="true" />
                      <Text>GitHub AI 분석 결과</Text>
                    </Stack>

                    <Stack>
                      <Text>최종 분석: 2026-07-26 14:30</Text>
                      <Button variant="contained" disabled size="large">
                        분석 완료
                      </Button>
                    </Stack>
                  </Stack>

                  {/* 편집 제한 안내 */}
                  <Alert>
                    <Text>※ AI로 생성된 내용 중 일부는 임의로 수정할 수 없습니다.</Text>
                  </Alert>

                  {/* 분석결과 그리드 */}
                  <Box component={Grid}>
                    <Stack>
                      <Text>프로젝트 요약</Text>
                      <Text>내용</Text>
                    </Stack>
                    <Stack>
                      <Text>주요 기능</Text>
                      <Text>내용</Text>
                    </Stack>
                    <Stack>
                      <Text>기술적 특징</Text>
                      <Text>내용</Text>
                    </Stack>
                    <Stack>
                      <Text>프로젝트 구조</Text>
                      <Text>내용</Text>
                    </Stack>
                    <Stack>
                      <Text>기술적 특징</Text>
                      <Text>내용</Text>
                    </Stack>
                    <Stack>
                      <Text>참여 내역</Text>
                      <Text>내용</Text>
                    </Stack>
                  </Box>

                  {/* 분석 근거 탭 */}
                  <Accordion
                    defaultExpanded
                    elevation={0}
                    sx={{
                      bgcolor: "#f1f2ff",
                      borderRadius: "16px !important",
                      overflow: "hidden",

                      "&::before": {
                        display: "none",
                      },
                    }}
                  >
                    <AccordionSummary>
                      <Text>분석 근거</Text>
                    </AccordionSummary>

                    <AccordionDetails sx={{ px: 4, pt: 0, pb: 4 }}>
                      <Stack>
                        <Button
                          type="button"
                          variant="outlined"
                          sx={{
                            px: 3,
                            py: 1,
                            bgcolor: "background.paper",
                          }}
                        >
                          프로젝트 구조
                        </Button>

                        <Button type="button" variant="contained" sx={{ px: 3, py: 1 }}>
                          커밋 기록
                        </Button>
                      </Stack>

                      <Paper>
                        <Text color="primary">영역을 펼쳐 분석 근거를 확인하세요</Text>
                      </Paper>

                      <Alert>
                        <ErrorTriangleIcon />
                        <Text>
                          분석 한계 : 커밋 작성자 정보가 실제 작업자와 다르거나 하나의 계정을 공동으로 사용했다면,
                          개인별 참여 내역을 정확하게 구분하기 어렵습니다.
                        </Text>
                      </Alert>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Stack>

              {/* 우측 (이미지 & 유형 정보) */}
              <Box>
                <Paper>
                  <Stack>
                    <Text>이미지 첨부</Text>

                    <Text>최대 5개 이미지</Text>
                  </Stack>

                  <ButtonBase>
                    <Stack>
                      <CloudUploadIcon />

                      <Text>파일을 끌어서 놓거나 클릭하여 업로드</Text>

                      <Text>PNG, JPG, WebP (최대 10MB)</Text>

                      <Box />
                    </Stack>
                  </ButtonBase>

                  <Text>이미지 미리보기</Text>

                  {/* 추후 이미지 미리보기 목록을 넣을 영역 */}
                  <Box />

                  <Stack>
                    <Text>0/5장 업로드됨</Text>

                    <Text>0KB</Text>
                  </Stack>
                </Paper>
              </Box>
            </Box>

            {/* 하단 (초안 가이드) */}
            <Box>
              <Box component="section" aria-labelledby="draft-guide-title">
                <Stack direction="row">
                  <Stack direction="row">
                    <EditIcon aria-hidden="true" />

                    <Text id="draft-guide-title" component="h2" variant="h4">
                      프로젝트 설명 초안 가이드 생성
                    </Text>
                  </Stack>

                  <Button type="button" variant="contained" disabled>
                    생성 완료
                  </Button>
                </Stack>

                <Stack direction="row">
                  <Paper component="article" variant="outlined">
                    <Text component="h3" variant="h5">
                      현재 내용
                    </Text>

                    <Text component="p">{/* 현재 프로젝트 설명 */}</Text>

                    <Button type="button" variant="contained">
                      되돌리기
                    </Button>
                  </Paper>

                  <Paper component="article" variant="outlined">
                    <Text component="h3" variant="h5">
                      AI 추천 초안 (미리보기)
                    </Text>

                    <Text component="p">{/* AI 추천 초안 */}</Text>

                    <Button type="button" variant="contained" disabled>
                      적용됨
                    </Button>
                  </Paper>
                </Stack>

                <Box component="section" aria-labelledby="one-line-summary-title">
                  <Text id="one-line-summary-title" component="h3" variant="h6">
                    AI 추천 한 줄 요약 (미리보기)
                  </Text>

                  <OutlinedInput
                    fullWidth
                    multiline
                    minRows={4}
                    inputProps={{
                      "aria-label": "AI 추천 한 줄 요약",
                    }}
                  />

                  <Stack direction="row">
                    <Button type="button" variant="outlined">
                      취소
                    </Button>

                    <Button type="button" variant="contained">
                      적용하기
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Box>

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
                  <VisibilityIcon />
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
