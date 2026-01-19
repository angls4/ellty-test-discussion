import { useCallback, useState } from 'react';

interface Comment {
  _id: string;
  [key: string]: any;
}

export const useComments = () => {
  const [comments, setComments] = useState<Map<string, Comment>>(new Map());

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch('/api/comments', { credentials: 'include' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch comments');
      }
      const commentsArray = await res.json();
      const commentsMap = new Map(commentsArray.map((comment: Comment) => [comment._id, comment]));
      setComments(commentsMap as any);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch comments');
    }
  }, []);

  const addComment = async (
    value: number,
    operation: 'add' | 'subtract' | 'divide' | 'multiply',
    parentId: string | null
  ) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value, operation, parentId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post comment');
      }
      await fetchComments();
      return true;
    } catch (err: any) {
      alert(err.message || 'Failed to post comment');
      return false;
    }
  };

  return { comments, setComments, fetchComments, addComment };
};
