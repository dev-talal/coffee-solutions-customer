import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductDetails } from "@/services/apiService";
import ProductDetailContent from "@/app/components/ProductDetailContent";
import SuggestedProducts from "@/app/components/SuggestedProducts";
import { cookies } from "next/headers";

async function getProduct(slug: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(
      process.env.NEXT_PUBLIC_COOKIE_TOKEN_NAME as string
    )?.value;

    return await getProductDetails(slug, token);
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0].image }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.images[0].image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);
  if (!product) return notFound();

  return (
    <div className="container mx-auto p-4 space-y-8 mt-6">
      <div className="mx-auto">
        <ProductDetailContent product={product} />
      </div>
      <div className="space-y-8 py-5">
        <SuggestedProducts productId={product.id} />
      </div>
    </div>
  );
}
