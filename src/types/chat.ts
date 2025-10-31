export interface ChatMedia {
  file: string;
  type: string;
  file_name: string;
}
export interface ChatMessage {
  id: number;
  message?: string;
  sender_id: number;
  media?: ChatMedia[];
}

export interface ChatMessagePayload {
  message?: string;
  sender_id: number;
  media?: {
    url: string;
    type: string;
    name: string;
  }[];
}
