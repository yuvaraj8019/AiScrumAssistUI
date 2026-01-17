export type MeetingStatus = 'CREATED' | 'AUDIO_UPLOADED' | 'TRANSCRIPT_UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Meeting {
  id: string;
  title: string;
  ceremonyType: 'STANDUP' | 'PLANNING' | 'REVIEW' | 'RETROSPECTIVE';
  meetingDate: string;
  toolType: 'JIRA' | 'AZURE';
  projectKey: string;
  status: MeetingStatus;
  createdAt: string;
  transcript?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  dueDate?: string;
  tags?: string[];
  externalId?: string;
  externalUrl?: string; // Derived in UI if possible
}

export interface ActionItem {
  id?: string;
  title: string;
  assignee?: string;
  dueDate?: string;
  notes?: string;
}

export interface Blocker {
  id?: string;
  description: string;
  owner?: string;
  impact?: string;
}

export interface Decision {
  description: string;
}

export interface ExtractedItems {
  decisions: string[];
  blockers: Blocker[];
  actionItems: ActionItem[];
}
