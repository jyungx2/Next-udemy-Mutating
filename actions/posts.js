"use server";

import { uploadImage } from "@/lib/cloudinary";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 174. foodies 앱과 다르게 Page에 서버액션을 남기고, useFormState 코드와 JSX 리턴코드를 components폴더로 분리함
// 💥 강의 175에서 서버액션 또한 actions/posts.js로 분리!
// -> 두 가지 방식 모두 server action(서버 컴포넌트)과 클라이언트 컴포넌트를 나누기 위함!
// 이렇게 서버액션을 form태그의 action속성으로 바로 연결하지 않고 useFormState훅을 이용해 리턴받은 formAction값으로 form태그의 action 속성값으로 등록하면, 서버액션의 매개변수가 하나 더 추가되어 serverAction(prevState, formData)로 코드 변경 필요
export async function createPost(prevState, formData) {
  // ✅ server action
  // 1. 비동기 함수 처리 (async) & 자동으로 객체 형태의 formData를 매개변수로 받음
  // 2. 이 함수는 form 요소의 action prop 값으로 등록 ...리액트 프로젝트에서만 함수를 매개변수로 받을 수 있음(바닐라 JS에서 action prop = 폼제출을 처리하는 URL일 뿐!)
  // 3. server action을 담당하는 함수는 내부에 'use server' 작성 필수 ... React & Next.js에게 이 함수를 등록한 form은 client form action이 아닌, server action를 수행한다고 말하는 역할의 코드

  // console.log(title, image, content) // ✅ 실제로 form을 작성 후 제출버튼을 누르면, 컨솔창이 아닌 터미널에서 코드 결과가 나타나는 것을 볼 수 있음 -> 서버에서만 실행되는 서버액션이라는 것을 증명.
  ("use server");
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");

  // ✅ server-side validation
  let errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (!content || content.trim().length === 0) {
    errors.push("Content is required");
  }

  // !image만 써주면 이미지 등록 안해도 오류메시지 출력 안됨 .. image는 항상 오브젝트이기 때문
  if (!image || image.size === 0) {
    errors.push("Image is required");
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl;
  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error(
      "Image upload failed, post was not created. Please try again later."
    );
  }

  // ✅ lib/posts.js 파일에 storePost 함수 정의돼있음.
  await storePost({
    imageUrl: imageUrl, // 아직 이미지 URL을 가져오지 못하기 때문에 빈 스트링으로 등록
    title,
    content,
    userId: 1, // 로그인 메커니즘이 구현되지 못한 상태.. 일단 무조건 1으로 설정
    // ✅ 똑같이 Form을 작성해 제출하고 나서, Feed 페이지로 가보면 방금 등록한 post가 보이는 것을 확인할 수 있다. (feed 페이지에서 getStore()를 불러와 렌더링하고 있기 때문)
  });

  revalidatePath("/", "layout"); // 좋아요 기능과 마찬가지로 이동하는 페이지(/feed - page.js)상에 최신 데이터를 바로 반영할 수 있도록 기존 캐시를 강제 무효화 및 새로운 캐시를 갱신!
  redirect("/feed");
}

// 178.
export async function togglePostLikeStatus(postId) {
  await updatePostLikeStatus(postId, 2);
  revalidatePath("/", "layout"); // make sure that all pages pick up the latest data.
}
