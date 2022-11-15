import { upload } from '~/utils/http/axios';

enum URL {
  upload = '/common/upload'
}

export const uploadFile = async (body: any) =>
  upload({ url: URL.upload, data: body });
