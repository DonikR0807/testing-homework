export function removeDuplicates(elements: HTMLElement[]) {
  const prev = new Set<string | undefined>();
  return elements.filter((el) => {
    if (prev.has(el.dataset.testid)) {
      return false;
    }

    prev.add(el.dataset.testid);
    return true;
  });
}
