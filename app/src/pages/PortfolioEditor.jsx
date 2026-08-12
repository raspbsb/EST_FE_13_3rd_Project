// React Hooks
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";

// mui Components
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

// My Components & Modules
import DraftGuideSection from "../components/PortfolioEditor/DraftGuideSection";
import EditorActionBar from "../components/PortfolioEditor/EditorActionBar";
import EditorTitleSection from "../components/PortfolioEditor/EditorTitleSection";
import GithubAiAnalysisSection from "../components/PortfolioEditor/GithubAiAnalysisSection";
import ImageAttachmentSection from "../components/PortfolioEditor/ImageAttachmentSection";
import ProjectBasicInfoSection from "../components/PortfolioEditor/ProjectBasicInfoSection";
import ProjectMetaSection from "../components/PortfolioEditor/ProjectMetaSection";
import "../components/PortfolioEditor/PortfolioEditor.css";
import { createPortfolioSavePayload } from "../utils/createPortfolioSavePayload";

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
  const [temporaryDrafts, setTemporaryDrafts] = useState([{ id: 1 }]);
  // 공개/비공개 토글 스위치 체크여부 상태
  const [isPortfolioPublic, setIsPortfolioPublic] = useState(false);

  // 카테고리/기술스택 최대 개수 제한용 상수
  const MAX_CATEGORY_COUNT = 5;
  const MAX_TECH_STACK_COUNT = 8;

  // 이미지 검증 기준 상수
  const MAX_IMAGE_COUNT = 5;
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

  // 섹션 카드 스타일 (mui)
  const sectionCardSx = useMemo(
    () => ({
      border: "1px solid",
      borderColor: "#c2c6d8",
      borderRadius: "12px",
      bgcolor: "background.paper",
      p: { xs: "17px", tablet: "25px" },
    }),
    [],
  );
  // 라벨 스타일 (mui)
  const fieldLabelSx = useMemo(
    () => ({
      mb: 1,
      color: "#757575",
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: "0.28px",
      lineHeight: "20px",
      display: "block",
    }),
    [],
  );
  // 인풋 스타일 (mui)
  const formInputSx = useMemo(
    () => ({
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
      "&.Mui-disabled": {
        bgcolor: "#f5f5f5",
        color: "#9e9e9e",
        cursor: "not-allowed",
      },
      "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
        borderColor: "#d6d9e3",
      },
      "&.Mui-disabled .MuiInputBase-input": {
        color: "#9e9e9e",
        WebkitTextFillColor: "#9e9e9e",
      },
      "&.Mui-disabled .MuiSvgIcon-root": {
        color: "#9e9e9e",
      },
    }),
    [],
  );
  // 이미지 액션 버튼 스타일 (mui)
  const thumbnailActionButtonSx = useMemo(
    () => ({
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
    }),
    [],
  );

  // 사용자 입력 데이터 상태 객체. 기본값 모두 빈값. 키 : title, summary, description, started_at, ended_at,
  // deploy_url, repository_url, project_type, team_size, author_role, environment, is_public, categories, tech_stacks, images
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description: "",
    started_at: "",
    ended_at: "",
    deploy_url: "",
    repository_url: "",
    project_type: "",
    team_size: "",
    author_role: "",
    environment: "",
    is_public: false,
    categories: [],
    tech_stacks: [],
    images: [{ id: "", previewUrl: "", name: "", size: "", type: "", isThumbnail: "" }],
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

  // 폼 전송 함수
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();

      const payload = createPortfolioSavePayload({
        formData,
        aiAnalysisResult,
        draftGuide,
        authorId: null,
      });

      console.log(payload);
    },
    [formData, aiAnalysisResult, draftGuide],
  );

  // 카테고리 텍스트를 매개변수로 받아서 칩으로 사용할 텍스트 배열을 반환하는 함수
  const handleAddCategory = useCallback(category => {
    if (!category) return;

    setFormData(prev => {
      if (prev.categories.length >= MAX_CATEGORY_COUNT) return prev;

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
  }, []);

  // 카테고리 칩의 삭제 버튼을 클릭하면 카테고리 배열에서 해당 카테고리를 삭제하는 함수
  const handleDeleteCategory = useCallback(categoryValue => {
    setFormData(prev => ({
      ...prev,
      // 선택한 카테고리 값이랑 다른 카테고리 값들만 남겨서 필터링
      categories: prev.categories.filter(category => category.value !== categoryValue),
    }));
  }, []);

  // 기술 스택 텍스트를 매개변수로 받아서 칩으로 사용할 텍스트 배열을 반환하는 함수
  // 기술 스택 검색 기능으로 선택하거나, 직접 입력한 값을 formData.tech_stacks에 추가
  // freeSolo 입력값은 문자열로 들어올 수 있으므로 value/label 객체 형태로 변환
  // 이미 추가된 기술 스택은 value 또는 대소문자를 무시한 label 기준으로 중복 추가하지 않는다.
  const handleAddTechStack = useCallback(techStack => {
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
      if (prev.tech_stacks.length >= MAX_TECH_STACK_COUNT) return prev;

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
  }, []);

  // 카테고리 칩의 삭제 버튼을 클릭하면 카테고리 배열에서 해당 카테고리를 삭제하는 함수
  const handleDeleteTechStack = useCallback(techStackValue => {
    setFormData(prev => ({
      ...prev,
      // 선택한 카테고리 값이랑 다른 카테고리 값들만 남겨서 필터링
      tech_stacks: prev.tech_stacks.filter(techStack => techStack.value !== techStackValue),
    }));
  }, []);

  // 사용자 입력 반영 함수 : select와 input의 현재 상태를 반영해 변수에 저장
  const handleFormChange = useCallback(e => {
    // 이벤트 타겟의 name, value, type, checked 상태를 구조분해할당
    const { name, value, type, checked } = e.target;

    // 개발용 콘솔 : 끝나면 지울것
    const nextValue = type === "checkbox" ? checked : value;
    // console.log({
    //   [name]: nextValue,
    // });

    // 이전걸 풀어헤친다음 그 중 formData에 해당하는 것만 값 변경
    setFormData(prev => ({
      ...prev,
      [name]: nextValue,
    }));
  }, []);

  // 공개/비공개 토글 스위치 핸들링 함수
  const handlePortfolioVisibilityChange = useCallback(
    e => {
      setIsPortfolioPublic(e.target.checked);
      handleFormChange(e);
    },
    [handleFormChange],
  );

  // 파일 선택/드롭으로 들어온 파일 배열을 받아서 검증하고 formData.images에 추가하는 함수
  const handleAddImages = useCallback(files => {}, []);

  // 선택한 이미지를 삭제하는 함수
  const handleDeleteImage = useCallback(imageId => {}, []);

  // 대표 이미지를 바꾸는 함수
  const handleSetThumbnailImage = useCallback(imageId => {}, []);

  // 이미지 순서를 바꾸는 함수
  const handleMoveImage = useCallback((imageId, direction) => {}, []);

  // 실험용 콘솔 : 끝나면 지울것
  useEffect(() => {
    console.log(isPortfolioPublic);
  }, [isPortfolioPublic]);

  return (
    <>
      {/* {console.log("PortfolioEditor 렌더")} */}
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
                <GithubAiAnalysisSection sectionCardSx={sectionCardSx} aiAnalysisResult={aiAnalysisResult} />
              </Stack>

              <Stack spacing={3}>
                <ImageAttachmentSection
                  sectionCardSx={sectionCardSx}
                  thumbnailActionButtonSx={thumbnailActionButtonSx}
                  images={formData.images}
                  onAddImages={handleAddImages}
                  onDeleteImage={handleDeleteImage}
                  onSetThumbnailImage={handleSetThumbnailImage}
                  onMoveImage={handleMoveImage}
                />
                <ProjectMetaSection
                  sectionCardSx={sectionCardSx}
                  fieldLabelSx={fieldLabelSx}
                  formInputSx={formInputSx}
                  projectType={formData.project_type}
                  teamSize={formData.team_size}
                  environment={formData.environment}
                  categories={formData.categories}
                  techStacks={formData.tech_stacks}
                  handleFormChange={handleFormChange}
                  handleAddCategory={handleAddCategory}
                  handleDeleteCategory={handleDeleteCategory}
                  handleAddTechStack={handleAddTechStack}
                  handleDeleteTechStack={handleDeleteTechStack}
                  maxCategoryCount={MAX_CATEGORY_COUNT}
                  maxTechStackCount={MAX_TECH_STACK_COUNT}
                />
              </Stack>
            </Box>

            <DraftGuideSection
              sectionCardSx={sectionCardSx}
              formInputSx={formInputSx}
              draftGuide={draftGuide}
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
