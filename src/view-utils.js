
export function addHtmlOption(select, text, document, value) {
  const opt = document.createElement('option');
  opt.textContent = text;
  if (value !== undefined) opt.value = value;
  select.appendChild(opt);
}

export function addOptionFromTemplate(element, template, text, textClass, value, valueAttribute) {
  const clone = template.content.cloneNode(true);
  clone.querySelector('.' + textClass).textContent = text;
  if (value !== undefined) {
    clone.querySelector('input').setAttribute(valueAttribute, value);
  }
  element.appendChild(clone);
}

export function removeNodesFromElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export default { addHtmlOption, addOptionFromTemplate, removeNodesFromElement };