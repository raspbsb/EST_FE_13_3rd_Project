// React Hooks
import { useEffect, useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";

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
import "../components/PortfolioEditor/PortfolioEditor.css";

export default function PortfolioEditor({ data }) {
  // 경로에서 파라미터 받기
  const { id } = useParams();
  // 경로에서 현재 위치 받기
  const editRouteMatch = useMatch({ path: "/portfolios/:id/edit", end: true });
  // 페이지 이동 초기화
  const navigate = useNavigate();
  // 현재 경로가 id/edit이면 true
  const isEdit = Boolean(id) && Boolean(editRouteMatch);

  // 로컬 스토리지 임시저장 데이터. 객체 데이터 확정되면 키값은 기본값으로 넣어주기
  const [temporaryDrafts, setTemporaryDrafts] = useState([{ id: null }]);
  // 공개/비공개 토글 스위치 체크여부 상태
  const [isPortfolioPublic, setIsPortfolioPublic] = useState(false);

  // 실험용 콘솔로그 끝나면 지울것
  useEffect(() => {
    console.log(isPortfolioPublic);
  }, [isPortfolioPublic]);

  // 섹션 카드 스타일 (mui)
  const sectionCardSx = {
    border: "1px solid",
    borderColor: "#c2c6d8",
    borderRadius: "12px",
    bgcolor: "background.paper",
    p: { xs: "17px", tablet: "25px" },
  };
  // 라벨 스타일 (mui)
  const fieldLabelSx = {
    mb: 1,
    color: "#757575",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "0.28px",
    lineHeight: "20px",
    display: "block",
  };
  // 인풋 스타일 (mui)
  const formInputSx = {
    minHeight: 42,
    borderRadius: "8px",
    bgcolor: "background.paper",
    fontSize: 16,
    lineHeight: "24px",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#c2c6d8",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9aa3b2",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "primary.main",
      borderWidth: 1,
    },
  };
  // 이미지 액션 버튼 스타일 (mui)
  const thumbnailActionButtonSx = {
    width: 32,
    height: 32,
    p: 0.75,
    border: "0.2px solid rgba(68, 68, 68, 0.5)",
    borderRadius: "8px",
    bgcolor: "rgba(255, 255, 255, 0.8)",
    color: "#444",
    "&:hover": {
      bgcolor: "rgba(255, 255, 255, 0.92)",
    },
    "& .MuiSvgIcon-root": {
      fontSize: 18,
    },
  };

  // 공개/비공개 토글 스위치 핸들링 함수
  const handlePortfolioVisibilityChange = e => {
    setIsPortfolioPublic(e.target.checked);
    handleFormChange(e);
  };

  // 폼 전송 함수
  const handleSubmit = e => {
    e.preventDefault();
  };

  // 사용자 입력 데이터 상태 객체. 기본값 모두 빈값. 키 : title, summary, description, started_at, ended_at,
  // deploy_url, repository_url, project_type, team_size, author_role, environment, is_public, categories, tech_stacks, images
  const [formData, setFormData] = useState({
    title: "Portfolio+",
    summary: "",
    description:
      "창작자와 개발자가 자신의 프로젝트를 등록하고, 방문자와 채용 담당자가 분야와 기술 스택을 기준으로 작품을 탐색할 수 있는 AI 기반 포트폴리오 갤러리 플랫폼입니다. GitHub 저장소 분석을 통해 프로젝트의 주요 기능과 기술적 특징, 참여 내역을 정리하여 제작자의 설명을 보완합니다.",
    started_at: "2026-07-15",
    ended_at: "2026-08-21",
    deploy_url: "https://react-mission-eight.vercel.app/",
    repository_url: "https://github.com/alikerock/estfe13-react-bbs-server/blob/main/index.js",
    project_type: "team",
    team_size: "small-team",
    author_role: "서비스 기획 · 스토리보드 · 디자인 · 프론트엔드 개발",
    environment: "course",
    is_public: false,
    categories: [
      { value: "web", label: "Web" },
      { value: "frontend", label: "Frontend" },
    ],
    tech_stacks: [
      { value: "sass", label: "Sass" },
      { value: "javascript", label: "javaScript" },
      { value: "react", label: "React" },
      { value: "typescript", label: "TypeScript" },
      { value: "next-js", label: "Next.js" },
      { value: "supabase", label: "Supabase" },
    ],
    images: [],
  });

  // AI 분석 결과 데이터 상태 객체. 기본값 모두 빈값. 키 : projectSummary, mainFeatures,
  // technicalFeatures, projectStructure, analyzedRole, participationDetails, analysisLimitation, analysisEvidence
  const [aiAnalysisResult, setAiAnalysisResult] = useState({
    projectSummary: "",
    mainFeatures: "",
    technicalFeatures: "",
    projectStructure: "",
    analyzedRole: "",
    participationDetails: "",
    analysisLimitation: "",
    analysisEvidence: null,
  });

  // AI 초안 생성 저장 데이터 상태 객체.
  const [draftGuide, setDraftGuide] = useState({
    originalDescription: "", // AI 초안 생성 전 사용자가 입력했던 기존 설명
    aiDraftDescription: "", // AI가 생성한 설명 초안
    aiShortSummary: "", // AI가 생성한 한 줄 요약
  });

  // 화면 동작 관리용 상태 객체.
  const [editorUi, setEditorUi] = useState({
    activeTab: "edit", // 현재 탭: 작성 / 미리보기
    isSubmitting: false, // 저장 버튼 누른 뒤 처리 중인지
    isPreviewOpen: false, // 미리보기 모달/패널 열림 여부
    selectedImageId: null, // 현재 선택된 이미지 id
  });

  // 카테고리 텍스트를 매개변수로 받아서 칩으로 사용할 텍스트 배열을 반환하는 함수
  const handleAddCategory = category => {
    if (!category) return;

    setFormData(prev => {
      // 기존 카테고리 배열에서 매개변수로 받은 카테고리가 존재하면 true, 없으면 false 반환
      const exists = prev.categories.some(item => item.value === category.value);

      // true면(이미 있으면) 뭐 안바꾸고 그대로 리턴
      if (exists) return prev;

      // false면(같은게 없으면) 카테고리 배열에 매개변수로 받은 카테고리 텍스트 추가
      return {
        ...prev,
        categories: [...prev.categories, category],
      };
    });
  };

  // 카테고리 칩의 삭제 버튼을 클릭하면 카테고리 배열에서 해당 카테고리를 삭제하는 함수
  const handleDeleteCategory = categoryValue => {
    setFormData(prev => ({
      ...prev,
      // 선택한 카테고리 값이랑 다른 카테고리 값들만 남겨서 필터링
      categories: prev.categories.filter(category => category.value !== categoryValue),
    }));
  };

  // 기술 스택 텍스트를 매개변수로 받아서 칩으로 사용할 텍스트 배열을 반환하는 함수
  // 기술 스택 검색 기능으로 선택하거나, 직접 입력한 값을 formData.tech_stacks에 추가
  // freeSolo 입력값은 문자열로 들어올 수 있으므로 value/label 객체 형태로 변환
  // 이미 추가된 기술 스택은 value 또는 대소문자를 무시한 label 기준으로 중복 추가하지 않는다.
  const handleAddTechStack = techStack => {
    if (!techStack) return;

    // 기술스택이 문자열이면 : 매개변수로 받은 기술스택의 좌우 공백 제거, 검색 가능하도록 소문자로 변경, 문자열 내의 각 공백은 -으로 변경해 value로, 좌우 공백만 제거한 텍스트는 label로 저장
    // 텍스트가 문자열이 아니면 : 받은 값 그대로 저장
    const nextTechStack =
      typeof techStack === "string"
        ? {
            value: techStack.trim().toLowerCase().replace(/\s+/g, "-"),
            label: techStack.trim(),
          }
        : techStack;

    // 위에서 저장한 값의 라벨이 없으면 그대로 리턴
    if (!nextTechStack.label) return;

    // 이전 기술스택의 value나 label 중 위에서 저장한 value나 label이 같다면(이미 존재한다면) true, 아니면 false 반환
    setFormData(prev => {
      const exists = prev.tech_stacks.some(
        item => item.value === nextTechStack.value || item.label.toLowerCase() === nextTechStack.label.toLowerCase(),
      );

      // true면 기존거 반환
      if (exists) return prev;

      // false면 기술스택 배열 풀어헤쳐서 새 기술스택 추가
      return {
        ...prev,
        tech_stacks: [...prev.tech_stacks, nextTechStack],
      };
    });
  };

  // 카테고리 칩의 삭제 버튼을 클릭하면 카테고리 배열에서 해당 카테고리를 삭제하는 함수
  const handleDeleteTechStack = techStackValue => {
    setFormData(prev => ({
      ...prev,
      // 선택한 카테고리 값이랑 다른 카테고리 값들만 남겨서 필터링
      tech_stacks: prev.tech_stacks.filter(techStack => techStack.value !== techStackValue),
    }));
  };

  // 사용자 입력 반영 함수 : select와 input의 현재 상태를 반영해 변수에 저장
  const handleFormChange = e => {
    // 이벤트 타겟의 name, value, type, checked 상태를 구조분해할당
    const { name, value, type, checked } = e.target;

    // 이전걸 풀어헤친다음 그 중 formData에 해당하는 것만 값 변경
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <>
      <Container
        className="portfolio-editor-page"
        component="main"
        maxWidth={false}
        disableGutters
        sx={{
          maxWidth: "1272px",
        }}
      >
        <EditorTitleSection isEdit={isEdit} temporaryDrafts={temporaryDrafts} />

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={4} sx={{ pb: 0 }}>
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
                  formData={formData}
                  handleFormChange={handleFormChange}
                />
                <GithubAiAnalysisSection sectionCardSx={sectionCardSx} />
              </Stack>

              <Stack spacing={3}>
                <ImageAttachmentSection
                  sectionCardSx={sectionCardSx}
                  thumbnailActionButtonSx={thumbnailActionButtonSx}
                  handleFormChange={handleFormChange}
                />
                <ProjectMetaSection
                  sectionCardSx={sectionCardSx}
                  fieldLabelSx={fieldLabelSx}
                  formInputSx={formInputSx}
                  formData={formData}
                  handleFormChange={handleFormChange}
                  handleAddCategory={handleAddCategory}
                  handleDeleteCategory={handleDeleteCategory}
                  handleAddTechStack={handleAddTechStack}
                  handleDeleteTechStack={handleDeleteTechStack}
                />
              </Stack>
            </Box>

            <DraftGuideSection
              sectionCardSx={sectionCardSx}
              formInputSx={formInputSx}
              handleFormChange={handleFormChange}
            />
            <EditorActionBar
              isEdit={isEdit}
              isPortfolioPublic={formData.is_public}
              onVisibilityChange={handlePortfolioVisibilityChange}
              handleFormChange={handleFormChange}
            />
          </Stack>
        </Box>
      </Container>
    </>
  );
}
