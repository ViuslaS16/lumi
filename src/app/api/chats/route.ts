import { NextRequest, NextResponse } from 'next/server';
import { getAllChats, createChat, clearAllChats, ChatSession } from '@/lib/chatDb';

// GET /api/chats - Read all chats (CRUD: Read)
export async function GET() {
  try {
    const chats = await getAllChats();
    return NextResponse.json({ success: true, data: chats });
  } catch (error) {
    console.error('Failed to get chats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve chat history' },
      { status: 500 }
    );
  }
}

// POST /api/chats - Create a new chat (CRUD: Create)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, messages, employeeId } = body;

    const newSession: ChatSession = {
      id: id || `chat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: title || 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: messages || [],
      employeeId: employeeId || 'NE-104',
    };

    const saved = await createChat(newSession);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error('Failed to create chat:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save chat conversation' },
      { status: 500 }
    );
  }
}

// DELETE /api/chats - Clear all chats (CRUD: Delete All)
export async function DELETE() {
  try {
    await clearAllChats();
    return NextResponse.json({ success: true, message: 'All conversations cleared' });
  } catch (error) {
    console.error('Failed to clear chats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear chat history' },
      { status: 500 }
    );
  }
}
