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
}

// Create a singleton instance of the database
export const db = new ChatDatabase();
