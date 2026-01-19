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
      if (!res.ok) throw new Error('Failed to fetch comments');
      const commentsArray = await res.json();
      const commentsMap = new Map(commentsArray.map((comment: Comment) => [comment._id, comment]));
      setComments(commentsMap);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
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

      if (!res.ok) throw new Error('Failed to post comment');
      await fetchComments();
      return true;
    } catch (err) {
      console.error('Failed to post comment:', err);
      return false;
    }
  };

  return { comments, setComments, fetchComments, addComment };
};
