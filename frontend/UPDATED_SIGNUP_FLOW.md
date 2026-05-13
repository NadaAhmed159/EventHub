# Updated Sign-Up Flow Implementation

## New Flow

```
┌─────────────────────────────────────────────────────────────┐
│  LANDING PAGE (/) or HEADER                                 │
│  - "Create Account" button → /signup                         │
│  - "Sign Up" button (header) → /signup                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  SIGNUP PAGE (/signup)                                       │
│  Form Fields:                                                │
│  - Email Address (required)                                  │
│  - Password (required)                                       │
│  - Role: Participant or Organizer (dropdown)                 │
│  - Button: "Continue to Setup"                               │
│  After Submit ↓                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  MULTI-STEP MODAL POPS UP                                    │
│  Step 1: Accept License Agreement ✓                         │
│  Step 2: Create Username ✓                                  │
│  Step 3: Choose Profile Picture ✓                           │
│  Step 4: Welcome Message ✓                                  │
│  After Completion ↓                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  REDIRECT TO HOME (/)                                        │
│  With Features:                                              │
│  - Profile Picture (circular, 40px) in header               │
│  - Username next to profile pic (Lobster font)               │
│  - Profile Dropdown Menu                                    │
│  - "Sign Up" & "Login" buttons HIDDEN                        │
└─────────────────────────────────────────────────────────────┘
```

## Files Created/Updated

### New Files:
- `src/pages/public/SignUp.jsx` - Sign-up form page

### Updated Files:
- `src/App.jsx` - Added `/signup` route
- `src/pages/public/Landing.jsx` - Changed to link to `/signup` instead of modal
- `src/components/Header.jsx` - Changed Sign Up button to link to `/signup`

## How It Works

### 1. Initial Sign-Up Form (`/signup`)
```jsx
- Email address input
- Password input  
- Role selector (Participant/Organizer)
- "Continue to Setup" button
```

### 2. Multi-Step Modal
After form submission, the modal appears with 4 steps:
1. **License** - Read terms, check checkbox
2. **Username** - Enter display name
3. **Profile Picture** - Upload image
4. **Welcome** - Confirmation screen

### 3. Auto-Login & Redirect
- Completes all steps → Gets logged in
- Profile data stored in AuthContext
- Redirects to `/` (home/landing)
- Home page shows profile with username

## Testing Steps

1. **From Landing Page:**
   - Click "Create Account" button
   - Redirects to `/signup` form page

2. **From Header (after logout):**
   - Click "Sign Up" button
   - Redirects to `/signup` form page

3. **Fill Sign-Up Form:**
   - Enter email: `test@example.com`
   - Enter password: `password123`
   - Select role: `Participant`
   - Click "Continue to Setup"

4. **Complete Multi-Step Modal:**
   - Step 1: Check "I agree to Terms"
   - Step 2: Enter username (e.g., "john_doe")
   - Step 3: Upload profile picture
   - Step 4: Click "Start Using EventsHub"

5. **Logged In Result:**
   - Redirected to home page (`/`)
   - Header shows: profile pic + "john_doe" (Lobster font)
   - "Sign Up" & "Login" buttons disappear
   - Click profile pic → dropdown menu appears
   - Click "Sign Out" → back to showing Login/SignUp buttons

## Key Points

✓ Both "Create Account" and "Sign Up" buttons go to same `/signup` page
✓ Form page separate from modal
✓ Modal appears AFTER form submission  
✓ On completion → auto-login → redirect home
✓ Profile shows up with Lobster font username
✓ Sign-up buttons disappear when logged in
✓ Data resets on page refresh (fake process)

## When APIs Available

Replace in `src/pages/public/SignUp.jsx`:
```js
// Change the form submission to call API
const handleSubmit = async (e) => {
  e.preventDefault();
  // Call: POST /api/auth/register with email/password/role
  // Then show the modal
  setShowModal(true);
};

// In SignUpModal.jsx handleComplete, call:
// POST /api/auth/complete-profile with username/profilePicture
// Get back auth token
// Store in localStorage
// Redirect to home
```
