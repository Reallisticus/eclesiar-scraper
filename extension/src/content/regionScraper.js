import { getElementText, getElementAttribute } from './utils.js';

export function scrapeRegionData() {
  const data = {};

  data.regionName = getElementText(
    'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.mt-1 > div > div.col-12.pb-3.map-full-page > div:nth-child(2) > div.col-12.col-md-4.mb-4.d-flex > p > span'
  );

  data.countryName = getElementText(
    'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.mt-1 > div > div.col-12.pb-3.map-full-page > div:nth-child(2) > div:nth-child(3) > p > span > span'
  );

  const resourceImageSrc = getElementAttribute(
    'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.mt-1 > div > div.col-12.pb-3.map-full-page > div:nth-child(2) > div.row.pl-3.pr-3.mb-4 > div:nth-child(2) > div > div > div.c-tooltip > img',
    'src'
  );
  const resourceAmount = getElementText(
    'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.mt-1 > div > div.col-12.pb-3.map-full-page > div:nth-child(2) > div.row.pl-3.pr-3.mb-4 > div:nth-child(2) > div > div > div.item-amount.text-center'
  );

  data.resourceType = resourceImageSrc
    ? `${resourceImageSrc} ${resourceAmount}`
    : '';

  data.pollution = getElementText(
    'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.mt-1 > div > div.col-12.pb-3.map-full-page > div:nth-child(2) > div.row.pl-3.pr-3.mb-4 > div:nth-child(3) > p:nth-child(2) > span'
  );

  return data;
}
