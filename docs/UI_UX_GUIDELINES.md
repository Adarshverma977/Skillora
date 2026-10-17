# Skillora — UI/UX Guidelines

## 1. Design Vision

Skillora will provide a premium, modern, student-friendly learning journal experience.

The interface must feel clean, focused, intuitive, and professional. Students should be able to record learning activities, understand their progress, and navigate the application without unnecessary complexity.

**Design priorities:**
- Clarity over decoration.
- Consistency across all pages.
- Mobile-first responsiveness.
- Accessible interactions.
- Clear feedback for every important action.
- Consistent spacing, typography, and component behavior.

## 2. Typography

**Primary font:** Poppins

Poppins must be used consistently throughout the application.

Recommended typography hierarchy:

| Element | Recommended Weight |
|---|---|
| Main page headings | 600–700 |
| Section headings | 600 |
| Card headings | 500–600 |
| Body text | 400 |
| Labels | 500 |
| Buttons | 500–600 |
| Supporting text | 400 |

Typography must remain readable on mobile and desktop. Font sizes and line heights should be consistent rather than chosen independently for every component.

The font will be loaded efficiently, with suitable fallback fonts configured.

## 3. Visual Design

The application should use a restrained, cohesive design system.

### Color Palette

The initial palette is a proposal and will be refined during frontend implementation.

| Token | Initial Value | Purpose |
|---|---|---|
| Primary | `#5B5BD6` | Primary actions and selected states |
| Primary Hover | `#4949B5` | Hover and active interactions |
| Background | `#F7F8FC` | Main application background |
| Surface | `#FFFFFF` | Cards, forms, and panels |
| Text Primary | `#202033` | Main content |
| Text Secondary | `#6B7280` | Supporting content |
| Border | `#E5E7EB` | Dividers and component outlines |
| Success | `#16845B` | Successful actions |
| Warning | `#B7791F` | Warnings |
| Error | `#D14343` | Validation and error states |

Colors must provide sufficient contrast and must not be used as the only way to communicate status.

### Surfaces and Shadows

- Prefer clean surfaces and subtle borders.
- Use consistent corner radii.
- Apply shadows only when they improve hierarchy.
- Avoid excessive gradients, unnecessary glass effects, and distracting animations.
- Maintain consistent card padding and alignment.

## 4. Layout and Spacing

- Use a consistent spacing scale.
- Keep page content aligned to a shared layout grid.
- Use readable content widths for forms and journal details.
- Maintain clear separation between page sections.
- Prevent horizontal overflow on small screens.
- Use consistent card and form spacing.
- Ensure dashboards remain understandable when screen space is limited.

## 5. Responsive Design

The application must be designed mobile-first and tested across mobile, tablet, and desktop layouts.

### Mobile

- Use a compact, touch-friendly navigation pattern.
- Stack dashboard cards when necessary.
- Ensure forms fit the available viewport.
- Keep primary actions easy to reach.
- Avoid tables or charts that overflow horizontally.

### Tablet

- Adapt card grids and navigation to available space.
- Maintain comfortable content widths.
- Preserve visual hierarchy.

### Desktop

- Use a consistent application shell and content container.
- Display dashboard cards in balanced grids.
- Use available space without stretching text excessively.
- Keep navigation and primary actions predictable.

Breakpoints will be finalized during implementation and verified through browser testing.

## 6. Application Layout

The authenticated application should have a consistent layout across its main pages.

Expected areas:

- Navigation or sidebar.
- Page heading and contextual actions.
- Main content area.
- Consistent notification and feedback placement.
- Responsive account/profile controls.

Public authentication pages may use a separate layout where appropriate.

## 7. Dashboard Design

The dashboard should help students understand their learning activity at a glance.

Expected components:

- Total entries card.
- Total study time card.
- Weekly learning summary.
- Recently added topics.
- Productivity overview.

Dashboard cards must display meaningful labels and correctly formatted values. Charts or progress indicators should have clear explanations and useful empty states.

Do not show fabricated statistics as real user data.

## 8. Learning Journal Interface

The journal interface must support efficient entry management.

Expected components:

- Learning entry list or card layout.
- Topic title and learning date.
- Study duration and difficulty indicator.
- Search input.
- Date and difficulty filters.
- Create and edit forms.
- Entry detail view.
- Clear edit and delete actions.

Destructive actions should provide appropriate confirmation or recovery behavior where practical.

## 9. Forms and Validation

- Every input must have a clear label.
- Required fields must be identified appropriately.
- Validation messages must explain how to fix the problem.
- Invalid fields should be visually distinguishable.
- Inputs must preserve understandable focus states.
- Submit buttons must show an appropriate loading state.
- Prevent duplicate submissions while a request is in progress.
- Display server-side validation errors clearly.
- Use consistent validation behavior across forms.

## 10. Loading, Empty, Success, and Error States

Every data-driven page must handle the following states where relevant:

### Loading

Use skeletons or lightweight loading indicators that fit the component.

### Empty

Explain that no entries or results are available and provide a relevant next action.

### Success

Show concise confirmation for important completed actions.

### Error

Display an understandable message and, where appropriate, a retry action.

Avoid blank screens, unexplained failures, and infinite loading indicators.

## 11. Toast Notifications

Toast notifications will provide concise feedback for important operations.

Examples:

- Entry created successfully.
- Entry updated successfully.
- Entry deleted successfully.
- Profile updated successfully.
- Unable to save changes.

Do not use repeated notifications for the same error. Important validation feedback should also appear near the relevant form fields.

## 12. Accessibility

- Use semantic HTML elements.
- Provide labels for form controls.
- Support keyboard navigation.
- Make focus states visible.
- Use sufficient text and control contrast.
- Provide accessible names for icon-only buttons.
- Do not rely on color alone to communicate meaning.
- Respect reduced-motion preferences.
- Use appropriate alternative text for meaningful images.

## 13. Interaction and Animation

Interactions should feel responsive and predictable.

- Use subtle hover, focus, and pressed states.
- Keep animation durations short and purposeful.
- Avoid distracting movement.
- Provide visible feedback for disabled and loading controls.
- Ensure animation does not block important actions.
- Respect reduced-motion preferences.

## 14. UI Quality Assurance

Before marking a page complete:

- Review it at mobile, tablet, and desktop sizes.
- Verify alignment, spacing, typography, and overflow.
- Test forms, validation, and keyboard interactions.
- Verify loading, empty, success, and error states.
- Check navigation and action consistency.
- Confirm that real API data is displayed correctly.
- Fix visible layout defects before moving on.

## 15. Design System Status

**Status:** Initial UI/UX standards documented.

The palette, spacing scale, breakpoints, reusable components, and final visual details will be implemented and refined during frontend development.