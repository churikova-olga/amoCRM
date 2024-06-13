<template>
  <div class="v-wrapper-search">
    <div style="position: relative">
      <button @click="flag = false; getData()" class="v-but-search"><SearchOutlined /></button>
      <input class="v-search" v-model="search" type="text" placeholder="Найти..." >
    </div>
  </div>

  <hr style="border: 1px #f0f0f0 solid"/>
  <div v-if="flag === false">
    Данные грузятся.... <LoadingOutlined />
  </div>
<div v-else>

  <ATable
             size="middle"
             :pagination="false"
             :columns="columns"
             :data-source="info"
             :expand-column-width="100">
    <template #bodyCell="{ column, record }">
    <template v-if="column.key === 'status'">
        <span>
          <ATag
              :color="color[record.status]"
          >
            {{ record.status }}
          </ATag>
        </span>
    </template>

      <template v-else-if="column.key === 'user'">
        <span>
           <UserOutlined />
          {{record.user}}
        </span>
      </template>


    </template>
    <template #expandedRowRender="{ record }">

    <div v-if="record.contact.length">
      <div style="margin: 10px 20px" v-for="contact in record.contact" :key="contact.id">
        <UserOutlined />
        <span style="margin: 0 5px">{{ contact.name }}</span>
        <a href="#"><PhoneTwoTone /></a>
        <ADivider type="vertical" />
        <a href="#"><MailTwoTone /></a>
      </div>
    </div>
      <div style="margin: 10px 20px" v-else>
        <span style="margin: 0 5px">Без контакта</span>
      </div>
    </template>

  </ATable>
</div>

</template>

<script lang="ts" setup>
const columns = [
  { title: 'Название', dataIndex: 'name', key: 'name', fixed: true },
  { title: 'Бюджет', dataIndex: 'price', key: 'price' },
  { title: 'Статус', dataIndex: 'status', key: 'status' },
  { title: 'Ответственный',dataIndex: 'user', key: 'user' },
  { title: 'Дата создания', dataIndex: 'date', key: 'date' },
];


</script>


<script lang="ts" >

import { defineComponent } from 'vue';

import {
  UserOutlined,
  LoadingOutlined,
  PhoneTwoTone,
  MailTwoTone,
  SearchOutlined
} from '@ant-design/icons-vue';

import axios from "axios";

import {Table, Tag, Divider} from 'ant-design-vue';

const API_URL = "http://localhost:3000/"

export default defineComponent({
  name: 'v-table',

  components: {
    UserOutlined,
    LoadingOutlined,
    PhoneTwoTone,
    MailTwoTone,
    SearchOutlined,
    ATable: Table,
    ATag: Tag,
    ADivider: Divider,


  },
  data(){
    return{
      info: [],
      color: {
        "Первичный контакт": "blue",
        "Переговоры": "yellow",
        "Принимают решение": "orange",
        "Согласование договора": "pink",
        "	Закрыто и не реализовано": "grey",
      },
      search: "",
      token: "",
      flag: false
    }
  },
  methods: {
    async getData() {
      await axios.get(API_URL + `api/leads?token=${this.token}&search=${this.search}`).then((response) => {
        this.info = response.data
        this.flag = true;
      })
    },
    async getToken() {
      await axios.get(API_URL + `api/auth`).then((response) => {
        console.log(response.data)
        this.token = response.data.access_token
        this.getData();
      })
    }
  },
  mounted() {
    this.getToken();
  }
});
</script>

<style scoped>

.v-wrapper-search{
  display: flex;
  margin: 20px;
  justify-content: flex-end;
}


.v-but-search{
  position: absolute;
  height: 100%;
  border: none;
  background-color: transparent;
  border-left: 1px solid grey;
  left: 180px;
  cursor: pointer;
  width: 15%;
}
.v-search{
  border-radius: 5px;
  border: 1px solid #a9a7a7;
  padding: 5px;
  width: 200px;
}
.v-search::-ms-clear {
  display: none;
}
.v-search:hover{
  border: 1px solid cornflowerblue;
}

</style>
