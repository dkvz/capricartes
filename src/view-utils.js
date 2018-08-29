
export function addHtmlOption(select, text, document, value) {
  const opt = document.createElement('option');
  opt.innerText = text;
  if (value !== undefined) opt.value = value;
  select.appendChild(opt);
}

export default { addHtmlOption };