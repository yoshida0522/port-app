import React from "react";
import styles from "../Manager/page.module.css";

interface User {
  id: string;
  name: string;
  pass: string;
  manager: boolean;
}

interface UserRowProps {
  user: User;
  editingUserId: string | null;
  editedUser: {
    name: string;
    pass: string;
    manager: boolean;
  };
  onEdit: (user: User) => void;
  onSave: (userId: string) => void;
  onCancel: () => void;
  onDelete: (userId: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: () => void;
}

const Manager: React.FC<UserRowProps> = ({
  user,
  editingUserId,
  editedUser,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onInputChange,
  onCheckboxChange,
}) => {
  return (
    <tr key={user.id}>
      <td>
        {editingUserId === user.id ? (
          <input
            type="text"
            name="name"
            value={editedUser.name}
            onChange={onInputChange}
          />
        ) : (
          user.name
        )}
      </td>
      <td>
        {editingUserId === user.id ? (
          <input
            type="text"
            name="pass"
            value={editedUser.pass}
            onChange={onInputChange}
          />
        ) : (
          user.pass
        )}
      </td>
      <td>
        {editingUserId === user.id ? (
          <input
            type="checkbox"
            checked={editedUser.manager}
            onChange={onCheckboxChange}
          />
        ) : (
          <input type="checkbox" checked={user.manager} readOnly />
        )}
      </td>
      <td className={styles.tableLine}>
        {editingUserId === user.id ? (
          <>
            <button
              className={styles.managerSave}
              onClick={() => onSave(user.id)}
            >
              保存
            </button>
            <button className={styles.managerCancel} onClick={onCancel}>
              キャンセル
            </button>
          </>
        ) : (
          <>
            <button className={styles.managerEdit} onClick={() => onEdit(user)}>
              変更
            </button>
            <button
              className={styles.managerDelete}
              onClick={() => onDelete(user.id)}
            >
              削除
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default Manager;
