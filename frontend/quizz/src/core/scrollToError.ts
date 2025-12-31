export function scrollToFirstError(errors: Record<string, string>) {
  const firstErrorId = Object.keys(errors)[0];
  if (firstErrorId) {
    const el = document.getElementById(firstErrorId);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}