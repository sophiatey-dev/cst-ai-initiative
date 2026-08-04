import { SitePage } from "../site-page";

const pages = ["forum", "workshops", "ai-prompt-thinking", "membership", "community", "calendar", "pulse", "speakers", "enterprise", "about"];

export function generateStaticParams() {
  return pages.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SitePage page={slug} />;
}

