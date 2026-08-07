// React Hooks
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// mui Components
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

// My Components
import DraftGuideSection from "../components/PortfolioEditor/DraftGuideSection";
import EditorActionBar from "../components/PortfolioEditor/EditorActionBar";
import EditorTitleSection from "../components/PortfolioEditor/EditorTitleSection";
import GithubAiAnalysisSection from "../components/PortfolioEditor/GithubAiAnalysisSection";
import ImageAttachmentSection from "../components/PortfolioEditor/ImageAttachmentSection";
import ProjectBasicInfoSection from "../components/PortfolioEditor/ProjectBasicInfoSection";
import ProjectMetaSection from "../components/PortfolioEditor/ProjectMetaSection";

export default function PortfolioEditor({ data }) {
  // 경로에서 파라미터 받기
  const { id } = useParams();
  // 페이지 이동 초기화
  const navigate = useNavigate();
  // 현재 경로가 id/edit이면 true
  const isEdit = Boolean(id);

  // 로컬 스토리지 임시저장 데이터. 객체 데이터 확정되면 키값은 기본값으로 넣어주기
  const [temporaryDrafts, setTemporaryDrafts] = useState([{ id: null }]);

  // 공개/비공개 토글 스위치 체크여부 상태
  const [isPortfolioPublic, setIsPortfolioPublic] = useState(false);

  // 공개/비공개 토글 스위치 핸들링 함수
  const handlePortfolioVisibilityChange = e => {
    setIsPortfolioPublic(e.target.checked);
  };

  // 폼 전송 함수
  const handleSubmit = e => {
    e.preventDefault();
  };

  // 실험용 콘솔로그 끝나면 지울것
  useEffect(() => {
    console.log(isPortfolioPublic);
  }, [isPortfolioPublic]);

  // AI 분석 결과 데이터 객체

  const sectionCardSx = {
    border: "1px solid",
    borderColor: "#c2c6d8",
    borderRadius: 2,
    bgcolor: "background.paper",
    p: { xs: 2, tablet: 3 },
  };

  const fieldLabelSx = {
    mb: 1,
    color: "#757575",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "0.28px",
    display: "block",
  };

  const formInputSx = {
    borderRadius: 2,
    bgcolor: "background.paper",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#c2c6d8",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9aa3b2",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "primary.main",
      borderWidth: 2,
    },
  };

  const thumbnailActionButtonSx = {
    width: 32,
    height: 32,
    p: 0.75,
    border: "0.2px solid rgba(68, 68, 68, 0.5)",
    borderRadius: 1.5,
    bgcolor: "rgba(255, 255, 255, 0.8)",
    color: "#444",
    "&:hover": {
      bgcolor: "rgba(255, 255, 255, 0.92)",
    },
    "& .MuiSvgIcon-root": {
      fontSize: 18,
    },
  };

  const projectDescription =
    "Portfolio+는 창작자와 개발자가 자신의 프로젝트를 전시하고, 방문자와 채용 담당자가 분야와 기술 스택을 기준으로 작품을 탐색할 수 있는 AI 기반 포트폴리오 갤러리 플랫폼입니다.\nGitHub 저장소에서 확인 가능한 프로젝트 구조와 참여 내역을 분석해 주요 기능과 기술적 특징을 정리하고, 제작자의 주관적인 소개를 보완하는 정보를 제공합니다.\n작품 탐색부터 제작자 프로필 확인, 채용 및 협업 문의까지 이어지는 통합 사용자 경험을 목표로 제작했습니다.";

  return (
    <>
      <Container
        component="main"
        maxWidth={false}
        disableGutters
        sx={{
          maxWidth: "1272px",
        }}
      >
        <EditorTitleSection isEdit={isEdit} temporaryDrafts={temporaryDrafts} />

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={4} sx={{ pb: 14 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", desktop: "minmax(0, 2fr) minmax(320px, 400px)" },
                gap: 3,
                alignItems: "start",
              }}
            >
              <Stack className="left-side primary-info" spacing={3}>
                <ProjectBasicInfoSection
                  sectionCardSx={sectionCardSx}
                  fieldLabelSx={fieldLabelSx}
                  formInputSx={formInputSx}
                  projectDescription={projectDescription}
                />
                <GithubAiAnalysisSection sectionCardSx={sectionCardSx} />
              </Stack>

              <Stack spacing={3}>
                <ImageAttachmentSection
                  sectionCardSx={sectionCardSx}
                  thumbnailActionButtonSx={thumbnailActionButtonSx}
                />
                <ProjectMetaSection sectionCardSx={sectionCardSx} fieldLabelSx={fieldLabelSx} formInputSx={formInputSx} />
              </Stack>
            </Box>

            <DraftGuideSection sectionCardSx={sectionCardSx} formInputSx={formInputSx} />
            <EditorActionBar
              isEdit={isEdit}
              isPortfolioPublic={isPortfolioPublic}
              onVisibilityChange={handlePortfolioVisibilityChange}
            />
          </Stack>
        </Box>
      </Container>
    </>
  );
}
