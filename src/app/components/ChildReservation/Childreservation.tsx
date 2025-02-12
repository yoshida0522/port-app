import React from "react";
import styles from "./page.module.css";
import { ChildReservationRowProps } from "@/app/type";

const ChildReservationRow: React.FC<ChildReservationRowProps> = ({
  postId,
  day,
  dayIndex,
  editingRow,
  editData,
  handleChange,
  handleEdit,
  handleSave,
  handleCancel,
  handleDelete,
  postIndex,
}) => {
  const isEditing =
    editingRow?.postId === postId && editingRow?.dayIndex === dayIndex;
  const editableFields = ["class", "date", "startTime", "endTime"] as const;

  return (
    <tr key={dayIndex} className={styles.childNameText}>
      <td>{day.name}</td>
      {editableFields.map((field) => (
        <td key={field}>
          {isEditing ? (
            <input
              className={styles.childInput}
              type={field.includes("Time") ? "time" : "text"}
              value={editData?.[field] ?? ""}
              onChange={(e) => handleChange(field, e.target.value)}
            />
          ) : (
            day[field]
          )}
        </td>
      ))}
      <td>{day.realStartTime}</td>
      <td>{day.realEndTime}</td>
      <td>{day.remark}</td>
      <td>
        {isEditing ? (
          <>
            <button className={styles.childSaveButton} onClick={handleSave}>
              保存
            </button>
            <button
              className={styles.childDeleteButton}
              onClick={() => handleDelete(postIndex)}
            >
              削除
            </button>
            <button className={styles.childCancelButton} onClick={handleCancel}>
              キャンセル
            </button>
          </>
        ) : (
          <button
            className={styles.childEditButton}
            onClick={() => handleEdit(day, postId, dayIndex)}
          >
            編集
          </button>
        )}
      </td>
    </tr>
  );
};

export default ChildReservationRow;
