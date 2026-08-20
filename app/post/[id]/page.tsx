import type { Metadata, ResolvingMetadata } from "next";
import DeepLinkFallback, {
  deepLinkMetadata,
} from "@/app/components/DeepLinkFallback";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const images = (await parent).openGraph?.images ?? [];
  return deepLinkMetadata("post", id, images);
}

export default function PostSharePage() {
  return <DeepLinkFallback kind="post" />;
}
