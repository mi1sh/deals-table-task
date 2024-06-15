const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;
const AMOCRM_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAyYTcyYjAwMzNiOGZlOWQ1Y2YwODkzM2FlYjNkZjNkOWJjZDlhNGZlODY3MjIwZTUwZTgxOTI5NThiNDEwY2ZiMWQ0MjdiNmQ0ZTU4MzVkIn0.eyJhdWQiOiJiOGVkZWZkZi1iMjQ5LTQ1ZDItYmE3ZS1kYWNhMWJkOWExOGUiLCJqdGkiOiIwMmE3MmIwMDMzYjhmZTlkNWNmMDg5MzNhZWIzZGYzZDliY2Q5YTRmZTg2NzIyMGU1MGU4MTkyOTU4YjQxMGNmYjFkNDI3YjZkNGU1ODM1ZCIsImlhdCI6MTcxODQwNzg5MywibmJmIjoxNzE4NDA3ODkzLCJleHAiOjE3MjUwNjI0MDAsInN1YiI6IjExMTI0ODMwIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNzg0ODcwLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNGYyOGU3MzMtODU4My00MTYzLTgwNzYtNzcxMjQ0Y2YwOWFiIn0.ZX9DYD4cZXuMwEtaKuKh9ZTW5toJLcNuDDrpLWTJ-faMCyda1sS2teaaQ6XHlbc7wWTZ2_Xxgfv7THZ1NLpgufC3UTbbSxG-Nheeub9wdGQMBMzC9bZo_-8Bq_xVMPRLzqS90mYKU_gCMPsHCvE1cPONaIW2lOYF37MrXp0caJi8OMbxPmRrpxSEVa_NR2j_VJZB3AX1kLKToi1GahImJc5lrr6jwGxNuHRPbXhgrFVPQlnP8Bv3QQwuG2-HauHArHMJa2cXSIRxzNz8y61MiAQH0o_QgsDpswxr-45Bd1AXbf2aEzZ2P_ntDCGZzp4NOpmMe2UO7UhnfNG3Z4D8WQ';
const AMOCRM_API_URL = 'https://mi1shtest.amocrm.ru/api/v4';

app.use(cors());

// получение сделок
app.get('/api/deals', async (req, res) => {
	try {
		const response = await axios.get(`${AMOCRM_API_URL}/leads`, {
			headers: {
				'Authorization': `Bearer ${AMOCRM_TOKEN}`,
			},
		});
		res.json(response.data._embedded.leads);
	} catch (error) {
		console.error('Ошибка при получении сделок:', error);
		res.status(500).send('Ошибка при получении сделок');
	}
});

// получение пользователей
app.get('/api/users', async (req, res) => {
	try {
		const response = await axios.get(`${AMOCRM_API_URL}/users`, {
			headers: {
				'Authorization': `Bearer ${AMOCRM_TOKEN}`,
			},
		});
		res.json(response.data._embedded.users);
	} catch (error) {
		console.error('Ошибка при получении пользователей:', error);
		res.status(500).send('Ошибка при получении пользователей');
	}
});

// получение статусов
app.get('/api/statuses', async (req, res) => {
	try {
		const response = await axios.get(`${AMOCRM_API_URL}/leads/pipelines`, {
			headers: {
				'Authorization': `Bearer ${AMOCRM_TOKEN}`,
			},
		});
		const pipelines = response.data._embedded.pipelines;
		const statuses = pipelines.flatMap(pipeline => pipeline._embedded.statuses.map(status => ({
			id: status.id.toString(),
			name: status.name
		})));
		res.json(statuses);
	} catch (error) {
		console.error('Ошибка при получении статусов:', error);
		res.status(500).send('Ошибка при получении статусов');
	}
});

// получение контактов
app.get('/api/contacts', async (req, res) => {
	try {
		const response = await axios.get(`${AMOCRM_API_URL}/contacts`, {
			headers: {
				'Authorization': `Bearer ${AMOCRM_TOKEN}`,
			},
		});
		res.json(response.data._embedded.contacts);
	} catch (error) {
		console.error('Ошибка при получении контактов:', error);
		res.status(500).send('Ошибка при получении контактов');
	}
});

app.listen(PORT, () => {
	console.log(`Сервер запущен на http://localhost:${PORT}`);
});