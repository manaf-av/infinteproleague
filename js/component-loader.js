(function () {
  const loaderScript = document.currentScript;
  const siteRoot = new URL("../", loaderScript.src);

  function resolveComponentUrls(fragment) {
    fragment.querySelectorAll("[src], [href]").forEach(element => {
      for (const attribute of ["src", "href"]) {
        const value = element.getAttribute(attribute);
        if (value && !/^(?:[a-z]+:|\/\/|#)/i.test(value)) {
          element.setAttribute(attribute, new URL(value, siteRoot).href);
        }
      }
    });
  }

  async function loadComponent(placeholder) {
    const componentName = placeholder.dataset.component;
    const response = await fetch(new URL(`components/${componentName}.html`, siteRoot), { cache: "no-cache" });
    if (!response.ok) throw new Error(`Unable to load ${componentName} component (${response.status})`);
    const template = document.createElement("template");
    template.innerHTML = await response.text();
    resolveComponentUrls(template.content);

    const component = componentName === "navbar"
      ? template.content.querySelector("nav.side-nav")
      : componentName === "footer"
        ? template.content.querySelector("footer.site-footer")
        : template.content.firstElementChild;
    if (!component) throw new Error(`Unable to find root element for ${componentName} component`);
    if (componentName === "navbar") {
      const pagePath = decodeURIComponent(window.location.pathname)
        .slice(siteRoot.pathname.length)
        .replace(/\/+$/, "");
      const currentPage = pagePath === "" || pagePath === "index.html"
        ? "home"
        : pagePath.startsWith("news/")
          ? "news"
          : pagePath.startsWith("verify/")
            ? "verify"
            : pagePath.replace(/\.html$/, "").replace(/\/index$/, "").replace(/\//g, "-");

      component.querySelectorAll("[data-nav-key]").forEach(link => {
        if (link.dataset.navKey === currentPage) link.setAttribute("aria-current", "page");
      });
    }

    placeholder.replaceWith(component);
    if (componentName === "footer") {
      const copyrightYear = component.querySelector("#copyright-year");
      copyrightYear.textContent = new Date().getFullYear();
    }
  }

  document.querySelectorAll("[data-component]").forEach(placeholder => {
    loadComponent(placeholder).catch(error => {
      console.error(`Component loader: ${error.message}`);
    });
  });
})();
