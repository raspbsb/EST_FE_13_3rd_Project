/**
 * 테이블에 저장된 상대 경로를 절대 경로로 바꿔주는 함수
 *
 * @param {string} bucketName Supabase Storage Bucket의 이름
 * @param {string} relativePath 테이블의 _path 칼럼에 저장된 상대 경로
 */
export async function toUrl(bucketName, relativePath) {
  if (typeof bucketName !== "string" || typeof relativePath !== "string") return ".";

  const result = await supabase.storage.from(bucketName).getPublicUrl(relativePath);
  return result.data.publicUrl;
}
