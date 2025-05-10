import React from "react";

type Props = {
  post: any;
  postIndex: number;
  isSelected: boolean;
  toggleSelect: (index: number) => void;
};

const ReservationList: React.FC<Props> = ({
  post,
  postIndex,
  isSelected,
  toggleSelect,
}) => {
  return (
    <>
      {post.days.map((day: any, i: number) => (
        <tr key={i}>
          <td>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleSelect(postIndex)}
            />
          </td>
          <td>{day.name}</td>
          <td>{day.class || "-"}</td>
          <td>{day.date}</td>
          <td>{day.startTime}</td>
          <td>{day.endTime}</td>
          <td>{day.realStartTime || "-"}</td>
          <td>{day.realEndTime || "-"}</td>
          <td>{day.remark || "-"}</td>
        </tr>
      ))}
    </>
  );
};

export default ReservationList;
