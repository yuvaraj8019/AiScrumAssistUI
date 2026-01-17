import api from './http';
import { Meeting, Task, ExtractedItems } from '@/types/meeting';

export const getMeetings = async () => {
  const { data } = await api.get<Meeting[]>('/meetings?limit=50');
  return data;
};

export const getMeetingById = async (id: string) => {
  const { data } = await api.get<Meeting>(`/meetings/${id}`);
  return data;
};

export const createMeeting = async (meeting: Partial<Meeting>) => {
  const { data } = await api.post<Meeting>('/meetings', meeting);
  return data;
};

export const saveTranscript = async (id: string, transcript: string) => {
  const { data } = await api.post(`/meetings/${id}/transcript`, transcript, {
    headers: { 'Content-Type': 'text/plain' }
  });
  return data;
};

export const processMeeting = async (id: string) => {
  const { data } = await api.post(`/meetings/${id}/process`);
  return data;
};

export const getMeetingTasks = async (id: string) => {
  const { data } = await api.get<Task[]>(`/meetings/${id}/tasks`);
  return data;
};

export const getMeetingItems = async (id: string) => {
  const { data } = await api.get<ExtractedItems>(`/meetings/${id}/items`);
  return data;
};
