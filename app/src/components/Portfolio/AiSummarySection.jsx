import { useState } from "react";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { AiIcon, DropDownIcon, DropUpIcon } from "../../lib/icons";
import { alpha, useTheme } from "@mui/material/styles";
import AiSummaryItem from "./AiSummaryItem";

export default function AiSummarySection({}) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      component={"section"}
      id="ai-analysis"
      sx={{
        px: 3,
        py: 3,
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "primary.main",
        borderRadius: "12px",
        bgcolor: alpha(theme.palette.primary.light, 0.1),
      }}
    >
      <Box
        component={"div"}
        onClick={() => setIsOpen(prev => !prev)}
        sx={{
          pb: 1,
          borderStyle: "solid",
          borderWidth: "0px 0px 1px",
          borderColor: "primary.dark",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Text component={"h2"} variant="h4" sx={{ fontWeight: "700" }} color="primary">
            <AiIcon sx={{ mr: 1 }} />
            AI 분석결과
          </Text>
          <DropDownIcon color="primary" sx={{ rotate: isOpen ? "180deg" : "0deg" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Text component={"p"} variant="caption">
            &#8251; AI로 생성된 내용입니다.
          </Text>
          <Text component={"p"} variant="caption">
            분석 시점: <time dateTime="2026-07-23 02:13">2026-07-23 02:13</time>
          </Text>
        </Box>
      </Box>
      <Box component={"dl"} sx={{ maxHeight: `${isOpen ? "8192px" : "0px"}`, overflow: "hidden" }}>
        <Box component={"dl"} sx={{ pt: 1 }}>
          <AiSummaryItem label="프로젝트 요약">
            프로젝트 등록과 작품 탐색, 제작자 프로필 확인, 채용·협업 문의 과정을 하나의 흐름으로 연결한 포트폴리오
            갤러리 플랫폼입니다.
          </AiSummaryItem>
          <AiSummaryItem label="주요 기능">
            포트폴리오 등록·수정·삭제, 이미지 업로드, 카테고리·기술 스택 기반 탐색, 좋아요·북마크, 제작자 프로필, GitHub
            저장소 분석, 프로젝트 설명 초안 생성 기능을 제공합니다.
          </AiSummaryItem>
          <AiSummaryItem label="기술적 특징">
            Next.js를 기반으로 페이지와 공통 UI를 컴포넌트화하고, Supabase를 이용해 사용자 인증과 프로젝트 데이터 및
            이미지 파일을 관리합니다. 외부 AI API의 JSON 응답을 구조화된 데이터로 변환해 등록 폼과 분석 결과 영역에
            반영합니다.
          </AiSummaryItem>
          <AiSummaryItem label="프로젝트 구조 및 복잡도">
            인증, 콘텐츠 CRUD, 이미지 저장소, 검색·필터링, 외부 API 통신을 함께 처리하는 다중 기능 웹
            애플리케이션입니다. 비동기 요청과 오류 상태, 사용자별 데이터 접근 권한을 함께 고려해야 하는 구조가
            확인됩니다.
          </AiSummaryItem>
          <AiSummaryItem label="담당 역할">
            서비스의 핵심 사용자 흐름과 페이지별 요구사항을 정의하고, 등록·수정 페이지를 포함한 스토리보드와 공통 UI
            구조를 설계했습니다. 프론트엔드 구현에서는 담당 범위에 따라 화면 및 기능 개발에 참여했습니다.
          </AiSummaryItem>
          <AiSummaryItem label="참여 내역">
            기획 문서와 화면 설계 자료를 기준으로 정보 구조, AI 분석 결과의 표시 정책, 입력 항목 및 예외 상태를 구체화한
            참여 내역이 확인됩니다. 정확한 코드 기여 범위는 커밋 기록과 변경 파일을 추가로 확인해야 합니다.
          </AiSummaryItem>
        </Box>
        {/*
        <Box>
          <Text>분석 근거</Text>
        </Box>
        */}
      </Box>
    </Box>
  );
}
