import React, { useEffect, useState } from "react";
import Container from "../../components/Container";
import Pic4 from "../../assets/images/pic4.svg";
import styles from "./styles.module.scss";
import { createOrUpdateContact } from "../../api/ServerApi";
import Modal from "../../components/Modal";
import { Button } from "react-bootstrap";

const Contact = () => {
	const [inputs, setInputs] = useState({});
	const [show, setShow] = useState(false);
	const token = localStorage.getItem("token");

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}))
	}
	
	inputs.status = 0;
	const handleSubmit = (event) => {
		event.preventDefault();
		createOrUpdateContact(token,inputs).then((res) => {
			setInputs({})
			setShow(true);
		});
		setInputs({})
	}

	return (
		<div className={styles.wrapper}>
			<Container>
				<div className={styles.contentWrapper}>
					<div className={styles.contentText}>
						<h1 className={styles.title}>LIÊN HỆ VỚI CHÚNG TÔI</h1>
						<div className={styles.text}>
							Liên hệ với chúng tôi để giải quyết các khó khăn của bạn.
							Chúng tôi sẽ xem xét và giúp đỡ bạn nhanh chóng nhất có thế.
						</div>
							<small id="emailHelp" className="form-text text-muted">Chúng tôi sẽ không bao giờ chia sẻ thông tin của bạn với bất kỳ ai khác.</small>
						<form onSubmit={handleSubmit}>
							<div className="form-group mt-2">
								<input 
									type="text" 
									className="form-control"  
									name="name" 
									value={inputs.name || ""} 
									onChange={handleChange} 
									placeholder="Tên của bạn..." />
							</div>
							<div className="form-group mt-2">
								<input 
									type="text" 
									className="form-control" 
									name="phone" 
									value={inputs.phone || ""} 
									onChange={handleChange} 
									placeholder="Số điện thoại hoặc Email..." />
							</div>
							<div className="form-group mt-2">
								<input 
									type="text" 
									className="form-control" 
									name="address" 
									value={inputs.address || ""} 
									onChange={handleChange} 
									placeholder="Địa chỉ liên hệ..." />
							</div>
							<div className="form-group mt-2">
								<textarea 
									className="form-control" 
									name="content" 
									value={inputs.content || ""} 
									onChange={handleChange} 
									placeholder="Nội dung..." />
							</div>
							<button type="submit" className="btn btn-warning mt-2">Gửi thông tin</button>
						</form>
					</div>
					<div className={styles.imageWrapper}>
						<img src={Pic4} className={styles.image} />
					</div>
				</div>
			</Container>
			<Modal
				show={show}
				onHide={() => {
					setShow(false);
				}}
				header={"Hòm thư"}
				content="Nội dung của bạn đã được gửi. Chúng tôi sẽ cố gắng phản hồi sớm nhất có thể."
				footer={
					<Button onClick={() => {setShow(false);}}>
						Đồng ý
					</Button>
				}
			></Modal>
		</div>
	);
};

export default Contact;
