import chrome from 'chrome-aws-lambda'

export async function getScreenshot(url, type, quality, fullPage, height, width, delay, darkMode) {
  // emoji support
  // await chrome.font('https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf')

  const browser = await chrome.puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
    ignoreHTTPSErrors: true,
  })

  const page = await browser.newPage()
  /*
  * If parameter darkMode isn't defined in URL, it uses default browser setting
  */
  if (darkMode != undefined) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: darkMode ? 'dark' : 'light'}]);
  }
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  const client = await page.target().createCDPSession();
  await client.send('Animation.setPlaybackRate', { playbackRate: 100 })
  await page.goto(url)
  await page.waitFor(delay)
  const file = await page.screenshot({ type, quality, fullPage })
  await browser.close()
  return file
}
