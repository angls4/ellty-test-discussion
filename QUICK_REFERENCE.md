# API Integration - Quick Reference

## What Was Changed

### Core Files Modified
1. **src/app/page.tsx** - Complete rewrite with API integration
2. **src/app/api/auth/register/route.ts** - Updated to auto-login after registration

### New Components Created
1. **src/components/AuthModals.tsx** - Login/Register modals
2. **src/components/ReplyModal.tsx** - Reply modal with operation selection

## Key Features Implemented

### ✅ API Integration
- Comments fetched from `GET /api/comments`
- Post replies to `POST /api/comments` with auth token
- Delete comments with `DELETE /api/comments?id={id}`
- Auto-refresh after posting replies

### ✅ Authentication
- **Login**: Modal form with username/password
- **Register**: Modal form that auto-logs in user
- **Logout**: Button in header when authenticated
- **Token Storage**: JWT stored in localStorage with fallback handling

### ✅ Comments Management
- **Flat Structure**: Uses PathMap for O(1) lookups
- **Parent-Child Relations**: Maintained via `parentId` field
- **No Nesting**: Comments displayed linearly with indentation
- **Show/Hide Replies**: Collapsible replies using VisibilityMap

### ✅ UI Components
- Reply modal with operation selection (+, -, ×, ÷)
- Result preview before submitting
- Error messages and loading states
- Refresh button and auto-refresh after posting

## Data Structures

### PathMap (Efficient Comment Storage)
```typescript
{
  "comment_id_1": { /* CommentData */ },
  "comment_id_2": { /* CommentData */ },
}
```

### VisibilityMap (Reply Visibility)
```typescript
{
  "comment_id_1": true,   // replies shown
  "comment_id_2": false,  // replies hidden
}
```

## Component Hierarchy

```
Page
├── AuthModals (Login/Register)
│   ├── Login Modal
│   └── Register Modal
├── ReplyModal
│   ├── Operation Selection
│   ├── Value Input
│   └── Result Preview
└── Comment Tree (rendered via renderComment)
    ├── Root Comments
    └── Child Comments (when expanded)
```

## Usage Flow

1. **View Comments**: Auto-fetches from API on page load
2. **Login/Register**: Click buttons, fill form, auto-redirects to dashboard
3. **Reply to Comment**: Click "Reply", modal opens, enter value & operation
4. **Refresh**: Auto after posting, or click Refresh button
5. **Show Replies**: Click "Show Replies (n)" to expand/collapse

## Performance Optimizations

- **PathMap**: O(1) comment lookup by ID
- **VisibilityMap**: Independent of data, allows instant toggle
- **Memoized fetchComments**: Prevents unnecessary refetches
- **Smart Serialization**: Handles both ObjectId formats properly

## Error Handling

- Auth errors: Display in modal
- API errors: Display below refresh button
- Validation: Empty fields, invalid operations
- Network: User-friendly error messages

## Responsive Design

- Full-width on mobile
- Max-width 2xl on desktop
- Modals center on screen
- Touch-friendly buttons
- Clear visual hierarchy with indentation
