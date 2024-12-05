import { VersionedTransaction, Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import axios from "axios";
import * as fs from "fs/promises"; // Import fs/promises for file handling

const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
const web3Connection = new Connection(RPC_ENDPOINT, "confirmed");

interface TokenMetadata {
  name: string;
  symbol: string;
  uri: string;
}

export async function createTokenTransaction(
  walletPrivateKey: string,
  imagePath: string,
  tokenName: string,
  tokenSymbol: string,
  tokenDescription: string,
  twitterUrl: string,
  telegramUrl: string,
  websiteUrl: string
): Promise<void> {
  try {
    const signerKeyPair = Keypair.fromSecretKey(bs58.decode(walletPrivateKey));

    // Generate a random keypair for token
    const mintKeypair = Keypair.generate();

    // Define token metadata
    const formData = new FormData();
    const imageFile = await fs.readFile(imagePath); // Read the image file
    formData.append("file", new Blob([imageFile])); // Convert to Blob and append
    formData.append("name", tokenName);
    formData.append("symbol", tokenSymbol);
    formData.append("description", tokenDescription);
    formData.append("twitter", twitterUrl);
    formData.append("telegram", telegramUrl);
    formData.append("website", websiteUrl);
    formData.append("showName", "true");

    // Create IPFS metadata storage
    const metadataResponse = await axios.post(
      "https://pump.fun/api/ipfs",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const metadataResponseJSON = metadataResponse.data;

    // Get the create transaction
    const response = await axios.post(
      `https://pumpportal.fun/api/trade-local`,
      {
        publicKey: signerKeyPair.publicKey.toBase58(), // Fix: Use the correct public key
        action: "create",
        tokenMetadata: {
          name: metadataResponseJSON.metadata.name,
          symbol: metadataResponseJSON.metadata.symbol,
          uri: metadataResponseJSON.metadataUri,
        },
        mint: mintKeypair.publicKey.toBase58(),
        denominatedInSol: "true",
        amount: 0.01, // dev buy of 1 SOL
        slippage: 10,
        priorityFee: 0.0005,
        pool: "pump",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      // successfully generated transaction
      const data = response.data;
      const tx = VersionedTransaction.deserialize(new Uint8Array(data));
      tx.sign([mintKeypair, signerKeyPair]);
      const signature = await web3Connection.sendTransaction(tx);
      console.log("Transaction: https://solscan.io/tx/" + signature);
    } else {
      console.error("Failed to generate transaction:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
