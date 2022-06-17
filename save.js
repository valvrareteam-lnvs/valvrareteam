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
const read = require('read-file')

const start = async () => {
  const urls = await getUrls()
  const blacks = [
    'http://valvrareteam.com/',
    'http://valvrareteam.com/cap-nhat-cac-light-novel.html',
    'http://valvrareteam.com/danh-sach-light-novel-thang-8-cua-mf-bunko-j.html',
    'http://valvrareteam.com/danh-sach-light-novel-thang-8-cua-fujimi-fantasia-bunko.html',
    'http://valvrareteam.com/ung-dung-mobile.html',
    'http://valvrareteam.com/anh-minh-hoa-sword-art-online-16.html'
  ]
  await write('docs/index.html', JSON.stringify((await getXml('http://valvrareteam.com/post-sitemap.xml')).filter(u => !blacks.includes(u))))
  const length = urls.length
  for (let i = 0; i < length; i++) {
    const url = urls[i];
    const path = url.replace('http://valvrareteam.com/', '')
    if(!path || path === 'story' ) continue
    let fPath = 'docs/' + path;
    if(fPath.includes('docs/story')) fPath = fPath + '.html'
    try {
      await read.sync(fPath)
    } catch (e) {
      const html = await (await fetch(url)).text()
      await write(fPath, html)
      console.log(i, length, url)
    }

  }
}

start()