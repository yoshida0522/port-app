export type Day = {
  date: string;
  name: string;
  id: string;
  class: string;
  startTime: string;
  endTime: string;
  realStartTime?: string;
  realEndTime?: string;
  remark?: string;
  delete: boolean;
  userId: string;
};

export type Post = {
  id: string;
  days: Day[];
  delete?: boolean;
};

export type User = {
  id: string;
  name: string;
  pass: string;
  manager: boolean;
  delete: boolean;
};
