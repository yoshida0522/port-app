import React from "react";
import styles from "./page.module.css";
import { Post } from "../../type";

type EditData = {
  startTime: string;
  endTime: string;
  remark: string;
};
type UserTableRowsProps = {
  filteredPosts: Post[];
  editingRow: { postIndex: number; dayIndex: number } | null;
  editData: EditData;
  setEditData: (data: EditData) => void;
  handleEdit: (postIndex: number, dayIndex: number) => void;
  handleSave: () => void;
  handleDelete: (post: Post) => void;
  setEditingRow: (row: { postIndex: number; dayIndex: number } | null) => void;
};

const UserTableRows: React.FC<UserTableRowsProps> = ({
  filteredPosts,
  editingRow,
  editData,
  setEditData,
  handleEdit,
  handleSave,
  handleDelete,
  setEditingRow,
}) => (
  <tbody>
    {filteredPosts.map((post, postIndex) => (
      <React.Fragment key={postIndex}>
        {post.days.map((day, dayIndex) => (
          <tr key={dayIndex}>
            <td>{day.name}</td>
            <td>{day.class}</td>
            <td>{day.date}</td>
            {editingRow?.postIndex === postIndex &&
            editingRow?.dayIndex === dayIndex ? (
              <>
                <td>
                  <input
                    type="time"
                    value={editData.startTime}
                    onChange={(e) =>
                      setEditData({ ...editData, startTime: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={editData.endTime}
                    onChange={(e) =>
                      setEditData({ ...editData, endTime: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editData.remark}
                    onChange={(e) =>
                      setEditData({ ...editData, remark: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button className={styles.usersSave} onClick={handleSave}>
                    保存
                  </button>
                  <button
                    className={styles.usersCancel}
                    onClick={() => setEditingRow(null)}
                  >
                    キャンセル
                  </button>
                </td>
              </>
            ) : (
              <>
                <td>{day.startTime}</td>
                <td>{day.endTime}</td>
                <td>{day.remark}</td>
                <td>
                  {new Date(day.date) > new Date() && (
                    <>
                      <button
                        className={styles.usersEdit}
                        onClick={() => handleEdit(postIndex, dayIndex)}
                      >
                        編集
                      </button>
                      <button
                        className={styles.usersDelete}
                        onClick={() => handleDelete(post)}
                      >
                        削除
                      </button>
                    </>
                  )}
                </td>
              </>
            )}
          </tr>
        ))}
      </React.Fragment>
    ))}
  </tbody>
);

export default UserTableRows;
