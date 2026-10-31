// "Ready to cook smarter?" banner shared by Home and About.
function renderCta(slot) {
  slot.innerHTML = `
    <section class="cta">
      <svg class="cta-deco cta-deco--fork" viewBox="0 0 200 340" fill="none" aria-hidden="true">
        <path d="M150 20l-40 70a30 30 0 0 0 10 40L20 340h40l90-200a30 30 0 0 0 40-15l20-60" stroke="#cfd9d6" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0 140c40 10 70 40 60 80s-10 70 20 90" stroke="#fe9f6b" stroke-width="16" stroke-linecap="round"/>
      </svg>
      <svg class="cta-deco cta-deco--knife" viewBox="0 0 200 340" fill="none" aria-hidden="true">
        <path d="M200 20C150 60 80 160 10 300l60-20c60-90 110-150 130-170z" fill="#cfd9d6"/>
        <path d="M60 140c30-20 60 0 60 30s20 60 80 50" stroke="#4fb7a1" stroke-width="14" stroke-linecap="round"/>
      </svg>
      <h2>Ready to cook smarter?</h2>
      <p>Hit the button, pick a recipe, and get dinner on the table—fast.</p>
      <a href="recipes.html" class="btn btn-sm">Browse recipes</a>
    </section>`;
}
