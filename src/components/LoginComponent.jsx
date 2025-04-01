import React, { useState } from 'react';
import { TextField, Button, Box, Link as MuiLink, Alert, Checkbox, FormControlLabel, FormControl, FormGroup, Typography, Slider, CircularProgress, InputLabel, Select, MenuItem } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import CloseIcon from '@mui/icons-material/Close';

import PrivacyPolicyDialog from '../pages/PrivacyPolicyDialog';

const apiUrl = process.env.REACT_APP_API_URL;

function LoginComponent({ type, setLoginOpen, setLoginType }) {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [role, setRole] = useState("");
	const [activeStep, setActiveStep] = useState(0);

	const handleChangeRole = (event) => {
		const selectedRole = event.target.value;
		setRole(selectedRole);
		setFormData((prev) => ({
			...prev,
			role: selectedRole,
		}));
	};

	const loginAnimation = {
		hidden: { opacity: 1, scale: 0.1 },
		visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
		exit: { opacity: 0, scale: 0, transition: { duration: 0.25, ease: 'easeIn' } },
	};

	const formFields = [
		{ label: 'Nome', name: 'nome', type: 'text', required: true, roles: ['studente', 'insegnante'] },
		{ label: 'Cognome', name: 'cognome', type: 'text', required: true, roles: ['studente', 'insegnante'] },
		{ label: 'Email', name: 'email', type: 'email', required: true, roles: ['studente', 'insegnante'], showInLogin: true },
		{ label: 'Password', name: 'password', type: 'password', required: true, roles: ['studente', 'insegnante'], showInLogin: true },
		{ label: 'Numero di Telefono', name: 'tel', type: 'text', required: true, roles: ['studente', 'insegnante'] },
		{ label: 'Studi o lavori?', name: 'activities', type: 'checkboxSchoolOrWork', required: true, roles: ['studente'] },
		{ label: 'Posso dare ripetizioni', name: 'ripetizioni', type: 'checkboxRipetizioni', required: false, roles: ['studente'] },
		{ label: 'Università', name: 'university', type: 'text', required: false, roles: ['studente'], dependencies: ['school'] },
		{ label: 'Facoltà', name: 'faculty', type: 'text', required: false, roles: ['studente'], dependencies: ['school'] },
		{ label: 'Quanto ti puoi spostare?', name: 'distance', type: 'slider', required: true, roles: ['studente'] },
		{ label: 'Luogo di lavoro', name: 'work', type: 'text', required: false, roles: ['studente'], dependencies: ['work'] },
		{ label: 'Note', name: 'note', type: 'text', required: false, roles: ['studente'] }
	];

	let filteredFields;

	if (type == "login") {
		filteredFields = formFields.filter(field => field.showInLogin == true);
	} else {
		filteredFields = formFields.filter(field => field.roles.includes(role));
	}

	const initialFormData = filteredFields.reduce((acc, field) => {
		acc[field.name] = '';
		return acc;
	}, {});

	const [formData, setFormData] = useState(initialFormData);
	const [schoolChecked, setSchoolChecked] = useState(false);
	const [workChecked, setWorkChecked] = useState(false);
	const [distance, setDistance] = useState(10);
	const [ripetizioni, setRipetizioni] = useState(false);



	////////////// STEP FORM //////////////

	const steps = ['Seleziona il tuo ruolo', 'Compila il form'];

	const handleNext = () => {
		if (activeStep < steps.length - 1) {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	///////////////////////////////////////



	////////////// HANDLE FORM //////////////

	const label = { inputProps: { 'aria-label': 'Checkbox demo' } }; // Per checkbox ripetizioni

	const [privacyOpen, setPrivacyOpen] = useState(false);
	const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const checkboxDistanceChange = (e) => {
		const { name, checked } = e.target;

		if (name === 'scuola') setSchoolChecked(checked);
		else if (name === 'lavoro') setWorkChecked(checked);

		const arrayActivities = Array.isArray(formData.activities) ? formData.activities : [];

		const updatedActivities = checked
			? [...arrayActivities, name]
			: arrayActivities.filter(val => val !== name);

		setFormData({
			...formData,
			activities: updatedActivities
		});
	};

	const checkboxRipetizioni = (e) => {
		const { name, checked } = e.target;
		setRipetizioni(checked)
		setFormData({
			...formData,
			ripetizioni: checked
		});
	}

	const handleSliderChange = (e, newValue) => {
		setDistance(newValue);
		setFormData({
			...formData,
			distance: newValue
		});
	};

	////////////////////////////////////

	////////////// SUBMIT //////////////
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!acceptedPrivacy && type !== 'login') {
			setErrorMessage("Devi accettare l'informativa sulla privacy.");
			console.log(acceptedPrivacy)
			return;
		}

		const dataToSend = filteredFields.reduce((acc, field) => {
			acc[field.name] = {
				value: formData[field.name],
				required: field.required
			};
			return acc;
		}, { type });

		dataToSend.role = formData.role;

		if (type !== "login" && role !== "insegnante") {
			dataToSend.distance = {
				value: distance,
				required: true
			};

			dataToSend.activities = {
				value: formData.activities || [],
				required: false
			};

			dataToSend.ripetizioni = {
				value: formData.ripetizioni || false,
				required: false
			};
		}

		const regex = /^\d+(\.\d+)?$/;
		if (regex.test(formData.tel) && formData.tel.length !== 10) {
			setErrorMessage("Numero di telefono non valido");
			return;
		}

		setErrorMessage('');
		setIsLoading(true);

		try {
			const response = await fetch(`${apiUrl}/api/users/${type === 'login' ? 'login' : 'create-user'}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(dataToSend),
			});

			const data = await response.json();

			if (response.ok) {
				setFormData(initialFormData);
				navigate('/dashboard');
			} else {
				console.log(data.error);
				setErrorMessage(data.error || 'Problema di rete');
			}
		} catch (error) {
			console.error('Errore di rete:', error);
		} finally {
			setIsLoading(false);
		}
	};
	////////////////////////////////////

	return (
		<AnimatePresence>
			<motion.div
				variants={loginAnimation}
				initial="hidden"
				animate="visible"
				exit="exit"
			>

				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						backgroundColor: 'white',
						padding: '40px',
						borderRadius: '15px',
						width: '400px',
						margin: 'auto',
						boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
						maxHeight: '80vh',
						overflowY: 'auto',
						width: '73%',
						minWidth: '270px',
						minHeight: '250px',
					}}
				>
					{errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
					<CloseIcon style={{ cursor: 'pointer' }}
						onClick={() => {
							setLoginOpen(false);
							setLoginType('');
						}}
					></CloseIcon>

					<>
						{type == "signin" && (
							<Stepper activeStep={activeStep}>
								{steps.map((label, index) => {
									const stepProps = {};
									const labelProps = {};
									return (
										<Step key={label} {...stepProps}>
											<StepLabel {...labelProps}>{label}</StepLabel>
										</Step>
									);
								})}
							</Stepper>
						)}


						{activeStep == 0 && type == "signin" ? (
							<>
								<FormControl sx={{ minWidth: 120, margin: "40px 0px" }}>
									<InputLabel id="selectRole">Ruolo</InputLabel>
									<Select
										labelId="selectRole"
										id="selectRole"
										value={role}
										label="Ruolo"
										onChange={handleChangeRole}
									>
										<MenuItem value={"studente"}>Studente</MenuItem>
										<MenuItem value={"insegnante"}>Insegnante</MenuItem>
									</Select>
								</FormControl>
							</>
						) : (
							<>
								{filteredFields.map((field) => {
									const isDependencyMet = !field.dependencies || field.dependencies.every(dep => (dep === 'school' ? schoolChecked : workChecked));

									if (!isDependencyMet) return null;

									switch (field.name) {
										case 'activities':
											return (
												<FormGroup key={field.name} sx={{ border: "1px solid #c2c2c2", padding: "15px", borderRadius: "4px" }}>
													<Typography sx={{ fontSize: "17px", marginBottom: "10px", color: "#5e5e5e" }} variant="p" component="p">{field.label}</Typography>
													<FormControlLabel
														control={<Checkbox checked={schoolChecked} onChange={checkboxDistanceChange} name="scuola" />}
														label="Studio"
													/>
													<FormControlLabel
														control={<Checkbox checked={workChecked} onChange={checkboxDistanceChange} name="lavoro" />}
														label="Lavoro"
													/>
												</FormGroup>
											);
										case 'distance':
											return (
												<Box key={field.name} sx={{ display: 'flex', flexDirection: 'column' }}>
													<Typography id="input-slider" gutterBottom>
														{field.label} {distance}km
													</Typography>
													<Slider
														value={distance}
														onChange={handleSliderChange}
														aria-labelledby="input-slider"
														min={0}
														max={100}
													/>
												</Box>
											);
										case 'ripetizioni':
											return (
												<Box key={field.name} display="flex" alignItems="center">
													<Typography>{field.label}</Typography>
													<Checkbox {...label} onChange={checkboxRipetizioni} checked={ripetizioni} />
												</Box>
											);
										default:
											return (
												<TextField
													key={field.name}
													label={field.label}
													name={field.name}
													type={field.type}
													value={formData[field.name]}
													onChange={handleChange}
													variant="outlined"
													required={field.required}
												/>
											);
									}

								})}

								{type == "signin" && (
									<FormControlLabel
										control={
											<Checkbox
												checked={acceptedPrivacy}
												onChange={(e) => setAcceptedPrivacy(e.target.checked)}
												sx={{ width: '40px' }}
											/>
										}
										label={
											<Typography>
												Ho letto e accetto <MuiLink onClick={() => setPrivacyOpen(true)} sx={{ textDecoration: 'underline', cursor: 'pointer' }}>l'informativa sulla privacy</MuiLink>.
											</Typography>
										}
									/>
								)}

							</>
						)}
					</>

					{
						isLoading ? (
							<CircularProgress
								style={{
									width: '40px',
									height: '40px',
									left: '45%',
									top: '20px',
									position: 'relative',
								}}
							/>
						) : (
							(type == 'login' || activeStep == steps.length - 1) && (
								<Button
									variant="contained"
									color="primary"
									type="submit"
									style={{
										marginTop: '30px',
										...(role === 'studente' && { marginBottom: '20px' }),
									}}
								>
									Invia
								</Button>
							)
						)
					}

					{
						privacyOpen && (
							<PrivacyPolicyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
						)
					}


					{
						type == "signin" &&
						<React.Fragment>

							<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
								<Button
									color="inherit"
									disabled={activeStep === 0}
									onClick={handleBack}
									sx={{ mr: 1 }}
								>
									Indietro
								</Button>
								<Box sx={{ flex: '1 1 auto' }} />
								{
									activeStep < steps.length - 1 && (
										<Button
											onClick={handleNext}
											disabled={!role}>
											{/*activeStep >= steps.length - 1 ? 'Invia' : 'Avanti'*/}
											Avanti
										</Button>
									)
								}

							</Box>
						</React.Fragment>
					}

				</Box>
			</motion.div>
		</AnimatePresence>
	);
}

export default LoginComponent;
