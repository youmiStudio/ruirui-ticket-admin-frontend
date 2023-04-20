import {
  h,
  render,
  AppContext,
  ComponentPublicInstance,
  createVNode
} from 'vue';

import Constructor from './index.vue';

import type {
  BoxOptions,
  Action,
  IBox,
  BoxShortcutMethod
} from './types';

const CustomBoxInstance = new Map<
  ComponentPublicInstance<{ doClose: () => void }>,
  {
    resolve: (value: any) => void;
    reject: () => void;
  }
>();

const initInstance = (
  props: any,
  containter: HTMLElement,
  appContext: AppContext | null = null
) => {
  const vnode = createVNode(Constructor, props);
  vnode.appContext = appContext;

  render(vnode, containter);
  document.body.appendChild(containter.firstElementChild!);

  return vnode.component;
};

const genContainer = () => {
  return document.createElement('div');
};

const showBox = (options: any, appContext?: AppContext) => {
  const containter = genContainer();

  options.onVanish = () => {
    render(null, containter);
    CustomBoxInstance.delete(vm);
  };

  options.onAction = (action: Action) => {    
    const currentBox = CustomBoxInstance.get(vm);
    let resolve: Action
    
    resolve = action;

    if (action === 'cancel' || action === 'close') {
      currentBox?.reject();
    } else {
      currentBox?.resolve(resolve);
    }
  };

  const instance = initInstance(options, containter, appContext);

  const vm = instance?.proxy as ComponentPublicInstance<{
    visible: boolean;
    doClose: () => void;
  }>;
  

  for (const prop in options) {
    if (Object.hasOwn(options, prop) && !Object.hasOwn(vm.$props, prop)) {
      vm[prop] = options[prop];
    }
  }

  vm.visible = true;

  return vm;
};

async function CustomBox(
  options?:   BoxOptions,
  appContext?: AppContext | null
): Promise<any>;
function CustomBox(
  options?:   BoxOptions,
  appContext: AppContext | null = null
): Promise<any> {
  return new Promise((resolve, reject) => {
    const vm = showBox(options, appContext ?? (CustomBox as IBox)._context);

    CustomBoxInstance.set(vm, {
      resolve,
      reject
    });
  });
}

const VARIANTS = ['show'] as const;
VARIANTS.forEach((type) => {
  (CustomBox as IBox)[type] = CustomBoxFactory() as BoxShortcutMethod;
});

function CustomBoxFactory() {
  return (options?: BoxOptions, appContext?: AppContext) => {
    return CustomBox(Object.assign({}, options), appContext);
  };
}

CustomBox.close = () => {
  CustomBoxInstance.forEach((_, vm) => {
    vm.doClose();
  });

  CustomBoxInstance.clear();
};

(CustomBox as IBox)._context = null;

export default CustomBox as IBox;
