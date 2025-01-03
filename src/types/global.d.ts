type Role = 'user';
type RouteAccessMap = { [path: string]: Role[] };

interface User {
   id: string;
   clerkUserId: string;
   type: string;
   firstname: string;
   lastname: string;
   email: string;
   folders: Folder[];
   createdAt: Date;
   updatedAt: stDatering;
}

interface Folder {
   id: string;
   folder_name: string;
   bytes: number;
   files: File[];
   favorited: boolean;
   trashed: boolean;
   createdAt: Date;
   updatedAt: Date;
   userId: string;
   user: User;
}

interface File {
   id: string;
   filename: string;
   asset_id: string;
   bytes: number;
   type: Type;
   secure_url: string;
   favorited: boolean;
   archived: boolean;
   trashed: boolean;
   createdAt: Date;
   updatedAt: Date;
   folderId: string;
   folder: Folder;
}

type Type = 'csv' | 'docs' | 'pptx' | 'pdf' | 'txt' | 'png' | 'jpg';

type CloudinaryEvent = {
   event: string; // e.g., "success"
   info: {
      id: string;
      batchId: string;
      asset_id: string;
      public_id: string;
      version: number;
      version_id: string;
      signature: string;
      width: number;
      height: number;
      format: string; // e.g., "jpg"
      resource_type: string; // e.g., "image"
      created_at: string; // ISO 8601 date string
      tags: string[];
      bytes: number;
      type: string; // e.g., "upload"
      etag: string;
      placeholder: boolean;
      url: string;
      secure_url: string;
      folder: string;
      access_mode: string; // e.g., "public"
      original_filename: string;
      path: string;
      thumbnail_url: string;
   };
};
