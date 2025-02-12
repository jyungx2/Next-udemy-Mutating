import Postform from "@/components/post-form";
import { createPost } from "@/actions/posts";

export default function NewPostPage() {
  return <Postform action={createPost} />;
}
