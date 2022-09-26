<script setup lang="ts">
  import { World, Model, ThirdPersonCamera, types, Find, Plane, LingoEditor, Cube, SvgMesh} from "lingo3d-vue"
  import { ref } from "vue"
  import Test from './components/test.vue'

  const characterPose = ref("idle")
  const characterRef = ref<types.Model>()
  const galleryScale = 20
  const characterScale = 0.2
  const position = ref({x: 0, y: 0, z: 0})

  const handleClick = (ev:types.MouseEvent) => {
    if (ev.distance >= 200) {
      let model=characterRef.value
      if (!model) return;
      position.value = ev.point
      characterPose.value = "walking"
    }
  }
  const handleMoveToEnd = () => {
    characterPose.value = "idle"
  }
</script>

<template>
  <Test></Test>
  <!-- <World>
    <Model
      name="gallery"
      src="gallery_0925.glb"
      :scale="galleryScale"
      physics="map"
      @click="handleClick"
      :y="600"
    >
    </Model> 
    <ThirdPersonCamera
      :active="true"
      mouse-control="drag"
      :lock-target-rotation="false"
      :min-polar-angle="90" 
      :max-polar-angle="110"
    >
      <Model
        name="character"
        src="c.glb"
        physics="character"
        ref="characterRef"
        :x="0"
        :y="250"
        :z="0"
        :scale="characterScale"
        :look-to="[position.x, undefined, position.z, 0.1]"
        :move-to="[position.x, undefined, position.z, 5]"
        @move-to-end="handleMoveToEnd"
      />

      <Model
        name="character"
        src="basic/src.glb"
        physics="character"
        ref="characterRef"
        :x="0"
        :y="200"
        :z="0"
        :scale="characterScale"
        :animations="{ idle : 'basic/idle.glb', walking: 'basic/walk.glb' }"
        :animation="characterPose"
        :look-to="[position.x, undefined, position.z, 0.1]"
        :move-to="[position.x, undefined, position.z, 5]"
        @move-to-end="handleMoveToEnd"
      />
    </ThirdPersonCamera>
    <SvgMesh
      src="arrow.svg"
      :metalness-factor="1"
      :roughness-factor="0.4"
      :roughness="0.4"
      :scale-z="0.19"
      color="#ff4e4e"
      emissive-color="#223056"
      v-if="characterPose=='walking'"
      :x="position.x"
      :y="position.y + 50"
      :z="position.z"
      :animation="{rotationY: [0, 45, 90, 135, 180, 225, 270, 315, 360]}"
    />
  </World> -->
</template>