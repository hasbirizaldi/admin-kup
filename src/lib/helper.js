export  const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";

  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getEmbedUrl = (url) => {
  if (!url) return "";
  const match = url.match(/v=([^&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

export const parseDate = (date) => {
  if (!date) return null;
  const [y, m, d] = date.slice(0, 10).split("-");
  return new Date(y, m - 1, d); // LOCAL DATE
};

export const isSunday = (date) => {
  if (!date) return false;

  const [y, m, d] = date.slice(0, 10).split("-");
  const localDate = new Date(y, m - 1, d); // LOCAL DATE

  return localDate.getDay() === 0;
};


