import { storePost } from "@/lib/posts";

export default function NewPostPage() {
  async function createPost(formData) {
    // server action
    // 1. 비동기 함수 처리 (async) & 자동으로 객체 형태의 formData를 매개변수로 받음
    // 2. 이 함수는 form 요소의 action prop 값으로 등록 ...리액트 프로젝트에서만 함수를 매개변수로 받을 수 있음(바닐라 JS에서 action prop = 폼제출을 처리하는 URL일 뿐!)
    // 3. server action을 담당하는 함수는 내부에 'use server' 작성 필수 ... React & Next.js에게 이 함수를 등록한 form은 client form action이 아닌, server action를 수행한다고 말하는 역할의 코드

    // console.log(title, image, content) // 실제로 form을 작성 후 제출버튼을 누르면, 컨솔창이 아닌 터미널에서 코드 결과가 나타나는 것을 볼 수 있음 -> 서버에서만 실행되는 서버액션이라는 것을 증명.
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
