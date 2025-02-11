import { storePost } from "@/lib/posts";

export default function NewPostPage() {
  async function createPost(formData) {
    // server action
    // 1. 비동기 함수 처리 (async) & 자동으로 객체 형태의 formData를 매개변수로 받음
    // 2. 이 함수는 form 요소의 action prop 값으로 등록 ...리액트 프로젝트에서만 함수를 매개변수로 받을 수 있음(바닐라 JS에서 action prop = 폼제출을 처리하는 URL일 뿐!)
    // 3. server action을 담당하는 함수는 내부에 'use server' 작성 필수
    "use server";
    const title = formData.get("title");
    const image = formData.get("image");
    const content = formData.get("content");

    storePost({
      imageUrl: "",
      title,
      content,
      userId: 1,
    });
  }

  return (
    <>
      <h1>Create a new post</h1>
      <form action={createPost}>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
        </p>
        <p className="form-control">
          <label htmlFor="image">Image URL</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
          />
        </p>
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows="5" />
        </p>
        <p className="form-actions">
          <button type="reset">Reset</button>
          <button>Create Post</button>
        </p>
      </form>
    </>
  );
}
