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

        // Update display
        $('#word').text(currentWord);
        wordProgress[currentWord].lastSeen = new Date().toISOString();

        // Add animation
        $('#word').parent().removeClass('fadeIn');
        setTimeout(() => {
            $('#word').parent().addClass('fadeIn');
        }, 10);
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
