export interface BaseItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  completed: boolean;
  tags?: string[];
  date?: string;
  notes?: string;
}

export interface Metadata {
  title?: string;
  description?: string;
}

export interface PendingItem {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  date?: string;
  notes?: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}