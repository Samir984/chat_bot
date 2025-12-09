import type { ChatMessage } from "@/types/chat";
import { roleChoicesEnum } from "@/gen/types/RoleChoices.ts";
import type { MessageSchema } from "@/gen/types/MessageSchema.ts";

export const filterHistoryMessages = (
  messages: ChatMessage[]
): MessageSchema[] => {
  const filterHistoryMessages = [];
  for (const message of messages) {
    if (message.role == roleChoicesEnum.user) {
      filterHistoryMessages.push({
        role: message.role,
        content: message.content,
      });
    } else if (
      message.role === roleChoicesEnum.ai &&
      (message.type == "INTERRUPTED" || message.type == "ERROR")
    ) {
      filterHistoryMessages.pop();
    } else {
      filterHistoryMessages.push({
        role: message.role,
        content: message.content,
      });
    }
  }

  return filterHistoryMessages;
};
