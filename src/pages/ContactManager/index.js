import React, { useEffect, useState } from "react";
import { FiDelete } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { deleteContactById, getAllContact } from "../../api/ServerApi";
import Container from "../../components/Container";
import { useLibrary } from "../../helpers/Hook";
import styles from "./styles.module.scss";

const mock = [
	{
		"_id": "63b1a185b8f1121c873b389f",
		"id": "0.6676334346933983",
		"name": "Kiều Myy",
		"phone": "0377277875",
		"address": "Pleiku",
		"content": "hi",
		"__v": 0
	},
	{
		"_id": "63b1a5c737f52ac0c752aeb0",
		"id": "0.5078177795025016",
		"name": "Kiều Myy",
		"phone": "0377277875",
		"address": "Pleiku",
		"content": "hhhh",
		"__v": 0
	}
]
const ContactManager = () => {
	const [loading, setLoading] = useState(false);
	const [buttonLoading, setButtonLoading] = useState(false);
	const token = localStorage.getItem('token');

	const handleClickDelete = async (id) => {
		console.log("del", id)
		setButtonLoading(true);
		deleteContactById(token, id).then(() => {
			setReRender(!reRender);
			setButtonLoading(false);
		});
	};

	const [data, setData] = useState([]);
	const [reRender, setReRender] = useState(true);

	const library = useLibrary();
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		const getData = async () => {
			const res = await getAllContact();
			setData(res.data.data);
			setLoading(false);
		};
		getData();
        
		console.log(getData);
	}, [reRender]);

	return (
		<div className={styles.wrapper}>
			<Container>
				<h3 className={styles.title}>Hòm thư</h3>
				<ul>
					{data.map(item => (
						<li className={styles.mailItem}>
							<div>
								<div className={styles.username}>
									<h4>{item.name}</h4><p>{item.phone}</p>
								</div>
								<p className={styles.address}>{item.address}</p>
								<p className={styles.content}>{item.content}</p>
							</div>
							<div className={styles.status}>
								{item.status}
							</div>
							<div>
								<FiDelete className={styles.btnDel} onClick={() => handleClickDelete(item._id)} />
							</div>
						</li>
					))}
				</ul>
			</Container>
		</div>
	)
};

export default ContactManager;
