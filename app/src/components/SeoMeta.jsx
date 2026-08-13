export const SITE_URL = import.meta.env.VITE_SITE_URL || "https://your-domain.com";
export const SITE_NAME = "Portfolio+";

export default function SeoMeta({
  title = SITE_NAME,
  description = "AI의 보조를 받아 내 포트폴리오를 공유하고, 다른 사람들의 포트폴리오를 둘러보는 사이트입니다.",
  path = "/",
  noindex = false,
}) {
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
