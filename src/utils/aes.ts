import CryptoJS from 'crypto-js';
const key = 'XgsZyVG62B90cWsI';

const encrypt = (text: string) => {
  const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
    // iv: CryptoJS.enc.Utf8.parse(key),
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString();
};

const decrypt = (text: string) => {
  let decrypted = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export default {
  encrypt,
  decrypt
}