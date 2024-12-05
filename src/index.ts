import { downloadPath } from "./config";
import { tags } from "./config/array-tags";
import { downloadGifAndSave, getRandomGif } from "./services/giphy";

async function main() {
  const randomTags = tags[Math.floor(Math.random() * tags.length)];
  const randomGif = await getRandomGif(randomTags);
  const titleFix = randomGif.title.split(" GIF")[0];
  const filePath = await downloadGifAndSave(
    randomGif.gif_url,
    titleFix,
    downloadPath
  );
  console.log(randomGif, titleFix);
}

main();
