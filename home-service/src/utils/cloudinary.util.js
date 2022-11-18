const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRECT,
});

async function addFile(path) {
    return await cloudinary.uploader.upload(path);
}

async function removeFiles(urls) {
    // [a-zA-Z0-9]*\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$
    // get file name form url
    let fileNames = urls.map(url => {
        let c = url.match(/[a-zA-Z0-9]*\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)[0];
        return c.split(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)/)[0];
    });
    
    return await cloudinary.api.delete_resources(fileNames);
}

module.exports = { addFile, removeFiles };
