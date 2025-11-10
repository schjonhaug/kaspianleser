# Development Notes - Built with Claude Code

This project was developed collaboratively with Claude Code, Anthropic's CLI tool for software development.

## Project Overview

**Goal**: Create a simple, kid-friendly flashcard application to help a 4-year-old learn to read Norwegian words using spaced repetition.

**Target User**: 4-year-old child learning to read Norwegian

**Requirements**:
- Simple, responsive web interface
- Flash cards with Norwegian words
- Spaced repetition algorithm
- No database (localStorage only)
- Static files (deployable to GitHub Pages)
- Load words from text file
- Track progress (correct/incorrect)

## Technology Decisions

### Why Static Site?
- **No backend needed**: GitHub Pages hosting (free, easy deployment)
- **Simplicity**: Just push to GitHub and it's live
- **Offline capable**: Works with local web server
- **No database**: localStorage sufficient for single-user app

### Why jQuery?
- **Explicit requirement**: User specified jQuery for UI
- **Familiarity**: Many developers know jQuery
- **Simplicity**: Easy DOM manipulation for this scale

### Why canvas-confetti?
- **Popular library**: Well-maintained, 3.6k+ stars on GitHub
- **Lightweight**: Small bundle size
- **Kid-friendly**: Fun visual feedback for correct answers
- **CDN available**: No build step needed

## Development Process

### Phase 1: Initial Setup
1. Created basic HTML structure with flashcard interface
2. Designed responsive CSS with kid-friendly colors and large buttons
3. Implemented jQuery-based logic with spaced repetition algorithm
4. Created word list with 90+ Norwegian words
5. Set up localStorage for progress tracking

### Phase 2: Flip Card Animation
**Problem**: User wanted emoji hints to help children recognize words

**Solution**:
- Implemented 3D flip card animation using CSS transforms
- Front: Norwegian word (pink gradient)
- Back: Emoji representation (purple gradient)
- Click card to flip and reveal hint
- Curated word list to only include words with clear emoji representations (65 words)

**Technical Details**:
- CSS `transform-style: preserve-3d` for 3D effect
- `backface-visibility: hidden` to hide back side when not visible
- 0.6s transition for smooth flip animation

### Phase 3: Fade Transition Bug Fix
**Problem**: When card was flipped (showing emoji) and user clicked ✓/✗, the new word's emoji briefly flashed before card flipped back

**Root Cause**: Content was updating while flip animation was visible

**Solution**:
- Replace flip-back animation with fade transition between words
- Fade out card (200ms)
- Update content while invisible
- Temporarily disable flip transition (`transition: none`)
- Unflip card instantly (no visible animation)
- Re-enable flip transition
- Fade in new word

**Result**: Smooth fade between different words, flip only for emoji reveal

### Phase 4: Confetti Celebration
**Requirement**: Add confetti animation when clicking "Riktig" (correct)

**Implementation**:
- Added canvas-confetti library via CDN
- Triggered on correct button click
- 100 particles, 70° spread, from center-bottom
- Colors match app theme (pink, purple, green, gold)

## Key Features Implemented

### Spaced Repetition Algorithm
```javascript
// Each word has a weight (starts at 1)
// Correct: weight decreases by 1 (min 1) → shown less
// Incorrect: weight increases by 2 → shown more
// Weighted random selection for next word
```

### Progress Tracking
- Per-word statistics: weight, correct count, incorrect count, last seen
- Session statistics: total correct/incorrect
- Persisted in localStorage
- Reset button to clear all progress

### Responsive Design
- Mobile-first approach
- Large, touch-friendly buttons
- Scales fonts and emoji sizes on smaller screens
- Works on phone, tablet, desktop

## Challenges & Solutions

### Challenge 1: CORS Error
**Problem**: Opening `index.html` with `file://` protocol blocked loading `words.txt`

**Solution**:
- Documented requirement to run local web server
- Provided 4 options: Python, PHP, Node.js, VS Code Live Server
- Added detailed README instructions

### Challenge 2: Animation Timing
**Problem**: Multiple animations conflicting (flip + fade + content update)

**Solution**:
- Carefully orchestrated animation sequence
- Used setTimeout to coordinate timing
- Temporarily disabled conflicting transitions
- Matched CSS transition durations with JS delays

### Challenge 3: Emoji Selection
**Problem**: Not all Norwegian words have obvious emoji representations

**Solution**:
- Curated word list to 65 words with clear emojis
- Removed abstract concepts (stor/liten, høy/lav, inn/ut)
- Kept concrete nouns, actions, emotions, colors
- Fallback emoji (❓) for unmapped words

## File Structure

```
kaspianleser/
├── index.html          # Main HTML structure
├── styles.css          # Responsive styling with animations
├── app.js              # jQuery logic + spaced repetition
├── words.txt           # 65 Norwegian words (one per line)
├── README.md           # User documentation
└── CLAUDE.md           # This file - development notes
```

## Deployment

1. Initialized git repository
2. Pushed to GitHub (github.com/schjonhaug/kaspianleser)
3. Enabled GitHub Pages (Settings → Pages → main branch)
4. Live at: https://schjonhaug.github.io/kaspianleser/

## Future Enhancement Ideas

- [ ] Audio pronunciation for each word
- [ ] Multiple difficulty levels
- [ ] Category filtering (animals, food, colors, etc.)
- [ ] Progress charts/statistics visualization
- [ ] Export/import progress data
- [ ] Multiple user profiles
- [ ] Dark mode
- [ ] More languages
- [ ] Parent dashboard with insights

## Lessons Learned

1. **Start simple**: Static site with localStorage was perfect for this use case
2. **Animation coordination**: Timing multiple animations requires careful planning
3. **Kid-friendly design**: Large buttons, bright colors, immediate feedback
4. **Progressive enhancement**: Core functionality first, then add delightful features (confetti)
5. **Documentation matters**: Clear README helps users set up local server

## Development Time

Approximately 1-2 hours including:
- Initial implementation
- Flip card animation
- Bug fixes (fade transition)
- Confetti celebration
- Documentation (README + CLAUDE.md)

## Commit History

1. `c4e29fc` - Initial commit
2. `4be11d1` - Add flip card animation with emoji hints
3. `f923a74` - Fix card flip animation when moving to new word
4. `b3a0615` - Add confetti celebration animation for correct answers

---

**Built with**: Claude Code by Anthropic
**Model**: Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
**Date**: November 2025
