export const QUERY_KEYS = {
  ME: ['auth', 'me'],
  MY_CONTENT: (params?: object) => ['content', 'my', params],
  CONTENT_BY_ID: (id: string) => ['content', id],
  PENDING_APPROVALS: (params?: object) => ['approval', 'pending', params],
  ALL_CONTENT: (params?: object) => ['approval', 'all', params],
  LIVE_BROADCAST: (teacherId: string, subject?: string) => ['broadcast', 'live', teacherId, subject],
  SUBJECT_SCHEDULE: (subject: string) => ['schedule', 'subject', subject],
} as const;
