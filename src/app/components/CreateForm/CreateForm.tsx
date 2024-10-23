import React from "react";
import styles from "../CreateForm/page.module.css";

interface ReservationInputProps {
  day: string;
  index: number;
  onChange: (
    day: string,
    field: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateForm: React.FC<ReservationInputProps> = ({
  day,
  index,
  onChange,
}) => {
  return (
    <div className={styles.applicationSection}>
      <div className={styles.applicationNumberContainer}>
        <span className={styles.applicationNumber}>第{index + 1}希望日</span>
      </div>
      <div className={styles.applicationContent}>
        <strong className={styles.createStrong}>日にち</strong>
        <input
          className={styles.createInput}
          type="date"
          onChange={onChange(day, "date")}
        />
        <strong className={styles.createStrong}>延長開始時間</strong>
        <input
          className={styles.createInput}
          type="time"
          defaultValue={"14:00"}
          onChange={onChange(day, "startTime")}
        />
        <strong className={styles.createStrong}>お迎え時間</strong>
        <input
          className={styles.createInput}
          type="time"
          min="14:00"
          defaultValue={"14:00"}
          onChange={onChange(day, "endTime")}
        />
        <strong className={styles.createStrong}>備考</strong>
        <input
          className={styles.createInput}
          onChange={onChange(day, "remark")}
        />
      </div>
    </div>
  );
};

export default CreateForm;
