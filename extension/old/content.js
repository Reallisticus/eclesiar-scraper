// Check if the page is valid (not 404)
if (
  document.title.includes('404') ||
  document.querySelector('body').textContent.includes('Page not found')
) {
  // If 404, send a stop message
  chrome.runtime.sendMessage({ action: 'stop' });
} else {
  const data = {};
  const url = window.location.href;

  if (url.includes('/business/')) {
    // Business Name
    const businessNameElement = document.querySelector(
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.user-profile.mt-1 > div > div > div.profile-container.mt-2 > div.row.main-info.mt-2 > div.col-12.col-md-8.text-center > div > div > div.d-flex.flex-column > div:nth-child(1) > p'
    );
    data.businessName = businessNameElement
      ? businessNameElement.textContent.trim()
      : '';

    // Quality (Number of <img> tags in a div)
    const qualityDiv = document.querySelector(
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.user-profile.mt-1 > div > div > div.profile-container.mt-2 > div.row.main-info.mt-2 > div.col-12.col-md-4 > div > div.d-inline-flex.align-items-center.fake-input.d-flex.align-items-center > div'
    );
    data.quality = qualityDiv ? qualityDiv.querySelectorAll('img').length : 0;

    // Type
    const typeElement = document.querySelector(
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.user-profile.mt-1 > div > div > div.profile-container.mt-2 > div.row.main-info.mt-2 > div.col-12.col-md-4 > div > div:nth-child(2) > span'
    );
    data.type = typeElement ? typeElement.textContent.trim() : '';

    // Region (Text and Image)
    const regionElement = document.querySelector(
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.user-profile.mt-1 > div > div > div.profile-container.mt-2 > div.row.main-info.mt-2 > div.col-12.col-md-4 > div > div:nth-child(3) > span > a'
    );
    data.regionText = regionElement ? regionElement.textContent.trim() : '';
    data.regionImage = regionElement
      ? regionElement.querySelector('img').src
      : '';

    // Current Employees (List of names from <a> tags inside <tr> elements)
    const employeeRows = document.querySelectorAll(
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.user-profile.mt-1 > div > div > div.row.statistics-info.mt-5.pb-4 > div:nth-child(2) > div > div > table > tbody > tr'
    );

    data.employees = [];
    employeeRows.forEach((row) => {
      const employeeNameElement = row.querySelector('td > a');
      if (employeeNameElement) {
        const employeeName = employeeNameElement.textContent.trim();
        data.employees.push(employeeName); // Add employee name to the array
      }
    });

    // Send the data to the background script or directly to a server
    chrome.runtime.sendMessage({ action: 'saveBusinessData', data });

    // Move to the next business
    chrome.runtime.sendMessage({ action: 'nextBusiness' });
  } else if (url.includes('/region/') && url.includes('/details')) {
    // Scrape region data
    const regionNameElement = document.querySelector(
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.mt-1 > div > div.col-12.pb-3.map-full-page > div:nth-child(2) > div.col-12.col-md-4.mb-4.d-flex > p > span'
    );
    data.regionName = regionNameElement
      ? regionNameElement.textContent.trim()
      : '';

    const countryNameElement = document.querySelector(
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.mt-1 > div > div.col-12.pb-3.map-full-page > div:nth-child(2) > div:nth-child(3) > p > span > span'
    );
    data.countryName = countryNameElement
      ? countryNameElement.textContent.trim()
      : '';

    const resourceImageElement = document.querySelector(
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.mt-1 > div > div.col-12.pb-3.map-full-page > div:nth-child(2) > div.row.pl-3.pr-3.mb-4 > div:nth-child(2) > div > div > div.c-tooltip > img'
    );
    const resourceAmountElement = document.querySelector(
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.mt-1 > div > div.col-12.pb-3.map-full-page > div:nth-child(2) > div.row.pl-3.pr-3.mb-4 > div:nth-child(2) > div > div > div.item-amount.text-center'
    );

    data.resourceType = resourceImageElement
      ? `${resourceImageElement.src} ${
          resourceAmountElement ? resourceAmountElement.textContent.trim() : ''
        }`
      : '';

    const pollutionElement = document.querySelector(
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.page-info.mt-1 > div > div.col-12.pb-3.map-full-page > div:nth-child(2) > div.row.pl-3.pr-3.mb-4 > div:nth-child(3) > p:nth-child(2) > span'
    );
    data.pollution = pollutionElement
      ? pollutionElement.textContent.trim()
      : '';

    chrome.runtime.sendMessage({ action: 'saveRegionData', data });
    chrome.runtime.sendMessage({ action: 'nextRegion' });
  }
  data.url = url;
}
