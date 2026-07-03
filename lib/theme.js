// Warna diambil langsung dari palet logo Flou Project.
export const colors = {
  ink: "#2e2e2e",        // teks utama, charcoal lembut
  paper: "#fbf8f2",      // background krem sangat lembut
  paperRaised: "#ffffff",// permukaan kartu
  coral: "#ed7e60",      // aksen utama — dari logo
  coralDark: "#d4623f",  // hover/active state
  teal: "#91dbc6",       // aksen sekunder — dari logo
  mustard: "#f2c781",    // aksen tersier — dari logo
  sage: "#bfd78b",       // aksen — dari logo
  lavender: "#caabd5",   // aksen pop kecil — dari logo
  line: "#ece5d6",       // garis & border
  textMuted: "#7a7267",  // teks sekunder
  danger: "#c0503a",
  success: "#5b8a52",
  info: "#4a7a8c",
};

export const fonts = {
  // Aloja (referensi pilihan kamu) belum tersedia di Google Fonts & berlisensi
  // tertutup untuk web-embed, jadi dipetakan ke "Caveat Brush" — brush bold
  // yang paling dekat karakternya: tebal, melengkung, playful.
  display: "'Caveat Brush', cursive", // judul besar/hero — energik & santai
  body: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  // Canda Tawa (font logo kamu) juga belum ada di Google Fonts & berbayar
  // untuk lisensi komersial, jadi dipetakan ke "Fuzzy Bubbles" — handwritten
  // bulat yang paling senada dengan wordmark "flou project".
  accent: "'Fuzzy Bubbles', cursive", // label kecil bergaya tulisan tangan, senada wordmark logo
};
