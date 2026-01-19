import { forwardRef } from "react";

const INDENTATION = 3;

interface ThreadItemProps {
  data: any;
  depth: number;
  hasReplies: boolean;
  isExpanded: boolean;
  isVisible: boolean;
  onToggleExpand: () => void;
  onReply: (parentId: string) => void;
}

const ThreadItem = forwardRef<HTMLDivElement, ThreadItemProps>(
  (
    { data, depth, hasReplies, isExpanded, isVisible, onToggleExpand, onReply },
    ref
  ) => {
    const getOperationSymbol = (operation: string) => {
      const symbols: Record<string, string> = {
        add: '+',
        subtract: '-',
        multiply: '×',
        divide: '÷',
      };
      return symbols[operation] || '';
    };

    return (
      <div
        ref={ref}
        data-id={data._id}
        className={`flex flex-col w-full p-2 space-y-1 ${
          depth > 0 ? 'border-l border-l-gray-200' : ''
        }`}
        style={{
          marginLeft: `${depth * INDENTATION}rem`,
          display: isVisible ? 'flex' : 'none',
        }}
      >
        <div className="flex items-center">
          <div className="font-semibold text-sm mr-2">
            {data.authorUsername || 'Anonymous'}
          </div>
          <div className="text-xs text-gray-600">
            {new Date(data.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="text-sm ml-2">
          {data.operation && data.value !== undefined ? (
            <span>
              {data.parentResult ? (
                <>
                  {data.parentResult}{' '}
                  <span className="font-semibold">
                    {getOperationSymbol(data.operation)}
                  </span>{' '}
                  <span>{data.value}</span> ={' '}
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

        <div className="flex gap-2 ml-2">
          <button
            className="text-xs text-blue-700 hover:underline"
            onClick={() => onReply(data._id)}
          >
            Reply
          </button>
          {hasReplies && (
            <button
              className="text-xs text-blue-400 hover:underline"
              onClick={onToggleExpand}
            >
              {isExpanded ? 'Hide Replies' : 'Show Replies'}
              <span className="inline-block ml-1">{isExpanded ? '▶' : '▼'}</span>
            </button>
          )}
        </div>
      </div>
    );
  }
);

ThreadItem.displayName = 'ThreadItem';

export default ThreadItem;
