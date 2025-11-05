export async function generateMetadata({ params }) {
  const param = await params;
  const slug = param?.slug || "Collection";
  const name = String(slug).replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${name} | Collection`,
    description: `Explore the ${name} collection at Zammel. Premium comfort and style.`,
  };
}

export default function CollectionSlugLayout({ children }) {
  return children;
}


