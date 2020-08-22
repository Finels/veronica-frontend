<template>
  <detail :is-edit="false" />
</template>

<script>
import detail from './components/detail'

export default {
  name: 'OrgDetail',
  components: { detail }
}
</script>

