export type TPost = {
  id: string;
  author: string;
  content: string;
  reactions: TReaction[];
};

export type TReaction = {
  id: string;
  name: string;
  count: number;
  addedBy: string[];
};
