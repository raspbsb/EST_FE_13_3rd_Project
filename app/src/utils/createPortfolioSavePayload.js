// 역할: 화면용 formData를 Supabase 저장용 payload로 변환

const emptyToNull = value => (value === "" ? null : value);

export function createPortfolioSavePayload({ formData, aiAnalysisResult, draftGuide, authorId = null }) {
  const portfolio = {
    title: formData.title,
    summary: emptyToNull(formData.summary),
    description: formData.description,
    started_at: emptyToNull(formData.started_at),
    ended_at: emptyToNull(formData.ended_at),
    deploy_url: emptyToNull(formData.deploy_url),
    repository_url: emptyToNull(formData.repository_url),
    project_type: emptyToNull(formData.project_type),
    team_size: emptyToNull(formData.team_size),
    author_role: emptyToNull(formData.author_role),
    environment: emptyToNull(formData.environment),
    is_public: formData.is_public,
  };

  if (authorId) {
    portfolio.author_id = authorId;
  }

  return {
    portfolio,

    categories: formData.categories.map(category => ({
      category_id: category.value,
      category_name: category.label,
    })),

    techStacks: formData.tech_stacks.map(techStack => ({
      tech_stack_id: techStack.value,
      tech_stack_name: techStack.label,
    })),

    images: formData.images
      .filter(image => image.file || image.previewUrl)
      .map((image, index) => ({
        file: image.file ?? null,
        name: image.name,
        size: image.size,
        type: image.type,
        preview_url: image.previewUrl,
        display_order: index + 1,
        is_thumbnail: Boolean(image.isThumbnail),
      })),

    aiCreated: {
      original_description: emptyToNull(draftGuide.originalDescription),
      ai_draft_description: emptyToNull(draftGuide.aiDraftDescription),
      ai_short_summary: emptyToNull(draftGuide.aiShortSummary),
      project_summary: emptyToNull(aiAnalysisResult.projectSummary),
      main_features: emptyToNull(aiAnalysisResult.mainFeatures),
      technical_features: emptyToNull(aiAnalysisResult.technicalFeatures),
      project_structure: emptyToNull(aiAnalysisResult.projectStructure),
      analyzed_role: emptyToNull(aiAnalysisResult.analyzedRole),
      participation_details: emptyToNull(aiAnalysisResult.participationDetails),
      analysis_limitation: emptyToNull(aiAnalysisResult.analysisLimitation),
      analysis_evidence: aiAnalysisResult.analysisEvidence,
    },
  };
}
