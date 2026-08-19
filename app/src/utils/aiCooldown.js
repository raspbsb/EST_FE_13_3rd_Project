// GitHub 저장소 분석 / 초안 생성 버튼에 공통으로 쓰는 쿨타임 유틸 모듈

// 분석/초안 생성 완료 후 재실행까지 기다려야 하는 시간의 기본값(fallback).
// 실제 쿨타임 길이는 analyze/draft 응답의 cooldownMs로 서버가 내려주고, 화면은 그 값을 우선 사용한다.
// 이 상수는 DB에서 불러온 기존 분석/초안 결과처럼 아직 서버 cooldownMs를 받은 적 없는 경우에만 fallback으로 쓰인다.
export const ANALYZE_COOLDOWN_MS = 30 * 60 * 1000;
export const DRAFT_COOLDOWN_MS = 10 * 60 * 1000;

// 마지막 완료 시각(서버가 응답에 담아 보낸 ISO 문자열) 기준으로 쿨타임이 얼마나 남았는지 계산한다.
// 클라이언트가 시스템 시계를 바꿔도 "언제 완료됐는지" 자체는 서버가 정한 값이라 기준점은 바뀌지 않는다.
export const getAiCooldownRemainingMs = (lastCompletedAt, cooldownMs) => {
  if (!lastCompletedAt) return 0;

  const completedTime = new Date(lastCompletedAt).getTime();

  if (Number.isNaN(completedTime)) return 0;

  const remaining = cooldownMs - (Date.now() - completedTime);

  return remaining > 0 ? remaining : 0;
};

// 쿨타임 남은 시간(ms)을 "n분 m초" / "m초" 형식 문자열로 변환한다.
export const formatCooldownRemaining = remainingMs => {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;
};

// 분석/초안 생성 완료 시각(Date 또는 ISO 문자열)을 화면 표시용 "YYYY-MM-DD HH:mm" 형식으로 변환한다.
export const formatAiTimestamp = value => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const pad = num => String(num).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
};
