import type { Place } from "@/lib/types";

function moodEmoji(mood: Place["mood"]) {
  switch (mood) {
    case "amazing":
      return "🤩";
    case "memorable":
      return "✨";
    case "good":
      return "😊";
    default:
      return "📍";
  }
}

export function createPlaceMarkerEl(
  place: Place,
  onClick: () => void,
  selected = false
) {
  const el = document.createElement("div");
  el.className = `place-marker${selected ? " place-marker-selected" : ""}`;
  el.dataset.placeId = place.id;
  el.innerHTML = `<div class="place-marker-inner"><span>${moodEmoji(place.mood)}</span></div>`;
  el.style.cursor = "pointer";
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick();
  });
  return el;
}

export function createPhotoMarkerEl(
  place: Place,
  onClick: () => void,
  selected = false
) {
  const el = document.createElement("div");
  el.className = `photo-marker${selected ? " photo-marker-selected" : ""}`;
  el.dataset.placeId = place.id;
  el.style.cursor = "pointer";

  const frame = document.createElement("div");
  frame.className = "photo-marker-frame";

  const skeleton = document.createElement("div");
  skeleton.className = "photo-marker-skeleton";
  skeleton.setAttribute("aria-hidden", "true");

  const img = document.createElement("img");
  img.className = "photo-marker-img";
  img.alt = place.name;
  img.loading = "lazy";
  img.decoding = "async";

  const fallback = document.createElement("div");
  fallback.className = "photo-marker-fallback";
  fallback.innerHTML = `<span>${moodEmoji(place.mood)}</span>`;
  fallback.hidden = true;

  const markLoaded = () => {
    skeleton.classList.add("photo-marker-skeleton-hidden");
    img.classList.add("photo-marker-img-loaded");
  };

  img.addEventListener("load", markLoaded);
  img.addEventListener("error", () => {
    skeleton.classList.add("photo-marker-skeleton-hidden");
    img.hidden = true;
    fallback.hidden = false;
  });

  if (place.photos?.[0]) {
    img.src = place.photos[0];
    if (img.complete && img.naturalWidth > 0) markLoaded();
  } else {
    skeleton.classList.add("photo-marker-skeleton-hidden");
    img.hidden = true;
    fallback.hidden = false;
  }

  frame.append(skeleton, img, fallback);
  el.append(frame);
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick();
  });
  return el;
}
