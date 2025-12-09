import type { MessageSchema } from "@/gen/types";

// response message types
type type = "INTERRUPTED" | "ERROR";

export interface Message extends MessageSchema {
  id: string;
  type?: type;
}

export type { Message as ChatMessage };
