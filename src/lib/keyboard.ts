const editableSelector = "input, textarea, select, [contenteditable='true']";

export function isEditableTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(editableSelector));
}
