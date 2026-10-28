# Skillora — UI/UX Guidelines

## 1. Design Vision

Skillora is a modern, student-friendly learning journal designed to help students record daily learning activities, understand their progress, and maintain consistent study habits.

The interface should feel polished, intuitive, responsive, and professional. Visual styling should support the product's functionality rather than compete with it.

### Design Priorities

- Clarity over decoration.
- Consistency across all pages.
- Responsive layouts for mobile, tablet, and desktop.
- Accessible and predictable interactions.
- Clear feedback for important actions.
- Consistent typography, spacing, and component behavior.
- Reliable presentation of real API data.
- Consistent light and dark theme behavior.

## 2. Typography

**Primary font:** Poppins

Poppins is the preferred application typeface and should be used consistently throughout the interface.

| Element | Recommended Weight |
|---|---|
| Main page headings | 600–700 |
| Section headings | 600 |
| Card headings | 500–600 |
| Body text | 400 |
| Labels | 500 |
| Buttons | 500–600 |
| Supporting text | 400 |

### Typography Principles

- Maintain a clear visual hierarchy.
- Use readable font sizes and line heights.
- Avoid unnecessarily small supporting text.
- Keep typography consistent across similar components.
- Configure appropriate fallback fonts.
- Ensure text remains readable in both themes.

The recommended weights are design guidelines; actual font files and CSS declarations should be checked against the frontend implementation.

## 3. Visual Design System

Skillora should use a cohesive design system for colors, surfaces, typography, borders, spacing, and interactive states.

### 3.1 Proposed Light Theme Palette

The following values are proposed design tokens, not a guarantee of the current CSS configuration.

| Token | Proposed Value | Purpose |
|---|---|---|
| Primary | `#5B5BD6` | Primary actions and selected states |
| Primary Hover | `#4949B5` | Hover and active interactions |
| Background | `#F7F8FC` | Main application background |
| Surface | `#FFFFFF` | Cards, forms, and panels |
| Text Primary | `#202033` | Main content |
| Text Secondary | `#6B7280` | Supporting content |
| Border | `#E5E7EB` | Dividers and component outlines |
| Success | `#16845B` | Successful actions |
| Warning | `#B7791F` | Warning states |
| Error | `#D14343` | Validation and error states |

Final token values should be reconciled with the CSS variables or design tokens actually used by the application.

### 3.2 Dark Theme

The dark theme should provide a complete alternative to the light theme rather than simply applying a dark background.

Guidelines:

- Use appropriately dark backgrounds and distinct surface colors.
- Maintain readable primary and secondary text.
- Keep borders visible without making them distracting.
- Ensure buttons, links, form fields, and selected states remain distinguishable.
- Review charts, badges, notifications, and dialogs in both themes.
- Avoid excessive contrast that causes visual discomfort.
- Ensure error and success states remain understandable.

The final dark-theme color values should be defined in the application's actual design tokens.

### 3.3 Surfaces, Borders, and Shadows

- Prefer clean surfaces and subtle borders.
- Use consistent corner radii.
- Apply shadows only when they improve visual hierarchy.
- Maintain consistent card padding.
- Avoid unnecessary gradients, glass effects, and decorative elements.
- Keep modal, dropdown, and popover layering predictable.
- Ensure interactive surfaces remain visually distinguishable.

## 4. Layout and Spacing

The application should use a consistent spacing scale and shared alignment rules.

- Align page content to a common layout grid.
- Keep forms and journal details within readable widths.
- Maintain clear separation between sections.
- Use consistent card and form spacing.
- Avoid arbitrary spacing differences between similar components.
- Prevent horizontal overflow on small screens.
- Keep dashboard layouts understandable at narrower widths.
- Ensure sticky elements do not obscure important content.

The exact spacing scale, maximum content widths, and layout dimensions should be defined by the existing CSS system.

## 5. Responsive Design

Skillora should support mobile, tablet, and desktop layouts.

### 5.1 Mobile

- Use compact, touch-friendly navigation.
- Hide or simplify nonessential page-heading elements where appropriate.
- Stack dashboard cards when horizontal space is limited.
- Ensure forms fit the viewport.
- Keep primary actions easy to reach.
- Prevent horizontal scrolling.
- Make dialogs and dropdowns usable on smaller screens.
- Preserve readable text sizes and sufficient touch targets.

### 5.2 Tablet

- Adapt card grids and navigation to available space.
- Maintain comfortable content widths.
- Preserve the visual hierarchy.
- Avoid excessive empty space or overcrowded cards.
- Verify forms and tables at intermediate viewport widths.

### 5.3 Desktop

- Use a consistent application shell and content container.
- Display dashboard cards in balanced grids.
- Use available space without stretching text excessively.
- Keep navigation and primary actions predictable.
- Maintain consistent alignment between headings and content.

### Responsive Verification

Review the actual interface at representative mobile, tablet, and desktop viewport sizes. Breakpoints must match the current CSS implementation rather than being assumed from this document.

## 6. Application Layout and Navigation

Authenticated pages should share a consistent application layout.

Expected areas include:

- Sidebar or navigation.
- Responsive navigation controls.
- Page heading and contextual actions.
- Main content area.
- Account and profile controls.
- Consistent notification placement.

Public authentication pages may use a separate layout.

### Navigation Guidelines

- Keep navigation labels clear and predictable.
- Highlight the current page appropriately.
- Ensure all navigation actions work.
- Avoid overflowing page titles or navigation items on mobile.
- Maintain consistent spacing and alignment.
- Preserve usable navigation when the sidebar is collapsed or hidden.
- Verify that responsive changes do not hide essential actions.

## 7. Dashboard Design

The dashboard should help students understand their learning activity at a glance.

Expected information includes:

- Total learning entries.
- Total study duration.
- Weekly learning summary.
- Recently added entries or topics.
- Productivity overview.
- Additional analytics where implemented.

### Dashboard Guidelines

- Give each metric a clear label.
- Format study duration consistently.
- Use charts and progress indicators only when they communicate useful information.
- Provide explanatory labels for charts.
- Show an appropriate empty state when the user has no learning entries.
- Avoid fabricated statistics or misleading visualizations.
- Ensure cards remain readable at narrow viewport widths.
- Verify that displayed metrics correspond to the authenticated user's actual data.

## 8. Learning Journal Interface

The learning-journal interface should make it easy to create, find, review, and manage entries.

Expected interface elements include:

- Learning-entry list or card layout.
- Topic title and relevant date.
- Study duration and difficulty indicator.
- Search input.
- Date and difficulty filters.
- Create and edit forms.
- Entry-detail view.
- Edit and delete actions.

### Interaction Guidelines

- Keep entry information easy to scan.
- Make search and filters straightforward to use.
- Preserve filter state appropriately during navigation where supported.
- Provide clear feedback after create, update, and delete operations.
- Confirm destructive actions or provide recovery behavior where practical.
- Handle empty search results separately from loading and error states.

## 9. Profile and Settings

Profile and settings pages should use the same visual language as the rest of the application.

- Group related fields logically.
- Use clear labels and helper text.
- Make editable fields visually distinguishable.
- Provide feedback after successful updates.
- Display validation errors near the relevant fields.
- Keep password-related operations clear and secure.
- Handle profile-image loading and upload failures gracefully.
- Avoid exposing internal account or authentication fields.

## 10. Authentication Pages

Registration, login, email verification, and password-recovery pages should remain consistent with the application's design system.

- Use clear page titles and concise supporting text.
- Label every form field.
- Provide appropriate password visibility controls where implemented.
- Display field-level validation feedback.
- Show loading states during submissions.
- Prevent unintended duplicate submissions.
- Provide useful error and success feedback.
- Keep the form layout readable on mobile.
- Ensure both light and dark themes remain usable.
- Avoid displaying sensitive technical error details.

## 11. Forms and Validation

- Provide a clear label for every input.
- Identify required fields appropriately.
- Explain how users can correct invalid values.
- Make invalid fields visually distinguishable.
- Preserve visible keyboard focus states.
- Show loading feedback during submissions.
- Prevent duplicate submissions while a request is in progress.
- Display server-side validation errors clearly.
- Use consistent validation behavior across similar forms.
- Ensure error messages do not shift the layout excessively.

## 12. Loading, Empty, Success, and Error States

Data-driven pages should handle the following states where relevant.

### Loading

Use skeletons or lightweight loading indicators appropriate to the component. Avoid unnecessary layout shifts.

### Empty

Explain why no results are displayed and offer a relevant next action when appropriate.

### Success

Provide concise confirmation for important completed actions.

### Error

Display understandable messages and offer a retry action where appropriate.

### Partial or Delayed Data

Keep unrelated parts of the interface usable when possible. Avoid making the entire page appear broken because one optional section fails.

Do not leave users with blank screens, unexplained failures, or infinite loading indicators.

## 13. Toast Notifications

Toast notifications provide concise feedback for important actions.

Examples include:

- Entry created successfully.
- Entry updated successfully.
- Entry deleted successfully.
- Profile updated successfully.
- Unable to save changes.

Guidelines:

- Keep messages concise and understandable.
- Avoid repeated notifications for the same error.
- Use appropriate visual status indicators.
- Do not rely exclusively on toasts for form validation.
- Ensure notifications do not obscure essential controls.
- Verify that notifications remain readable in both themes.

## 14. Accessibility

- Use semantic HTML elements.
- Associate labels with form controls.
- Support keyboard navigation.
- Make focus states visible.
- Provide sufficient text and control contrast.
- Give icon-only buttons accessible names.
- Do not rely on color alone to communicate status.
- Respect reduced-motion preferences.
- Provide appropriate alternative text for meaningful images.
- Maintain understandable heading order.
- Ensure dialogs and dropdowns support keyboard interaction.
- Use accessible feedback for loading and error states where appropriate.

Accessibility should be verified through actual interaction and testing rather than inferred from visual appearance.

## 15. Interaction and Animation

Interactions should feel responsive and predictable.

- Use subtle hover, focus, and pressed states.
- Keep animation durations short and purposeful.
- Avoid distracting movement.
- Provide visible feedback for disabled and loading controls.
- Ensure animation does not block important actions.
- Respect reduced-motion preferences.
- Maintain consistent interaction patterns across similar components.

Animation should support usability rather than delay important tasks.

## 16. UI Quality Assurance

Before marking a page complete:

- Review mobile, tablet, and desktop layouts.
- Verify alignment, spacing, typography, and overflow.
- Test forms and validation.
- Test keyboard navigation and visible focus.
- Verify loading, empty, success, and error states.
- Check navigation and action consistency.
- Confirm that displayed information matches real API data.
- Review both light and dark themes where supported.
- Check long text, missing images, and empty datasets.
- Fix visible layout defects before considering the page complete.

## 17. Design System Maintenance

The UI/UX guidelines should remain aligned with the actual frontend implementation.

When changing the design system:

1. Update the relevant CSS variables or shared styling definitions.
2. Review affected reusable components and pages.
3. Verify both themes.
4. Test responsive layouts.
5. Check accessibility and interaction states.
6. Update this document when established design rules change.

## 18. UI/UX Status

Skillora has an implemented frontend with responsive navigation and theme-related UI behavior.

The final palette, spacing scale, breakpoints, component standards, and accessibility behavior should be confirmed against the current CSS and React implementation.

Design guidelines are not proof that every page meets the requirements. Each page should be reviewed and tested before being marked complete.
