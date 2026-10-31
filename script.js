const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menú" : "Cerrar menú");
  primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    primaryNav.classList.remove("is-open");
  });
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll(".product-card").forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "todos" && card.dataset.base !== filter);
    });
  });
});

const tabs = [...document.querySelectorAll(".science-tab")];
const panels = [...document.querySelectorAll(".science-panel")];

function activateTab(tab, moveFocus = false) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
  });
  panels.forEach((panel) => {
    const active = panel.id === `panel-${tab.dataset.panel}`;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
  if (moveFocus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      activateTab(tabs[nextIndex], true);
    }
  });
});

const productDetails = {
  hierbabuena: {
    title: "Hierbabuena",
    base: "Maceración · base de alcohol",
    description: "Un perfil herbal y verde inspirado en las hojas frescas de hierbabuena. El alcohol actúa como vehículo para extraer y dispersar parte de las moléculas aromáticas.",
    science: "En plantas de menta pueden encontrarse compuestos como carvona y mentol. La composición del extracto de este proyecto no se analizó, así que no podemos confirmar cuál está presente ni en qué cantidad."
  },
  "coco-alcohol": {
    title: "Coco",
    base: "Maceración · base de alcohol",
    description: "Una interpretación artesanal de las notas suaves y cremosas del coco, extraída con una base alcohólica.",
    science: "El aroma característico del coco se asocia con mezclas de moléculas, incluidas algunas lactonas. El resultado depende del material usado y del proceso; no es una esencia pura."
  },
  "coco-aceite": {
    title: "Coco",
    base: "Maceración · base de aceite",
    description: "La misma familia aromática explorada con un vehículo oleoso. Cambiar de solvente permite comparar cómo cambia el extracto y su liberación del aroma.",
    science: "Los compuestos con distinta afinidad por el agua, el alcohol o los lípidos pueden comportarse de manera diferente. La muestra sirve para explorar esa diferencia, no para medirla."
  },
  naranja: {
    title: "Naranja",
    base: "Maceración · base de alcohol",
    description: "Un perfil cítrico y brillante inspirado en la cáscara fresca de naranja, donde se concentran muchas de sus sustancias volátiles.",
    science: "El limoneno es un terpeno abundante en las cáscaras de cítricos. Puede contribuir a sus notas frescas, aunque no se confirmó ni cuantificó en este extracto artesanal."
  }
};

const productDialog = document.querySelector(".product-dialog");
document.querySelectorAll(".product-open").forEach((button) => {
  button.addEventListener("click", () => {
    const details = productDetails[button.closest(".product-card").dataset.product];
    productDialog.querySelector("#dialog-title").textContent = details.title;
    productDialog.querySelector(".dialog-base").textContent = details.base;
    productDialog.querySelector(".dialog-description").textContent = details.description;
    productDialog.querySelector(".dialog-science p").textContent = details.science;
    productDialog.showModal();
  });
});

productDialog.querySelector(".dialog-close").addEventListener("click", () => productDialog.close());
productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) productDialog.close();
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".section-heading, .product-card, .process-image, .process-copy, .science-panel, .field-image, .field-copy").forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}
