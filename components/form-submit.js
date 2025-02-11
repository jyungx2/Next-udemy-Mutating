"use client";

import { useFormStatus } from "react-dom";

export default function FormSubmit() {
  const status = useFormStatus();

  if (status.pending) {
    return <p>Creating post...</p>;
  }

  // 아래 버튼들은 useFormStatus*를 사용하기 때문에 무조건 form 태그로 감싸져 있어야 한다!
  return (
    <>
      <button type="reset">Reset</button>
      <button>Create Post</button>
    </>
  );
}
