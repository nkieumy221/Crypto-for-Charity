import moment from "moment";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FiDelete } from "react-icons/fi";
import { createOrUpdateContact, deleteContactById, getAllContact } from "../../api/ServerApi";
import Button from "../../components/Button";
import Container from "../../components/Container";
import Modal from "../../components/Modal";
import styles from "./styles.module.scss";

const ContactManager = () => {
	const [loading, setLoading] = useState(false);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [show, setShow] = useState(false);
	const token = localStorage.getItem('token');
	const [data, setData] = useState([]);
	const [reRender, setReRender] = useState(true);
	const [dataItem, setDataItem] = useState();
	const [itemSelect, setItemSelect] = useState()

	const handleClickDelete = async (e,id) => {
		e.stopPropagation();
		setButtonLoading(true);
		deleteContactById(token, id).then(() => {
			setReRender(!reRender);
			setButtonLoading(false);
		});
	};

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

	const handleUpdateStatusMail = async () => {
		createOrUpdateContact(token, dataItem).then(() => {
			setReRender(!reRender);
			setButtonLoading(false);
		});
	}

	console.log(data)

	return (
		<div className={styles.wrapper}>
			<Container>
				<h3 className={styles.title}>Hòm thư</h3>
				<ul>
					{data.map(item => (
						<li className={styles.mailItem} 
							onClick={() => {
								setDataItem(item)
								setShow(true)
							}}
						>
							<div className={styles.mailItemHeader} >
								<div>
									<div className={styles.username}>
										<h4>{item.name}</h4><p>{item.phone}</p>
									</div>
									<p className={styles.address}>{item.address}</p>
								</div>
								<div className={styles.status} >
									<span style={{
										backgroundColor: item.status === 0 ? "red" :
										item.status === 1 ? "yellow":
										"green"
									}}>
										{item.status === 0 ? "Chưa đọc" :
										item.status === 1 ? "Đang xác minh":
										"Đã xác minh"}
									</span>
								</div>
								<div>
									<FiDelete className={styles.btnDel} onClick={(e) => handleClickDelete(e,item._id)} />
								</div>
							</div>
							<p className={styles.content}>{item.content}</p>
						</li>
					))}
				</ul>
			</Container>
			<Modal
				show={show}
				onHide={() => {
					setShow(false);
				}}
				header={"Lời nhắn gửi"}
				content={
					<div className={styles.mailItemModal} >
						<div className={styles.mailItemModalHeader}>
							<div>
								<div className={styles.username}>
									<h4>{dataItem?.name}</h4><p>{dataItem?.phone}</p>
								</div>
								<p className={styles.address}>{dataItem?.address}</p>
							</div>
							<div className={styles.status} >
								<Form.Select 
									value={itemSelect}
									onChange={e => {
										setItemSelect(e.target.value);
										dataItem.status = e.target.value;
										handleUpdateStatusMail()
									  }}
									>
									<option value="0">Chưa đọc</option>
									<option value="1">Đang xác minh</option>
									<option value="2">Đã xác minh</option>
								</Form.Select>
							</div>
						</div>
						<div className={styles.mailItemModalBody}>
							{dataItem?.content}
						</div>
					</div>
				}
				footer={
					<>
						<Button className="btn-dark" onClick={() => {setShow(false);}}>
							Huỷ
						</Button>
						<Button onClick={() => handleClickDelete(dataItem?._id)}>
							Xoá
						</Button>
					</>
				}
			></Modal>
		</div>
	)
};

export default ContactManager;
