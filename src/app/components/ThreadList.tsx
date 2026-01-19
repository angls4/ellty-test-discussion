import { useImperativeHandle, forwardRef, useState } from 'react';
import ThreadItem from './ThreadItem';

interface ThreadListProps {
  comments: Map<string, any>;
  onReply: (parentId: string) => void;
}

export interface ThreadListHandle {
  expandComment: (id: string) => void;
}

const ThreadList = forwardRef<ThreadListHandle, ThreadListProps>(
  ({ comments, onReply }, ref) => {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    useImperativeHandle(ref, () => ({
      expandComment: (id: string) => {
        setExpandedIds((prev) => new Set(prev).add(id));
      },
    }));

    const getCommentById = (id: string) => {
      return Array.from(comments.values()).find((c) => c._id === id);
    };

    const isParentVisible = (comment: any): boolean => {
      if (comment.depth === 0) return true;

      const parent = getCommentById(comment.parentId);
      if (!parent) return false;

      return expandedIds.has(parent._id) && isParentVisible(parent);
    };

    const getVisibility = (comment: any): boolean => {
      return isParentVisible(comment);
    };

    const handleExpand = (id: string, shouldExpand: boolean) => {
      const newExpanded = new Set(expandedIds);
      if (shouldExpand) {
        newExpanded.add(id);
      } else {
        newExpanded.delete(id);
      }
      setExpandedIds(newExpanded);
    };

    return (
      <div>
        {Array.from(comments.values()).map((comment) => {
          const hasReplies = Array.from(comments.values()).some(
            (c) => c.parentId === comment._id
          );
          const isExpanded = expandedIds.has(comment._id);
          const isVisible = getVisibility(comment);

          return (
            <ThreadItem
              key={comment._id}
              data={comment}
              depth={comment.depth}
              hasReplies={hasReplies}
              isExpanded={isExpanded}
              isVisible={isVisible}
              onToggleExpand={() => handleExpand(comment._id, !isExpanded)}
              onReply={onReply}
            />
          );
        })}
      </div>
    );
  }
);

ThreadList.displayName = 'ThreadList';

export default ThreadList;
