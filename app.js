$(document).ready(function() {
    // Application state
    let words = [];
    let wordProgress = {};
    let sessionStats = {
        correct: 0,
        incorrect: 0
    };
    let currentWord = null;

    // Local storage keys
    const STORAGE_KEY_PROGRESS = 'flashcard_progress';
    const STORAGE_KEY_STATS = 'flashcard_session_stats';

    // Emoji mapping
    const emojiMap = {
        'mor': '👩',
        'far': '👨',
        'baby': '👶',
        'hund': '🐕',
        'katt': '🐱',
        'mus': '🐭',
        'fugl': '🐦',
        'ku': '🐄',
        'gris': '🐷',
        'hest': '🐴',
        'and': '🦆',
        'sau': '🐑',
        'ball': '⚽',
        'bil': '🚗',
        'tog': '🚂',
        'fly': '✈️',
        'brød': '🍞',
        'melk': '🥛',
        'eple': '🍎',
        'banan': '🍌',
        'ost': '🧀',
        'egg': '🥚',
        'kake': '🎂',
        'øye': '👁️',
        'nese': '👃',
        'munn': '👄',
        'øre': '👂',
        'hånd': '✋',
        'fot': '🦶',
        'rød': '🔴',
        'blå': '🔵',
        'grønn': '🟢',
        'gul': '🟡',
        'rosa': '🩷',
        'hvit': '⚪',
        'svart': '⚫',
        'hus': '🏠',
        'dør': '🚪',
        'seng': '🛏️',
        'bok': '📖',
        'penn': '✏️',
        'kopp': '☕',
        'sko': '👟',
        'bukse': '👖',
        'skjorte': '👕',
        'sokk': '🧦',
        'lue': '🧢',
        'jakke': '🧥',
        'sol': '☀️',
        'måne': '🌙',
        'stjerne': '⭐',
        'regn': '🌧️',
        'snø': '❄️',
        'tre': '🌳',
        'blomst': '🌸',
        'glad': '😊',
        'trist': '😢',
        'ja': '✅',
        'nei': '❌',
        'hei': '👋',
        'takk': '🙏',
        'sove': '😴',
        'spise': '🍴',
        'løpe': '🏃',
        'gå': '🚶'
    };

    // Initialize the application
    init();

    function init() {
        loadWords();
        loadProgress();
        setupEventListeners();
    }

    function setupEventListeners() {
        $('#correct-btn').on('click', handleCorrect);
        $('#incorrect-btn').on('click', handleIncorrect);
        $('#reset-btn').on('click', handleReset);
        $('#flashcard').on('click', toggleFlip);
    }

    // Toggle card flip
    function toggleFlip() {
        $('#flashcard').toggleClass('flipped');
    }

    // Load words from words.txt
    function loadWords() {
        $.ajax({
            url: 'words.txt',
            dataType: 'text',
            success: function(data) {
                // Parse words from file (one per line)
                words = data
                    .split('\n')
                    .map(word => word.trim())
                    .filter(word => word.length > 0);

                if (words.length === 0) {
                    showError();
                    return;
                }

                // Initialize progress for new words
                words.forEach(word => {
                    if (!wordProgress[word]) {
                        wordProgress[word] = {
                            weight: 1,
                            correctCount: 0,
                            incorrectCount: 0,
                            lastSeen: null
                        };
                    }
                });

                hideLoading();
                showFlashcard();
                updateWordCount();
                showNextWord();
            },
            error: function() {
                showError();
            }
        });
    }

    // Load progress from localStorage
    function loadProgress() {
        const savedProgress = localStorage.getItem(STORAGE_KEY_PROGRESS);
        if (savedProgress) {
            try {
                wordProgress = JSON.parse(savedProgress);
            } catch (e) {
                console.error('Failed to parse saved progress:', e);
                wordProgress = {};
            }
        }

        const savedStats = localStorage.getItem(STORAGE_KEY_STATS);
        if (savedStats) {
            try {
                sessionStats = JSON.parse(savedStats);
                updateStats();
            } catch (e) {
                console.error('Failed to parse saved stats:', e);
            }
        }
    }

    // Save progress to localStorage
    function saveProgress() {
        localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(wordProgress));
        localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(sessionStats));
    }

    // Weighted random selection
    function selectNextWord() {
        if (words.length === 0) return null;

        // Create weighted array
        const weightedWords = [];
        words.forEach(word => {
            const weight = wordProgress[word]?.weight || 1;
            // Add word multiple times based on weight
            for (let i = 0; i < weight; i++) {
                weightedWords.push(word);
            }
        });

        // Select random word from weighted array
        const randomIndex = Math.floor(Math.random() * weightedWords.length);
        return weightedWords[randomIndex];
    }

    // Show next word
    function showNextWord() {
        currentWord = selectNextWord();
        if (!currentWord) {
            showError();
            return;
        }

        // Fade out the card
        const $card = $('#flashcard');
        $card.addClass('fade-out');

        // Wait for fade out, then update content and fade in
        setTimeout(() => {
            // Disable flip transition temporarily
            const $inner = $('.flashcard-inner');
            $inner.css('transition', 'none');

            // Reset card to front (unflipped) instantly while invisible
            $card.removeClass('flipped');

            // Update display while card is invisible
            $('#word').text(currentWord);
            $('#emoji').text(emojiMap[currentWord] || '❓');
            wordProgress[currentWord].lastSeen = new Date().toISOString();

            // Re-enable flip transition after a brief moment
            setTimeout(() => {
                $inner.css('transition', '');
            }, 50);

            // Fade back in
            $card.removeClass('fade-out');
        }, 200); // Match the CSS transition duration
    }

    // Handle correct answer
    function handleCorrect() {
        if (!currentWord) return;

        // Update progress
        wordProgress[currentWord].correctCount++;
        wordProgress[currentWord].weight = Math.max(1, wordProgress[currentWord].weight - 1);

        // Update stats
        sessionStats.correct++;
        updateStats();

        // Celebrate with confetti!
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f093fb', '#f5576c', '#667eea', '#764ba2', '#10b981', '#fbbf24']
        });

        // Save and show next word
        saveProgress();
        showNextWord();
    }

    // Handle incorrect answer
    function handleIncorrect() {
        if (!currentWord) return;

        // Update progress
        wordProgress[currentWord].incorrectCount++;
        wordProgress[currentWord].weight += 2;

        // Update stats
        sessionStats.incorrect++;
        updateStats();

        // Save and show next word
        saveProgress();
        showNextWord();
    }

    // Update statistics display
    function updateStats() {
        $('#correct-count').text(sessionStats.correct);
        $('#incorrect-count').text(sessionStats.incorrect);
    }

    // Update word count display
    function updateWordCount() {
        $('#word-count').text(words.length);
    }

    // Reset all progress
    function handleReset() {
        const confirmed = confirm('Er du sikker på at du vil nullstille all fremgang?');
        if (confirmed) {
            // Reset progress
            wordProgress = {};
            words.forEach(word => {
                wordProgress[word] = {
                    weight: 1,
                    correctCount: 0,
                    incorrectCount: 0,
                    lastSeen: null
                };
            });

            // Reset session stats
            sessionStats = {
                correct: 0,
                incorrect: 0
            };

            // Update display
            updateStats();
            saveProgress();
            showNextWord();

            alert('Fremgangen er nullstilt!');
        }
    }

    // UI helper functions
    function hideLoading() {
        $('#loading').addClass('hidden');
    }

    function showFlashcard() {
        $('#flashcard-container').removeClass('hidden');
    }

    function showError() {
        $('#loading').addClass('hidden');
        $('#error').removeClass('hidden');
    }
});
