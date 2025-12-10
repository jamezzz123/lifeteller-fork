# Request Lift Flow

This folder contains the multi-step request lift feature (8 steps total).

## Structure

```
app/request-lift/
├── _layout.tsx           # Shared layout with header, progress bar, and context provider
├── context.tsx           # Shared state management across all steps
├── index.tsx             # Step 1: Select contacts
├── step-2.tsx            # Step 2: [Add description]
├── step-3.tsx            # Step 3: [Add description]
├── step-4.tsx            # Step 4: [Add description]
├── step-5.tsx            # Step 5: [Add description]
├── step-6.tsx            # Step 6: [Add description]
├── step-7.tsx            # Step 7: [Add description]
└── step-8.tsx            # Step 8: Review & Submit

components/request-lift/
├── types.ts              # Shared TypeScript types
├── data.ts               # Mock data (contacts list)
├── ContactChip.tsx       # Reusable contact chip component
├── ContactRow.tsx        # Reusable contact row component
└── index.ts              # Barrel export file
```

## How It Works

### Layout (_layout.tsx)
- Wraps all steps with `RequestLiftProvider` for shared state
- Shows header with close button and "Request lift" title
- Displays progress bar that updates based on current step
- Progress calculation: `(currentStep / 8) * 100`

### Context (context.tsx)
- Manages shared state across all steps
- Currently tracks `selectedContacts` from step 1
- Add more state fields as you build out other steps
- Provides `reset()` function to clear all data

### Navigation
- Step 1: `/request-lift` (index.tsx)
- Step 2: `/request-lift/step-2`
- Step 3: `/request-lift/step-3`
- ... and so on

Use `router.push('/request-lift/step-X')` to navigate forward
Use `router.back()` to navigate backward

## Adding New Step Data

When you need to add data for a new step:

1. **Add state to context.tsx:**
```tsx
const [pickupLocation, setPickupLocation] = useState<Location>();
```

2. **Add to context type:**
```tsx
type RequestLiftContextType = {
  pickupLocation?: Location;
  setPickupLocation: (location: Location) => void;
  // ...
};
```

3. **Add to provider value:**
```tsx
<RequestLiftContext.Provider
  value={{
    pickupLocation,
    setPickupLocation,
    // ...
  }}
>
```

4. **Use in your step:**
```tsx
const { pickupLocation, setPickupLocation } = useRequestLift();
```

## Component Organization

Reusable components go in `components/request-lift/`:
- Extract any component used in multiple steps
- Keep step-specific components in the step file
- Export from `index.ts` for clean imports

## Current Status

- ✅ Step 1: Select contacts (fully implemented)
- ⏳ Steps 2-8: Placeholder templates ready for implementation

## Next Steps

1. Define what each step should do
2. Update context with necessary state fields
3. Implement each step's UI and logic
4. Add form validation where needed
5. Connect to API in step 8 (submit)
