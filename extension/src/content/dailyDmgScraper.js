export function scrapeDailyDamage() {
  const damageData = {
    day: '',
    countries: [],
  };

  // Scrape the day
  const dayElement = document.querySelector(
    'body > div.wrapper > div > section > div > div > div.row.py-2 > div.header-bar.desktop.pl-3 > div > div.d-flex.ml-3.justify-content-around > div:nth-child(3) > span.header-text'
  );
  damageData.day = dayElement ? dayElement.innerText.trim() : '';

  // Scrape the table data
  const tableBody = document.querySelector(
    'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.mt-1 > div.col-12.statistics-content-area > div > div > div.d-flex.flex-wrap.w-100.mt-3 > div > table > tbody'
  );

  if (tableBody) {
    const rows = tableBody.querySelectorAll('tr');
    for (let i = 0; i < Math.min(20, rows.length); i++) {
      const row = rows[i];
      const country = row
        .querySelector('td.overflow-hidden.column-2 > a')
        .innerText.trim();
      const damage = parseInt(
        row
          .querySelector('td.overflow-hidden.column-3')
          .innerText.trim()
          .replace(/,/g, ''),
        10
      );

      damageData.countries.push({ country, damage });
    }
  }

  console.log('Scraped daily damage data:', damageData);
  return damageData;
}
