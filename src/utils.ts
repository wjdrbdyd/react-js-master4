export function makeImagePath(id: string, format?: string) {
  if (id === "") {
    return "";
  }

  console.log(
    `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`
  );
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
