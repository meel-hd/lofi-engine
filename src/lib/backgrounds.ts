export const defaultBackgrounds = [
  { id: 1, url: "assets/background/bg1.webp" },
  { id: 2, url: "assets/background/bg2.webp" },
  { id: 3, url: "assets/background/bg3.webp" },
  { id: 4, url: "assets/background/bg4.webp" },
  { id: 5, url: "assets/background/bg5.webp" },
  { id: 6, url: "assets/background/bg6.webp" },
  { id: 7, url: "assets/background/bg7.webp" },
  { id: 8, url: "assets/background/bg8.webp" },
  { id: 9, url: "assets/background/bg9.webp" },
  { id: 10, url: "assets/background/bg10.webp" },
  { id: 11, url: "assets/background/bg11.webp" },
] as const;

export function getDefaultBackground(id: number | string) {
  return (
    defaultBackgrounds.find((background) => background.id === Number(id)) ??
    defaultBackgrounds[0]
  );
}
