import React from "react";
import styles from "../ChildReservation/page.module.css";
import { Day } from "./type";

type ChildReservationRowProps = {
  postId: string;
  day: Day;
  dayIndex: number;
  editingRow: { postId: string; dayIndex: number } | null;
  editData: Day | null;
  handleChange: (field: keyof Day, value: string) => void;
  handleEdit: (day: Day, postId: string, dayIndex: number) => void;
  handleSave: () => void;
  handleCancel: () => void;
  handleDelete: (postIndex: number) => void;
  postIndex: number;
};

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
  return (
    <tr key={dayIndex} className={styles.childNameText}>
      <td>{day.name}</td>
      <td>
        {editingRow?.postId === postId && editingRow?.dayIndex === dayIndex ? (
          <input
            className={styles.childInput}
            value={editData?.class}
            onChange={(e) => handleChange("class", e.target.value)}
          />
        ) : (
          day.class
        )}
      </td>
      <td>
        {editingRow?.postId === postId && editingRow?.dayIndex === dayIndex ? (
          <input
            className={styles.childInput}
            value={editData?.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        ) : (
          day.date
        )}
      </td>
      <td>
        {editingRow?.postId === postId && editingRow?.dayIndex === dayIndex ? (
          <input
            className={styles.childInput}
            type="time"
            value={editData?.startTime}
            onChange={(e) => handleChange("startTime", e.target.value)}
          />
        ) : (
          day.startTime
        )}
      </td>
      <td>
        {editingRow?.postId === postId && editingRow?.dayIndex === dayIndex ? (
          <input
            className={styles.childInput}
            type="time"
            value={editData?.endTime}
            onChange={(e) => handleChange("endTime", e.target.value)}
          />
        ) : (
          day.endTime
        )}
      </td>
      <td>{day.realStartTime}</td>
      <td>{day.realEndTime}</td>
      <td>{day.remark}</td>
      <td>
        {editingRow?.postId === postId && editingRow?.dayIndex === dayIndex ? (
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
          <>
            <button
              className={styles.childEditButton}
              onClick={() => handleEdit(day, postId, dayIndex)}
            >
              編集
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default ChildReservationRow;
