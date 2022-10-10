<template>
  <div :class="{ show: show }" class="header-search">
    <svg-icon
      class-name="search-icon"
      icon-class="search"
      @click.stop="click"
    />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="item in options"
        :key="item.item.path"
        :value="item.item.path"
        :label="item.item.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script lang="ts" setup name="HeaderSearch">
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js';
import path from 'path-browserify';
import { usePermissionStore } from '@/store';
import { storeToRefs } from 'pinia';
import { Ref } from 'vue';

const permissionStore = usePermissionStore();
const { routes } = storeToRefs(permissionStore);
const route = useRoute();
const router = useRouter();

const search: Ref<string> = ref('');
const options: Ref<Fuse.FuseResult<SearchRoutes>[]> = ref([]);
const searchPool: Ref<SearchRoutes[]> = ref([]);
const show: Ref<boolean> = ref(false);
const fuse: Ref<Fuse<SearchRoutes>> = ref(new Fuse([]));
const headerSearchSelect: Ref<HTMLSelectElement | null> = ref(null);

watch(
  routes,
  () => {
    searchPool.value = generateRoutes(routes.value);
  },
  { immediate: true }
);

watch(
  searchPool,
  (list) => {
    initFuse(list);
  },
  { immediate: true }
);

watch(
  show,
  (value) => {
    if (value) {
      document.body.addEventListener('click', close);
    } else {
      document.body.removeEventListener('click', close);
    }
  },
  { immediate: true }
);

onBeforeMount(()=>{
  search.value = route.path
})

function click() {
  show.value = !show.value;
  if (show.value) {
    headerSearchSelect.value && headerSearchSelect.value.focus();
  }
}

function close() {
  headerSearchSelect.value && headerSearchSelect.value.blur();
  options.value = [];
  show.value = false;
}

function change(val: string) {
  router.push(val);
  search.value = '';
  options.value = [];
  nextTick(() => {
    show.value = false;
  });
}

function initFuse(list: SearchRoutes[]) {
  fuse.value = new Fuse(list, {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    // maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      {
        name: 'title',
        weight: 0.7
      },
      {
        name: 'path',
        weight: 0.3
      }
    ]
  });
}

// Filter out the routes that can be displayed in the sidebar
// And generate the internationalized title
function generateRoutes(
  routes: RouteItem[],
  basePath = '/',
  prefixTitle: string[] = []
): SearchRoutes[] {
  let res: SearchRoutes[] = [];

  for (const router of routes) {
    // skip hidden router
    if (router.hidden) {
      continue;
    }

    const data: SearchRoutes = {
      path: path.resolve(basePath, router.path),
      title: [...prefixTitle]
    };

    if (router.meta && router.meta.title) {
      data.title = [...data.title, router.meta.title];

      if (router.redirect !== 'noRedirect') {
        // only push the routes with title
        // special case: need to exclude parent router without redirect
        res.push(data);
      }
    }

    // recursive child routes
    if (router.children) {
      const tempRoutes = generateRoutes(router.children, data.path, data.title);
      if (tempRoutes.length >= 1) {
        res = [...res, ...tempRoutes];
      }
    }
  }
  return res;
}

function querySearch(query: string) {
  if (query !== '') {
    options.value = fuse.value.search(query);
  } else {
    options.value = [];
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
