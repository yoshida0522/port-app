import React from "react";
import styles from "../ReservationList/page.module.css";
import Link from "next/link";
import { Day } from "./type";

type ReservationRowProps = {
  post: { id: string; days: Day[] };
  postIndex: number;
  editingRow: { postId: string; dayIndex: number } | null;
  editStartTime: string;
  editEndTime: string;
  setEditStartTime: (time: string) => void;
  setEditEndTime: (time: string) => void;
  handleEdit: (postId: string, dayIndex: number) => void;
  handleSave: () => Promise<void>;
  handleDelete: (postIndex: number) => Promise<void>;
  handleCancel: () => void;
};

const ReservationList: React.FC<ReservationRowProps> = ({
  post,
  postIndex,
  editingRow,
  editStartTime,
  editEndTime,
  setEditStartTime,
  setEditEndTime,
  handleEdit,
  handleSave,
  handleDelete,
  handleCancel,
}) => {
  const isEditing = (dayIndex: number) =>
    editingRow?.postId === post.id && editingRow?.dayIndex === dayIndex;

  const renderTimeInput = (
    value: string,
    onChange: (value: string) => void,
    min?: string
  ) => (
    <input
      className={styles.reservationInput}
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
    />
  );

  return (
    <>
      {post.days.map((day, dayIndex) => (
        <tr key={dayIndex} className={styles.reservationText}>
          <td>
            <Link className={styles.childName} href={`/childName/${day.name}`}>
              {day.name}
            </Link>
          </td>
          <td>{day.class}</td>
          <td>{day.date}</td>
          <td>{day.startTime}</td>
          <td>{day.endTime}</td>
          <td>
            {isEditing(dayIndex)
              ? renderTimeInput(editStartTime, setEditStartTime)
              : day.realStartTime}
          </td>
          <td>
            {isEditing(dayIndex)
              ? renderTimeInput(editEndTime, setEditEndTime, editStartTime)
              : day.realEndTime}
          </td>
          <td>{day.remark}</td>
          <td>
            {isEditing(dayIndex) ? (
              <>
                <button className={styles.saveButton} onClick={handleSave}>
                  保存
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(postIndex)}
                >
                  削除
                </button>
                <button className={styles.cancelButton} onClick={handleCancel}>
                  キャンセル
                </button>
              </>
            ) : (
              <button
                className={styles.editButton}
                onClick={() => handleEdit(post.id, dayIndex)}
              >
                編集
              </button>
            )}
          </td>
        </tr>
      ))}
    </>
  );
};

export default ReservationList;
