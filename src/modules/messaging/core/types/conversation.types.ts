export type Conversation = {
  id: number;
  guestId: number;
  hostId: number;
  reservationId: number;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: number;
  conversationId: number;
  senderId: number;
  body: string;
  readAt: string | null;
  createdAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function mapConversation(data: unknown): Conversation | null {
  if (!isRecord(data)) {
    return null;
  }

  if (
    typeof data.id !== 'number' ||
    typeof data.guestId !== 'number' ||
    typeof data.hostId !== 'number' ||
    typeof data.reservationId !== 'number'
  ) {
    return null;
  }

  return {
    id: data.id,
    guestId: data.guestId,
    hostId: data.hostId,
    reservationId: data.reservationId,
    lastMessageAt: typeof data.lastMessageAt === 'string' ? data.lastMessageAt : null,
    createdAt: typeof data.createdAt === 'string' ? data.createdAt : '',
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : '',
  };
}

export function mapConversations(data: unknown): Conversation[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((entry) => mapConversation(entry))
    .filter((entry): entry is Conversation => entry !== null);
}

export function mapMessage(data: unknown): Message | null {
  if (!isRecord(data)) {
    return null;
  }

  if (
    typeof data.id !== 'number' ||
    typeof data.conversationId !== 'number' ||
    typeof data.senderId !== 'number' ||
    typeof data.body !== 'string'
  ) {
    return null;
  }

  return {
    id: data.id,
    conversationId: data.conversationId,
    senderId: data.senderId,
    body: data.body,
    readAt: typeof data.readAt === 'string' ? data.readAt : null,
    createdAt: typeof data.createdAt === 'string' ? data.createdAt : '',
  };
}

export function mapMessages(data: unknown): Message[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((entry) => mapMessage(entry))
    .filter((entry): entry is Message => entry !== null);
}

export function formatMessageTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
