import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import Search from "../../components/Search";
import { AiOutlineSearch } from "react-icons/ai";
import { Tab, TabComponent } from "../../components/Tab";
import Container from "../../components/Container";
import { useNavigate, useParams } from "react-router-dom";
import * as _ from "lodash";
import { getNormal, getInternal } from "../../api/ExplorerAPI";
import Table from "../../components/Table";
import { getBalace } from "../../api/ExplorerAPI";
import { Link } from "react-router-dom";
import { useLibrary } from "../../helpers/Hook";
import moment from "moment";
import styles from "./styles.module.scss";
import Loading from "../../components/Loading";
import { roundNumber } from "../../utils/number";

const ExplorerDetail = () => {
	const [newAddress, setNewAddress] = useState();
	const [data1, setData1] = useState([]);
	const [data2, setData2] = useState([]);
	const [balance, setBalance] = useState();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const library = useLibrary();

	const params = useParams();
	const address = params.address;

	const columnsInternal = [
		{
			name: "Txn Hash",
			selector: (row) => (
				<a
					href={`https://kovan.etherscan.io/tx/${row.hash}`}
					target={"_blank"}
					style={{ textDecoration: "none" }}
				>
					{row.hash}
				</a>
			),
			width: "200px",
		},
		{
			name: "Block",
			selector: (row) => row.blockNumber,
			width: "100px",
		},
		{
			name: "Time",
			selector: (row) => moment.unix(row.timeStamp).format("YYYY-MM-DD"),
			width: "120px",
		},
		{
			name: "From",
			selector: (row) => (
				<Link to={`/explorer/${row.from}`} style={{ textDecoration: "none" }}>
					{row.from}
				</Link>
			),
			width: "200px",
		},
		{
			selector: (row) => (
				<div
					// {console.log(row.to, address}
					style={{
						color:
							row.to.toLowerCase() === address.toLowerCase()
								? "#02977e"
								: "#b47d00",
						backgroundColor:
							row.to.toLowerCase() === address.toLowerCase()
								? "rgba(0,201,167,.2)"
								: "rgba(219,154,4,.2)",
						padding: "3px 8px",
						fontWeight: "500",
					}}
				>
					{row.to.toLowerCase() === address.toLowerCase() ? "IN" : "OUT"}
				</div>
			),
			width: "90px",
		},
		{
			name: "To",
			selector: (row) => (
				<Link to={`/explorer/${row.to}`} style={{ textDecoration: "none" }}>
					{row.to}
				</Link>
			),
			width: "200px",
		},
		{
			name: "Value",
			selector: (row) => (
				<span>{roundNumber(row.value / 1000000000000000000)} ETH</span>
			),
			width: "100px",
		},
	];
	const columnsTransaction = [
		{
			name: "Txn Hash",
			selector: (row) => (
				<a
					href={`https://kovan.etherscan.io/tx/${row.hash}`}
					target={"_blank"}
					style={{ textDecoration: "none" }}
				>
					{row.hash}
				</a>
			),
			width: "200px",
		},
		{
			name: "Block",
			selector: (row) => row.blockNumber,
			width: "100px",
		},
		{
			name: "Time",
			selector: (row) => moment.unix(row.timeStamp).format("YYYY-MM-DD"),
			width: "120px",
		},
		{
			name: "From",
			selector: (row) => (
				<Link to={`/explorer/${row.from}`} style={{ textDecoration: "none" }}>
					{row.from}
				</Link>
			),
			width: "200px",
		},
		{
			selector: (row) => (
				<div
					// {console.log(row.to, address}
					style={{
						color:
							row.to.toLowerCase() === address.toLowerCase()
								? "#02977e"
								: "#b47d00",
						backgroundColor:
							row.to.toLowerCase() === address.toLowerCase()
								? "rgba(0,201,167,.2)"
								: "rgba(219,154,4,.2)",
						padding: "3px 8px",
						fontWeight: "500",
					}}
				>
					{row.to.toLowerCase() === address.toLowerCase() ? "IN" : "OUT"}
				</div>
			),
			width: "90px",
		},
		{
			name: "To",
			selector: (row) => (
				<Link to={`/explorer/${row.to}`} style={{ textDecoration: "none" }}>
					{row.to}
				</Link>
			),
			width: "200px",
		},
		{
			name: "Value",
			selector: (row) => (
				<span>{roundNumber(row.value / 1000000000000000000)} ETH</span>
			),
			width: "100px",
		},
	];

	const handleClickExplorer = () => {
		navigate("/explorer/" + newAddress);
	};
	useEffect(() => {
		if (library.utils.isAddress(address)) {
			setLoading(true);
			const getData = async () => {
				const promise = [];
				promise.push(getNormal(address));
				promise.push(getInternal(address));
				promise.push(getBalace(address));
				console.log(address);
				let [res1, res2, res3] = await Promise.all(promise);
				setData1(res1.data.result);
				setData2(res2.data.result);
				setBalance(res3.data.result);
			};
			getData().then((res) => {
				setLoading(false);
			});
		}
	}, [address]);

	console.log(data2);
	return (
		<div className={styles.wrapper}>
			<div className={styles.headerDetail}>
				<img
					src={`https://bscscan.com/images/svg/components/abstract-shapes-20.svg?v=2`}
				/>
				<div className={styles.contentWrapper}>
					<div className={styles.content}>
						<h1 className={styles.title}>Trình khám phá chuỗi khối</h1>
						<div className={styles.searhWrapper}>
							<Search
								placeholder="Tìm kiếm theo địa chỉ ví/ địa chỉ dự án"
								hideIcon={true}
								className={styles.searchInput}
								onChange={(event) => setNewAddress(event.target.value)}
							/>
							<div className={styles.buttonSearch}>
								<Button
									onClick={handleClickExplorer}
									disabled={_.isEmpty(newAddress)}
								>
									<AiOutlineSearch />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
			{loading ? (
				<Loading style={{ height: "100px" }} />
			) : library.utils.isAddress(address) ? (
				<Container>
					<div className={styles.headerCard}>
						<div className={styles.cardWrapper}>
							<div className={styles.titleAddress}>
								<div className={styles.address}>Địa chỉ ví</div>
								<div className={styles.value}>{address}</div>
							</div>
							<a
								className={styles.viewInExplorer}
								target={"_blank"}
								href={`https://kovan.etherscan.io/address/${address}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
									<polyline points="15 3 21 3 21 9"></polyline>
									<line x1="10" y1="14" x2="21" y2="3"></line>
								</svg>
								<span style={{ marginLeft: "4px" }}>
									Xem thêm trên EtherScan
								</span>
							</a>
						</div>
						<div className={styles.titleBalance}>
							Số dư:
							<span className={styles.value}>
								{balance && roundNumber(library.utils.fromWei(balance))} ETH
							</span>
						</div>
					</div>
					<div className={styles.card}>
						<Tab className={styles.tab}>
							<TabComponent eventKey="desc" title="Transactions">
								<Table data={data1} columns={columnsTransaction} />
							</TabComponent>
							<TabComponent eventKey="internal-txns" title="Internal Txns">
								<Table data={data2} columns={columnsInternal} />
							</TabComponent>
						</Tab>
					</div>
				</Container>
			) : (
				<Container>
					<div className={styles.backgroundNotFound}>
						<div className={styles.searchNotFound}>
							<h1>404</h1>
							<p>KHÔNG TÌM THẤY!</p>
						</div>
					</div>
				</Container>
			)}
		</div>
	);
};

export default ExplorerDetail;
