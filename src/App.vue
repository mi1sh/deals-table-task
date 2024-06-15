<template>
  <a-config-provider :theme="{
      token: {
        colorBgBase: '#3f3f3f',
        colorPrimary: '#5e5e5e',
        colorText: '#e0dada',
        colorTextHeading: 'azure',
      },
    }"
  >
    <a-spin :spinning="loading">
      <a-table :dataSource="formattedDeals" :columns="columns" rowKey="id">
        <template #expandedRowRender="{ record }">
          <div style="display: flex; gap: 1em; line-height: 0.5em">
            <p v-if="record.contact !== 'Нет контакта'">
              <strong>Имя контакта:</strong> {{ record.contact.name }}
            </p>
            <a-button v-if="hasPhone(record.contact)" type="primary" @click="() => handleCall(record.contact)">
              Позвонить
            </a-button>
            <a-button v-if="hasEmail(record.contact)" type="primary" @click="() => handleEmail(record.contact)">
              Email
            </a-button>
          </div>
        </template>
      </a-table>
    </a-spin>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import type { Contact, Deal, Status, User } from '@/types';

const deals = ref<Deal[]>([]);
const users = ref<User[]>([]);
const statuses = ref<Status[]>([]);
const contacts = ref<Contact[]>([]);
const formattedDeals = ref<any[]>([]);
const loading = ref<boolean>(true);

const columns = [
  { title: 'Название', dataIndex: 'name', key: 'name' },
  { title: 'Бюджет', dataIndex: 'price', key: 'price' },
  { title: 'Статус', dataIndex: 'status_name', key: 'status_name' },
  { title: 'Ответственный', dataIndex: 'responsible_user_id', key: 'responsible_user_id' },
  { title: 'Дата создания', dataIndex: 'created_at', key: 'created_at' },
];

const API_URL = 'http://localhost:3000/api';

const fetchData = async () => {
  try {
    const [dealsResponse, usersResponse, statusesResponse, contactsResponse] = await Promise.all([
      axios.get<Deal[]>(`${API_URL}/deals`),
      axios.get<User[]>(`${API_URL}/users`),
      axios.get<Status[]>(`${API_URL}/statuses`),
      axios.get<Contact[]>(`${API_URL}/contacts`)
    ]);

    deals.value = dealsResponse.data;
    users.value = usersResponse.data;
    statuses.value = statusesResponse.data;
    contacts.value = contactsResponse.data;

    formatDeals();
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  } finally {
    loading.value = false;
  }
};

const formatDeals = () => {
  formattedDeals.value = deals.value.map(deal => {
    const user = users.value.find(user => user.id === deal.responsible_user_id);
    const status = statuses.value.find(status => status.id === deal.status_id.toString());
    const companies = deal._embedded && deal._embedded.companies ? deal._embedded.companies : [];
    const company = companies.length > 0 ? companies[0] : null;

    let contact: Contact | null = null;
    if (company) {
      contact = contacts.value.find(contact => contact._embedded.companies.some(c => c.id === company.id)) || null;
    }

    return {
      ...deal,
      responsible_user_id: user ? user.name : (deal.responsible_user_id ? deal.responsible_user_id.toString() : 'Неизвестно'),
      status_name: status ? status.name : 'Неизвестно',
      contact: contact ? contact : 'Нет контакта',
      created_at: new Date(deal.created_at * 1000).toLocaleString()
    };
  });
};

const hasPhone = (contact: Contact) => {
  return contact && contact.custom_fields_values && contact.custom_fields_values.some(field => field.field_code === 'PHONE');
};

const hasEmail = (contact: Contact) => {
  return contact && contact.custom_fields_values && contact.custom_fields_values.some(field => field.field_code === 'EMAIL');
};

const handleCall = (contact: Contact) => {
  const phoneField = contact.custom_fields_values?.find(field => field.field_code === 'PHONE');
  const phone = phoneField ? phoneField.values[0].value : undefined;
  if (phone) {
    window.open(`tel:${phone}`);
  } else {
    alert('Phone number not found');
  }
};

const handleEmail = (contact: Contact) => {
  const emailField = contact.custom_fields_values?.find(field => field.field_code === 'EMAIL');
  const email = emailField ? emailField.values[0].value : undefined;
  if (email) {
    window.open(`mailto:${email}`);
  } else {
    alert('Email not found');
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
</style>
