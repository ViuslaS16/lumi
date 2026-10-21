import { NextRequest, NextResponse } from 'next/server';
import { getChatById, updateChat, deleteChat } from '@/lib/chatDb';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/chats/[id] - Read single chat (CRUD: Read)
export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const chat = await getChatById(id);

    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: chat });
  } catch (error) {
    console.error('Failed to get chat by id:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve conversation' },
      { status: 500 }
    );
  }
}

// PUT /api/chats/[id] - Update chat title or messages (CRUD: Update)
export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { title, messages, employeeId } = body;

    const updated = await updateChat(id, {
      ...(title !== undefined ? { title } : {}),
      ...(messages !== undefined ? { messages } : {}),
      ...(employeeId !== undefined ? { employeeId } : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Chat conversation not found for update' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Failed to update chat:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}

// DELETE /api/chats/[id] - Delete chat (CRUD: Delete)
export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const success = await deleteChat(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Chat conversation not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: `Chat ${id} deleted successfully` });
  } catch (error) {
    console.error('Failed to delete chat:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
