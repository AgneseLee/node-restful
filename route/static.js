const fs = require('fs');
const path = require('path');
const zlib = require("zlib");
const url = require('url')


const PUBLIC_PATH = path.resolve(__dirname, '../public');
let MIME = {};
MIME[".gif"] = "image/gif";
MIME[".css"] = "text/css";
MIME[".js"] = "text/js";
MIME[".jpg"] = "image/jpeg";
MIME[".jpeg"] = "image/jpeg";
MIME[".png"] = "image/png";

function get(req, res) {
    const pathName = url.parse(req.url).pathname.replace('/public', '')

    const fileName = path.join(PUBLIC_PATH, '/', pathName)
    if (fs.existsSync(fileName)) {
        let stats = fs.statSync(fileName);
        const extname = path.extname(pathName);
        const baseName = path.basename(pathName)

        let IfModifiedSince = req.headers["if-modified-since"];
        let lastMTime = stats.mtime
        if (IfModifiedSince && lastMTime <= IfModifiedSince) {
            res.writeHead(304, "not Modified")
            return res.end()
        }
        res.writeHead(200, {
            "Content-Type": MIME[extname],
            "Content-Disposition": `attachment; filename = ${baseName}`,
            // 'Content-Length': stats.size,
            'Content-Encoding': "gzip",
            "Last-Modified": lastMTime.toUTCString(),
            "Cache-Control": `max-age=${1 * 60 * 60 * 24 * 30}`//一个月
        });

        const gzip = zlib.createGzip();
        let readStream = fs.createReadStream(fileName);
        readStream.pipe(gzip).pipe(res);

        readStream.on('error', (err) => {
            console.trace();
            console.error('Stack:', err.stack);
            console.error('The error raised was: static file fail! ', err);
        });


    }
}

function isImage(extname) {
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(extname);
}

function isMp3(extname) {
    return extname.indexOf('.mp3') > -1
}

module.exports = {
    get
};