import Dexie, { Table } from "dexie";
import { Message } from "@ai-sdk/react";

// Define the database schema
export class ChatDatabase extends Dexie {
  messages!: Table<Message, string>; // 'string' is the type of the primary key

  constructor() {
    super("ChatDatabase");

    // Define tables and schema
    this.version(1).stores({
      messages: "id, role, createdAt", // Primary key is 'id', indexes on 'role' and 'createdAt'
    });
  }

  // Method to clear all messages
  async resetMessages(): Promise<void> {
    await this.messages.clear();
  }

  // Method to safely add initial messages only if the database is empty
  async safelyAddInitialMessages(messages: Message[]): Promise<Message[]> {
    // Use a transaction to ensure this operation is atomic
    return await this.transaction("rw", this.messages, async () => {
      // Check if the database already has messages
      const count = await this.messages.count();

      // Only add initial messages if there are no messages
      if (count === 0 && messages.length > 0) {
        await this.messages.bulkPut(messages);
        return messages;
      }

      // Return existing messages
      return await this.messages.toArray();
    });
  }
}

// Create a singleton instance of the database
export const db = new ChatDatabase();
