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
  delete?: boolean;
};

export type Post = {
  id: string;
  days: Day[];
  delete?: boolean;
};
