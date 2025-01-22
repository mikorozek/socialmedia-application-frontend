export type Conversation = {
  id: number;
  users: User[];
  last_message: Message | null;
};

export type User = {
  id: number;
  username: string;
  email: string;
};

export type Message = {
  user_id: number;
  content: string;
  message_date: string;
};
