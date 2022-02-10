export function makeImagePath(id: string, format?: string) {
  if (id === "" || id === "undefined") {
    return "";
  }
  console.log(`id:${id} , format:${format}`);
  console.log(
    `https://image.tmdb.org/t/p/${format ? format : "original"}${id}`
  );
  return `https://image.tmdb.org/t/p/${format ? format : "original"}${id}`;
}
