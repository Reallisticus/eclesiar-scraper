export function isPageValid() {
  return !(
    document.title.includes('404') ||
    document.querySelector('body').textContent.includes('Page not found')
  );
}

export function getElementText(selector) {
  const element = document.querySelector(selector);
  return element ? element.textContent.trim() : '';
}

export function getElementAttribute(selector, attribute) {
  const element = document.querySelector(selector);
  return element ? element.getAttribute(attribute) : '';
}

export function getElementCount(selector, childSelector) {
  const element = document.querySelector(selector);
  return element ? element.querySelectorAll(childSelector).length : 0;
}
