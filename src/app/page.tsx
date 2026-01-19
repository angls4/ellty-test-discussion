'use client';

import { useEffect, useRef, useState } from 'react';
import ThreadList, { ThreadListHandle } from '@/app/components/ThreadList';
import UserHeader from '@/app/components/UserHeader';
import ReplyModal from '@/app/components/ReplyModal';
import AuthModal from '@/app/components/AuthModal';
import { useAuth } from '@/app/hooks/useAuth';
import { useComments } from '@/app/hooks/useComments';

export default function Page() {
  const { user, setUser, logout } = useAuth();
  const { comments, fetchComments, addComment } = useComments();
  const threadListRef = useRef<ThreadListHandle>(null);
  const [replyModal, setReplyModal] = useState<{ open: boolean; parentId: string | null }>({
    open: false,
    parentId: null,
  });
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'register' }>({
    open: false,
    mode: 'login',
  });

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleReply = (parentId: string) => {
    if (!user) {
      setAuthModal({ open: true, mode: 'login' });
      return;
    }
    setReplyModal({ open: true, parentId });
  };

  const handleReplySubmit = async (
    value: number,
    operation: 'add' | 'subtract' | 'divide' | 'multiply'
  ) => {
    const success = await addComment(value, operation, replyModal.parentId);
    if (success) {
      setReplyModal({ open: false, parentId: null });
      if (replyModal.parentId) {
        threadListRef.current?.expandComment(replyModal.parentId);
      }
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setAuthModal({ open: false, mode: 'login' });
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleStartCalculation = () => {
    if (!user) {
      setAuthModal({ open: true, mode: 'login' });
      return;
    }
    setReplyModal({ open: true, parentId: null });
  };

  return (
    <div className="p-8">
      <UserHeader
        user={user}
        onLogout={handleLogout}
        onStartCalculation={handleStartCalculation}
        onLogin={() => setAuthModal({ open: true, mode: 'login' })}
      />
      <ThreadList ref={threadListRef} comments={comments} onReply={handleReply} />
      <ReplyModal
        open={replyModal.open}
        parentId={replyModal.parentId}
        onClose={() => setReplyModal({ open: false, parentId: null })}
        onSubmit={handleReplySubmit}
      />
      <AuthModal
        open={authModal.open}
        mode={authModal.mode}
        onClose={() => setAuthModal({ open: false, mode: 'login' })}
        onSuccess={handleAuthSuccess}
        onSwitchMode={(mode) => setAuthModal({ open: true, mode })}
      />
    </div>
  );
}