const images = require.context('./images', false, /\.(jpg|jpeg|png|webp)$/);

const FolderImage = {};

images.keys().forEach((imageName) => {
  const key = imageName.replace('./', '').replace(/\.(jpg|jpeg|png)$/, '');
  FolderImage[key] = images(imageName);
});

export default FolderImage;
