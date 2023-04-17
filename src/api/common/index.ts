import { upload, del } from '~/utils/http/axios';
import type { R } from '../types';
import { getToken } from '~/utils/auth';
import { useGlobSettings } from '@/hooks/settings/useGlobSettings';

enum URL {
  UPLOAD = '/common/upload',
  DELETE = '/common/file'
}

export const uploadFile = async (body: any) =>
  upload({ url: URL.UPLOAD, data: body });

export const deleteFile = async (fileName: string) => {
  fetch(`${useGlobSettings().apiUrl}/${URL.DELETE}?fileName=${fileName}`, {
    method: 'DELETE',
    keepalive: true,
    headers: {
      'Authorization': getToken()
    }
  });
};
