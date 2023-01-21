import { ElLoading } from 'element-plus';

let loading: { close: () => void };

function openLoading(text: string) {
  loading = ElLoading.service({
    text,
    lock: true,
    body: true,
    background: 'rgba(0, 0, 0, 0.7)'
  });
}
function closeLoading() {
  loading.close();
}
export { openLoading, closeLoading };
