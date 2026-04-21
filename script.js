function sendAnalyticsEvent(eventName, params = {}) {
  if (typeof gtag === "function") {
    gtag("event", eventName, params);
  }
}

// ======================
// CONTACT NAVIGATION
// ======================

function goToContact() {
  sendAnalyticsEvent("contact_click", {
    event_category: "Navigation",
    event_label: "goToContact Function",
    value: 1
  });

  setTimeout(() => {
    window.location.href = "contact.html";
  }, 200);
}

// ======================
// SCROLL ANIMATION SYSTEM
// ======================

const elements = document.querySelectorAll(".fade-in");

if (elements.length > 0 && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, {
    threshold: 0.1
  });

  elements.forEach((el) => observer.observe(el));
} else {
  elements.forEach((el) => el.classList.add("show"));
}

// ======================
// MOBILE MENU TOGGLE
// ======================

const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-menu");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("show");
  });
}

// ======================
// TOAST
// ======================

function showToast(message, type = "success") {
  let toast = document.getElementById("custom-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "custom-toast";
    toast.style.position = "fixed";
    toast.style.top = "24px";
    toast.style.right = "24px";
    toast.style.zIndex = "9999";
    toast.style.padding = "14px 18px";
    toast.style.borderRadius = "14px";
    toast.style.color = "#fff";
    toast.style.fontWeight = "600";
    toast.style.boxShadow = "0 12px 30px rgba(0,0,0,0.18)";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    toast.style.transition = "all 0.3s ease";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.background = type === "error" ? "#c0392b" : "#2A9D8F";
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
  }, 2500);
}

// ======================
// CONTACT FORM
// ======================

const contactForm = document.getElementById("contactForm");
const formError = document.getElementById("formError");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");

let isSubmitting = false;

function showFormError(message) {
  if (formError) {
    formError.textContent = message;
    formError.style.display = "block";
  }
  showToast(message.replace("❌ ", ""), "error");
}

function clearFormError() {
  if (formError) {
    formError.textContent = "";
    formError.style.display = "none";
  }
}

function normalizeText(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

if (contactForm && submitBtn && btnText) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (isSubmitting) return;

    clearFormError();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");
    const honeypotInput = document.getElementById("website");

    const name = normalizeText(nameInput?.value || "");
    const email = normalizeText(emailInput?.value || "");
    const subject = normalizeText(subjectInput?.value || "");
    const message = normalizeText(messageInput?.value || "");
    const honeypotValue = honeypotInput?.value?.trim() || "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (honeypotValue !== "") {
      showFormError("❌ Submission blocked.");
      return;
    }

    if (!name || !email || !subject || !message) {
      showFormError("❌ Please fill in all fields before submitting.");
      return;
    }

    if (name.length < 2) {
      showFormError("❌ Please enter a valid name.");
      return;
    }

    if (!emailPattern.test(email)) {
      showFormError("❌ Please enter a valid email address.");
      return;
    }

    if (message.length < 10) {
      showFormError("❌ Please enter a fuller message.");
      return;
    }

    if (message.length > 2000) {
      showFormError("❌ Your message is too long.");
      return;
    }

    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    btnText.textContent = "Sending...";

    try {
      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        sendAnalyticsEvent("generate_lead", {
          event_category: "Contact Form",
          event_label: "Form Submission",
          value: 1
        });

        submitBtn.classList.remove("loading");
        submitBtn.classList.add("success");
        btnText.textContent = "Message Sent ✓";
        showToast("Message sent successfully");

        setTimeout(() => {
          window.location.href = "thank-you.html";
        }, 1200);

        return;
      }

      const data = await response.json().catch(() => null);

      if (data && data.errors && data.errors.length > 0) {
        showFormError(`❌ ${data.errors[0].message}`);
      } else {
        showFormError("❌ Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showFormError("❌ Network error. Please check your connection and try again.");
    }

    isSubmitting = false;
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
    btnText.textContent = "Send Message";
  });
}

// ======================
// WHATSAPP CLICK TRACKING
// ======================

function trackWhatsAppClick(event, location) {
  if (!event || !event.currentTarget) return true;

  event.preventDefault();

  const url = event.currentTarget.href;

  sendAnalyticsEvent("whatsapp_click", {
    event_category: "Contact",
    event_label: location,
    value: 1
  });

  setTimeout(() => {
    window.open(url, "_blank");
  }, 300);

  return false;
}

// ======================
// CONTACT CLICK TRACKING
// ======================

function trackContactClick(event, location) {
  if (!event || !event.currentTarget) return true;

  event.preventDefault();

  const url = event.currentTarget.href;

  sendAnalyticsEvent("contact_click", {
    event_category: "Navigation",
    event_label: location,
    value: 1
  });

  setTimeout(() => {
    window.location.href = url;
  }, 200);

  return false;
}

// ======================
// GENERAL BUTTON CLICK TRACKING
// ======================

const trackedButtons = document.querySelectorAll("[data-track]");

trackedButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const eventName = button.getAttribute("data-event") || "button_click";
    const label = button.getAttribute("data-track") || button.textContent.trim();
    const category = button.getAttribute("data-category") || "Engagement";

    sendAnalyticsEvent(eventName, {
      event_category: category,
      event_label: label,
      value: 1
    });
  });
});

// ======================
// COPY BUTTONS
// ======================

const copyButtons = document.querySelectorAll(".copy-btn");

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const textToCopy = button.getAttribute("data-copy");
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      const originalText = button.textContent;
      button.textContent = "Copied!";
      showToast("Copied to clipboard");

      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
    } catch (error) {
      showToast("Copy failed", "error");
    }
  });
});

// ======================
// SCROLL DEPTH TRACKING
// ======================

let scrollMarksFired = {
  25: false,
  50: false,
  75: false,
  100: false
};

function getScrollPercent() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (docHeight <= 0) return 100;

  return Math.round((scrollTop / docHeight) * 100);
}

function fireScrollEvent(mark) {
  sendAnalyticsEvent("scroll", {
    event_category: "Engagement",
    event_label: `${mark}% Scroll`,
    value: mark
  });
}

window.addEventListener("scroll", () => {
  const scrollPercent = getScrollPercent();

  [25, 50, 75, 100].forEach((mark) => {
    if (scrollPercent >= mark && !scrollMarksFired[mark]) {
      scrollMarksFired[mark] = true;
      fireScrollEvent(mark);
    }
  });
});

// ======================
// PAGE VIEW CONTEXT EVENT
// ======================

window.addEventListener("load", () => {
  const pageName = document.title || window.location.pathname;

  sendAnalyticsEvent("page_engagement_ready", {
    event_category: "Page",
    event_label: pageName
  });
});
function sendAnalyticsEvent(eventName, params = {}) {
  if (typeof gtag === "function") {
    gtag("event", eventName, params);
  }
}

// ======================
// CONTACT NAVIGATION
// ======================

function goToContact() {
  sendAnalyticsEvent("contact_click", {
    event_category: "Navigation",
    event_label: "goToContact Function",
    value: 1
  });

  setTimeout(() => {
    window.location.href = "contact.html";
  }, 200);
}

// ======================
// SCROLL ANIMATION SYSTEM
// ======================

const elements = document.querySelectorAll(".fade-in");

if (elements.length > 0 && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, {
    threshold: 0.1
  });

  elements.forEach((el) => observer.observe(el));
} else {
  elements.forEach((el) => el.classList.add("show"));
}

// ======================
// MOBILE MENU TOGGLE
// ======================

const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-menu");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("show");
  });
}

// ======================
// TOAST
// ======================

function showToast(message, type = "success") {
  let toast = document.getElementById("custom-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "custom-toast";
    toast.style.position = "fixed";
    toast.style.top = "24px";
    toast.style.right = "24px";
    toast.style.zIndex = "9999";
    toast.style.padding = "14px 18px";
    toast.style.borderRadius = "14px";
    toast.style.color = "#fff";
    toast.style.fontWeight = "600";
    toast.style.boxShadow = "0 12px 30px rgba(0,0,0,0.18)";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    toast.style.transition = "all 0.3s ease";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.background = type === "error" ? "#c0392b" : "#2A9D8F";
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
  }, 2500);
}

// ======================
// CONTACT FORM
// ======================

const contactForm = document.getElementById("contactForm");
const formError = document.getElementById("formError");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");

let isSubmitting = false;

function showFormError(message) {
  if (formError) {
    formError.textContent = message;
    formError.style.display = "block";
  }
  showToast(message.replace("❌ ", ""), "error");
}

function clearFormError() {
  if (formError) {
    formError.textContent = "";
    formError.style.display = "none";
  }
}

function normalizeText(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

if (contactForm && submitBtn && btnText) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (isSubmitting) return;

    clearFormError();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");
    const honeypotInput = document.getElementById("website");

    const name = normalizeText(nameInput?.value || "");
    const email = normalizeText(emailInput?.value || "");
    const subject = normalizeText(subjectInput?.value || "");
    const message = normalizeText(messageInput?.value || "");
    const honeypotValue = honeypotInput?.value?.trim() || "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (honeypotValue !== "") {
      showFormError("❌ Submission blocked.");
      return;
    }

    if (!name || !email || !subject || !message) {
      showFormError("❌ Please fill in all fields before submitting.");
      return;
    }

    if (name.length < 2) {
      showFormError("❌ Please enter a valid name.");
      return;
    }

    if (!emailPattern.test(email)) {
      showFormError("❌ Please enter a valid email address.");
      return;
    }

    if (message.length < 10) {
      showFormError("❌ Please enter a fuller message.");
      return;
    }

    if (message.length > 2000) {
      showFormError("❌ Your message is too long.");
      return;
    }

    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    btnText.textContent = "Sending...";

    try {
      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        sendAnalyticsEvent("generate_lead", {
          event_category: "Contact Form",
          event_label: "Form Submission",
          value: 1
        });

        submitBtn.classList.remove("loading");
        submitBtn.classList.add("success");
        btnText.textContent = "Message Sent ✓";
        showToast("Message sent successfully");

        setTimeout(() => {
          window.location.href = "thank-you.html";
        }, 1200);

        return;
      }

      const data = await response.json().catch(() => null);

      if (data && data.errors && data.errors.length > 0) {
        showFormError(`❌ ${data.errors[0].message}`);
      } else {
        showFormError("❌ Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showFormError("❌ Network error. Please check your connection and try again.");
    }

    isSubmitting = false;
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
    btnText.textContent = "Send Message";
  });
}

// ======================
// WHATSAPP CLICK TRACKING
// ======================

function trackWhatsAppClick(event, location) {
  if (!event || !event.currentTarget) return true;

  event.preventDefault();

  const url = event.currentTarget.href;

  sendAnalyticsEvent("whatsapp_click", {
    event_category: "Contact",
    event_label: location,
    value: 1
  });

  setTimeout(() => {
    window.open(url, "_blank");
  }, 300);

  return false;
}

// ======================
// CONTACT CLICK TRACKING
// ======================

function trackContactClick(event, location) {
  if (!event || !event.currentTarget) return true;

  event.preventDefault();

  const url = event.currentTarget.href;

  sendAnalyticsEvent("contact_click", {
    event_category: "Navigation",
    event_label: location,
    value: 1
  });

  setTimeout(() => {
    window.location.href = url;
  }, 200);

  return false;
}

// ======================
// GENERAL BUTTON CLICK TRACKING
// ======================

const trackedButtons = document.querySelectorAll("[data-track]");

trackedButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const eventName = button.getAttribute("data-event") || "button_click";
    const label = button.getAttribute("data-track") || button.textContent.trim();
    const category = button.getAttribute("data-category") || "Engagement";

    sendAnalyticsEvent(eventName, {
      event_category: category,
      event_label: label,
      value: 1
    });
  });
});

// ======================
// COPY BUTTONS
// ======================

const copyButtons = document.querySelectorAll(".copy-btn");

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const textToCopy = button.getAttribute("data-copy");
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      const originalText = button.textContent;
      button.textContent = "Copied!";
      showToast("Copied to clipboard");

      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
    } catch (error) {
      showToast("Copy failed", "error");
    }
  });
});

// ======================
// SCROLL DEPTH TRACKING
// ======================

let scrollMarksFired = {
  25: false,
  50: false,
  75: false,
  100: false
};

function getScrollPercent() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (docHeight <= 0) return 100;

  return Math.round((scrollTop / docHeight) * 100);
}

function fireScrollEvent(mark) {
  sendAnalyticsEvent("scroll", {
    event_category: "Engagement",
    event_label: `${mark}% Scroll`,
    value: mark
  });
}

window.addEventListener("scroll", () => {
  const scrollPercent = getScrollPercent();

  [25, 50, 75, 100].forEach((mark) => {
    if (scrollPercent >= mark && !scrollMarksFired[mark]) {
      scrollMarksFired[mark] = true;
      fireScrollEvent(mark);
    }
  });
});

// ======================
// PAGE VIEW CONTEXT EVENT
// ======================

window.addEventListener("load", () => {
  const pageName = document.title || window.location.pathname;

  sendAnalyticsEvent("page_engagement_ready", {
    event_category: "Page",
    event_label: pageName
  });
});