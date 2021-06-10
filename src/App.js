import React,{useState} from 'react'
import './App.css'
import ReCAPTCHA from "react-google-recaptcha";
 

const App = () => {
	const [val,setVal]=useState(false);
	function onChange(value) {
	  console.log("Captcha value:", value);
	  setVal(true);
	}
	
	return (
		<div className="App">
		<form>
			
			<input type="file" />
			
			<ReCAPTCHA className="cap"
				sitekey="6LemriMbAAAAAD70L4EwyYWv8ef3yDBO8O34YrTq"
				onChange={onChange}
			/>
			{val
			?<button >upload</button>
			:<button disabled>upload</button>
            }
				
		</form>
		</div>
	)
}

export default App
