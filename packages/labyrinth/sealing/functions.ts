export const hashedNodeIdFromEncryptedNodeId = async (
  proof: string,
  encrypted: string,
): Promise<string> => await decrypt(await proofAsSecretKey(proof), encrypted);

export const encryptedNodeIdByProof = async (
  proof: string,
  nodeId: string,
): Promise<string> =>
  await encrypt(await proofAsSecretKey(proof), await hashedNodeId(nodeId));

export const proofAsToken = async (proof: string): Promise<string> =>
  await hash(await proofAsSecretKey(proof));

const proofAsSecretKey = async (proof: string): Promise<string> =>
  await hash(proof);

export const hashedNodeId = async (nodeId: string): Promise<string> =>
  await hash(nodeId);

const hash = async (
  input: string,
  salt: string = "betarixm",
): Promise<string> => {
  const utf8 = new TextEncoder().encode(input + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

const encrypt = async (keyString: string, data: string) => {
  const encodedData = new TextEncoder().encode(data);

  const { key, iv } = await getKeyAndIvFromKeyString(keyString);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData,
  );

  return arrayBufferToHex(encrypted);
};

export const decrypt = async (
  keyString: string,
  encryptedDataInHex: string,
) => {
  const { key, iv } = await getKeyAndIvFromKeyString(keyString);

  const encryptedArrayBuffer = hexToArrayBuffer(encryptedDataInHex);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedArrayBuffer,
  );

  return new TextDecoder().decode(decrypted);
};

const getKeyAndIvFromKeyString = async (keyString: string) => {
  const buffer = stringToArrayBuffer(keyString);
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  const key = await crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
  return {
    key,
    iv: hash.slice(0, 12),
  };
};

const hexToArrayBuffer = (hex: string): ArrayBuffer => {
  const matched = hex.match(/.{1,2}/g);

  if (!matched) {
    throw new Error("Invalid hex string");
  }

  const byteArray = new Uint8Array(matched.map((byte) => parseInt(byte, 16)));

  return byteArray.buffer as ArrayBuffer;
};

const arrayBufferToHex = (buffer: ArrayBuffer) => {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const stringToArrayBuffer = (str: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};
