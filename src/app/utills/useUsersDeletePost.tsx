import { doc, updateDoc } from "firebase/firestore";
import db from "../firebase";
import { Post } from "../type";

export const useUsersDeletePost = (setShouldFetch: (val: boolean) => void) => {
  const handleDelete = async (postToDelete: Post) => {
    // 確認ダイアログを表示
    const confirmed = window.confirm("本当に取り消しますか？");
    if (!confirmed) return;

    if (postToDelete && postToDelete.id) {
      try {
        const postRef = doc(db, "posts", postToDelete.id);

        // postのdeleteフィールドをtrueに設定
        await updateDoc(postRef, { delete: true });
        console.log("データが削除フラグを立てました");
        setShouldFetch(true);
      } catch (error) {
        console.error("削除フラグの更新に失敗しました", error);
      }
    }
  };

  return { handleDelete };
};
