# Kaspian Leser - Norwegian Reading Flashcards

A simple, kid-friendly flashcard application to help 4-year-olds learn to read Norwegian words using spaced repetition.

## Features

- **Simple Interface**: Large, colorful buttons designed for young children
- **Spaced Repetition**: Words marked incorrect appear more frequently
- **Progress Tracking**: Saves progress in browser (localStorage)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **No Database Required**: Pure static files with localStorage
- **Easy to Customize**: Add/edit words in simple text file

## Files

- `index.html` - Main flashcard interface
- `styles.css` - Responsive styling
- `app.js` - jQuery-based logic with spaced repetition
- `words.txt` - Norwegian word list (one word per line)

## How to Use Locally

**Important**: Due to browser security (CORS), you need to run a local web server. Opening `index.html` directly with `file://` won't work in Chrome.

### Option 1: Python (easiest if you have Python installed)

```bash
# Navigate to the project folder
cd /path/to/kaspianleser

# Start server
python3 -m http.server 8000
```

Then open: **http://localhost:8000**

Stop the server with `Ctrl+C`

### Option 2: PHP

```bash
php -S localhost:8000
```

Then open: **http://localhost:8000**

### Option 3: Node.js

```bash
npx http-server
```

### Option 4: VS Code Live Server Extension

1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

### Using the App

1. The app will load words from `words.txt`
2. Click ✓ (Riktig) if your child reads correctly
3. Click ✗ (Feil) if they need more practice
4. Progress saves automatically in the browser

## Deploying to GitHub Pages

### Step 1: Create GitHub Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Norwegian reading flashcards"

# Create repository on GitHub (replace YOUR-USERNAME with your GitHub username)
# Then push to GitHub:
git remote add origin https://github.com/YOUR-USERNAME/kaspianleser.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under "Source", select **main** branch
5. Click **Save**
6. Wait a few minutes for deployment
7. Your site will be live at: `https://YOUR-USERNAME.github.io/kaspianleser/`

### Step 3: Update Words (Optional)

To add or change words:
1. Edit `words.txt` (one word per line)
2. Commit and push changes:
```bash
git add words.txt
git commit -m "Update word list"
git push
```
3. Changes will be live in a few minutes!

## How It Works

### Spaced Repetition Algorithm

- Each word has a **weight** (starts at 1)
- Mark correct (✓): weight decreases by 1 (minimum 1) → word shown less often
- Mark incorrect (✗): weight increases by 2 → word shown more often
- Next word selected using weighted random selection

### Example

If a word has weight 3, it's 3 times more likely to appear than a word with weight 1.

### Progress Storage

- Progress saved in browser's localStorage
- Tracks per-word statistics:
  - Weight (for spaced repetition)
  - Correct count
  - Incorrect count
  - Last seen timestamp
- Session statistics (total correct/incorrect)

## Customization

### Adding More Words

Simply edit `words.txt` and add one word per line:

```
hund
katt
ball
bil
```

### Changing Colors/Styling

Edit `styles.css` to customize colors, fonts, button sizes, etc.

### Adjusting Spaced Repetition

In `app.js`, modify these values:

```javascript
// Correct answer - decrease weight
wordProgress[currentWord].weight = Math.max(1, wordProgress[currentWord].weight - 1);

// Incorrect answer - increase weight
wordProgress[currentWord].weight += 2;
```

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Safari
- Firefox

Requires JavaScript enabled.

## Reset Progress

Click the "Nullstill fremgang" (Reset Progress) button at the bottom to clear all saved data and start fresh.

## Tips for Parents

1. Practice for short sessions (5-10 minutes)
2. Celebrate progress, not perfection
3. Let your child click the buttons themselves
4. Take breaks if they get frustrated
5. Add words they're interested in
6. Review difficult words separately

## License

Free to use and modify for personal use.

## Support

Questions or issues? Edit the code or add more words as needed!
