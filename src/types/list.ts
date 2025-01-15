export interface BaseItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface Metadata {
  title?: string;
  description?: string;
}

export interface PendingItem {
  url: string;
  title: string;
  description?: string;
}