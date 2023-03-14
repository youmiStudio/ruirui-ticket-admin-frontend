import type { Config } from '../types';

const config = ref<Config>({
  iconSize: {
    width: 50,
    height: 50
  }
})

export default unref(config);
