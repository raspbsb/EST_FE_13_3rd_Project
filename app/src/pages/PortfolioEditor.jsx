// React Hooks
import { useCallback, useEffect, useRef, useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";

// Material UI Components
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";

// Components & Modules
import DraftGuideSection from "../components/PortfolioEditor/DraftGuideSection";
import EditorActionBar from "../components/PortfolioEditor/EditorActionBar";
import EditorTitleSection from "../components/PortfolioEditor/EditorTitleSection";
import GithubAiAnalysisSection from "../components/PortfolioEditor/GithubAiAnalysisSection";
import ImageAttachmentSection from "../components/PortfolioEditor/ImageAttachmentSection";
import ProjectBasicInfoSection from "../components/PortfolioEditor/ProjectBasicInfoSection";
import ProjectMetaSection from "../components/PortfolioEditor/ProjectMetaSection";
import SeoMeta, { SITE_NAME } from "../components/SeoMeta";
import { getIsGithubLinked, getLinkedGithubUsername, linkGithubIdentity } from "../services/authService";
import { createPortfolio, getAuthenticatedUser, updatePortfolio } from "../services/portfolioService";
import { categoryOptions, techStackOptions } from "../constants/portfolioOptions";

// CSS
import styles from "./PortfolioEditor.module.css";

// Utils
import { deleteLocalStorageItem, loadLocalStorageItem, saveLocalStorageItem } from "../utils/localStorage";
import { createPortfolioPayload } from "../utils/portfolioPayload";
import { getEdgeFunctionErrorMessage } from "../utils/supabaseError";
import {
  createEmptyFormErrors,
  getFirstFormErrorMessage,
  hasFormErrors,
  validateAiFormFieldErrors,
  validateDraftGuideFieldErrors,
  validateSubmitFieldErrors,
} from "../utils/portfolioValidation";
import { supabase } from "../utils/supabase";

// 카테고리/기술스택 최대 개수 제한용 상수
const MAX_CATEGORY_COUNT = 5;
const MAX_TECH_STACK_COUNT = 8;

// 이미지 검증 기준 상수
const MAX_IMAGE_COUNT = 5;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

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

// 이미지 첨부 상태에 넣을 이미지 객체 생성 함수
const createPortfolioImageItem = ({ file, order, isThumbnail = false }) => ({
  id: crypto.randomUUID(),
  file,
  previewUrl: URL.createObjectURL(file),
  name: file.name,
  size: file.size,
  type: file.type,
  order,
  isThumbnail,
});

// 현재 배열 순서 기준으로 order를 1부터 다시 매기는 함수
const normalizeImageOrder = images =>
  images.map((image, index) => ({
    ...image,
    order: index + 1,
    isThumbnail: index === 0,
  }));

// 임시저장할 때 formData에서 브라우저 세션에만 유효한 이미지 객체를 제외하는 함수
const createDraftFormData = formData => ({
  ...formData,
  images: [],
});

// 임시저장 가능 여부 판단을 위해 값이 비어 있지 않은지 확인하는 함수
const hasNonEmptyDraftValue = value => {
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.values(value).some(hasNonEmptyDraftValue);

  return String(value ?? "").trim().length > 0;
};

// 이미지 제외 formData, AI 분석 결과, 초안 가이드 중 하나라도 입력값이 있는지 확인하는 함수
const hasPortfolioDraftContent = ({ formData, aiAnalysisResult, draftGuide }) => {
  const { images: _images, ...draftFormData } = formData;

  return (
    hasNonEmptyDraftValue(draftFormData) || hasNonEmptyDraftValue(aiAnalysisResult) || hasNonEmptyDraftValue(draftGuide)
  );
};

// DB : 카테고리/기술스택 label만 저장 -> 에디터 칩에서 사용하는 { value, label } 형태로 다시 변환
const createOptionFromLabel = ({ label, options }) => {
  const matchedOption = options.find(option => option.label === label);

  if (matchedOption) return matchedOption;

  return {
    value: String(label ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-"),
    label: label ?? "",
  };
};

// GitHub 저장소 URL(https://github.com/{사용자명}/{저장소명})에서 사용자명만 뽑아낸다.
const extractGithubUsernameFromUrl = repositoryUrl => {
  const match = String(repositoryUrl ?? "").match(/^https:\/\/github\.com\/([^/\s]+)\/[^/\s]+\/?$/);

  return match ? match[1] : null;
};

// Storage에 저장된 image_path를 화면 미리보기용 public URL로 변환
// DB에는 상대 경로만 저장되어 있고, img 태그에는 접근 가능한 URL이 필요함
const getPortfolioImagePublicUrl = imagePath => {
  if (!imagePath) return "";

  const { data } = supabase.storage.from("portfolio_images").getPublicUrl(imagePath);

  return data.publicUrl;
};

// DB에서 가져온 portfolios row를 에디터의 formData 구조로 변환
const createEditorFormData = data => ({
  title: data.title ?? "",
  summary: data.summary ?? "",
  description: data.description ?? "",
  started_at: data.started_at ?? "",
  ended_at: data.ended_at ?? "",
  deploy_url: data.deploy_url ?? "",
  repository_url: data.repository_url ?? "",
  project_type: data.project_type ?? "",
  team_size: data.team_size ?? "",
  author_role: data.author_role ?? "",
  environment: data.environment ?? "",
  is_public: Boolean(data.is_public),

  categories: (data.portfolio_categories ?? []).map(category =>
    createOptionFromLabel({
      label: category.category,
      options: categoryOptions,
    }),
  ),

  tech_stacks: (data.portfolio_tech_stacks ?? []).map(techStack =>
    createOptionFromLabel({
      label: techStack.tech_stack,
      options: techStackOptions,
    }),
  ),

  // 기존 이미지는 File 객체가 없으므로 imagePath를 보존하고 previewUrl은 public URL로 만든다.
  images: (data.portfolio_images ?? [])
    .map(image => ({
      id: image.image_id ?? image.image_path,
      imagePath: image.image_path,
      previewUrl: getPortfolioImagePublicUrl(image.image_path),
      name: image.alt_text ?? "portfolio-image",
      size: 0,
      type: "",
      order: image.display_order,
      isThumbnail: Boolean(image.is_thumbnail),
    }))
    .sort((a, b) => a.order - b.order),
});

// DB에서 가져온 portfolio_ai_created row를 에디터의 AI 분석 결과 상태 구조로 변환
const createEditorAiAnalysisResult = aiCreated => ({
  projectSummary: aiCreated.project_summary ?? "",
  mainFeatures: aiCreated.main_features ?? "",
  technicalFeatures: aiCreated.technical_features ?? "",
  projectStructure: aiCreated.project_structure ?? "",
  analyzedRole: aiCreated.analyzed_role ?? "",
  participationDetails: aiCreated.participation_details ?? "",
  analysisLimitation: aiCreated.analysis_limitation ?? "",
  analysisEvidence: aiCreated.analysis_evidence ?? null,
  analyzedAt: aiCreated.github_analyzed_at ?? "",
});

// DB에서 가져온 portfolio_ai_created row를 초안 가이드 상태 구조로 변환
const createEditorDraftGuide = aiCreated => ({
  originalDescription: aiCreated.draft_source_content ?? "",
  aiDraftDescription: aiCreated.generated_content ?? "",
  aiShortSummary: aiCreated.ai_short_summary ?? "",
  generatedAt: aiCreated.draft_generated_at ?? "",
  appliedDescriptionSource: "",
  isSummaryApplied: Boolean(aiCreated.ai_short_summary),
});

// 포트폴리오 에디터 임시저장 목록을 localStorage에 저장할 때 사용하는 key
const PORTFOLIO_EDITOR_DRAFT_KEY = "portfolio-editor-drafts";
// 임시저장 목록에서 유지할 최대 저장본 개수
const MAX_PORTFOLIO_DRAFT_COUNT = 5;
// 잠글 수 있는 임시저장본 최대 개수. 전부 잠기면 새 임시저장이 밀려날 자리가 없어지므로 5개보다 작게 제한한다.
const MAX_LOCKED_DRAFT_COUNT = 3;
// 프로젝트명이 비어 있을 때 임시저장 목록에 표시할 기본 제목
const UNTITLED_PORTFOLIO_DRAFT_TITLE = "제목 없는 임시저장";
// GitHub 연동 페이지로 이동하기 전 저장한 임시저장 id를 잠깐 보관하는 key
// 연동 완료/취소 후 이 페이지로 돌아왔을 때, 이 key에 남아있는 draft를 확인창 없이 자동으로 복원한다.
const PORTFOLIO_EDITOR_PENDING_RESTORE_KEY = "portfolio-editor-pending-restore-draft-id";

// 잠긴 임시저장본은 밀어내지 않고, 잠기지 않은 것부터(뒤쪽=오래된 것부터) 최대 개수에 맞춰 제거한다.
const capPortfolioDrafts = drafts => {
  if (drafts.length <= MAX_PORTFOLIO_DRAFT_COUNT) return drafts;

  const result = [...drafts];

  for (let i = result.length - 1; i >= 0 && result.length > MAX_PORTFOLIO_DRAFT_COUNT; i -= 1) {
    if (!result[i].locked) {
      result.splice(i, 1);
    }
  }

  return result;
};

// 등록/수정 페이지 조립용 최상위 컴포넌트
export default function PortfolioEditor({ data }) {
  // 수정 모드일 때 URL의 project_id를 가져오기 위한 라우트 파라미터
  const { id } = useParams();
  // 현재 경로가 정확히 /portfolios/:id/edit인지 확인해 등록/수정 모드를 구분
  const editRouteMatch = useMatch({ path: "/portfolios/:id/edit", end: true });
  // 로그인 리다이렉트, 저장 성공 후 상세 페이지 이동에 사용하는 라우터 함수
  const navigate = useNavigate();
  // project_id가 있고 edit 경로와 일치하면 수정 모드로 취급
  const isEdit = Boolean(id) && Boolean(editRouteMatch);

  // 인증 확인이 끝나기 전에는 에디터를 렌더링하지 않기 위한 로딩 플래그
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // localStorage에서 읽어온 임시저장 목록. 최신 저장본이 배열 앞쪽에 위치한다.
  const [temporaryDrafts, setTemporaryDrafts] = useState([]);

  // 현재 적용된 임시저장본 id. 제출 성공 후 해당 저장본만 자동 삭제할 때 사용한다.
  const [appliedDraftId, setAppliedDraftId] = useState(null);

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

  // AI 초안 생성 저장 데이터 상태 객체
  const [draftGuide, setDraftGuide] = useState({
    originalDescription: "", // AI 초안 생성 전 사용자가 입력했던 기존 설명
    aiDraftDescription: "", // AI가 생성한 설명 초안
    aiShortSummary: "", // AI가 생성한 한 줄 요약
    generatedAt: "",
    appliedDescriptionSource: "",
    isSummaryApplied: false,
  });

  // 화면 동작 관리용 상태 객체
  const [editorUi, setEditorUi] = useState({
    isSubmitting: false, // 저장 버튼 누른 뒤 처리 중인지
    isAnalyzing: false, // 저장소 분석 요청 처리 중인지 (analyze Edge Function 응답 대기)
    isGeneratingDraft: false, // 초안 생성 요청 처리 중인지 (draft Edge Function 응답 대기)
    selectedImageId: null, // 현재 선택된 이미지 id
  });

  // 분석/초안/제출 검증 이후 라벨 오른쪽에 표시할 필드별 피드백 상태
  const [formErrors, setFormErrors] = useState(createEmptyFormErrors);
  // 사용자가 마지막으로 실행한 검증 흐름. 값이 있으면 입력 변경마다 같은 기준으로 다시 검사한다.
  const [formValidationMode, setFormValidationMode] = useState("");

  // alert() 대신 쓰는 스낵바 알림 상태
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  // MUI Snackbar의 autoHideDuration만으로는 안 사라지는 경우가 있어, 직접 타이머로 닫는다.
  const snackbarTimeoutRef = useRef(null);

  // 스낵바를 띄우는 함수. severity: "success" | "error" | "warning" | "info"
  const notify = useCallback((message, severity = "info") => {
    if (snackbarTimeoutRef.current) clearTimeout(snackbarTimeoutRef.current);

    setSnackbar({ open: true, message, severity });

    snackbarTimeoutRef.current = setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 4000);
  }, []);

  // 스낵바 닫기 버튼 클릭 처리. 바깥 클릭으로는 안 닫히게 한다.
  const handleCloseSnackbar = useCallback((_, reason) => {
    if (reason === "clickaway") return;

    if (snackbarTimeoutRef.current) clearTimeout(snackbarTimeoutRef.current);

    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // confirm() 대신 쓰는 확인 다이얼로그 상태. 열려있는 동안 사용자의 선택을 Promise로 기다린다.
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: "" });
  const confirmResolverRef = useRef(null);

  // 확인/취소 버튼을 눌러 답할 때까지 기다리는 확인창을 띄운다. window.confirm과 같은 방식으로 Promise<boolean>을 반환한다.
  const requestConfirm = useCallback(message => {
    setConfirmDialog({ open: true, message });

    return new Promise(resolve => {
      confirmResolverRef.current = resolve;
    });
  }, []);

  // 확인/취소 결과를 requestConfirm을 호출한 쪽에 전달하고 다이얼로그를 닫는다.
  const handleConfirmDialogResult = useCallback(result => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
    confirmResolverRef.current?.(result);
    confirmResolverRef.current = null;
  }, []);

  // 임시저장/제출할 만한 내용이 있는지 여부. popstate 핸들러(클로저)에서 항상 최신값을 읽을 수 있도록 ref로도 들고 있는다.
  const hasUnsavedContent = hasPortfolioDraftContent({ formData, aiAnalysisResult, draftGuide });
  const hasUnsavedContentRef = useRef(hasUnsavedContent);
  hasUnsavedContentRef.current = hasUnsavedContent;

  // 작성 중인 내용이 있으면 새로고침/탭 닫기 시 브라우저 기본 확인창을 띄운다.
  useEffect(() => {
    const handleBeforeUnload = e => {
      if (!hasUnsavedContentRef.current) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // 작성 중인 내용이 있으면 브라우저 뒤로가기/앞으로가기도 막고 확인창을 띄운다.
  // BrowserRouter는 데이터 라우터 전용인 useBlocker를 못 써서 history API를 직접 다룬다.
  // 마운트 시 현재 URL과 동일한 더미 history entry를 하나 쌓아두고, popstate가 오면(=뒤로가기 시도) 실제로 나가기 전에 가로챈다.
  useEffect(() => {
    const currentUrl = window.location.href;

    window.history.pushState(null, "", currentUrl);

    const handlePopState = async () => {
      if (!hasUnsavedContentRef.current) {
        window.removeEventListener("popstate", handlePopState);
        window.history.go(-1);
        return;
      }

      const shouldLeave = await requestConfirm("작성 중인 내용이 저장되지 않을 수 있습니다.\n페이지를 벗어날까요?");

      if (shouldLeave) {
        window.removeEventListener("popstate", handlePopState);
        window.history.go(-1);
        return;
      }

      // 취소하면 더미 entry를 다시 쌓아서, 다음 뒤로가기 시도도 계속 가로챌 수 있게 한다.
      window.history.pushState(null, "", currentUrl);
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [requestConfirm]);

  // 경고 후 갤러리 페이지로 이동 (없는 pid일 때 사용). 알림을 잠깐 보여준 뒤 이동한다.
  const redirectAfterEditorAlert = useCallback(
    ({ message, path = "/gallery" }) => {
      notify(message, "error");
      setTimeout(() => navigate(path, { replace: true }), 1200);
    },
    [navigate, notify],
  );

  // 로그인 페이지로 이동
  const redirectToLogin = useCallback(() => {
    navigate("/login", {
      replace: true,
      state: {
        from: isEdit ? `/portfolios/${id}/edit` : "/portfolios/new",
      },
    });
  }, [navigate, isEdit, id]);

  // 에디터 페이지 진입 시 로그인한 사용자 인증 확인 후 분기 : 비로그인 상태면 로그인 페이지로 이동
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getAuthenticatedUser();

      if (!user) {
        redirectToLogin();
        return;
      }

      setIsAuthChecking(false);
    };

    checkAuth();
  }, [redirectToLogin]);

  // 수정 모드로 진입 시 : URL의 project_id가 실제 portfolios 테이블에 존재하는지 확인
  // 존재하지 않는 id를 직접 주소로 입력하면 안내 후 갤러리 페이지로 이동
  useEffect(() => {
    // 등록 페이지는 project_id가 없으므로 검사X
    if (!isEdit) return;

    const checkPortfolioExists = async () => {
      // 포트폴리오 테이블에서 파라미터 id 동일한 pid를 하나만 가져옴
      const { data, error } = await supabase
        .from("portfolios")
        .select(
          `
          project_id,
          author_id,
          title,
          summary,
          description,
          started_at,
          ended_at,
          deploy_url,
          repository_url,
          project_type,
          team_size,
          author_role,
          environment,
          is_public,
          portfolio_categories(category),
          portfolio_tech_stacks(tech_stack),
          portfolio_images(image_id, image_path, display_order, is_thumbnail, alt_text),
          portfolio_ai_created(
            project_summary,
            main_features,
            technical_features,
            project_structure,
            analyzed_role,
            participation_details,
            analysis_limitation,
            analysis_evidence,
            github_analyzed_at,
            draft_source_content,
            generated_content,
            ai_short_summary,
            draft_generated_at
          )
          `,
        )
        .eq("project_id", id)
        .maybeSingle();

      // Supabase 조회 자체가 실패하면 우선 에러 메시지를 보여주고 갤러리로 이동한다.
      if (error) {
        redirectAfterEditorAlert({
          message: error.message,
        });
        return;
      }

      // 조회 결과가 없으면 존재하지 않는 포트폴리오 id로 판단한다.
      if (!data) {
        redirectAfterEditorAlert({
          message: "존재하지 않는 포트폴리오입니다.",
        });
        return;
      }

      // 현재 로그인한 사용자를 다시 확인한다.
      // 인증 useEffect가 이미 있더라도, 권한 비교에는 실제 user.id가 필요하다.
      const user = await getAuthenticatedUser();

      if (!user) {
        redirectToLogin();
        return;
      }

      // 포트폴리오 작성자와 현재 로그인 사용자가 다르면 수정 권한이 없는 것으로 처리한다.
      if (data.author_id !== user.id) {
        redirectAfterEditorAlert({
          message: "수정 권한이 없는 포트폴리오입니다.",
        });
        return;
      }

      const aiCreated = data.portfolio_ai_created ?? {};

      setFormData(createEditorFormData(data));
      setAiAnalysisResult(createEditorAiAnalysisResult(aiCreated));

      setDraftGuide(prev => ({
        ...prev,
        ...createEditorDraftGuide(aiCreated),
      }));
    };

    checkPortfolioExists();
  }, [isEdit, id, redirectAfterEditorAlert, redirectToLogin]);

  // 첫 렌더링할때 로컬스토리지 로드해서 임시저장 데이터 있는지 확인
  useEffect(() => {
    const savedDrafts = loadLocalStorageItem(PORTFOLIO_EDITOR_DRAFT_KEY);
    const draftList = Array.isArray(savedDrafts)
      ? savedDrafts.slice(0, MAX_PORTFOLIO_DRAFT_COUNT)
      : savedDrafts?.id
        ? [savedDrafts]
        : [];

    setTemporaryDrafts(draftList);

    // GitHub 연동 페이지로 갔다가 돌아온 경우, 연동 성공/취소와 상관없이
    // 떠나기 전 저장해둔 임시저장을 확인창 없이 바로 복원한다.
    const pendingDraftId = loadLocalStorageItem(PORTFOLIO_EDITOR_PENDING_RESTORE_KEY);

    if (!pendingDraftId) return;

    deleteLocalStorageItem(PORTFOLIO_EDITOR_PENDING_RESTORE_KEY);

    const pendingDraft = draftList.find(draft => draft.id === pendingDraftId);

    if (!pendingDraft) return;

    setFormData(prev => ({
      ...prev,
      ...pendingDraft.formData,
      images: prev.images,
    }));

    if (pendingDraft.aiAnalysisResult) {
      setAiAnalysisResult(pendingDraft.aiAnalysisResult);
    }

    if (pendingDraft.draftGuide) {
      setDraftGuide(pendingDraft.draftGuide);
    }

    setAppliedDraftId(pendingDraft.id);
  }, []);

  // 사용자가 한 번 검증을 실행한 뒤에는 같은 검증 기준으로 입력 변경마다 라벨 피드백을 갱신
  useEffect(() => {
    if (!formValidationMode) return;

    const validatorByMode = {
      analysis: validateAiFormFieldErrors,
      draft: validateDraftGuideFieldErrors,
      submit: validateSubmitFieldErrors,
    };

    setFormErrors(validatorByMode[formValidationMode](formData));
  }, [formData, formValidationMode]);

  // 작성 완료/수정 완료 클릭 시 폼 검증, payload 생성, Supabase 등록 요청, 성공 후 이동을 처리
  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();

      // 제출 시에는 브라우저 required 팝업 대신 현재 formData 상태를 기준으로 직접 검증한다.
      const nextErrors = validateSubmitFieldErrors(formData);
      setFormValidationMode("submit");
      setFormErrors(nextErrors);

      // 첫 번째 오류 메시지만 스낵바로 보여주고 Supabase 요청은 보내지 않는다.
      if (hasFormErrors(nextErrors)) {
        notify(getFirstFormErrorMessage(nextErrors), "warning");
        return;
      }

      // 이미지를 건드리지 않고 다른 필드만 수정해서 제출하면 normalizeImageOrder가 한 번도 안 돌 수 있다.
      // 대표 이미지가 2개 이상(또는 0개)인 상태로 그대로 저장되면 DB 유니크 제약에 걸리므로 제출 직전에 한 번 더 강제한다.
      const normalizedFormData = { ...formData, images: normalizeImageOrder(formData.images) };

      // formData는 화면 관리용 구조라서, 백엔드 저장 전에 테이블 구조에 맞는 payload로 변환한다.
      const payload = createPortfolioPayload({
        formData: normalizedFormData,
        aiAnalysisResult,
        draftGuide,
      });

      try {
        // 등록 서비스는 인증 확인, portfolios 저장, 정규화 테이블 저장, 이미지 업로드를 순서대로 처리한다.
        const { projectId, needsLogin } = isEdit
          ? await updatePortfolio({ projectId: id, payload })
          : await createPortfolio({ payload });

        // 서비스에서 로그인 세션이 없다고 알려주면 로그인 페이지로 돌려보낸다.
        if (needsLogin) {
          redirectToLogin();
          return;
        }

        // 현재 작성 중이던 내용이 임시저장본에서 불러온 상태였다면, 저장이 끝난 그 임시저장본만 정리한다.
        if (appliedDraftId) {
          setTemporaryDrafts(prev => {
            const nextDrafts = prev.filter(draft => draft.id !== appliedDraftId);

            saveLocalStorageItem(PORTFOLIO_EDITOR_DRAFT_KEY, nextDrafts);

            return nextDrafts;
          });
          setAppliedDraftId(null);
        }

        // 등록이 끝나면 생성된 project_id 기준 상세 페이지로 이동한다. 알림을 잠깐 보여준 뒤 이동한다.
        notify(isEdit ? "포트폴리오가 수정되었습니다." : "포트폴리오가 등록되었습니다.", "success");
        setTimeout(() => navigate(`/portfolios/${projectId}`), 800);
      } catch (error) {
        // Supabase/RLS/Storage 오류
        notify(error.message, "error");
      }
    },
    [formData, aiAnalysisResult, draftGuide, isEdit, id, navigate, redirectToLogin, appliedDraftId, notify],
  );

  // GitHub 연동 없이 저장소 분석을 진행할 수 없으므로, 연동 여부를 먼저 확인하고 분기하는 함수
  // 연동 안 됐으면 현재 작성 내용을 임시저장해두고 연동 페이지로 보낸 뒤, 돌아오면 자동 복원되도록 표시한다.
  // 연동 상태에서만 개발용 GitHub AI 분석 결과를 현재 분석 결과 상태에 반영하고 분석 완료 시점을 기록한다.
  const handleCompleteAiAnalysis = useCallback(async () => {
    const nextErrors = validateAiFormFieldErrors(formData);
    setFormValidationMode("analysis");
    setFormErrors(nextErrors);

    if (hasFormErrors(nextErrors)) {
      notify(getFirstFormErrorMessage(nextErrors), "warning");
      return;
    }

    // 분석 실행 조건(최종본): ① 유효한 GitHub 저장소 URL ② GitHub 계정 연동 ③ 입력한 저장소 URL의 소유자(사용자명)가
    // 연동된 GitHub 계정의 사용자명과 일치. ①은 이미 validateAiFormFieldErrors + analyze 쪽 URL 파싱으로 걸러지고 있어서
    // 여기서는 ②③만 추가로 확인한다.
    let isGithubLinked = false;

    try {
      isGithubLinked = await getIsGithubLinked();
    } catch (error) {
      notify(error.message, "error");
      return;
    }

    if (!isGithubLinked) {
      const shouldLink = await requestConfirm(
        "GitHub 저장소 분석을 사용하려면 GitHub 계정 연동이 필요합니다.\n지금 작성 중인 내용은 임시저장되고, 돌아오면 자동으로 복원됩니다.\nGitHub 연동 페이지로 이동할까요?",
      );

      if (!shouldLink) return;

      // 현재 작성 중인 내용이 있으면 임시저장하고, 복귀 시 자동 복원할 대상으로 표시한다.
      if (hasPortfolioDraftContent({ formData, aiAnalysisResult, draftGuide })) {
        const pendingDraft = {
          id: crypto.randomUUID(),
          title: formData.title.trim() || UNTITLED_PORTFOLIO_DRAFT_TITLE,
          savedAt: new Date().toISOString(),
          formData: createDraftFormData(formData),
          aiAnalysisResult,
          draftGuide,
        };

        setTemporaryDrafts(prev => {
          const nextDrafts = [pendingDraft, ...prev].slice(0, MAX_PORTFOLIO_DRAFT_COUNT);

          saveLocalStorageItem(PORTFOLIO_EDITOR_DRAFT_KEY, nextDrafts);

          return nextDrafts;
        });

        saveLocalStorageItem(PORTFOLIO_EDITOR_PENDING_RESTORE_KEY, pendingDraft.id);
      }

      try {
        // window.location.href를 그대로 쓰면 이전 시도의 에러/토큰이 남은 쿼리·해시까지 같이 목적지로 넘어가서
        // 재시도 시 URL이 오염될 수 있어, 쿼리/해시를 뺀 깨끗한 경로만 redirectTo로 사용한다.
        await linkGithubIdentity({ redirectTo: `${window.location.origin}${window.location.pathname}` });
      } catch (error) {
        notify(error.message, "error");
      }

      return;
    }

    // 연동은 돼 있지만, 입력한 저장소가 본인 소유가 아니면(사용자명 불일치) 분석을 막는다.
    const repoUsername = extractGithubUsernameFromUrl(formData.repository_url);
    let linkedUsername = null;

    try {
      linkedUsername = await getLinkedGithubUsername();
    } catch (error) {
      notify(error.message, "error");
      return;
    }

    if (!repoUsername || !linkedUsername || repoUsername.toLowerCase() !== linkedUsername.toLowerCase()) {
      notify("입력한 GitHub 저장소 주소가 연동된 계정 소유가 아닙니다.", "warning");
      return;
    }

    // 버튼/분석 카드 영역만 로딩 상태로 표시하고, 나머지 폼은 계속 조작할 수 있게 둔다.
    setEditorUi(prev => ({ ...prev, isAnalyzing: true }));

    try {
      const { data, error } = await supabase.functions.invoke("analyze", {
        body: {
          repositoryUrl: formData.repository_url,
          // 커밋 수집을 이 사용자 작성 커밋만으로 좁히기 위해 연동된 GitHub 사용자명을 같이 보낸다.
          githubUsername: linkedUsername,
          // 수정 페이지는 project_id로 쿨타임을 구분한다(같은 저장소를 다른 포트폴리오에서 써도 서로 안 막히게).
          // 등록(신규) 페이지는 아직 project_id가 없어서 저장소 URL 기준을 그대로 쓴다.
          portfolioId: isEdit ? id : undefined,
          formData: {
            title: formData.title,
            description: formData.description,
            author_role: formData.author_role,
            project_type: formData.project_type,
            team_size: formData.team_size,
            environment: formData.environment,
            categories: formData.categories,
            tech_stacks: formData.tech_stacks,
          },
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAiAnalysisResult(prev => ({
        ...prev,
        ...data.aiAnalysisResult,
        analyzedAt: data.analyzedAt,
      }));
    } catch (error) {
      notify(await getEdgeFunctionErrorMessage(error), "error");
    } finally {
      setEditorUi(prev => ({ ...prev, isAnalyzing: false }));
    }
  }, [formData, notify, requestConfirm, aiAnalysisResult, draftGuide, isEdit, id]);

  // 초안 생성 버튼 클릭 시 draft Edge Function을 호출해 AI 추천 설명 초안/한 줄 요약을 받아오는 함수
  const handleGenerateDraftGuide = useCallback(async () => {
    // 초안 생성은 프로젝트 설명이 핵심 입력값이므로 draft 전용 검증 기준을 먼저 적용한다.
    const nextErrors = validateDraftGuideFieldErrors(formData);
    setFormValidationMode("draft");
    setFormErrors(nextErrors);

    if (hasFormErrors(nextErrors)) {
      notify(getFirstFormErrorMessage(nextErrors), "warning");
      return;
    }

    setEditorUi(prev => ({ ...prev, isGeneratingDraft: true }));

    try {
      const { data, error } = await supabase.functions.invoke("draft", {
        body: {
          formData: {
            title: formData.title,
            description: formData.description,
            author_role: formData.author_role,
            project_type: formData.project_type,
            categories: formData.categories,
            tech_stacks: formData.tech_stacks,
          },
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setDraftGuide(prev => ({
        ...prev,
        originalDescription: formData.description,
        aiDraftDescription: data.draftGuideResult.draftDescription,
        aiShortSummary: data.draftGuideResult.shortSummary,
        generatedAt: data.generatedAt,
        appliedDescriptionSource: "current",
        isSummaryApplied: false,
      }));
    } catch (error) {
      notify(await getEdgeFunctionErrorMessage(error), "error");
    } finally {
      setEditorUi(prev => ({ ...prev, isGeneratingDraft: false }));
    }
  }, [formData, notify]);

  // 초안 생성 당시의 기존 프로젝트 설명을 다시 프로젝트 설명 입력값에 적용하는 함수
  const handleApplyCurrentDescription = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      description: draftGuide.originalDescription,
    }));

    setDraftGuide(prev => ({
      ...prev,
      appliedDescriptionSource: "current",
    }));
  }, [draftGuide.originalDescription]);

  // AI 추천 설명 초안을 프로젝트 설명 입력값에 적용하는 함수
  const handleApplyDraftDescription = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      description: draftGuide.aiDraftDescription,
    }));

    setDraftGuide(prev => ({
      ...prev,
      appliedDescriptionSource: "ai",
    }));
  }, [draftGuide.aiDraftDescription]);

  // AI 추천 한 줄 요약 미리보기 값을 실제 formData.summary에 적용하는 함수
  const handleApplyDraftSummary = useCallback(nextSummary => {
    setFormData(prev => ({
      ...prev,
      summary: nextSummary,
    }));

    setDraftGuide(prev => ({
      ...prev,
      aiShortSummary: nextSummary,
      isSummaryApplied: true,
    }));
  }, []);

  // 현재 에디터 상태를 최대 5개 임시저장 목록에 추가하고 localStorage에 반영
  const handleSaveDraft = useCallback(() => {
    if (!hasPortfolioDraftContent({ formData, aiAnalysisResult, draftGuide })) {
      notify("임시저장할 내용이 없습니다.", "warning");
      return;
    }

    const nextDraft = {
      id: crypto.randomUUID(),
      title: formData.title.trim() || UNTITLED_PORTFOLIO_DRAFT_TITLE,
      savedAt: new Date().toISOString(),
      formData: createDraftFormData(formData),
      aiAnalysisResult,
      draftGuide,
      locked: false,
    };

    setTemporaryDrafts(prev => {
      // 최대 개수를 넘기면 잠기지 않은 저장본부터(오래된 순서로) 밀어내고, 잠긴 저장본은 그대로 둔다.
      const nextDrafts = capPortfolioDrafts([nextDraft, ...prev]);

      saveLocalStorageItem(PORTFOLIO_EDITOR_DRAFT_KEY, nextDrafts);

      return nextDrafts;
    });
    notify("임시저장되었습니다.", "success");
    setAppliedDraftId(nextDraft.id);
  }, [formData, aiAnalysisResult, draftGuide, notify]);

  // 임시저장본 잠금/해제를 토글한다. 잠금은 최대 개수까지만 허용한다.
  const handleToggleDraftLock = useCallback(
    draftId => {
      setTemporaryDrafts(prev => {
        const target = prev.find(draft => draft.id === draftId);

        if (!target) return prev;

        const lockedCount = prev.filter(draft => draft.locked).length;

        if (!target.locked && lockedCount >= MAX_LOCKED_DRAFT_COUNT) {
          notify(`임시저장 잠금은 최대 ${MAX_LOCKED_DRAFT_COUNT}개까지만 가능합니다.`, "warning");
          return prev;
        }

        const nextDrafts = prev.map(draft => (draft.id === draftId ? { ...draft, locked: !draft.locked } : draft));

        saveLocalStorageItem(PORTFOLIO_EDITOR_DRAFT_KEY, nextDrafts);

        return nextDrafts;
      });
    },
    [notify],
  );

  // 선택한 임시저장 데이터를 찾아 이미지 제외 폼 데이터와 AI 보조 데이터를 현재 상태에 복원하는 함수
  const handleApplyDraft = useCallback(
    async draftId => {
      // 임시저장 목록에서 사용자가 선택한 저장본을 찾는다.
      const selectedDraft = temporaryDrafts.find(draft => draft.id === draftId);

      if (!selectedDraft) return false;

      // 저장본을 불러오면 현재 작성 중인 텍스트가 바뀌므로, 적용 전에 한 번 더 확인한다.
      const shouldApply = await requestConfirm(
        "현재 작성 중인 내용이 선택한 임시저장 내용으로 바뀝니다.\n기존에 작성 중이던 내용은 사라질 수 있습니다.\n이 저장본을 불러올까요?",
      );

      if (!shouldApply) return false;

      // localStorage에는 File/blob 미리보기 URL을 안정적으로 저장하지 않으므로 이미지는 현재 첨부 상태를 유지한다.
      setFormData(prev => ({
        ...prev,
        ...selectedDraft.formData,
        images: prev.images,
      }));

      // 저장본에 AI 분석 결과가 있으면 분석 결과 섹션도 같이 복원한다.
      if (selectedDraft.aiAnalysisResult) {
        setAiAnalysisResult(selectedDraft.aiAnalysisResult);
      }

      // 저장본에 초안 가이드 상태가 있으면 현재 내용/AI 초안/요약 적용 상태도 같이 복원한다.
      if (selectedDraft.draftGuide) {
        setDraftGuide(selectedDraft.draftGuide);
      }

      // 제출 성공 시 이 저장본만 자동 삭제할 수 있도록 현재 적용된 저장본 id를 기록한다.
      setAppliedDraftId(draftId);

      return true;
    },
    [temporaryDrafts, requestConfirm],
  );

  // 선택한 카테고리가 비어 있거나 최대 개수/중복 조건에 걸리면 무시하고, 새 카테고리만 추가
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

  // 선택한 임시저장 데이터를 목록과 localStorage에서 삭제하는 함수
  const handleDeleteDraft = useCallback(
    draftId => {
      setTemporaryDrafts(prev => {
        const nextDrafts = prev.filter(draft => draft.id !== draftId);

        saveLocalStorageItem(PORTFOLIO_EDITOR_DRAFT_KEY, nextDrafts);

        return nextDrafts;
      });

      if (appliedDraftId === draftId) {
        setAppliedDraftId(null);
      }
    },
    [appliedDraftId],
  );

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

    // Autocomplete freeSolo는 문자열, 직접 입력 옵션 객체, 기존 옵션 객체가 모두 들어올 수 있다.
    // 기술스택이 문자열이면 : 매개변수로 받은 기술스택의 좌우 공백 제거, 검색 가능하도록 소문자로 변경, 문자열 내의 각 공백은 -으로 변경해 value로, 좌우 공백만 제거한 텍스트는 label로 저장
    // 텍스트가 문자열이 아니면 : 받은 값 그대로 저장
    const nextTechStack =
      typeof techStack === "string"
        ? {
            value: techStack.trim().toLowerCase().replace(/\s+/g, "-"),
            label: techStack.trim(),
          }
        : techStack.inputValue
          ? {
              value: techStack.inputValue.trim().toLowerCase().replace(/\s+/g, "-"),
              label: techStack.inputValue.trim(),
            }
          : techStack;

    // 위에서 저장한 값의 라벨이 없으면 그대로 리턴
    if (!nextTechStack.label) return;

    // 이전 기술스택의 value나 label 중 위에서 저장한 value나 label이 같다면(이미 존재한다면) true, 아니면 false 반환
    setFormData(prev => {
      // 기술 스택은 최대 8개까지만 저장한다.
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

  // 기술 스택 칩의 삭제 버튼을 클릭하면 기술 스택 배열에서 해당 항목을 삭제하는 함수
  const handleDeleteTechStack = useCallback(techStackValue => {
    setFormData(prev => ({
      ...prev,
      // 선택한 기술 스택 값과 다른 항목만 남겨서 필터링
      tech_stacks: prev.tech_stacks.filter(techStack => techStack.value !== techStackValue),
    }));
  }, []);

  // name 속성을 기준으로 일반 input/select 변경값을 formData의 같은 key에 반영
  const handleFormChange = useCallback(e => {
    // 이벤트 타겟의 name, value, type, checked 상태를 구조분해할당
    const { name, value, type, checked } = e.target;

    const nextValue = type === "checkbox" ? checked : value;

    // 이전걸 풀어헤친다음 그 중 formData에 해당하는 것만 값 변경
    setFormData(prev => ({
      ...prev,
      [name]: nextValue,
    }));
  }, []);

  // 공개/비공개 토글 스위치 변경값을 공통 formData 변경 함수로 전달
  const handlePortfolioVisibilityChange = useCallback(
    e => {
      handleFormChange(e);
    },
    [handleFormChange],
  );

  // 이미지 추가 : 파일 선택/드롭으로 들어온 파일 배열을 받아서 검증하고 formData.images에 추가하는 함수
  const handleAddImages = useCallback(
    files => {
      setFormData(prev => {
        // FileList는 배열 메서드를 바로 쓰기 어려우므로 Array.from으로 실제 배열로 바꾼다.
        // (사용자에게) 선택된 파일 = 이미지 섹션에서 받은 파일 배열을 실제 배열로 변경해 저장
        const selectedFiles = Array.from(files);
        // 받을 수 있는 남은 이미지 = 최대 이미지 수 - 현재 이미지 개수
        const remainingImageCount = MAX_IMAGE_COUNT - prev.images.length;

        // 받을 수 있는 남은 이미지가 0이하면 리턴하고 경고 (더이상 이미지 첨부할 수 없게 함)
        if (remainingImageCount <= 0) {
          notify(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지 업로드할 수 있습니다.`, "warning");
          return prev;
        }

        // 남은 이미지 개수는 있지만, 사용자가 남은 이미지 개수보다 많은 파일을 선택했을 때 리턴하고 경고
        if (selectedFiles.length > remainingImageCount) {
          notify(
            `이미지는 최대 ${MAX_IMAGE_COUNT}장까지 업로드할 수 있습니다. ${remainingImageCount}장만 더 추가할 수 있습니다.`,
            "warning",
          );
          return prev;
        }

        // png/jpeg/webp 타입이 아닌 파일들을 분류
        const invalidTypeFiles = selectedFiles.filter(file => !ALLOWED_IMAGE_TYPES.includes(file.type));

        // 타입이 맞지 않는 파일이 있다면 리턴하고 경고
        if (invalidTypeFiles.length > 0) {
          notify("PNG, JPG, WebP 이미지만 업로드할 수 있습니다.", "warning");
          return prev;
        }

        // 최대 크기 이상의 파일들을 분류
        const oversizedFiles = selectedFiles.filter(file => file.size > MAX_IMAGE_SIZE);

        // 최대 크기 이상인 파일이 있다면 리턴하고 경고
        if (oversizedFiles.length > 0) {
          notify("10MB 이하 이미지만 업로드할 수 있습니다.", "warning");
          return prev;
        }

        // 사용자가 선택한 파일이 모두 검증을 통과한 경우에만 이미지 객체로 변환한다.
        // 조건에 맞는 이미지들을 객체로 생성하는 함수
        const nextImages = selectedFiles.map((file, index) =>
          createPortfolioImageItem({
            file,
            order: prev.images.length + index + 1,
            isThumbnail: prev.images.length === 0 && index === 0,
          }),
        );

        // 기존거에 이미지 순서를 재정렬한 이미지 넣어서 반환
        return {
          ...prev,
          images: normalizeImageOrder([...prev.images, ...nextImages]),
        };
      });
    },
    [notify],
  );

  // 선택한 이미지를 삭제하는 함수
  const handleDeleteImage = useCallback(imageId => {
    // formData를 변경 :
    setFormData(prev => {
      // 삭제 전에 대상 객체를 찾아 previewUrl을 정리해야 한다.
      // 기존에서 삭제 요청받은 id와 동일한 대상을 삭제대상으로 지정
      const deleteTarget = prev.images.find(image => image.id === imageId);

      // 삭제대상이 아니면 기존거 리턴
      if (!deleteTarget) return prev;

      // 이미지 객체가 상태에서 사라져도 브라우저가 만든 blob URL은 자동 해제되지 않으므로 직접 정리한다.
      // 브라우저가 임시로 잡아둔 이미지 미리보기 URL을 해제 (브라우저 메모리 정리용)
      URL.revokeObjectURL(deleteTarget.previewUrl);

      // 기존 이미지에서 삭제대상이 아닌 이미지만 필터링해 다시 저장
      const nextImages = prev.images.filter(image => image.id !== imageId);

      // 남은 이미지를 순서 재정렬해 반환
      return {
        ...prev,
        images: normalizeImageOrder(nextImages),
      };
    });
  }, []);

  // 선택한 이미지를 대표 이미지로 올리고, 나머지 이미지 순서를 뒤로 재정렬
  const handleSetThumbnailImage = useCallback(imageId => {
    setFormData(prev => {
      // 대표로 지정할 이미지를 먼저 찾고, 없으면 상태를 바꾸지 않는다.
      // 기존거에서 매개변수로 받은 id와 일치하는 이미지를 찾아 썸네일 이미지로 저장
      const thumbnailImage = prev.images.find(image => image.id === imageId);

      // 썸네일 이미지가 아닌 것들은 기존거 리턴
      if (!thumbnailImage) return prev;

      // 썸네일 이미지가 아닌 것들을 필터링해 저장
      const otherImages = prev.images.filter(image => image.id !== imageId);

      // 대표 이미지를 배열 맨 앞으로 이동시키면 normalizeImageOrder가 첫 번째 이미지를 대표 이미지로 확정한다.
      // 썸네일 이미지를 가장 처음에 놓고, 다른 이미지를 풀어헤쳐 하나의 배열로 만든 뒤 기존거에 이미지 순서를 재정렬한 이미지 넣어서 반환
      return {
        ...prev,
        images: normalizeImageOrder([thumbnailImage, ...otherImages]),
      };
    });
  }, []);

  // dnd-kit 드래그 결과를 받아 대표 이미지를 제외한 보조 이미지들의 순서를 변경
  // 라이브러리 dnd-kit 사용 : https://docs.dndkit.com/presets/sortable
  const handleMoveImage = useCallback((activeImageId, overImageId) => {
    setFormData(prev => {
      // 드롭 대상이 없거나 같은 이미지 위에 놓은 경우에는 정렬할 필요가 없다.
      if (!overImageId || activeImageId === overImageId) return prev;

      // 대표 이미지가 드래그 대상에 섞이면 대표 이미지 고정 규칙이 깨지므로 보조 이미지만 분리한다.
      // 대표 이미지는 항상 첫 번째 위치에 고정하고, 나머지 이미지만 드래그 정렬 대상으로 사용
      const sortedImages = [...prev.images].sort((a, b) => a.order - b.order);
      const primaryImage = sortedImages.find(image => image.isThumbnail) ?? sortedImages[0];
      const secondaryImages = sortedImages.filter(image => image.id !== primaryImage?.id);

      // dnd-kit이 넘겨준 active/over id를 보조 이미지 배열의 index로 변환
      const activeIndex = secondaryImages.findIndex(image => image.id === activeImageId);
      const overIndex = secondaryImages.findIndex(image => image.id === overImageId);

      if (activeIndex === -1 || overIndex === -1) return prev;

      // 실제 배열 이동은 active 항목을 빼서 over 위치에 다시 끼워 넣는 방식이다.
      const nextSecondaryImages = [...secondaryImages];
      const [movedImage] = nextSecondaryImages.splice(activeIndex, 1);
      nextSecondaryImages.splice(overIndex, 0, movedImage);

      // 대표 이미지와 정렬된 보조 이미지를 합친 뒤 order/isThumbnail 값을 다시 정규화
      return {
        ...prev,
        images: normalizeImageOrder([primaryImage, ...nextSecondaryImages]),
      };
    });
  }, []);

  if (isAuthChecking) {
    return null;
  }

  return (
    <>
      {/* 메타데이터 */}
      <SeoMeta
        title={`${isEdit ? "포트폴리오 수정" : "새 포트폴리오 작성"} | ${SITE_NAME}`}
        description={isEdit ? "포트폴리오 내용을 수정합니다." : "새 포트폴리오를 작성합니다."}
        path={isEdit ? `/portfolios/${id}/edit` : "/portfolios/new"}
        noindex
      />

      <Container
        className={styles.page}
        component="main"
        maxWidth={false}
        disableGutters
        sx={{
          maxWidth: "1272px",
          px: { xs: 2, tablet: 3, desktop: 0 },
        }}
      >
        <EditorTitleSection
          isEdit={isEdit}
          temporaryDrafts={temporaryDrafts}
          onApplyDraft={handleApplyDraft}
          onDeleteDraft={handleDeleteDraft}
          onToggleDraftLock={handleToggleDraftLock}
          maxLockedDraftCount={MAX_LOCKED_DRAFT_COUNT}
          onRequestConfirm={requestConfirm}
        />

        <Box component="form" onSubmit={handleSubmit} noValidate>
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
                  title={formData.title}
                  startedAt={formData.started_at}
                  endedAt={formData.ended_at}
                  deployUrl={formData.deploy_url}
                  authorRole={formData.author_role}
                  repositoryUrl={formData.repository_url}
                  description={formData.description}
                  formErrors={formErrors}
                  handleFormChange={handleFormChange}
                />
                <GithubAiAnalysisSection
                  sectionCardSx={sectionCardSx}
                  aiAnalysisResult={aiAnalysisResult}
                  isAnalyzing={editorUi.isAnalyzing}
                  onCompleteAiAnalysis={handleCompleteAiAnalysis}
                />
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
                  formErrors={formErrors}
                />
              </Stack>
            </Box>

            <DraftGuideSection
              sectionCardSx={sectionCardSx}
              formInputSx={formInputSx}
              draftGuide={draftGuide}
              summary={draftGuide.aiShortSummary}
              isGenerating={editorUi.isGeneratingDraft}
              onGenerateDraftGuide={handleGenerateDraftGuide}
              onApplyCurrentDescription={handleApplyCurrentDescription}
              onApplyDraftDescription={handleApplyDraftDescription}
              onApplyDraftSummary={handleApplyDraftSummary}
            />
            <EditorActionBar
              isEdit={isEdit}
              isPortfolioPublic={formData.is_public}
              onVisibilityChange={handlePortfolioVisibilityChange}
              onSaveDraft={handleSaveDraft}
              handleFormChange={handleFormChange}
            />
          </Stack>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={confirmDialog.open}
        onClose={() => handleConfirmDialogResult(false)}
        aria-labelledby="portfolio-editor-confirm-dialog-title"
      >
        <DialogTitle id="portfolio-editor-confirm-dialog-title">확인</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ whiteSpace: "pre-line" }}>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={() => handleConfirmDialogResult(false)}>
            취소
          </Button>
          <Button type="button" variant="contained" autoFocus onClick={() => handleConfirmDialogResult(true)}>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
