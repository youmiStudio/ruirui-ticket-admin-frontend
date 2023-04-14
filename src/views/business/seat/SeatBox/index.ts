import {
  h,
  render,
  AppContext,
  ComponentPublicInstance,
  createVNode
} from 'vue';

import SeatBoxConstructor from './index.vue';

import type {
  SeatBoxOptions,
  Action,
  ISeatBox,
  SeatBoxShortcutMethod
} from './types';

const seatBoxInstance = new Map<
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
  const vnode = createVNode(SeatBoxConstructor, props);
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
    seatBoxInstance.delete(vm);
  };

  options.onAction = (action: Action) => {    
    const currentBox = seatBoxInstance.get(vm);
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

async function SeatBox(
  options?: SeatBoxOptions,
  appContext?: AppContext | null
): Promise<any>;
function SeatBox(
  options?: SeatBoxOptions,
  appContext: AppContext | null = null
): Promise<any> {
  return new Promise((resolve, reject) => {
    const vm = showBox(options, appContext ?? (SeatBox as ISeatBox)._context);

    seatBoxInstance.set(vm, {
      resolve,
      reject
    });
  });
}

const VARIANTS = ['show'] as const;
VARIANTS.forEach((type) => {
  (SeatBox as ISeatBox)[type] = seatBoxFactory() as SeatBoxShortcutMethod;
});

function seatBoxFactory() {
  return (options?: SeatBoxOptions, appContext?: AppContext) => {
    return SeatBox(Object.assign({}, options), appContext);
  };
}

SeatBox.close = () => {
  seatBoxInstance.forEach((_, vm) => {
    vm.doClose();
  });

  seatBoxInstance.clear();
};

(SeatBox as ISeatBox)._context = null;

export default SeatBox as ISeatBox;
