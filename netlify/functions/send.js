export async function handler(event) {
  const data = JSON.parse(event.body);

  const text = `
💍 Новая анкета

👤 Гость: ${data.fullname}
✅ Присутствие: ${data.attendance}
❤️ Пара: ${data.plusOne}
👶 Дети: ${data.kids}
🍷 Напитки: ${data.drinks}
🎵 Песня: ${data.favoriteSong}
`;

  await fetch("/.netlify/functions/send", {
  method: "POST",
  body: JSON.stringify(data),
});

  return {
    statusCode: 200,
    body: "ok",
  };
}