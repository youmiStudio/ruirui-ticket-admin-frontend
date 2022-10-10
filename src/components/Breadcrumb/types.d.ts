import { RouteLocationMatched } from 'vue-router';

interface BreadcrumbMatched extends RouteLocationMatched {
  components?
  redirect?
  name?
  children?
  props?
  beforeEnter?
  leaveGuards?
  updateGuards?
  enterCallbacks?
  instances?
  aliasOf?
}
