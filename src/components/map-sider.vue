<template>
  <div class="map-sider">
    <div
      :class="['item', { active: item.defaultActive }]"
      v-for="(item, index) in modelValue"
      :key="index"
      @click="setActive(item)"
    >
      <img
        v-if="!item.defaultActive"
        src="@/assets/images/map-sider-bg.png"
        alt=""
      />
      <img v-else src="@/assets/images/map-sider-bg-active.png" alt="" />
      <span class="label"> {{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface listType {
  id: number
  label: string
  defaultActive: boolean
}
interface Props {
  modelValue: listType[]
}
const propData = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'tabsChange'])
const setActive = async (item: listType) => {
  item.defaultActive = !item.defaultActive

  emits('update:modelValue', propData.modelValue)
  emits('tabsChange', item)
}
</script>

<style scoped lang="scss">
.map-sider {
  display: flex;
  flex-direction: column;
  user-select: none;
  .label {
    font-size: 30px;
  }
  .item {
    height: 46px;
    display: flex;
    align-items: center;
    font-size: 22px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #fff;
    padding-left: 15px;
    background-size: 100% 100%;
    margin-bottom: 40px;
    position: relative;
    cursor: pointer;

    img {
      width: 46px;
      height: 46px;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .active {
    color: #ffee2e;
  }
}
</style>
