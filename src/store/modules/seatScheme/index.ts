import { defineStore } from 'pinia';

import { seatList } from '@/api/business/seat/index';
import { deleteFile } from '@/api/common/index';
import {
  addSeatScheme,
  getSeatScheme,
  editSeatScheme
} from '@/api/business/seatScheme/index';
import { useGlobSettings } from '@/hooks/settings/useGlobSettings';

import type { ConfigSeatStoreState } from './types';
import type { SeatPosition } from '~/views/business/seat-scheme/types';
import type {
  SeatSchemeDTO,
  SeatSchemePosition
} from '~/api/business/seatScheme/types';

const SERVER_PROFILE = '/profile';
const ICON_KEYS = [
  'carPlaneImage',
  'unSelectedIcon',
  'selectedIcon',
  'boughtIcon'
];

export const useSeatSchemeStore = defineStore({
  id: 'seatScheme',
  state: (): ConfigSeatStoreState => ({
    seatSchemeId: undefined,
    seatTypeList: [],
    seatIconList: [
      {
        label: '未选座位',
        prop: 'unSelectedIcon',
        value: ''
      },
      {
        label: '已选座位',
        prop: 'selectedIcon',
        value: ''
      },
      {
        label: '已购座位',
        prop: 'boughtIcon',
        value: ''
      }
    ],
    carPlaneImage: '',
    deleteImageFileName: [],
    seatSchemeName: '',
    positionList: [],
    currentParentSize: {
      scale: 1,
      width: -1,
      height: -1
    }
  }),
  getters: {
    defaultIcon(): string {
      return this.seatIconList.filter(
        (item) => item.prop === 'unSelectedIcon'
      )[0].value;
    }
  },
  actions: {
    reset() {
      if (this.seatSchemeId) {
        this.getSeatScheme();
        return;
      }
      this.$reset();
    },
    setSeatSchemeId(id: number) {
      this.seatSchemeId = id;
    },
    getSeatScheme() {
      const id = this.seatSchemeId;
      const setIcon = (prop: string, value: string) => {
        this.seatIconList.forEach((item) => {
          if (item.prop === prop) {
            item.value = value;
            return;
          }
        });
      };
      const convertImageUrlOfFrontBack = (url: string) => {
        return url;
      };
      const waitParent = () => {
        return new Promise((resolve) => {
          const next = () => {
            if (this.currentParentSize.height === -1) {
              setTimeout(() => {
                next();
              }, 50);
            } else {
              resolve(true);
            }
          };

          next();
        });
      };
      getSeatScheme(id!).then((res) => {
        if (res.code === 200) {
          const { data } = res;
          if (!data) return;
          ICON_KEYS.forEach((key) => {
            if (Object.hasOwn(data!, key)) {
              setIcon(key, convertImageUrlOfFrontBack(data[key])!);
            }
          });
          this.carPlaneImage = convertImageUrlOfFrontBack(data.carPlaneImage)!;
          this.seatSchemeName = data.seatSchemeName;
          // 一定要先加载车辆平面图，采用加载
          waitParent().then(() => {
            setTimeout(() => {
              this.positionList = data.positions.map((item) => {
                const obj: SeatPosition = {
                  seatSchemePositionId: item.seatSchemePositionId,
                  name: item.name,
                  seatId: item.seatId,
                  positionData: item.positionData,
                  size: item.sizeData
                };
                return {
                  ...obj
                };
              });
              this.calcSeatXYByCurParentSize();
            }, 300);
          });
        }
      });
    },
    /**
     * 获取座位类型
     */
    getSeatTypeList() {
      seatList({
        status: '0',
        pageSize: '50'
      }).then((res) => {
        if (res.code === 200) {
          if (!res.data) return;
          this.seatTypeList = [...res.data.items];
        }
      });
    },
    /**
     * 当图片上传成功时
     */
    uploadOnSuccess(data: any) {
      this.deleteImageFileName.push(data.fileName);
    },
    /**
     * 删除未使用的图片
     */
    deleteUnuseImage() {
      // 想了想还是后端处理好了
      // this.deleteImageFileName.forEach((fileName) => {
      //   deleteFile(fileName);
      // });
      this.deleteImageFileName = [];
    },
    /**
     * 页面离开时，执行
     */
    destory() {
      this.deleteUnuseImage();
      this.$reset();
    },
    /**
     * 新增座位位置
     * @param data 座位位置
     */
    addSeatPosition(data: SeatPosition) {
      const len = this.positionList.length;
      const time = new Date().getTime();
      data.seatSchemePositionId = 'L' + time + len + 1;
      this.positionList.push(data);
    },
    /**
     * 新增座位位置
     * @param data 座位位置
     */
    deleteSeatPosition(id: number | string) {
      this.positionList = this.positionList.filter(
        (item) => item.seatSchemePositionId !== id
      );
    },
    /**
     * 每次父亲尺寸变了后，当前位置的父亲尺寸，应该为本次的
     */
    reSetParentSize() {
      this.positionList.forEach((item) => {
        item.size.parentHeight = this.currentParentSize.height;
        item.size.parentWidth = this.currentParentSize.width;
        item.size.parentScale = this.currentParentSize.scale;
      });
    },
    /**
     * 根据当前的父亲尺寸，计算出新的X，Y
     */
    calcSeatXYByCurParentSize() {
      const { width: cpw, height: cph } = this.currentParentSize;

      this.positionList.forEach((item) => {
        const { parentWidth: pw, parentHeight: ph } = item.size;
        // console.log(`width: ${cpw} height:${cph} pw: ${pw} ph: ${ph}`);

        const wScale = cpw / pw;
        const hScale = cph / ph;

        if (!item.firstPositionData && !item.firstSize) {
          item.firstPositionData = { ...item.positionData };
          item.firstSize = { ...item.size };
        }

        item.size.width = item.firstSize?.width! * wScale;
        item.size.height = item.firstSize?.height! * wScale;
        item.positionData.x = item.firstPositionData?.x! * wScale;
        item.positionData.y = item.firstPositionData?.y! * wScale;
      });
    },
    save(): Promise<number | string> {
      const getIcon = (prop: string) => {
        return this.seatIconList.filter((icon) => icon.prop === prop)[0].value;
      };
      const convertPostions = (arr: SeatPosition[]) => {
        return arr.map((item) => {
          const obj: SeatSchemePosition = {
            seatSchemePositionId:
              typeof item.seatSchemePositionId === 'string'
                ? undefined
                : item.seatSchemePositionId,
            seatId: item.seatId,
            name: item.name,
            positionData: item.positionData,
            sizeData: item.size
          };
          return obj;
        });
      };
     
      const convertUploadPath = (path: string) => {
        if (!path.startsWith(SERVER_PROFILE)) {
          return path.substring(path.indexOf(SERVER_PROFILE));
        }
        return path;
      };

      this.reSetParentSize();

      const params: SeatSchemeDTO = {
        seatSchemeId: this.seatSchemeId,
        seatSchemeName: this.seatSchemeName,
        carPlaneImage: convertUploadPath(this.carPlaneImage),
        unSelectedIcon: convertUploadPath(getIcon('unSelectedIcon')),
        selectedIcon: convertUploadPath(getIcon('selectedIcon')),
        boughtIcon: convertUploadPath(getIcon('boughtIcon')),
        status: '0',
        positions: convertPostions(this.positionList)
      };

      const api = this.seatSchemeId ? editSeatScheme : addSeatScheme;

      return new Promise((resolve, reject) => {
        api(params)
          .then((res) => {
            if (res.code === 200) {
              this.deleteUnuseImage();
              const { data } = res;

              resolve(this.seatSchemeId ? this.seatSchemeId : data!);
            }
          })
          .catch(() => {});
      });
    }
  }
});
