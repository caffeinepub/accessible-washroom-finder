# Call Reminder

## Current State
No existing application (rebuilding from expired draft).

## Requested Changes (Diff)

### Add
- Log calls as Missed (they called you) or Busy (you called them)
- Track Phone and WhatsApp call types
- Auto 30-minute reminder prompt when logging a busy/no-answer call
- Custom reminder times: 10 min, 30 min, 1 hour, 2 hours
- Browser notifications when a reminder fires: "You missed a call from [Name]. Do you want to call back now?"
- Reminder cards with countdown timers and Call Back Now / Dismiss actions
- Active reminders list showing pending call-backs
- Call log history

### Modify
- N/A (new build)

### Remove
- N/A

## Implementation Plan
1. Backend: store call log entries (name, type, call kind, timestamp) and reminders (callId, reminderTime)
2. Frontend: log call form, active reminders panel with countdown, call history list
3. Browser Notification API for firing reminders
4. Reminder countdown using setInterval in frontend
