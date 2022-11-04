const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the board class', () => {
  it('should display the kanban columns vertically when the screen is a maximum width of 400px', async () => {
    const numberFound = await page.$eval('style', (style) => {
      return style.innerHTML.match(/@media.*(.*max-width.*:.*400px.*).*{[\s\S][^}]*\.board.*{[\s\S][^}]*flex-direction.*:.*column.*;/g).length;
    });
    
    expect(numberFound).toBe(1);
  });
});