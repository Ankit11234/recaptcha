import ReCAPTCHA from "react-google-recaptcha";
 
function onChange(value) {
  console.log("Captcha value:", value);
}
 
const New=()=>{
return (
  <ReCAPTCHA
    sitekey="6LemriMbAAAAAD70L4EwyYWv8ef3yDBO8O34YrTq"
    onChange={onChange}
  />
);
};
export default New;