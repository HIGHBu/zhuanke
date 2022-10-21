<script setup lang="ts">
  import { World, Model, ThirdPersonCamera, types, Find, Plane, LingoEditor, Cube, SvgMesh} from "lingo3d-vue"
  import { ref } from "vue"
  import Test from './components/test.vue'

  const characterPose = ref("idle")
  const characterRef = ref<types.Model>()
  const galleryScale = 15
  const characterScale = 0.2
  const position = ref({x: 550, y: 0, z: 40})
  const visibleDistance = 500
  const initPosition = ref({x: 550, y: 150, z: 400})
  const Frames = [
    {id: "0", name: "Frame_000", texture: ""},
    {id: "1", name: "Frame_001", texture: ""},
    {id: "2", name: "Frame_002", texture: ""},
    {id: "3", name: "Frame_003", texture: ""},
  ]
  const GamePoints = [
    {id: 0, name: "game_point_000"},
    {id: 1, name: "game_point_001"},
    {id: 2, name: "game_point_002"},
    {id: 3, name: "game_point_003"},
    {id: 4, name: "game_point_004"},
    
  ]
  var persons = [
    {
      x: 0,
      y: 200,
      z: 0,
      animate: "idle",
      src: "basic",
      scale: 0.2,
    },
    {
      x: 200,
      y: 200,
      z: 0,
      animate: "walking",
      src: "basic",
      scale: 0.2,
    },
  ]
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
  const handleGameClick = (id: number) => {
    if (id == 0) {
      console.log("第零个游戏点")
    } else if (id == 1) {
      console.log("第一个游戏点")
    } else if (id == 2) {
      console.log("第二个游戏点")
    } else if (id == 3) {
      console.log("第三个游戏点")
    } else if (id == 4) {
      console.log("第四个游戏点")
    }
  }
</script>

<template>
  <!-- <Test></Test> -->
  <World>
    <Model
      name="gallery"
      src="gallery_1021_1.glb"
      :scale="galleryScale"
      physics="map"
      :y="600"
    >
      <Find
        name="gallery_floor"
        @click="handleClick"
      />
      <Find
        v-for="(frame, id) in Frames"
        name="frame.name"
        texture="frame.texture"
      ></Find>
      <Find
        v-for="(game_point, id) in GamePoints"
        name="game_point.name"
        @click="handleGameClick(game_point.id)"
      >
      </Find>
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
        src="basic/src.glb"
        physics="character"
        ref="characterRef"
        :x="initPosition.x"
        :y="initPosition.y"
        :z="initPosition.z"
        :scale="characterScale"
        :animations="{ idle : 'basic/idle.glb', walking: 'basic/walk.glb' }"
        :animation="characterPose"
        :look-to="[position.x, undefined, position.z, 0.1]"
        :move-to="[position.x, undefined, position.z, 5]"
        @move-to-end="handleMoveToEnd"
      />
    </ThirdPersonCamera>
    <Model
      v-for="(person, id) in persons.filter(p=> {
        if (characterRef) {
          return  Math.sqrt(Math.pow((p.x - characterRef.x), 2) + Math.pow((p.y - characterRef!.y), 2) + Math.pow((p.z - characterRef!.z), 2)) < visibleDistance
        }
        return  Math.sqrt(Math.pow((p.x - initPosition.x), 2) + Math.pow((p.y - initPosition.y), 2) + Math.pow((p.z - initPosition.z), 2)) < visibleDistance
      })"
      :src="person.src + '/src.glb'"
      :scale="person.scale"
      :x="person.x"
      :y="person.y"
      :z="person.z"
      :animations="{ idle : person.src + '/idle.glb', walking: person.src + '/walk.glb' }"
      :animation="person.animate"
    >
      <Sprite>
      </Sprite>
    </Model>
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
  </World>
</template>