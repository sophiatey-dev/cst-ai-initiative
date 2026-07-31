import { SitePage } from "../../site-page";

export default async function ChinesePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SitePage page={slug} initialLang="zh" />;
}
