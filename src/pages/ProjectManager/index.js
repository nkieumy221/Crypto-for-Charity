import React, { useEffect, useState, useRef } from "react";
import styles from "./styles.module.scss";
import {
	addCharityProject,
	getAllProject,
	getProjectInfo,
} from "../../api/CharityApi";
import { getContract, getCharityAdress } from "../../helpers/Contract";
import { useWeb3React } from "@web3-react/core";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import Container from "../../components/Container";
import { useLibrary } from "../../helpers/Hook";
import Button from "../../components/Button";
import Search from "../../components/Search";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import EthIcon from "../../assets/images/icon-eth.png";
import { createOrUpdate } from "../../api/ServerApi";
import Loading from "../../components/Loading";
import Input from "../../components/Input";
import { deleteCharityProject } from "../../api/CharityApi";
import { deleteProjectByAddress } from "../../api/ServerApi";
import * as _ from "lodash";
import Web3Token from "web3-token";
import { roundNumber } from "../../utils/number";
import AddressComponent from "../../components/Address";

const ProjectManager = () => {
	const { active, account } = useWeb3React();
	const [loading, setLoading] = useState(false);
	const [rerender, setRerender] = useState(false);
	const [token, setToken] = useState();
	const [search, setSearch] = useState("");
	const [error, setError] = useState();
	const [buttonLoading, setButtonLoading] = useState(false);

	const navigate = useNavigate();
	const handleClickEdit = (address) => {
		navigate("/auth/project/" + address + "/edit");
	};

	const handleClickDelete = async (address) => {
		const contract = await getcontract();
		setButtonLoading(true);
		deleteCharityProject(contract, account, address)
			.then(() => {
				setRerender(!rerender);
				setShowDeleteProject(false);
				deleteProjectByAddress(token, address);
				setButtonLoading(false);
			})
			.catch((e) => {
				setButtonLoading(false);
			});
	};

	const library = useLibrary();

	useEffect(() => {
		if (!account) {
			return navigate("/");
		}
		const newToken = async () => {
			const newToken = await Web3Token.sign(
				(msg) => library.eth.personal.sign(msg, account),
				"1d"
			);
			localStorage.setItem("token", newToken);
			setToken(newToken);
		};
		let token = localStorage.getItem("token");
		if (!_.isEmpty(token)) {
			try {
				const { address, body } = Web3Token.verify(token);
				if (new Date(body["expiration-time"]) > new Date()) {
					setToken(token);
					return;
				}
			} catch (e) {
				console.log(e);
			}
		}
		newToken();
	}, [active]);

	const getcontract = async () => {
		return await getContract(library, getCharityAdress());
	};

	////
	const columnsProject = [
		{
			name: "Địa chỉ dự án",
			selector: (row) => <AddressComponent address={row.address} />,
			maxWidth: "150px",
		},
		{
			name: "Tên dự án",
			selector: (row) => row.name,
			sortable: true,
			maxWidth: "350px",
		},
		{
			name: "Loại tiền",
			selector: (row) => (
				<div className={styles.currencyTable}>
					<img src={EthIcon} />
					ETH
				</div>
			),
			maxWidth: "100px",
		},
		{
			name: "Số dư",
			selector: (row) => row.balance,
			maxWidth: "100px",
			sortable: true,
		},
		{
			name: "Mục tiêu",
			selector: (row) => row.target,
			maxWidth: "120px",
			sortable: true,
		},
		{
			name: "Trạng thái",
			selector: (row) => (
				<div className={styles.projectStatus}>
					<div
						className={
							row.status === "Chưa diễn ra"
								? styles.setup
								: row.status === "Đang diễn ra"
								? styles.running
								: styles.finnish
						}
					>
						{row.status}
					</div>
				</div>
			),
			maxWidth: "150px",
			sortable: true,
		},
		{
			name: "",
			selector: (row) => (
				<div className={styles.actionTable}>
					<FiEdit2 onClick={() => handleClickEdit(row.address)} />
					{row.status === "Chưa diễn ra" && (
						<>
							<FiTrash2 onClick={() => setShowDeleteProject(true)} />

							<Modal
								show={showDeleteProject}
								onHide={hideDeleteProject}
								header={"Xóa dự án"}
								content={
									<div className={styles.deleteGroup}>
										<div className={styles.content}>
											Bạn có chắc chắn muốn xóa?
										</div>
										<div className={styles.modalAction}>
											<Button
												onClick={() => handleClickDelete(row.address)}
												loading={buttonLoading}
											>
												Xóa
											</Button>
											<Button typeButton="action" onClick={hideDeleteProject}>
												Hủy
											</Button>
										</div>
									</div>
								}
							></Modal>
						</>
					)}
				</div>
			),
			ignoreRowClick: true,
			allowOverflow: true,
			button: true,
			width: "60px",
		},
	];

	const getDataTable = (rawData) => {
		return rawData?.map((item) => {
			return {
				address: item[0],
				name: item[1],
				balance: roundNumber(library.utils.fromWei(item[3])),
				target: roundNumber(library.utils.fromWei(item[2])),
				status:
					item[8] === "0"
						? "Chưa diễn ra"
						: item[8] === "1"
						? "Đang diễn ra"
						: "Đã kết thúc",
			};
		});
	};
	///

	const [info, setInfo] = useState();
	const getInfo = (contract, address) => {
		return getProjectInfo(contract, address);
	};

	useEffect(() => {
		setLoading(true);
		const getData = async () => {
			const projectInfo = [];
			const contract = await getcontract();
			const myProject = await getAllProject(contract);
			// console.log(myProject);
			if (myProject.length < 1) return;
			myProject.forEach((element) => {
				projectInfo.push(getInfo(contract, element));
			});
			const data = await Promise.all(projectInfo);
			setInfo(data.reverse());
			setLoading(false);
		};
		getData();
	}, [rerender]);

	///Modal Add Project
	const [showAddProject, setShowAddProject] = useState(false);

	const addProject = async (e) => {
		e.preventDefault();
		if (e.target[0].value.trim() === "") {
			setError("Vui lòng nhập đủ các trường!");
			return;
		}
		const contract = await getcontract();
		setButtonLoading(true);
		addCharityProject(
			contract,
			account,
			e.target[0].value,
			library.utils.toWei(e.target[1].value)
		)
			.then((res) => {
				setShowAddProject(false);
				setRerender(!rerender);
				let tempProject = {
					address: res.events.addCharityProjectEvent.returnValues[1],
					image: "",
					description: "",
					problem: "",
					infomation: "",
				};
				createOrUpdate(token, tempProject);
				setButtonLoading(false);
			})
			.catch((err) => {
				setButtonLoading(false);
				console.log(err);
			});
	};

	const [showDeleteProject, setShowDeleteProject] = useState(false);
	const hideDeleteProject = () => {
		setShowDeleteProject(false);
	};

	const hideAddProject = () => {
		setError("");
		setShowAddProject(false);
	};
	const showModalAddProject = () => {
		setShowAddProject(true);
	};

	const searchFunction = (data, item) => {
		const keyword = item.toLowerCase();
		return data.filter(
			(x) =>
				x[0].toLowerCase().includes(keyword) ||
				x[1].toLowerCase().includes(keyword)
		);
	};

	let dataDisplay = _.cloneDeep(info);

	if (search && info) {
		console.log("search", searchFunction(info, search));
		dataDisplay = searchFunction(info, search);
	}

	return _.isEmpty(token) ? (
		<Loading style={{ height: "100vh" }} />
	) : (
		<div className={styles.wrapper}>
			<Container>
				<h3 className={styles.title}>Dự án từ thiện</h3>
				<div className={styles.action}>
					<Button className={styles.add} onClick={showModalAddProject}>
						Thêm mới
					</Button>
					<Search
						className={styles.search}
						placeholder="Tìm kiếm"
						onChange={(event) => setSearch(event.target.value)}
					/>
				</div>
				<Table
					fixedHeader={true}
					fixedHeaderScrollHeight={"100%"}
					columns={columnsProject}
					progressPending={loading}
					data={getDataTable(dataDisplay)}
				></Table>
				<Modal
					show={showAddProject}
					onHide={hideAddProject}
					header={"Thêm mới"}
					content={
						<div>
							<form className={styles.form} onSubmit={addProject}>
								{!_.isEmpty(error) && <p style={{ color: "red" }}>{error}</p>}
								<Input label="Tên dự án" name="name" required />
								<div className={styles.amountGroup}>
									<Input
										label="Mục tiêu"
										name="target"
										required
										type="number"
										step=".01"
									/>
									<div className={styles.logoGroup}>
										<img src={EthIcon} /> <span> ETH</span>
									</div>
								</div>
								<div className={styles.modalAction}>
									<Button type="submit" loading={buttonLoading}>
										Lưu
									</Button>
									<Button
										typeButton="action"
										type="button"
										onClick={hideAddProject}
									>
										Hủy
									</Button>
								</div>
							</form>
						</div>
					}
				></Modal>
			</Container>
		</div>
	);
};

export default ProjectManager;
