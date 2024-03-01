<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { getCurrentInstance, onBeforeMount, onUnmounted, ref } from "vue";

interface MapConfigOption {
    resizeEnable?: boolean;
    center?: number[];
    zoom?: number;
}

interface MapConfigure {
    amapKey: string;
    options: MapConfigOption;
}

interface MapConfigureInter {
    on?: Fn;
    destroy?: Fn;
    clearEvents?: Fn;
    addControl?: Fn;
    getCenter?: Fn;
    setCenter?: Fn;
    setZoom?: Fn;
    plugin?: Fn;
}

let map: any;

const mapConfigure = {
    amapKey: "3124c4451dc02716d85f97682d9ac094",
    options: {
        resizeEnable: true,
        // center: [121.553958, 29.869472],
        zoom: 16
    }
};

window._AMapSecurityConfig = {
    securityJsCode: "2d0df44c352ade94430f0ffe174a32bd"
};

const instance = getCurrentInstance();

const addressList = ref<any[]>([]);

const emit = defineEmits(['pick']);

const sureAddress = (data: any) => {
    // map.setCenter(data.location);
    emit('pick', data)
    addressList.value = [];
};

onBeforeMount(() => {
    if (!instance) return;
    let { options } = mapConfigure;

    AMapLoader.load({
        key: mapConfigure.amapKey,
        version: "2.0",
        plugins: [],
        AMapUI: {
            version: "1.1",
            plugins: ["misc/PositionPicker", "misc/PoiPicker"]
        }
    })
        .then(AMap => {
            map = new AMap.Map(instance.refs.mapView, options);

            map.plugin(["AMap.Geolocation"], () => {
                let geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,
                    timeout: 10000,
                    buttonOffset: new AMap.Pixel(10, 20),
                    zoomToAccuracy: true,
                    buttonPosition: "RB"
                });

                map.addControl(geolocation);
                geolocation.getCurrentPosition(function (status: any, result: unknown) {
                    if (status == "complete") {
                        onComplete(result);
                    } else {
                        onError(result);
                    }
                });
            });

            function onComplete(data: any) {
                map.setCenter(data.position);
            }
            function onError(error: unknown) {
                console.log("error", error);
            }

            let positionPicker = new AMapUI.PositionPicker({
                mode: "dragMap",
                map: map
            });

            positionPicker.on("success", function (positionResult: any) {
                addressList.value = positionResult.regeocode.pois;
            });

            positionPicker.on("fail", function (positionResult: any) {
                console.log("positionResult", positionResult);
            });

            positionPicker.start();

            let poiPicker = new AMapUI.PoiPicker({
                input: instance.refs.pickerInput
            });
            poiPicker.on("poiPicked", function (poiResult: any) {
                map.setCenter(poiResult.item.location);
            });
        })
        .catch(() => {
            throw "地图加载失败，请重新加载";
        });
});

onUnmounted(() => {
    if (map) {
        // 销毁地图实例
        map.destroy() && map.clearEvents("click");
    }
});
</script>

<template>
    <div class="map-container">
        <div ref="mapView" class="map-view"></div>
        <div class="search">
            <input type="text" ref="pickerInput" placeholder="搜索地点" />
        </div>
        <div class="address-wrapper">
            <div class="address-list">
                <div class="address-list-item" v-for="item in addressList" :key="item.id" @click="sureAddress(item)">
                    <p>{{ item.name }}</p>
                    <p>{{ item.address }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.map-container {
    position: relative;
    background-color: #fff;
    width: 100%;
    height: 100%;

    .map-view {
        position: absolute;
        width: 100%;
        height: 300px;
        // position: fixed !important;
        // top: 0;
    }

    input {
        width: 32%;
        height: 32px;
        padding: 8px 15px;
        position: absolute;
        z-index: 10;
        top: 20px;
        left: 20px;
        outline: none;
        border: 1px solid #d3d3d3;
        border-radius: 5px;
        background-color: #fff;
    }

    .address-wrapper {
        padding-top: 300px;
        cursor: pointer;

        .address-list {
            position: relative;
            // height: 50vh;
            overflow: auto;

            &-item {
                font-size: 12px;
                padding: 6px 12px;
                border-bottom: 1px solid #e8e8e8;

                p:first-child {
                    color: #333;
                    font-size: 13px;
                }

                p:last-child {
                    color: #666;
                }
            }
        }
    }
}
</style>