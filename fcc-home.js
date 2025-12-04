/* ================================
   SECTION NAVIGATION 
================================= */

const navButtons = document.querySelectorAll(".nav-btn, .shortcut-btn");
const sections = document.querySelectorAll(".fcc-section");

function showSection(sectionId) {
    //remove active + animation classes from all sections
    sections.forEach((sec) => {
        sec.classList.remove("active-section", "animate-in");
    });

    //find the section we want to show
    const target = document.getElementById(sectionId);
    if (target) {
        //show it
        target.classList.add("active-section");

        // trigger animation on next frame
        requestAnimationFrame(() => {
            target.classList.add("animate-in");
        });
    }
}

navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        showSection(target);
    });
});

/* =====================================
    THEME SWITCHER
===================================== */

const themeSelect = document.getElementById("theme-select");

// Load saved theme on start
const savedTheme = localStorage.getItem("fcc-theme") || "chill";
applyTheme(savedTheme);
themeSelect.value = savedTheme;

themeSelect.addEventListener("change", () => {
    const value = themeSelect.value;
    applyTheme(value);
    localStorage.setItem("fcc-theme", value);
});

function applyTheme(theme) {
    document.body.classList.remove("theme-chill", "theme-edgy", "theme-luxe");
    document.body.classList.add(`theme-${theme}`);
}
/* ================================
   DASHBOARD — OOTD SUGGESTION
================================= */

const ootdForm = document.getElementById("ootd-form");
const ootdResult = document.getElementById("ootd-result");

ootdForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const mood = document.getElementById("mood-select").value;
  const weather = document.getElementById("weather-select").value;

  if (!mood || !weather) {
    ootdResult.textContent = "Please choose a mood and weather.";
    return;
  }

  let suggestion = "";

  if (mood === "chill") {
    suggestion = weather === "warm"
      ? "Chill + warm: crop top, bike shorts, sneakers."
      : "Chill + cool: hoodie, cargo joggers, white sneakers.";
  } else if (mood === "dressy") {
    suggestion = weather === "warm"
      ? "Dressy + warm: satin cami, flowy skirt, low heels."
      : "Dressy + cool: fitted turtleneck, midi skirt, boots.";
  } else if (mood === "edgy") {
    suggestion = "Edgy: leather jacket, black jeans, chunky boots.";
  } else if (mood === "work") {
    suggestion = "Work: blazer, tailored pants, comfortable loafers.";
  }

  ootdResult.textContent = suggestion;
});

/* ================================
   OUTFIT PLANNER
================================= */

let outfits = JSON.parse(localStorage.getItem("fcc-outfits") || "[]");

function saveOutfits() {
    localStorage.setItem("fcc-outfits", JSON.stringify(outfits));
}

const outfitForm = document.getElementById("outfit-form");
const outfitList = document.getElementById("outfit-list");
const filterOccasionSelect = document.getElementById("filter-occasion");
const filterSeasonSelect = document.getElementById("filter-season");

let currentOccasionFilter = "all";
let currentSeasonFilter = "all";

outfitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newOutfit = {
    name: document.getElementById("outfit-name").value.trim(),
    top: document.getElementById("top-input").value.trim(),
    bottom: document.getElementById("bottom-input").value.trim(),
    dress: document.getElementById("dress-input").value.trim(),
    shoes: document.getElementById("shoes-input").value.trim(),
    accessories: document.getElementById("accessories-input").value.trim(),
    occasion: document.getElementById("occasion-select").value,
    season: document.getElementById("season-select").value,
    imageUrl: document.getElementById("image-url").value.trim(),
  };

  if (!newOutfit.name) {
    alert("Please give your outfit a name.");
    return;
  }

  outfits.push(newOutfit);
  saveOutfits();
  renderOutfits();
  outfitForm.reset();
});

filterOccasionSelect.addEventListener("change", () => {
  currentOccasionFilter = filterOccasionSelect.value;
  renderOutfits();
});

filterSeasonSelect.addEventListener("change", () => {
  currentSeasonFilter = filterSeasonSelect.value;
  renderOutfits();
});

function renderOutfits() {
  outfitList.innerHTML = "";

  const filtered = outfits.filter((o) => {
    const occasionMatch =
      currentOccasionFilter === "all" || o.occasion === currentOccasionFilter;
    const seasonMatch =
      currentSeasonFilter === "all" || o.season === currentSeasonFilter;
    return occasionMatch && seasonMatch;
  });

  if (filtered.length === 0) {
    outfitList.innerHTML = "<p>No outfits yet. Add one above!</p>";
    return;
  }

  filtered.forEach((o, index) => {
    const card = document.createElement("div");
    card.classList.add("outfit-card");

    card.innerHTML = `
  ${o.imageUrl ? `<div class="outfit-img-wrap"><img src="${o.imageUrl}" alt="${o.name}" /></div>` : ""}
  <h4>${o.name}</h4>
  <p><strong>Top:</strong> ${o.top || "—"}</p>
  <p><strong>Bottom:</strong> ${o.bottom || "—"}</p>
  ${o.dress ? `<p><strong>Dress:</strong> ${o.dress}</p>` : ""}
  <p><strong>Shoes:</strong> ${o.shoes || "—"}</p>
  <p><strong>Accessories:</strong> ${o.accessories || "—"}</p>
  <p><strong>Occasion:</strong> ${o.occasion || "—"}</p>
  <p><strong>Season:</strong> ${o.season || "—"}</p>
  <button data-index="${index}" class="delete-outfit">Delete</button>
`;

    outfitList.appendChild(card);
  });

  document.querySelectorAll(".delete-outfit").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.index);
      outfits.splice(i, 1);
      saveOutfits();
      renderOutfits();
    });
  });
}

renderOutfits();

/* ================================
   EVENT STYLIST (simple suggestions)
================================= */

const eventForm = document.getElementById("event-form");
const eventSuggestions = document.getElementById("event-outfit-suggestions");

eventForm.addEventListener("submit", (e) => {
  e.preventDefault();

  eventSuggestions.innerHTML = "";

  const name = document.getElementById("event-name").value.trim();
  const date = document.getElementById("event-date").value;
  const vibe = document.getElementById("event-vibe").value;

  if (!vibe) {
    eventSuggestions.innerHTML = "<p>Please choose a vibe.</p>";
    return;
  }

  const title = document.createElement("h4");
  title.textContent = name || "Event Outfit Ideas";
  eventSuggestions.appendChild(title);

  const suggestion = document.createElement("p");
  suggestion.innerHTML = getEventSuggestionText(vibe);
  eventSuggestions.appendChild(suggestion);
});

function getEventSuggestionText(vibe) {
  if (vibe === "chill") {
    return "Chill vibe: soft tee, relaxed jeans or leggings, comfy sneakers, and a light layer.";
  }
  if (vibe === "dressy") {
    return "Dressy vibe: midi dress or blouse + skirt, delicate jewelry, and low heels or heeled boots.";
  }
  if (vibe === "edgy") {
    return "Edgy vibe: leather or faux leather jacket, black jeans, statement boots, layered necklaces.";
  }
  if (vibe === "professional") {
    return "Professional vibe: blazer, tailored pants or pencil skirt, simple top, closed-toe shoes.";
  }
  return "Pick a vibe to get ideas.";
}

/* ================================
   TRIP PLANNER
================================= */

const tripForm = document.getElementById("trip-form");
const packingList = document.getElementById("packing-list");

tripForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const days = Number(document.getElementById("trip-days").value);
  const destination = document.getElementById("trip-destination").value.trim();
  const vibe = document.getElementById("trip-vibe").value;

  packingList.innerHTML = "";

  if (!days) {
    packingList.innerHTML = "<li>Enter number of days.</li>";
    return;
  }

  const items = [
    `Tops: ${days}`,
    `Bottoms: ${Math.ceil(days / 2)}`,
    `Dresses: ${Math.floor(days / 3)}`,
    `Shoes: 2 pairs`,
    `PJs: 1`,
    `Jacket/Cardigan: 1`,
  ];

  const header = document.createElement("li");
  header.textContent = destination
    ? `Trip to ${destination} (${days} days, vibe: ${vibe || "mixed"})`
    : `${days}-day trip packing list`;
  header.style.fontWeight = "600";
  packingList.appendChild(header);

  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    packingList.appendChild(li);
  });
});

/* ================================
   WISHLIST & BUDGET
================================= */

let wishlist = JSON.parse(localStorage.getItem("fcc-wishlist") || "[]");

function saveWishlist() {
    localStorage.setItem("fcc-wishlist", JSON.stringify(wishlist));
}

const wishlistForm = document.getElementById("wishlist-form");
const wishlistItems = document.getElementById("wishlist-items");
const totalSpan = document.getElementById("wishlist-total");
const highTotalSpan = document.getElementById("wishlist-high-total");

wishlistForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const item = {
    name: document.getElementById("item-name").value.trim(),
    store: document.getElementById("item-store").value.trim(),
    price: Number(document.getElementById("item-price").value),
    priority: document.getElementById("item-priority").value,
  };

  if (!item.name || !item.price || !item.priority) {
    alert("Please fill in name, price, and priority.");
    return;
  }

  wishlist.push(item);
  saveWishlist();
  renderWishlist();
  wishlistForm.reset();
});

function renderWishlist() {
  wishlistItems.innerHTML = "";

  if (wishlist.length === 0) {
    wishlistItems.innerHTML = "<p>No items in your wishlist yet.</p>";
  } else {
    wishlist.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("wishlist-card");

      card.innerHTML = `
        <h4>${item.name}</h4>
        <p>${item.store || "Store: —"}</p>
        <p>$${item.price.toFixed(2)}</p>
        <p>Priority: ${item.priority}</p>
      `;

      wishlistItems.appendChild(card);
    });
  }

  const total = wishlist.reduce((sum, i) => sum + i.price, 0);
  const highTotal = wishlist
    .filter(i => i.priority === "high")
    .reduce((sum, i) => sum + i.price, 0);

  totalSpan.textContent = total.toFixed(2);
  highTotalSpan.textContent = highTotal.toFixed(2);
}

renderWishlist();

/* ================================
   STYLE NOTES
================================= */

let notes = JSON.parse(localStorage.getItem("fcc-notes") || "[]");

function saveNotes() {
    localStorage.setItem("fcc-notes", JSON.stringify(notes));
}

const noteForm = document.getElementById("note-form");
const notesList = document.getElementById("notes-list");

noteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = document.getElementById("note-text").value.trim();
  if (!text) return;

  notes.push(text);
  saveNotes();
  renderNotes();
  noteForm.reset();
});

function renderNotes() {
  notesList.innerHTML = "";

  if (notes.length === 0) {
    notesList.innerHTML = "<li>No notes yet. Add your first closet rule above.</li>";
    return;
  }

  notes.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n;
    notesList.appendChild(li);
  });
}

renderNotes();
