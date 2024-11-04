export interface Resource {
  id: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  topic: string;
  resource_type: string;
  image_url?: string;
  duration?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  resource_path?: string;
  answers_path?: string;
  tips_path?: string;
}

export interface FilterOptions {
  resource_type?: string;
  grade?: string;
  subject?: string;
  topic?: string;
}

// Make ResourceCard identical to Resource
export type ResourceCard = Resource; 