const videosContainer = document.getElementById("videos-container");
const subjectFilter = document.getElementById("subject-filter");
const languageFilter = document.getElementById("language-filter");
const difficultyFilter = document.getElementById("difficulty-filter");
const sortFilter = document.getElementById("sort-filter");
const searchBox = document.getElementById("search-box");
const themeToggle = document.getElementById("theme-toggle");
const showSavedButton = document.getElementById("show-saved-btn");
const savedCount = document.getElementById("saved-count");
const clearFiltersButton = document.getElementById("clear-filters-btn");
const resultsCount = document.getElementById("results-count");

const progressLabel = document.getElementById("progress-label");
const progressPercent = document.getElementById("progress-percent");
const progressFill = document.getElementById("progress-fill");

const detailsModal = document.getElementById("details-modal");
const closeModalButton = document.getElementById("close-modal-btn");
const modalThumbnail = document.getElementById("modal-thumbnail");
const modalTitle = document.getElementById("modal-title");
const modalSubject = document.getElementById("modal-subject");
const modalTopic = document.getElementById("modal-topic");
const modalChannel = document.getElementById("modal-channel");
const modalDuration = document.getElementById("modal-duration");
const modalLanguage = document.getElementById("modal-language");
const modalDifficulty = document.getElementById("modal-difficulty");
const modalWatchButton = document.getElementById("modal-watch-btn");

const welcomeUser = document.getElementById("welcome-user");
const logoutButton = document.getElementById("logout-btn");

let favoriteVideos = [];
let completedVideos = [];
let showingSavedVideos = false;

try {
  const savedFavorites = localStorage.getItem("favoriteVideos");
  favoriteVideos = savedFavorites ? JSON.parse(savedFavorites) : [];

  const savedCompletedVideos = localStorage.getItem("completedVideos");
  completedVideos = savedCompletedVideos
    ? JSON.parse(savedCompletedVideos)
    : [];
} catch (error) {
  favoriteVideos = [];
  completedVideos = [];
}

function setupUserHeader() {
  const userName = localStorage.getItem("userName");

  if (welcomeUser) {
    welcomeUser.textContent = userName
      ? `Welcome, ${userName}`
      : "Welcome, Student";
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userName");

      window.location.href = "login.html";
    });
  }
}

function saveFavorites() {
  localStorage.setItem("favoriteVideos", JSON.stringify(favoriteVideos));
}

function saveCompletedVideos() {
  localStorage.setItem("completedVideos", JSON.stringify(completedVideos));
}

function isFavorite(videoId) {
  return favoriteVideos.includes(videoId);
}

function isCompleted(videoId) {
  return completedVideos.includes(videoId);
}

function updateSavedCount() {
  if (savedCount) {
    savedCount.textContent = `♥ Saved: ${favoriteVideos.length}`;
  }
}

function updateProgress() {
  const totalVideos = videos.length;
  const completedTotal = completedVideos.length;

  const percent =
    totalVideos === 0
      ? 0
      : Math.round((completedTotal / totalVideos) * 100);

  if (progressLabel) {
    progressLabel.textContent =
      `Learning Progress: ${completedTotal} / ${totalVideos} videos completed`;
  }

  if (progressPercent) {
    progressPercent.textContent = `${percent}%`;
  }

  if (progressFill) {
    progressFill.style.width = `${percent}%`;
  }
}

function updateResultsCount(total) {
  if (resultsCount) {
    const word = total === 1 ? "video" : "videos";
    resultsCount.textContent = `Showing ${total} ${word}`;
  }
}

function getDurationInSeconds(duration) {
  const parts = duration.split(":").map(Number);

  return parts[0] * 60 + parts[1];
}

function getDifficultyRank(difficulty) {
  const ranks = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3
  };

  return ranks[difficulty] || 4;
}

function sortVideos(videoList) {
  const selectedSort = sortFilter ? sortFilter.value : "default";
  const sortedVideos = [...videoList];

  if (selectedSort === "shortest") {
    sortedVideos.sort(function (a, b) {
      return getDurationInSeconds(a.duration) - getDurationInSeconds(b.duration);
    });
  }

  if (selectedSort === "longest") {
    sortedVideos.sort(function (a, b) {
      return getDurationInSeconds(b.duration) - getDurationInSeconds(a.duration);
    });
  }

  if (selectedSort === "beginner") {
    sortedVideos.sort(function (a, b) {
      return getDifficultyRank(a.difficulty) - getDifficultyRank(b.difficulty);
    });
  }

  if (selectedSort === "advanced") {
    sortedVideos.sort(function (a, b) {
      return getDifficultyRank(b.difficulty) - getDifficultyRank(a.difficulty);
    });
  }

  return sortedVideos;
}

function displayVideos(videoList) {
  if (!videosContainer) {
    return;
  }

  videosContainer.innerHTML = "";

  if (videoList.length === 0) {
    videosContainer.innerHTML = "<p>No videos found.</p>";
    return;
  }

  videoList.forEach(function (video) {
    const card = document.createElement("div");
    card.className = "video-card";

    const savedClass = isFavorite(video.id) ? "saved" : "";
    const savedText = isFavorite(video.id) ? "♥ Saved" : "♡ Save Video";

    const completedClass = isCompleted(video.id) ? "completed" : "";
    const completedText = isCompleted(video.id)
      ? "✓ Completed"
      : "✓ Mark Complete";

    card.innerHTML = `
      <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">

      <h3>${video.title}</h3>

      <p><strong>Channel:</strong> ${video.channel}</p>

      <p><strong>Duration:</strong> ${video.duration}</p>

      <p><strong>Language:</strong> ${video.language}</p>

      <p><strong>Difficulty:</strong> ${video.difficulty}</p>

      <a href="${video.youtubeUrl}" target="_blank" class="watch-btn">
        Watch Video
      </a>

      <button type="button" class="favorite-btn ${savedClass}" data-video-id="${video.id}">
        ${savedText}
      </button>

      <button type="button" class="details-btn" data-video-id="${video.id}">
        View Details
      </button>

      <button type="button" class="completed-btn ${completedClass}" data-video-id="${video.id}">
        ${completedText}
      </button>
    `;

    videosContainer.appendChild(card);
  });
}

function getFilteredVideos() {
  const selectedSubject = subjectFilter ? subjectFilter.value : "all";
  const selectedLanguage = languageFilter ? languageFilter.value : "all";
  const selectedDifficulty = difficultyFilter
    ? difficultyFilter.value
    : "all";

  const searchText = searchBox ? searchBox.value.toLowerCase() : "";

  const filteredVideos = videos.filter(function (video) {
    const subjectMatch =
      selectedSubject === "all" || video.subject === selectedSubject;

    const languageMatch =
      selectedLanguage === "all" || video.language === selectedLanguage;

    const difficultyMatch =
      selectedDifficulty === "all" || video.difficulty === selectedDifficulty;

    const searchMatch =
      video.topic.toLowerCase().includes(searchText) ||
      video.title.toLowerCase().includes(searchText);

    const savedMatch =
      !showingSavedVideos || isFavorite(video.id);

    return (
      subjectMatch &&
      languageMatch &&
      difficultyMatch &&
      searchMatch &&
      savedMatch
    );
  });

  return sortVideos(filteredVideos);
}

function filterVideos() {
  const filteredVideos = getFilteredVideos();

  displayVideos(filteredVideos);
  updateSavedCount();
  updateResultsCount(filteredVideos.length);
  updateProgress();
}

function openDetailsModal(video) {
  if (!detailsModal) {
    return;
  }

  modalThumbnail.src = video.thumbnail;
  modalThumbnail.alt = video.title;
  modalTitle.textContent = video.title;
  modalSubject.textContent = video.subject;
  modalTopic.textContent = video.topic;
  modalChannel.textContent = video.channel;
  modalDuration.textContent = video.duration;
  modalLanguage.textContent = video.language;
  modalDifficulty.textContent = video.difficulty;
  modalWatchButton.href = video.youtubeUrl;

  detailsModal.classList.add("show");
}

function closeDetailsModal() {
  if (detailsModal) {
    detailsModal.classList.remove("show");
  }
}

if (videosContainer) {
  videosContainer.addEventListener("click", function (event) {
    const favoriteButton = event.target.closest(".favorite-btn");
    const detailsButton = event.target.closest(".details-btn");
    const completedButton = event.target.closest(".completed-btn");

    if (favoriteButton) {
      const videoId = Number(favoriteButton.dataset.videoId);

      if (isFavorite(videoId)) {
        favoriteVideos = favoriteVideos.filter(function (id) {
          return id !== videoId;
        });
      } else {
        favoriteVideos.push(videoId);
      }

      saveFavorites();
      filterVideos();
      return;
    }

    if (completedButton) {
      const videoId = Number(completedButton.dataset.videoId);

      if (isCompleted(videoId)) {
        completedVideos = completedVideos.filter(function (id) {
          return id !== videoId;
        });
      } else {
        completedVideos.push(videoId);
      }

      saveCompletedVideos();
      filterVideos();
      return;
    }

    if (detailsButton) {
      const videoId = Number(detailsButton.dataset.videoId);

      const selectedVideo = videos.find(function (video) {
        return video.id === videoId;
      });

      if (selectedVideo) {
        openDetailsModal(selectedVideo);
      }
    }
  });
}

if (subjectFilter) {
  subjectFilter.addEventListener("change", filterVideos);
}

if (languageFilter) {
  languageFilter.addEventListener("change", filterVideos);
}

if (difficultyFilter) {
  difficultyFilter.addEventListener("change", filterVideos);
}

if (sortFilter) {
  sortFilter.addEventListener("change", filterVideos);
}

if (searchBox) {
  searchBox.addEventListener("input", filterVideos);
}

if (clearFiltersButton) {
  clearFiltersButton.addEventListener("click", function () {
    if (subjectFilter) subjectFilter.value = "all";
    if (languageFilter) languageFilter.value = "all";
    if (difficultyFilter) difficultyFilter.value = "all";
    if (sortFilter) sortFilter.value = "default";
    if (searchBox) searchBox.value = "";

    showingSavedVideos = false;

    if (showSavedButton) {
      showSavedButton.textContent = "♥ Show Saved Videos";
      showSavedButton.classList.remove("active");
    }

    filterVideos();
  });
}

const viewButtons = document.querySelectorAll(".view-btn");

viewButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const subjectName =
      this.parentElement.querySelector("h2").textContent;

    if (subjectFilter) {
      subjectFilter.value = subjectName;
    }

    const videosSection = document.getElementById("videos-section");

    if (videosSection) {
      videosSection.scrollIntoView({
        behavior: "smooth"
      });
    }

    filterVideos();
  });
});

if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      themeToggle.textContent = "☀️ Light Mode";
    } else {
      themeToggle.textContent = "🌙 Dark Mode";
    }
  });
}

if (showSavedButton) {
  showSavedButton.addEventListener("click", function () {
    showingSavedVideos = !showingSavedVideos;

    if (showingSavedVideos) {
      showSavedButton.textContent = "← Show All Videos";
      showSavedButton.classList.add("active");
    } else {
      showSavedButton.textContent = "♥ Show Saved Videos";
      showSavedButton.classList.remove("active");
    }

    filterVideos();

    const videosSection = document.getElementById("videos-section");

    if (videosSection) {
      videosSection.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
}

if (closeModalButton) {
  closeModalButton.addEventListener("click", closeDetailsModal);
}

if (detailsModal) {
  detailsModal.addEventListener("click", function (event) {
    if (event.target === detailsModal) {
      closeDetailsModal();
    }
  });
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeDetailsModal();
  }
});

setupUserHeader();
updateSavedCount();
updateProgress();
filterVideos();
