"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import { forwardRef } from "react";
import ReplyModal from "@/app/components/ReplyModal";
import AuthModal from "@/app/components/AuthModal";


const indentation: number = 3; // rem per depth level

const Thread = forwardRef<HTMLDivElement, { data: any, depth: number, parentId?: string, handleExpand: (id: string, isExpanded: boolean) => void, onReply: (parentId: string) => void, hasReplies: boolean }>(
  ({ data, depth, parentId = "123123", handleExpand, onReply, hasReplies }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggleExpand = () => {
      const newExpanded = !isExpanded;
      setIsExpanded(newExpanded);
      handleExpand(data._id, newExpanded);
    };

    return (
      <div ref={ref} data-expanded={isExpanded} data-parentid={parentId} data-id={data._id} className={`flex flex-col w-125 p-2 space-y-1 ${depth > 0 ? 'border-l border-l-gray-200' : ''}`} style={{marginLeft:depth*indentation+"rem", display: depth > 0 ? 'none' : 'block'}}>
        {/* username & date */}
        <div className="flex items-center">
          <div className="font-semibold text-sm mr-2">{data.authorUsername || "Anonymous"}</div>
          <div className="text-xs text-gray-600">{new Date(data.createdAt).toLocaleString()}</div>
        </div>
        {/* content */}
        <div className="text-sm ml-2">
          {data.operation && data.value !== undefined ? (
            <span>
              {data.parentResult ? (
                <>
                  {data.parentResult} <span className="font-semibold">
                    {data.operation === 'add' && '+'}
                    {data.operation === 'subtract' && '-'}
                    {data.operation === 'multiply' && '×'}
                    {data.operation === 'divide' && '÷'}
                  </span> 
                  <span className="">{data.value}</span>
                   =  
                  <span className="font-semibold">{data.result}</span>
                </>
              ) : (
                <span className="font-semibold">{data.value}</span>
              )}
            </span>
          ) : (
            <span className="text-gray-500">No operation</span>
          )}
        </div>
        {/* actions */}
        <div className="flex gap-2 ml-2">
          <button className="text-xs text-blue-700 hover:underline" onClick={() => onReply(data._id)}>Reply</button>
          {hasReplies && (
            <button className="text-xs text-blue-400 hover:underline" onClick={handleToggleExpand}>
              {!isExpanded ? "Show Replies" : "Hide Replies"}
              <div className="inline-block ml-1">{!isExpanded ? "▼" : "▶"}</div>
            </button>
          )}
        </div>
      </div>
    )
  }
);

export default function Page() {
  const commentRefs = useRef<Record<string, HTMLDivElement>>({});
  const [comments, setComments] = useState<Map<string, any>>(new Map());
  const [replyModal, setReplyModal] = useState<{ open: boolean, parentId: string | null }>({ open: false, parentId: null });
  const [authModal, setAuthModal] = useState<{ open: boolean, mode: 'login' | 'register' }>({ open: false, mode: 'login' });
  const [user, setUser] = useState<any>(null);
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      }
    };
    checkAuth();
  }, []);

  // Fetch comments from API
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch('/api/comments', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch comments');
      const commentsArray = await res.json();
      const commentsMap = new Map(commentsArray.map((comment: any) => [comment._id, comment]));
      setComments(commentsMap as any);
    } catch (err: any) {
      console.error('Failed to fetch comments:', err);
    }
  }, []);

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const insertRef = useCallback((el: HTMLDivElement | null, fullPath: string) => {
    if (el) {
      commentRefs.current[fullPath] = el;
    }
    else {
      delete commentRefs.current[fullPath];
    }
  }, []);

  const handleExpand = (id: string, isExpanded: boolean, recursive = false) => {
    console.log("Handle expand:", id, isExpanded);
    if (isExpanded){
      Object.entries(commentRefs.current).forEach(([key, ref]) => {
        if (new RegExp(`${id}/[^/]+$`).test(key)) {
          ref.style.display = "block"
          handleExpand(ref.dataset.id, ref.dataset.expanded === "true", true);
        }
      });
    }
    else
      Object.entries(commentRefs.current).forEach(([key, ref]) => {
          if (new RegExp(`${id}/`).test(key)) {
            ref.style.display = "none";
          }
    });
  }
  
  const handleReply = (parentId: string) => {
    if (!user) {
      setAuthModal({ open: true, mode: 'login' });
      return;
    }
    setReplyModal({ open: true, parentId });
  }

  const handleReplySubmit = async (value: number, operation: "add" | "subtract" | "divide" | "multiply") => {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          value,
          operation,
          parentId: replyModal.parentId,
        })
      });
      
      if (res.ok) {
        setReplyModal({ open: false, parentId: null });
        fetchComments();
      } else {
        alert('Failed to post reply');
      }
    } catch (err) {
      console.error('Failed to post reply:', err);
    }
  }

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setAuthModal({ open: false, mode: 'login' });
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Comment Thread</h1>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm font-medium">{user.username}</span>
              <button onClick={() => setReplyModal({ open: true, parentId: null })} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Start New Calculation</button>
              <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Logout</button>
            </>
          ) : (
            <button onClick={() => setAuthModal({ open: true, mode: 'login' })} className="text-sm text-blue-600 hover:underline">Login</button>
          )}
        </div>
      </div>
      {Array.from(comments.values()).map((comment) => {
        const hasReplies = Array.from(comments.values()).some((c) => c.fullPath?.includes(comment._id + "/"));
        return (
          <Thread data={comment} key={comment._id} depth={comment.depth} parentId={comment.parentId} ref={el => insertRef(el, comment.fullPath)} handleExpand={handleExpand} onReply={handleReply} hasReplies={hasReplies} />
        );
      })}

      <ReplyModal open={replyModal.open} onClose={() => setReplyModal({ open: false, parentId: null })} onSubmit={handleReplySubmit} />
      <AuthModal open={authModal.open} mode={authModal.mode} onClose={() => setAuthModal({ open: false, mode: 'login' })} onSuccess={handleAuthSuccess} onSwitchMode={(mode) => setAuthModal({ open: true, mode })} />
    </div>
  )
}