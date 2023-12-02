const puppeteer = require('puppeteer');

describe('Shopping List App', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.goto('https://butanya.github.io/SL/');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Renders the header correctly', async () => {
    const headerText = await page.$eval('.header h1', (element) => element.textContent);
    expect(headerText).toBe('Shopping List App');
  });

  test('Adds a new item to the list', async () => {
    await page.waitForTimeout(1000);
    await page.click('.btn.btn-primary');
    await page.type('input[type="text"]', 'Test Item');
    await page.click('.btn.btn-primary');

    await page.waitForSelector('ul li');

    const addedItem = await page.$eval('ul li', (li) => li.textContent.trim());
    expect(addedItem).toBe('Test Item');
  });


  test('marks an item as purchased', async () => {
    const itemSelector = 'ul li:first-child';
    const initialText = await page.$eval(itemSelector, (item) => item.textContent);

    await page.click(itemSelector);
    await page.waitForTimeout(500);

    const updatedText = await page.$eval(itemSelector, (item) => item.textContent);
    expect(updatedText).not.toBe(initialText);
  });

  test('erases an item from the list', async () => {
    await page.click('.erase-cross');
    const itemList = await page.$$('ul li');
    expect(itemList.length).toBe(0);
  });

  test('cancels item addition', async () => {
    await page.click('.btn-primary');
    await page.click('.btn-cancel');

    const isAddFormVisible = await page.$('.add-item-form');
    expect(isAddFormVisible).toBe(null);
  });

    test('List is still visible after reloading', async () => {
    await page.click('.btn.btn-primary');
    await page.type('input[type="text"]', 'Test Item');
    await page.click('.btn.btn-primary');

    await page.reload();

    await page.waitForSelector('ul li');

    const addedItem = await page.$eval('ul li', (li) => li.textContent.trim());
    expect(addedItem).toBe('Test Item');
  
    });
  })