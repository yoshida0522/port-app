// import { useState } from "react";

// export const useHandleChange = () => {
//   const [firstDay, setFirstDay] = useState({
//     date: "",
//     startTime: "14:00",
//     endTime: "14:00",
//     remark: "",
//     delete: false,
//   });
//   const [secondDay, setSecondDay] = useState({
//     date: "",
//     startTime: "14:00",
//     endTime: "14:00",
//     remark: "",
//     delete: false,
//   });
//   const [thirdDay, setThirdDay] = useState({
//     date: "",
//     startTime: "14:00",
//     endTime: "14:00",
//     remark: "",
//     delete: false,
//   });
//   const [fourthDay, setFourthDay] = useState({
//     date: "",
//     startTime: "14:00",
//     endTime: "14:00",
//     remark: "",
//     delete: false,
//   });
//   const [fifthDay, setFifthDay] = useState({
//     date: "",
//     startTime: "14:00",
//     endTime: "14:00",
//     remark: "",
//     delete: false,
//   });

//   const handleChange =
//     (day: string, field: string) =>
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const value = e.target.value;
//       switch (day) {
//         case "firstDay":
//           setFirstDay((prev) => ({
//             ...prev,
//             [field]: value,
//           }));
//           break;
//         case "secondDay":
//           setSecondDay((prev) => ({
//             ...prev,
//             [field]: value,
//           }));
//           break;
//         case "thirdDay":
//           setThirdDay((prev) => ({
//             ...prev,
//             [field]: value,
//           }));
//           break;
//         case "fourthDay":
//           setFourthDay((prev) => ({
//             ...prev,
//             [field]: value,
//           }));
//           break;
//         case "fifthDay":
//           setFifthDay((prev) => ({
//             ...prev,
//             [field]: value,
//           }));
//           break;
//         default:
//           break;
//       }
//     };
//   return { handleChange, firstDay, secondDay, thirdDay, fourthDay, fifthDay };
// };

import { useState } from "react";

export const useHandleChange = () => {
  const initialDayState = {
    date: "",
    startTime: "14:00",
    endTime: "14:00",
    remark: "",
    delete: false,
  };

  const [days, setDays] = useState(Array(5).fill(initialDayState));

  const handleChange =
    (dayIndex: number, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setDays((prev) =>
        prev.map((day, index) =>
          index === dayIndex ? { ...day, [field]: value } : day
        )
      );
    };

  return {
    handleChange,
    firstDay: days[0],
    secondDay: days[1],
    thirdDay: days[2],
    fourthDay: days[3],
    fifthDay: days[4],
  };
};
