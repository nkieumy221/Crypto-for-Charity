import axios from "axios";
import { BASE_SERVER_URL } from "../../config";

const getAllProject = () => {
	return axios({
		method: "get",
		url: `${BASE_SERVER_URL}/project`,
	});
};

const getProjectByAddress = (address) => {
	return axios({
		method: "get",
		url: `${BASE_SERVER_URL}/project/${address}`,
	});
};

const deleteProjectByAddress = async (token, address) => {
	return axios({
		method: "get",
		url: `${BASE_SERVER_URL}/project/delete/${address}`,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

const createOrUpdate = async (token, project) => {
	return axios({
		method: "post",
		url: `${BASE_SERVER_URL}/project/`,
		data: project,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

const uploadImage = async (token, file) => {
	let formData = new FormData();
	formData.append("upload", file);
	return axios.post(`${BASE_SERVER_URL}/upload`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};

const getAllBeneficy = () => {
	return axios({
		method: "get",
		url: `${BASE_SERVER_URL}/beneficy`,
	});
};

const deleteBeneficyByAddress = async (token, address) => {
	return axios({
		method: "get",
		url: `${BASE_SERVER_URL}/beneficy/delete/${address}`,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

const createOrUpdateBeneficy = async (token, beneficy) => {
	return axios({
		method: "post",
		url: `${BASE_SERVER_URL}/beneficy/`,
		data: beneficy,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

const getAllContact = () => {
	return axios({
		method: "get",
		url: `${BASE_SERVER_URL}/contact`,
	});
};

const deleteContactById = async (token,id) => {
	return axios({
		method: "get",
		url: `${BASE_SERVER_URL}/contact/delete/${id}`,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

const createOrUpdateContact = async (token,contact) => {
	return axios({
		method: "post",
		url: `${BASE_SERVER_URL}/contact/`,
		data: contact,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

const getAllComment = () => {
	return axios({
		method: "get",
		url: `${BASE_SERVER_URL}/comment`,
	});
};

const getCommentByAddress = (address) => {
	return axios({
		method: "get",
		url: `${BASE_SERVER_URL}/comment/${address}`,
	});
}

const deleteCommentByAddress = async (token,id) => {
	return axios({
		method: "get",
		url: `${BASE_SERVER_URL}/comment/delete/${id}`,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

const createOrUpdateComment = async (token,contact) => {
	return axios({
		method: "post",
		url: `${BASE_SERVER_URL}/comment/`,
		data: contact,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

export {
	getAllProject,
	getProjectByAddress,
	deleteProjectByAddress,
	createOrUpdate,
	uploadImage,
	getAllBeneficy,
	deleteBeneficyByAddress,
	createOrUpdateBeneficy,
	getAllContact,
	deleteContactById,
	createOrUpdateContact,
	getAllComment,
	getCommentByAddress,
	deleteCommentByAddress,
	createOrUpdateComment
};
