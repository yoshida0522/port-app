// import React from "react";
// import styles from "./page.module.css";
// import { Post } from "../../type";

// type EditData = {
//   startTime: string;
//   endTime: string;
//   remark: string;
// };
// type UserTableRowsProps = {
//   filteredPosts: Post[];
//   editingRow: { postIndex: number; dayIndex: number } | null;
//   editData: EditData;
//   setEditData: (data: EditData) => void;
//   handleEdit: (postIndex: number, dayIndex: number) => void;
//   handleSave: () => void;
//   handleDelete: (post: Post) => void;
//   setEditingRow: (row: { postIndex: number; dayIndex: number } | null) => void;
// };

// const UserTableRows: React.FC<UserTableRowsProps> = ({
//   filteredPosts,
//   editingRow,
//   editData,
//   setEditData,
//   handleEdit,
//   handleSave,
//   handleDelete,
//   setEditingRow,
// }) => (
//   <tbody>
//     {filteredPosts.map((post, postIndex) => (
//       <React.Fragment key={postIndex}>
//         {post.days.map((day, dayIndex) => {
//           const isEditing =
//             editingRow?.postIndex === postIndex &&
//             editingRow?.dayIndex === dayIndex;

//           return (
//             <tr key={dayIndex}>
//               <td>{day.name}</td>
//               <td>{day.class}</td>
//               <td>{day.date}</td>
//               {isEditing ? (
//                 <>
//                   {["startTime", "endTime", "remark"].map((field, idx) => (
//                     <td key={idx}>
//                       <input
//                         type={field === "remark" ? "text" : "time"}
//                         value={editData[field as keyof EditData]}
//                         onChange={(e) =>
//                           setEditData({
//                             ...editData,
//                             [field]: e.target.value,
//                           })
//                         }
//                       />
//                     </td>
//                   ))}
//                   <td>
//                     <button className={styles.usersSave} onClick={handleSave}>
//                       保存
//                     </button>
//                     <button
//                       className={styles.usersCancel}
//                       onClick={() => setEditingRow(null)}
//                     >
//                       キャンセル
//                     </button>
//                   </td>
//                 </>
//               ) : (
//                 <>
//                   <td>{day.startTime}</td>
//                   <td>{day.endTime}</td>
//                   <td>{day.remark}</td>
//                   <td>
//                     {new Date(day.date) > new Date() && (
//                       <>
//                         <button
//                           className={styles.usersEdit}
//                           onClick={() => handleEdit(postIndex, dayIndex)}
//                         >
//                           編集
//                         </button>
//                         <button
//                           className={styles.usersDelete}
//                           onClick={() => handleDelete(post)}
//                         >
//                           取り消し
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </>
//               )}
//             </tr>
//           );
//         })}
//       </React.Fragment>
//     ))}
//   </tbody>
// );

// export default UserTableRows;

import React from "react";
import styles from "./page.module.css";
import { Post } from "../../type";

type EditData = {
  date: string;
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
        {post.days.map((day, dayIndex) => {
          const isEditing =
            editingRow?.postIndex === postIndex &&
            editingRow?.dayIndex === dayIndex;

          return (
            <tr key={dayIndex}>
              <td>{day.name}</td>
              <td>{day.class}</td>
              <td>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        date: e.target.value,
                      })
                    }
                  />
                ) : (
                  day.date
                )}
              </td>
              {isEditing ? (
                <>
                  {["startTime", "endTime", "remark"].map((field, idx) => (
                    <td key={idx}>
                      <input
                        type={field === "remark" ? "text" : "time"}
                        value={editData[field as keyof EditData]}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            [field]: e.target.value,
                          })
                        }
                      />
                    </td>
                  ))}
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
                          取り消し
                        </button>
                      </>
                    )}
                  </td>
                </>
              )}
            </tr>
          );
        })}
      </React.Fragment>
    ))}
  </tbody>
);

export default UserTableRows;
