export const MAX_EVENTS_PER_USER = process.env.MAX_EVENTS_PER_USER || 2;

export const TOURNAMENT_CATEGORIES = {
  BEGINNER: { maxParticipants: 8 },
  INTERMEDIATE: { maxParticipants: 16 },
  ADVANCED: { maxParticipants: 32 },
};