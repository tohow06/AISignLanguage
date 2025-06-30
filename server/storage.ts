import { users, videoRequests, type User, type InsertUser, type VideoRequest, type InsertVideoRequest } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createVideoRequest(request: InsertVideoRequest): Promise<VideoRequest>;
  getVideoRequest(id: number): Promise<VideoRequest | undefined>;
  updateVideoRequest(id: number, updates: Partial<VideoRequest>): Promise<VideoRequest | undefined>;
  getVideoRequestsByStatus(status: string): Promise<VideoRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private videoRequests: Map<number, VideoRequest>;
  private currentUserId: number;
  private currentVideoRequestId: number;

  constructor() {
    this.users = new Map();
    this.videoRequests = new Map();
    this.currentUserId = 1;
    this.currentVideoRequestId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createVideoRequest(insertRequest: InsertVideoRequest): Promise<VideoRequest> {
    const id = this.currentVideoRequestId++;
    const request: VideoRequest = {
      id,
      inputText: insertRequest.inputText,
      videoUrl: null,
      status: "pending",
      createdAt: new Date(),
    };
    this.videoRequests.set(id, request);
    return request;
  }

  async getVideoRequest(id: number): Promise<VideoRequest | undefined> {
    return this.videoRequests.get(id);
  }

  async updateVideoRequest(id: number, updates: Partial<VideoRequest>): Promise<VideoRequest | undefined> {
    const existing = this.videoRequests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.videoRequests.set(id, updated);
    return updated;
  }

  async getVideoRequestsByStatus(status: string): Promise<VideoRequest[]> {
    return Array.from(this.videoRequests.values()).filter(
      (request) => request.status === status,
    );
  }
}

export const storage = new MemStorage();
