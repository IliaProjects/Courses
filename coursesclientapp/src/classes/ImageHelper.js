class ImageHelper {
    constructor(base64){
        this.base64 = base64
    }

    resize(maxWidth, maxHeight, callback) {
        const canvas = document.createElement('canvas');
        const img = document.createElement('img');
        img.onload = () => {
            let width = img.width;
            let height = img.height;
            if (width > height){
                if(width > maxWidth){
                    height = Math.round((height *= maxWidth / width))
                    width = maxWidth
                }
            } else {
                if(height > maxHeight) {
                    width = Math.round((width *= maxHeight / height))
                    height = maxHeight;
                }
            }
            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0, width, height)
            var compressedData =  canvas.toDataURL('image/png', 0.7);
            callback(compressedData);
        }
        img.onerror = (err) => {
            console.log(err);
        }
        img.src = this.base64;
    }

    getResizedWithoutPrefix(maxWidth, maxHeight, callback) {
        let result = this.resize(maxWidth, maxHeight, (data) => { 
             callback(this.withoutPrefix(data))})
    }

    getWithPrefix(){
        if(this.base64 != null && !this.base64.includes("base64"))
            return "data:image/png;base64," + this.base64
        else
            return this.base64
    }

    withoutPrefix(base64) {
        return base64.split("base64,")[1]
    }

}
export default ImageHelper