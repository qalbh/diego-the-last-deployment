// Character photos. Paths are relative to index.html.
// Edit or add images in assets/photos/.
const PHOTOS={
 "diego": "assets/photos/diego.jpg",
 "haris": "assets/photos/haris.jpg",
 "eren": "assets/photos/eren.jpg",
 "jake": "assets/photos/jake.jpg",
 "sush": "assets/photos/sush.jpg",
 "zoofi": "assets/photos/zoofi.jpg",
 "arqam": "assets/photos/arqam.jpg",
 "ali": "assets/photos/ali.jpg",
 "zack": "assets/photos/zack.jpg"
};
const faces={};Object.entries(PHOTOS).forEach(([k,src])=>{let im=new Image();im.src=src;faces[k]=im});
