import { getDictType } from '~/api/system/dict/index';

enum DictDataOtption {
  LABEL = 'dictLabel',
  VALUE = 'dictValue'
}

type DictData = {
  label: string;
  value: string;
  raw: any;
};

const dicts = reactive({
  type: {} as Recordable<DictData[]>
});

/**
 * 获取该字典类型的所有字典
 *
 * @param dictType 字典类型
 * @returns
 */
function requestDictDataByDictType(dictType: string | symbol): Promise<any[]> {
  return new Promise((resolve, reject) => {
    if (hasDictType(dictType as string)) return;
    getDictType(dictType as string).then((res) => {
      const { data } = res;
      if (data.length > 0) {
        resolve(data);
      } else {
        reject('DictType not match');
      }
    });
  });
}

/**
 * 将请求点接口字典信息，转换成前端需要的字典格式
 *
 * @param dictDataRawList 请求返回的字典
 * @returns
 */
function dictMetaConvert(dictDataRawList: any[]): DictData[] {
  let result: DictData[] = [];
  for (let i = 0; i < dictDataRawList.length; i++) {
    const dictData = dictDataRawList[i];
    const dictLabel = dictData[DictDataOtption.LABEL];
    const dictValue = dictData[DictDataOtption.VALUE];

    result.push({
      label: dictLabel,
      value: dictValue,
      raw: dictData
    });
  }

  return result;
}

/**
 * 判断字段是否已经存在
 *
 * @param types 字典类型
 */
function hasDictType(types: string[] | string): boolean {
  let objKeys = Object.keys(dicts.type);

  if (typeof types === 'string') {
    return objKeys.includes(types);
  } else if (types instanceof Array) {
    return types.some((type) => objKeys.includes(type));
  }

  return false;
}

/**
 * 获取字典数据，并设置到本地字典上
 * 
 * @param type 字典字段
 */
function loadAndSetDictTypes(type: string) {
  requestDictDataByDictType(type).then((res) => {
    const dictTypes = dictMetaConvert(res);
    dicts.type[type] = dictTypes;
  });
}

export default function useDictTypes(types: string[] | string) {
  const loadDictTypesByArrayStrategy = {
    handle: () => {
      const list = types as [];
      list.forEach((type: string) => {
        loadAndSetDictTypes(type);
      });
    },
    support: () => types instanceof Array
  };

  const loadDictTypesByStringStrategy = {
    handle: () => {
      loadAndSetDictTypes(types as string);
    },
    support: () => typeof types === 'string'
  };

  const loadDataTypeStrategy = [
    loadDictTypesByArrayStrategy,
    loadDictTypesByStringStrategy
  ];

  for (let i = 0; i < loadDataTypeStrategy.length; i++) {
    const strategy = loadDataTypeStrategy[i];
    if (!strategy.support()) continue;
    strategy.handle();
  }

  return dicts;
}
