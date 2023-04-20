import { useUserStore } from '@/store';
import JSEncrypt from 'jsencrypt';

const encryptor = new JSEncrypt();
const publicKey = useUserStore().rasKey;
export const encrypt = (value: any) => {
  encryptor.setPublicKey(publicKey);
  return encryptor.encrypt(value);
};
