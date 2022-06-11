<template>
  <div>
    <Card></Card>
  </div>
</template>

<script>
import Card from './Card'

export default {
  name: 'Dashboard',
  components: {
    Card,
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
