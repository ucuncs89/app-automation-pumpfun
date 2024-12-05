import axios from "axios";
import * as fs from "fs";
import * as path from "path";

const GIPHY_API_KEY = "kC0kZcGTTNZITKMQPLaxGwHeGpwYMn4S";
const GIPHY_API_URL = "http://api.giphy.com/v1/gifs/random";

export async function getRandomGif(tag: string): Promise<any> {
  try {
    const response = await axios.get(GIPHY_API_URL, {
      params: {
        api_key: GIPHY_API_KEY,
        tag: tag,
      },
    });

    if (response.status === 200) {
      const gifUrl = response.data.data.images.original.url;
      return { gif_url: gifUrl, tag: tag, title: response.data.data.title };
    } else {
      throw new Error(`Failed to fetch GIF: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching GIF:", error);
    throw error;
  }
}

// // Example usage
// getRandomGif("Po Kung Fu Panda")
//   .then((gifUrl) => console.log("Random GIF URL:", gifUrl))
//   .catch((error) => console.error("Error:", error));

export async function downloadGifAndSave(
  url: string,
  name: string,
  savePath: string
): Promise<string> {
  try {
    const response = await axios.get(url, { responseType: "stream" });
    const filePath = path.resolve(savePath, `${name}.gif`);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(filePath));
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading GIF:", error);
    throw error;
  }
}

export async function getRandomGifFromArray(tags: string[]): Promise<string> {
  const randomTag = tags[Math.floor(Math.random() * tags.length)];
  return getRandomGif(randomTag);
}
