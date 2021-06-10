// Student Side Filter Component For Internships
import React, { useState, useEffect, useCallback } from "react";
import { Dropdown, Label, Icon, Button } from "semantic-ui-react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import TagsInput from "react-tagsinput";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import { Hidden } from "@material-ui/core";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./FilterSideBarStudent.css"; 
import "./style.scss";

import { debounce } from "./../../util/helpers";

const useStyles = makeStyles({
	root: {
		marginTop: "0.5em"
	},
	item: {
		width: "13%"
	},
	opprtunity: {
		width: "10%"
	}
});

const FilterSideBarStudent = ({
	filterFormG,
	setFilterFormG,
	status,
	urlFetched,
	setUrlFetched,
	pageNumber,
	setPageNumber
}) => {
	const classes = useStyles();
	const history = useHistory();

	// Loading for Applicants
	const [loading, setLoading] = useState(false);
	const [inputValue, setInputValue] = useState("");

	// Loading for Button
	const [resetLoading, setResetLoading] = useState(false);

	//disabled state for the button of Apply
	const [isDisabled, setIsDisabled] = useState(true);

	// Filter Values from form
	const [studentFilterForm, setStudentFilterForm] = useState({
		stipend: [0, 500000],
		opportunityType: "all",
		jobType: "all",
		status: "all",
		place: "all",
		skills: []
	});

	// Skills input tag
	const [suggestedSkills, setSuggestedSkills] = useState([]);
	const [skill, setSkill] = useState("");

	//slider range values
	const [sliderValue, setSliderValue] = useState([0, 500000]);

	// Stipend Popover
	const [anchorEl, setAnchorEl] = useState(null);
	// Mobile Filter Popover
	const [anchorEl2, setAnchorEl2] = useState(null);

	const [showTick, setShowTick] = useState(false);

	// const [searchFiltersQ, setSearchFiltersQ] = useState({});

	const InternshipOptions = [
		{
			key: "fullTime",
			text: "Full Time",
			value: "fullTime"
		},
		{
			key: "partTime",
			text: "Part Time",
			value: "partTime"
		}
	];

	const OpportunityOptions = [
		{ key: "all", text: "All", value: "all" },
		{
			key: "job",
			text: "Job",
			value: "job"
		},
		{
			key: "internship",
			text: "Internship",
			value: "internship"
		},
		{
			key: "traineeship",
			text: "Traineeship",
			value: "traineeship"
		},
		{
			key: "liveProject",
			text: "Live Project",
			value: "liveProject"
		}
	];
	const PendingOptions = [
		{
			key: "Pending",
			text: "Pending",
			value: "Applied"
		},
		{
			key: "Screening",
			text: "Screening",
			value: "Shortlisted"
		},
		{
			key: "Interview",
			text: "Interview",
			value: "Interview"
		}
	];

	const ClosedOptions = [
		{
			key: "Closed",
			text: "Closed",
			value: "Closed"
		},
		{
			key: "Rejected",
			text: "Rejected",
			value: "Rejected"
		}
	];
	const link = history.location.pathname;

	//fetching the filters from URL and setting it to setudentFilterForm state
	useEffect(() => {
		if (history.location.search.length !== 0) {
			let queries = history.location.search.substr(1);

			let result = {};
			queries.split("&").forEach(query => {
				const item = query.split("=");

				if (item[1].includes(",")) {
					const itemValues = item[1].split(",");
					result[item[0]] = itemValues;
				} else {
					result[item[0]] = decodeURIComponent(item[1]);
				}
			});
			let earn = [];
			if (result.stipend && result.stipend.length > 0) {
				result.stipend.map(el => {
					earn.push(Number(el));
				});
			} else {
				earn = [0, 500000];
			}

			result.stipend = earn;
			if (result.skills && (typeof result.skills === "string" || result.skills instanceof String))
				result.skills = [result.skills];
			setStudentFilterForm(result);
			setFilterFormG(result);
			console.log("Url fetching done!", result);
			setUrlFetched(true);
			setPageNumber(1);
		} else {
			setUrlFetched(true);
		}
	}, []);

	console.log("student filters Results", studentFilterForm);

	const handleApplyFilters = async () => {
		const user_id = localStorage.getItem("user_id");

		setFilterFormG(studentFilterForm);
		setAnchorEl2(null);
		let string = "?";
		let arr = [
			{
				stipend: studentFilterForm.stipend,
				opportunityType: studentFilterForm.opportunityType,
				skills: studentFilterForm.skills,
				jobType: studentFilterForm.jobType,
				place: studentFilterForm.place,
				status: studentFilterForm.status
			}
		];
		for (let key of arr) {
			if (key.stipend !== "" && key.stipend) {
				string += `stipend=${studentFilterForm.stipend}&`;
			}
			if (key.opportunityType !== "" && key.opportunityType) {
				string += `opportunityType=${studentFilterForm.opportunityType}&`;
			}
			if (key.skills !== "" && key.skills && key.skills.length !== 0) {
				string += `skills=${studentFilterForm.skills}&`; //Some Problem Here
			}
			if (key.jobType !== "" && key.jobType) {
				string += `jobType=${studentFilterForm.jobType}&`;
			}
			if (key.place !== "" && key.place) {
				string += `place=${studentFilterForm.place}&`;
			}
			if (key.status !== "" && key.status) {
				string += `status=${studentFilterForm.status}`;
			}
		}
		if (
			!studentFilterForm.stipend &&
			!studentFilterForm.opportunityType &&
			!studentFilterForm.partTime &&
			!studentFilterForm.fullTime &&
			!studentFilterForm.status &&
			!studentFilterForm.place &&
			(!studentFilterForm.skills || studentFilterForm.skills.length === 0)
		) {
			history.replace(link);
		}
		if (string.endsWith("&")) {
			string = string.slice(0, -1);
			// console.log("StringX", string)
		}
		if (!string.endsWith("?")) {
			history.replace(link + string);
		}
		setPageNumber(1);
	};
	// if(url)

	//  Reset Filters
	const onReset = () => {
		// setStudentFilterForm({});
		let initialState = {
			stipend: [0, 500000],
			opportunityType: "all",
			jobType: "all",
			status: "all",
			place: "all",
			skills: []
		};
		setStudentFilterForm(initialState);
		setFilterFormG(initialState);
		setAnchorEl2(null);
		setShowTick(false);
		setSkill([]);
		setIsDisabled(true);
		history.replace(link);
		setInputValue("");
		setPageNumber(1);
	};

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleClick2 = event => {
		setAnchorEl2(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleClose2 = () => {
		setAnchorEl2(null);
	};

	const open = Boolean(anchorEl);
	const open2 = Boolean(anchorEl2);
	const id = open ? "simple-popover" : undefined; // For Stipend Popover
	const id2 = open2 ? "simple-popover" : undefined; // For Skills Popover

	// SKILLS SELECT CHANGE__
	const pasteSplit = data => {
		const separators = [",", ";", "\\(", "\\)", "\\*", "/", ":", "\\?", "\n", "\r"];
		const splitData = data.split(new RegExp(separators.join("|"))).map(d => d.trim());
		return splitData;
	};
	const handleSkillsUsed = skills => {
		setStudentFilterForm({ ...studentFilterForm, skills: skills });
		setSuggestedSkills([]);
	};
	const handleLocationUsed = event => {
		// console.log(event.target.value);
		setInputValue(event.target.value);
		setStudentFilterForm({
			...studentFilterForm,
			place: event.target.value
		});
	};

	const handleChangeInput = async tag => {
		let skills = [];
		if (tag.length !== 0) {
			setLoading(true);
			const { data: results } = await axios.get(
				`${process.env.REACT_APP_ML_URL}/skill_autocomplete?search=${tag}`
			);
			results.result.map(res => {
				skills.push({ tag: res });
			});
			skills.unshift({ tag });
		}
		setSuggestedSkills(skills);
		setLoading(false);
		setIsDisabled(false);
	};

	const debouncedHandleChangeInput = useCallback(debounce(handleChangeInput, 200), []);

	const handleResultSelect = (e, tag) => {
		const previousSkills = studentFilterForm.skills || [];
		setStudentFilterForm({
			...studentFilterForm,
			skills: [...previousSkills, tag]
		});
		setSkill("");
		setSuggestedSkills([]);
	};

	// this useEffect checks if there is any filter selected or not if not then apply button will be disabled
	useEffect(() => {
		if (
			studentFilterForm.skills ||
			studentFilterForm.place ||
			studentFilterForm.stipend ||
			showTick ||
			studentFilterForm.opportunityType ||
			studentFilterForm.jobType
		) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [
		studentFilterForm.skills,
		studentFilterForm.place,
		showTick,
		studentFilterForm.stipend,
		studentFilterForm.opportunityType,
		studentFilterForm.jobType
	]);

	const resultRenderer = suggestions => {
		return (
			<div
				id="skill-label"
				style={{
					position: "absolute",
					backgroundColor: "#fbfdff",
					textAlign: "left",
					width: "56%",
					marginTop: "0.5em",
					borderRadius: "0.28rem",
					border: "1px solid #d4d4d5",
					zIndex: "998",
					boxShadow: "0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15)",
					height: "10em",
					overflow: "auto"
				}}
			>
				{suggestions.map((sug, index) => (
					<div
						onClick={e => handleResultSelect(e, sug.tag)}
						key={index}
						style={{
							cursor: "pointer",
							display: "block",
							overflow: "hidden",
							fontSize: "1.2em",
							padding: "0.5em 1.2em",
							borderBottom: "1px solid rgba(34,36,38,.1)"
						}}
					>
						<Label content={sug.tag} style={{ backgroundColor: "#ffd369" }} />
					</div>
				))}
			</div>
		);
	};

	const handleChange = (event, newValue) => {
		console.log(newValue);
		setSliderValue(newValue);
		setStudentFilterForm({ ...studentFilterForm, stipend: newValue });
		setShowTick(true);
	};

	function valueText(value) {
		return `${value} Rs`;
	}

	const handleChangeInternshipType = (e, data) => {
		console.log("Dues", data);
		setStudentFilterForm({
			...studentFilterForm,
			jobType: data.value
		});
	};

	const handleChangeOpportunityType = (e, data) => {
		setStudentFilterForm({
			...studentFilterForm,
			opportunityType: data.value
		});
	};

	const handleChangePendingType = (e, data) => {
		setStudentFilterForm({ ...studentFilterForm, status: data.value });
	};

	const handleChangeClosedType = (e, data) => {
		setStudentFilterForm({ ...studentFilterForm, status: data.value });
	};

	return (
		<Grid container spacing={1} style={{}} justify="space-around">
			<Hidden mdDown>
				<Grid
					item
					style={{
						textAlign: "center",
						fontSize: "20px",
						padding: "16px 0px"
					}}
				>
					Filter By
				</Grid>
				<Grid item classes={{ root: classes.root, item: classes.item }}>
					<Button
						icon
						labelPosition="right"
						style={{
							width: "100%",
							backgroundColor: "#FFFFFF",
							border: "1px solid #ccc"
						}}
						onClick={handleClick}
					>
						<h6
							style={{
								display: "inline-block",
								fontSize: "18px",
								color: "#D4D4D4"
							}}
						>
							Stipend &nbsp;
						</h6>
						{studentFilterForm.stipend[0] != 0 ||
							(studentFilterForm.stipend[1] != 500000 && (
								<i
									className="fas fa-check-circle"
									style={{
										display: "inline-block",
										color: "green"
									}}
								/>
							))}
						<Icon name="caret down" />
					</Button>
					<Popover
						id={id}
						open={open}
						anchorEl={anchorEl}
						onClose={handleClose}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "center"
						}}
						transformOrigin={{
							vertical: "top",
							horizontal: "center"
						}}
					>
						<h3
							style={{
								marginLeft: "20px",
								marginTop: "10px"
							}}
						>
							Enter the range &nbsp;
						</h3>
						<Slider
							style={{
								color: "#F7EE39",
								width: "500px",
								marginLeft: "20px",
								marginRight: "20px"
							}}
							value={studentFilterForm.stipend || sliderValue}
							onChange={handleChange}
							valueLabelDisplay="auto"
							aria-labelledby="range-slider"
							getAriaValueText={valueText}
							step={200}
							min={0}
							max={500000}
						/>
					</Popover>
				</Grid>
				{status && status !== "inprogress" && status !== "closed" ? (
					<Grid item style={{ padding: "16px 0px" }} classes={{ item: classes.item }}>
						<Dropdown
							style={{ fontSize: "16px", width: "90%" }}
							placeholder="Select Type"
							fluid
							selection
							value={studentFilterForm.jobType == "all" ? "" : studentFilterForm.jobType}
							options={InternshipOptions}
							onChange={handleChangeInternshipType}
							className="dropdown"
						/>
					</Grid>
				) : (
					<Grid item style={{ padding: "16px 0px" }} classes={{ item: classes.item }}>
						<Dropdown
							style={{ fontSize: "16px", width: "90%" }}
							placeholder="Select Type"
							fluid
							selection
							value={studentFilterForm.jobType == "all" ? "" : studentFilterForm.jobType}
							options={InternshipOptions}
							onChange={handleChangeInternshipType}
							className="dropdown"
						/>
					</Grid>
				)}
				{status && status === "inprogress" ? (
					<Grid item xs={2} style={{ padding: "16px 0px" }}>
						<Dropdown
							style={{ fontSize: "18px", width: "100%" }}
							placeholder="Status Type"
							value={studentFilterForm.status == "all" ? "" : studentFilterForm.status}
							fluid
							selection
							options={PendingOptions}
							onChange={handleChangePendingType}
							className="dropdown"
						/>
					</Grid>
				) : status && status === "closed" ? (
					<Grid item xs={2} style={{ padding: "16px 0px" }}>
						<Dropdown
							style={{ fontSize: "18px", width: "90%" }}
							placeholder="Status Type"
							value={studentFilterForm.status == "all" ? "" : studentFilterForm.status}
							fluid
							selection
							options={ClosedOptions}
							onChange={handleChangeClosedType}
							className="dropdown"
						/>
					</Grid>
				) : null}

				<Grid item style={{ padding: "16px 0px" }} classes={{ item: classes.item }}>
					<Dropdown
						style={{ fontSize: "18px", width: "100%" }}
						placeholder="Opportunity"
						fluid
						selection
						value={studentFilterForm.opportunityType == "all" ? "" : studentFilterForm.opportunityType}
						options={OpportunityOptions}
						onChange={handleChangeOpportunityType}
						className="dropdown"
					/>
				</Grid>
				<Grid item style={{ padding: "16px 0px", marginLeft: "1em" }}>
					<div style={{ width: "100%", fontSize: "18px" }}>
						<input
							style={{ padding: "0rem" }}
							className="input-location"
							placeholder="Locations"
							value={studentFilterForm.place == "all" ? "" : studentFilterForm.place}
							onChange={handleLocationUsed}
						/>
					</div>
				</Grid>
				<Grid item xs={2} style={{ padding: "16px 0px" }} className="input-div">
					<div style={{ width: "100%" }}>
						<TagsInput
							className="tags-input"
							inputProps={{
								className: "react-tagsinput-input",
								placeholder: "Enter a skill and press ENTER"
							}}
							pasteSplit={pasteSplit}
							value={studentFilterForm.skills || []}
							onChange={handleSkillsUsed}
							inputValue={skill}
							onChangeInput={tag => {
								setSkill(tag);
								debouncedHandleChangeInput(tag);
							}}
						/>

						{suggestedSkills.length > 0 ? resultRenderer(suggestedSkills) : null}
					</div>
				</Grid>
				<Grid item xs={1} style={{ marginLeft: "0px", padding: "16px 0px" }}>
					<Button
						disabled={isDisabled}
						style={{ backgroundColor: "#f7ee39" }}
						onClick={handleApplyFilters}
						id="apply-filter-btn"
					>
						{loading ? "Loading..." : "Apply"}
					</Button>
				</Grid>
				<Grid item xs={1} classes={{ root: classes.root }}>
					<Button
						disabled={isDisabled}
						style={{ backgroundColor: "#f7ee39" }}
						onClick={onReset}
						id="reset-filter-btn"
					>
						{resetLoading ? "Loading..." : "Reset"}
					</Button>
				</Grid>
			</Hidden>
			<Hidden lgUp>
				<Grid item xs={4} style={{ marginTop: "30px", textAlign: "center" }}>
					<Button
						style={{
							backgroundColor: "#f7ee39",
							width: "100px"
						}}
						onClick={handleClick2}
					>
						Filters
					</Button>
					<Popover
						id={id2}
						open={open2}
						anchorEl={anchorEl2}
						onClose={handleClose2}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "center"
						}}
						transformOrigin={{
							vertical: "top",
							horizontal: "center"
						}}
					>
						<Grid container spacing={2} style={{ marginTop: "20px" }}>
							<Grid item xs={3}>
								&nbsp;Stipend
							</Grid>
							<Grid item xs={8}>
								<Slider
									style={{
										color: "#F7EE39"
									}}
									value={sliderValue}
									onChange={handleChange}
									valueLabelDisplay="auto"
									aria-labelledby="range-slider"
									getAriaValueText={valueText}
									step={200}
									min={0}
									max={500000}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item xs={3}>
								&nbsp;Skills
							</Grid>
							<Grid item xs={9}>
								<div>
									<TagsInput
										style={{}}
										inputProps={{
											className: "react-tagsinput-input",
											placeholder: "Enter skill & press ENTER"
										}}
										pasteSplit={pasteSplit}
										value={studentFilterForm.skills || []}
										onChange={handleSkillsUsed}
										inputValue={skill}
										onChangeInput={tag => {
											setSkill(tag);
											debouncedHandleChangeInput(tag);
										}}
									/>
									{suggestedSkills.length > 0 ? resultRenderer(suggestedSkills) : null}
								</div>
							</Grid>
							<Grid container spacing={2}>
								<Grid item xs={3} style={{ paddingLeft: "15px" }}>
									&nbsp; Type
								</Grid>
								<Grid item xs={8}>
									<Dropdown
										placeholder="Select Type"
										fluid
										selection
										options={InternshipOptions}
										onChange={handleChangeInternshipType}
									/>
								</Grid>
							</Grid>
							{status && status == "inprogress" ? (
								<Grid container spacing={2}>
									<Grid item xs={3} style={{ paddingLeft: "15px" }}>
										&nbsp; Status
									</Grid>
									<Grid item xs={8}>
										<Dropdown
											placeholder="Status Type"
											fluid
											selection
											options={PendingOptions}
											onChange={handleChangePendingType}
										/>
									</Grid>
								</Grid>
							) : status && status == "closed" ? (
								<Grid container spacing={2}>
									<Grid item xs={3} style={{ paddingLeft: "15px" }}>
										&nbsp; Status
									</Grid>
									<Grid item xs={8}>
										<Dropdown
											placeholder="Status Type"
											fluid
											selection
											options={ClosedOptions}
											onChange={handleChangeClosedType}
										/>
									</Grid>
								</Grid>
							) : null}
							<Grid container spacing={8} style={{ marginTop: "40px" }} justify="space-around">
								<Grid item xs={5}>
									<Button
										style={{ backgroundColor: "#f7ee39" }}
										onClick={handleApplyFilters}
										id="apply-filter-btn"
									>
										{loading ? "Loading..." : "Apply"}
									</Button>
								</Grid>
								<Grid item xs={5}>
									<Button
										style={{ backgroundColor: "#f7ee39" }}
										onClick={onReset}
										id="reset-filter-btn"
									>
										{resetLoading ? "Loading..." : "Reset"}
									</Button>
								</Grid>
							</Grid>
						</Grid>
						<br />
						<br />
					</Popover>
				</Grid>
			</Hidden>
		</Grid>
	);
};

export default FilterSideBarStudent;
