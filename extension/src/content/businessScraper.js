import {
  getElementText,
  getElementCount,
  getElementAttribute,
} from './utils.js';

export function scrapeBusinessData() {
  const data = {};

  data.businessName = getElementText(
    'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.user-profile.mt-1 > div > div > div.profile-container.mt-2 > div.row.main-info.mt-2 > div.col-12.col-md-8.text-center > div > div > div.d-flex.flex-column > div:nth-child(1) > p'
  );

  data.quality = getElementCount(
    'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.user-profile.mt-1 > div > div > div.profile-container.mt-2 > div.row.main-info.mt-2 > div.col-12.col-md-4 > div > div.d-inline-flex.align-items-center.fake-input.d-flex.align-items-center > div',
    'img'
  );

  data.type = getElementText(
    'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.user-profile.mt-1 > div > div > div.profile-container.mt-2 > div.row.main-info.mt-2 > div.col-12.col-md-4 > div > div:nth-child(2) > span'
  );

  const regionElement = document.querySelector(
    'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.user-profile.mt-1 > div > div > div.profile-container.mt-2 > div.row.main-info.mt-2 > div.col-12.col-md-4 > div > div:nth-child(3) > span > a'
  );
  data.regionText = regionElement ? regionElement.textContent.trim() : '';
  data.regionImage = regionElement
    ? regionElement.querySelector('img').src
    : '';

  data.employees = Array.from(
    document.querySelectorAll(
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.user-profile.mt-1 > div > div > div.row.statistics-info.mt-5.pb-4 > div:nth-child(2) > div > div > table > tbody > tr'
    )
  )
    .map((row) => {
      const employeeNameElement = row.querySelector('td > a');
      return employeeNameElement
        ? employeeNameElement.textContent.trim()
        : null;
    })
    .filter(Boolean);

  return data;
}
