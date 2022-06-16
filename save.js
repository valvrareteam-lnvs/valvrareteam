var xml2js = require('xml2js');
var parser = new xml2js.Parser(/* options */);

const getXml = async (url) => {
  const xml = (await parser.parseStringPromise(await (await fetch(url)).text())).urlset.url
  return xml.map((x) => x.loc[0])
}

const getUrls = async () => {
  const sitemaps = [
    'http://valvrareteam.com/post-sitemap.xml',
    'http://valvrareteam.com/story-sitemap1.xml',
    'http://valvrareteam.com/story-sitemap2.xml',
    'http://valvrareteam.com/story-sitemap3.xml',
    'http://valvrareteam.com/story-sitemap4.xml',
    'http://valvrareteam.com/story-sitemap5.xml',
    'http://valvrareteam.com/story-sitemap6.xml'
  ]
  let urls = []
  for (const sitemap of sitemaps) {
    urls = [...urls, ...await getXml(sitemap)]
  }
  return urls
}

const write = require('write-file-utf8')

const start = async () => {
  const urls = await getUrls()
  await write('docs/index.html', JSON.stringify(await getXml('http://valvrareteam.com/post-sitemap.xml')))
  for (const url of urls) {
    const path = url.replace('http://valvrareteam.com/', '')
    if(!path) continue
    const html = await (await fetch(url)).text()
    await write('docs/' + path, html)
  }
}

start()