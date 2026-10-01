document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle) toggle.addEventListener("click", () => links.classList.toggle("open"));

  document.querySelectorAll(".nav-links a").forEach(a =>
    a.addEventListener("click", () => links?.classList.remove("open"))
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  const form = document.querySelector("#reviewForm");
  const list = document.querySelector("#reviewsList");
  const toast = document.querySelector("#toast");

  const getReviews = () => JSON.parse(localStorage.getItem("ripe_reviews") || "[]");
  const saveReviews = r => localStorage.setItem("ripe_reviews", JSON.stringify(r));

  function renderReviews() {
    if (!list) return;
    const reviews = getReviews();
    list.innerHTML = reviews.map(r => `
      <article class="review">
        <div class="review-top"><span class="review-name">${escapeHTML(r.name)}</span><span class="stars">★★★★★</span></div>
        <p>${escapeHTML(r.text)}</p>
        <small>${escapeHTML(r.date)}</small>
      </article>`).join("");
  }
  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }
  if (list) renderReviews();

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = form.name.value.trim(), text = form.text.value.trim();
      if (!name || !text) return;
      const reviews = getReviews();
      reviews.unshift({name, text, date:new Date().toLocaleDateString("ru-RU")});
      saveReviews(reviews);
      renderReviews();
      form.reset();
      if (toast) {
        toast.textContent = "Спасибо! Ваш отзыв опубликован.";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2800);
      }
    });
  }
});